'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FREE_SHIPPING, installments, price } from '@/lib/format';
import { img } from '@/lib/img';
import { bySlug, newArrivals, related } from '@/lib/products';
import { useStore } from '@/lib/store';
import { Drawer } from './drawer';

export function ShippingBar({ remaining, subtotal }: { remaining: number; subtotal: number }) {
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  return (
    <div>
      <p className="text-[13px]" aria-live="polite">
        {remaining > 0 ? (
          <>
            Faltam <strong className="font-[560]">{price(remaining)}</strong> para você ganhar frete grátis.
          </>
        ) : (
          <>Você ganhou frete grátis.</>
        )}
      </p>
      <div className="mt-3 h-[2px] w-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progresso para frete grátis">
        <motion.div className="h-full origin-left bg-ink" initial={false} animate={{ scaleX: pct / 100 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

export function Qty({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="inline-flex h-8 items-center border border-line" role="group" aria-label={`Quantidade de ${label}`}>
      <button className="grid h-full w-8 place-items-center" onClick={() => onChange(value - 1)} aria-label="Diminuir quantidade">
        <Minus size={12} strokeWidth={1.5} />
      </button>
      <span className="mono w-6 text-center text-[11px] tabular-nums" aria-live="polite">
        {value}
      </span>
      <button className="grid h-full w-8 place-items-center disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= 9} aria-label="Aumentar quantidade">
        <Plus size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, count, subtotal, shipping, total, remainingForFree, setQty, remove } = useStore();
  const router = useRouter();
  const close = () => setCartOpen(false);
  const suggestions = lines.length ? related(lines[0].product, 6).filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 2) : newArrivals.slice(0, 2);

  const footer = lines.length ? (
    <div className="space-y-5 px-6 py-6">
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-stone-deep">Subtotal</dt>
          <dd className="tabular-nums">{price(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-deep">Frete</dt>
          <dd className="tabular-nums">{shipping === 0 ? 'Grátis' : price(shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3 text-[15px]">
          <dt>Total</dt>
          <dd className="text-right tabular-nums">
            {price(total)}
            <span className="block text-[11px] text-stone-deep">{installments(total)}</span>
          </dd>
        </div>
      </dl>
      <button
        className="btn btn-dark w-full"
        onClick={() => {
          close();
          router.push('/checkout');
        }}
      >
        Finalizar compra
      </button>
      <p className="eyebrow text-center text-stone-deep">PIX com 5% off · Cartão em até 10x · Apple Pay · Google Pay</p>
    </div>
  ) : null;

  return (
    <Drawer open={cartOpen} onClose={close} title={`Sacola${count ? ` (${count})` : ''}`} footer={footer}>
      {lines.length === 0 ? (
        <div className="flex h-full flex-col px-6 py-10">
          <p className="wd-wide text-[26px] font-[300] leading-tight tracking-[-0.02em]">Sua sacola está vazia.</p>
          <p className="mt-3 text-[14px] text-stone-deep">Comece pelas peças da coleção FW26.</p>
          <Link href="/colecao/new" onClick={close} className="btn btn-dark mt-8 self-start">
            Explorar coleção
          </Link>
          <div className="mt-auto pt-12">
            <p className="eyebrow mb-4 text-stone-deep">Novidades</p>
            <MiniGrid slugs={suggestions.map((p) => p.slug)} onPick={close} />
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <div className="border-b border-line py-5">
            <ShippingBar remaining={remainingForFree} subtotal={subtotal} />
          </div>
          <ul>
            <AnimatePresence initial={false}>
              {lines.map((l) => {
                const colorHex = l.product.colors.find((c) => c.name === l.color)?.hex;
                return (
                  <motion.li
                    key={l.key}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-b border-line"
                  >
                    <div className="flex gap-4 py-5">
                      <Link href={`/produto/${l.slug}`} onClick={close} className="relative h-32 w-24 shrink-0 overflow-hidden bg-mist">
                        <Image {...img(l.product.images[0])} alt={l.product.name} sizes="96px" className="size-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <Link href={`/produto/${l.slug}`} onClick={close} className="text-[14px] leading-snug">
                            {l.product.name}
                          </Link>
                          <span className="shrink-0 text-[14px] tabular-nums">{price(l.product.price * l.qty)}</span>
                        </div>
                        <p className="mt-1 flex items-center gap-2 text-[12px] text-stone-deep">
                          <span className="size-2.5 rounded-full border border-line" style={{ background: colorHex }} />
                          {l.color} · Tam. {l.size}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <Qty value={l.qty} onChange={(v) => setQty(l.key, v)} label={l.product.name} />
                          <button onClick={() => remove(l.key)} className="link-u text-[12px] text-stone-deep">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
          {suggestions.length > 0 && (
            <div className="pt-8">
              <p className="eyebrow mb-4 text-stone-deep">Complete o look</p>
              <MiniGrid slugs={suggestions.map((p) => p.slug)} onPick={close} />
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function MiniGrid({ slugs, onPick }: { slugs: string[]; onPick: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {slugs.map((s) => {
        const p = bySlug(s)!;
        return (
          <Link key={s} href={`/produto/${s}`} onClick={onPick} className="group">
            <span className="relative block aspect-[3/4] overflow-hidden bg-mist">
              <Image {...img(p.images[0])} alt={p.name} sizes="200px" className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-105" />
            </span>
            <span className="mt-2 block text-[12px] leading-snug">{p.name}</span>
            <span className="block text-[12px] text-stone-deep">{price(p.price)}</span>
          </Link>
        );
      })}
    </div>
  );
}
