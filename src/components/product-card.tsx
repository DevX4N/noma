'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Heart, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { price } from '@/lib/format';
import { img } from '@/lib/img';
import type { Product } from '@/lib/products';
import { useStore } from '@/lib/store';

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductCard({ product: p, index = 0, sizes = '(min-width:1024px) 24vw, 48vw', priority = false }: { product: Product; index?: number; sizes?: string; priority?: boolean }) {
  const { add, isFav, toggleFav, setCartOpen, notify } = useStore();
  const [picking, setPicking] = useState(false);
  const [color, setColor] = useState(p.colors[0].name);
  const fav = isFav(p.slug);

  const quickAdd = (size: string) => {
    add(p.slug, color, size);
    setPicking(false);
    notify({ title: 'Adicionado à sacola', body: `${p.name} · ${color} · ${size}`, image: p.images[0] });
    setCartOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease, delay: (index % 4) * 0.08 }}
      className="group/card relative"
      onMouseLeave={() => setPicking(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-mist">
        <Link href={`/produto/${p.slug}`} className="absolute inset-0" aria-label={p.name}>
          <Image
            {...img(p.images[0])}
            alt={p.name}
            sizes={sizes}
            priority={priority}
            className="absolute inset-0 size-full object-cover transition-[transform,opacity] duration-[1.1s] ease-[var(--ease-silk)] group-hover/card:scale-[1.03] [@media(hover:hover)]:group-hover/card:opacity-0"
          />
          {p.images[1] && (
            <Image
              {...img(p.images[1])}
              alt=""
              sizes={sizes}
              className="absolute inset-0 size-full scale-[1.06] object-cover opacity-0 transition-[transform,opacity] duration-[1.1s] ease-[var(--ease-silk)] [@media(hover:hover)]:group-hover/card:scale-100 [@media(hover:hover)]:group-hover/card:opacity-100"
            />
          )}
        </Link>

        {(p.limited || p.isNew) && (
          <span className="eyebrow pointer-events-none absolute left-3 top-3 bg-bone/85 px-2 py-1 text-[9.5px] text-ink backdrop-blur">{p.limited ? <><span className="sm:hidden">Limitada</span><span className="hidden sm:inline">Edição limitada</span></> : 'Novo'}</span>
        )}

        <button
          onClick={() => toggleFav(p.slug)}
          aria-label={fav ? `Remover ${p.name} dos favoritos` : `Salvar ${p.name} nos favoritos`}
          aria-pressed={fav}
          className="absolute right-2 top-2 grid size-9 place-items-center transition-opacity duration-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
        >
          <motion.span key={String(fav)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
            <Heart size={17} strokeWidth={1.25} className={fav ? 'fill-ink text-ink' : 'text-ink'} />
          </motion.span>
        </button>

        {/* Quick add: desktop revela no hover; mobile abre pelo botão + */}
        <div className="absolute inset-x-2 bottom-2">
          <AnimatePresence initial={false} mode="wait">
            {picking ? (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease }}
                className="bg-bone/95 p-3 backdrop-blur"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="eyebrow text-stone-deep">Selecione o tamanho</span>
                  <button onClick={() => setPicking(false)} aria-label="Fechar seleção de tamanho" className="-m-1 p-1">
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {p.sizes.map((s) => {
                    const out = p.soldOut?.includes(s);
                    return (
                      <button
                        key={s}
                        disabled={out}
                        onClick={() => quickAdd(s)}
                        className="mono h-8 border border-line text-[11px] transition-colors hover:border-ink hover:bg-ink hover:text-bone disabled:text-stone disabled:line-through disabled:hover:bg-transparent"
                        aria-label={out ? `${s} esgotado` : `Adicionar tamanho ${s}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <button
                  onClick={() => setPicking(true)}
                  className="btn btn-light hidden h-11 w-full translate-y-3 text-[10px] opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-silk)] focus-visible:translate-y-0 focus-visible:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 [@media(hover:hover)]:inline-flex"
                >
                  Adicionar à sacola
                </button>
                <button onClick={() => setPicking(true)} className="ml-auto grid size-9 place-items-center bg-bone/90 backdrop-blur [@media(hover:hover)]:hidden" aria-label={`Adicionar ${p.name} à sacola`}>
                  <Plus size={16} strokeWidth={1.25} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_auto]">
        <h3 className="min-w-0 text-[13.5px] leading-snug sm:text-[14px]">
          <Link href={`/produto/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="order-3 mt-1 text-[13.5px] tabular-nums sm:order-none sm:mt-0 sm:text-[14px]">{price(p.price)}</p>
        <p className="mt-0.5 text-[12px] text-stone-deep sm:col-span-2">{p.category}</p>
      </div>
      <div className="mt-3 flex items-center gap-1.5" role="radiogroup" aria-label="Cores disponíveis">
        {p.colors.map((c) => (
          <button
            key={c.name}
            role="radio"
            aria-checked={color === c.name}
            aria-label={c.name}
            title={c.name}
            onClick={() => setColor(c.name)}
            className={`grid size-4 place-items-center rounded-full border transition-colors ${color === c.name ? 'border-ink' : 'border-transparent'}`}
          >
            <span className="size-2.5 rounded-full ring-1 ring-line" style={{ background: c.hex }} />
          </button>
        ))}
      </div>
    </motion.article>
  );
}
