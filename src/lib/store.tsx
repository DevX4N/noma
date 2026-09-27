'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { bySlug, type Product } from './products';
import { FREE_SHIPPING, SHIPPING_FEE } from './format';

export type CartLine = { key: string; slug: string; color: string; size: string; qty: number };
export type Toast = { id: number; title: string; body?: string; image?: string };

type Store = {
  ready: boolean;
  lines: (CartLine & { product: Product })[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  remainingForFree: number;
  add: (slug: string, color: string, size: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  favorites: string[];
  isFav: (slug: string) => boolean;
  toggleFav: (slug: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  toast: Toast | null;
  notify: (t: Omit<Toast, 'id'>) => void;
};

const Ctx = createContext<Store | null>(null);
const CART_KEY = 'noma.cart.v1';
const FAV_KEY = 'noma.fav.v1';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setRaw(read<CartLine[]>(CART_KEY, []).filter((l) => bySlug(l.slug)));
    setFavorites(read<string[]>(FAV_KEY, []));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) write(CART_KEY, raw);
  }, [raw, ready]);
  useEffect(() => {
    if (ready) write(FAV_KEY, favorites);
  }, [favorites, ready]);

  const notify = useCallback((t: Omit<Toast, 'id'>) => {
    clearTimeout(toastTimer.current);
    setToast({ ...t, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const add = useCallback((slug: string, color: string, size: string, qty = 1) => {
    const key = `${slug}|${color}|${size}`;
    setRaw((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l));
      return [{ key, slug, color, size, qty }, ...prev];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l))));
  }, []);
  const remove = useCallback((key: string) => setRaw((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setRaw([]), []);

  const toggleFav = useCallback(
    (slug: string) => {
      setFavorites((prev) => {
        const on = !prev.includes(slug);
        const p = bySlug(slug);
        if (p) notify({ title: on ? 'Salvo nos favoritos' : 'Removido dos favoritos', body: p.name, image: p.images[0] });
        return on ? [slug, ...prev] : prev.filter((s) => s !== slug);
      });
    },
    [notify],
  );

  const value = useMemo<Store>(() => {
    const lines = raw.map((l) => ({ ...l, product: bySlug(l.slug)! }));
    const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    return {
      ready,
      lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      remainingForFree: Math.max(0, FREE_SHIPPING - subtotal),
      add,
      setQty,
      remove,
      clear,
      favorites,
      isFav: (s) => favorites.includes(s),
      toggleFav,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      toast,
      notify,
    };
  }, [raw, favorites, ready, cartOpen, searchOpen, toast, add, setQty, remove, clear, toggleFav, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore fora do StoreProvider');
  return v;
}
