'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { price } from '@/lib/format';
import { img } from '@/lib/img';
import { products } from '@/lib/products';
import { useStore } from '@/lib/store';
import { useScrollLock } from './smooth-scroll';

const popular = ['Casaco', 'Tricô', 'Essential Tee', 'Alfaiataria', 'Linho'];
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const synonyms: Record<string, string> = { casaco: 'outerwear', trico: 'knitwear', camiseta: 'essentials', calca: 'bottom', camisa: 'shirts', alfaiataria: 'tailoring', blazer: 'tailoring' };

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useScrollLock(searchOpen);
  const close = () => setSearchOpen(false);

  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => input.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSearchOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const term = norm(q.trim());
    if (term.length < 2) return [];
    const words = term.split(/\s+/).map((w) => synonyms[w] ?? w);
    return products.filter((p) => {
      const hay = norm([p.name, p.category, p.material, p.composition, ...p.colors.map((c) => c.name), p.gender === 'men' ? 'masculino' : p.gender === 'women' ? 'feminino' : 'unissex'].join(' '));
      return words.every((w) => hay.includes(w));
    });
  }, [q]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Buscar produtos">
          <motion.div className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-bone"
            data-lenis-prevent
          >
            <div className="gutter pb-12 pt-5 lg:pb-16">
              <div className="flex justify-end">
                <button onClick={close} className="-mr-2 p-2" aria-label="Fechar busca">
                  <X size={18} strokeWidth={1.25} />
                </button>
              </div>
              <label className="mx-auto mt-6 flex max-w-4xl items-center gap-4 border-b border-ink pb-4">
                <Search size={22} strokeWidth={1.1} className="shrink-0" />
                <span className="sr-only">Buscar</span>
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="O que você procura?"
                  className="wd-wide w-full bg-transparent text-[clamp(1.5rem,4vw,2.75rem)] font-[280] tracking-[-0.02em] outline-none placeholder:text-stone"
                />
                {q && (
                  <button onClick={() => setQ('')} className="eyebrow shrink-0 text-stone-deep">
                    Limpar
                  </button>
                )}
              </label>

              <div className="mx-auto mt-8 max-w-4xl">
                {q.trim().length < 2 ? (
                  <div>
                    <p className="eyebrow mb-4 text-stone-deep">Mais buscados</p>
                    <div className="flex flex-wrap gap-2">
                      {popular.map((t) => (
                        <button key={t} onClick={() => setQ(t)} className="h-9 border border-line px-4 text-[13px] transition-colors hover:border-ink">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div>
                    <p className="text-[15px]">Nenhuma peça encontrada para “{q}”.</p>
                    <p className="mt-1 text-[13px] text-stone-deep">Tente buscar por categoria, como “casaco” ou “tricô”, ou por material.</p>
                  </div>
                ) : (
                  <div>
                    <p className="eyebrow mb-5 text-stone-deep" aria-live="polite">
                      {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                    </p>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
                      {results.slice(0, 8).map((p) => (
                        <li key={p.slug}>
                          <Link href={`/produto/${p.slug}`} onClick={close} className="group block">
                            <span className="relative block aspect-[3/4] overflow-hidden bg-mist">
                              <Image {...img(p.images[0])} alt={p.name} sizes="(min-width:640px) 22vw, 45vw" className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-105" />
                            </span>
                            <span className="mt-3 block text-[13px]">{p.name}</span>
                            <span className="block text-[12px] text-stone-deep">{price(p.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {results.length > 8 && (
                      <Link href="/colecao/new" onClick={close} className="link-u mt-8 inline-flex items-center gap-2 text-[13px]">
                        Ver todos <ArrowRight size={14} strokeWidth={1.25} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
