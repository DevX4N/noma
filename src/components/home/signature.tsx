'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { price } from '@/lib/format';
import { img } from '@/lib/img';
import { bySlug } from '@/lib/products';
import { Lines, Reveal } from '../reveal';

const SRC = '/images/e/signature.webp';
const ZOOM = 2.6;
const LENS = 190;

const spots = [
  { id: 'lapela', x: 56, y: 47, label: 'Acabamento', title: 'Lapela moldada a vapor', text: 'Lapela entalhada larga, modelada à mão sem entretela. Mantém a forma pela própria densidade da lã.' },
  { id: 'botoes', x: 32.5, y: 64, label: 'Aviamentos', title: 'Botões em metal escovado', text: 'Quatro botões costurados com haste, para o tecido assentar sem repuxar no abotoamento duplo.' },
  { id: 'tecido', x: 44, y: 83, label: 'Tecido', title: 'Lã dupla face 90/10', text: '90% lã virgem e 10% cashmere, 780 g/m². Duas faces tecidas juntas: o casaco dispensa forro.' },
  { id: 'origem', x: 64, y: 72, label: 'Origem', title: 'Biella → São Paulo', text: 'Tecido de Biella, Itália. Cortado e finalizado no nosso ateliê no Bom Retiro, em 18 horas por peça.' },
];

export function Signature() {
  const coat = bySlug('noire-signature-coat')!;
  const [active, setActive] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !box.current) return;
    const r = box.current.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };

  return (
    <section aria-labelledby="sig-title" className="bg-mist py-24 lg:py-36">
      <div className="gutter grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6 lg:col-start-1">
          <div
            ref={box}
            className="relative aspect-[2/3] overflow-hidden bg-graphite [@media(hover:hover)]:cursor-none"
            onPointerMove={onMove}
            onPointerLeave={() => setLens(null)}
          >
            <Image {...img(SRC)} alt="Noiré Signature Coat preto, abotoamento duplo, vestido por modelo" sizes="(min-width:1024px) 50vw, 100vw" className="size-full object-cover" />

            {spots.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                className="group absolute z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center [@media(hover:hover)]:cursor-none"
                aria-label={`${s.label}: ${s.title}`}
                aria-pressed={active === i}
              >
                <span className={`absolute inset-0 rounded-full border border-white/60 transition-transform duration-700 ${active === i ? 'scale-100' : 'scale-50 opacity-0'}`} />
                {active !== i && <span className="absolute inset-2 animate-ping rounded-full border border-white/40 [animation-duration:2.4s]" />}
                <span className="chrome-dot relative size-2.5 rounded-full shadow-[0_0_0_3px_rgb(255_255_255/0.18)]" />
              </button>
            ))}

            <AnimatePresence>
              {lens && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute z-20 rounded-full shadow-[0_24px_60px_-12px_rgb(0_0_0/0.6)] ring-1 ring-white/50"
                  style={{
                    width: LENS,
                    height: LENS,
                    left: lens.x - LENS / 2,
                    top: lens.y - LENS / 2,
                    backgroundImage: `url(${SRC})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
                    backgroundPosition: `${-(lens.x * ZOOM - LENS / 2)}px ${-(lens.y * ZOOM - LENS / 2)}px`,
                  }}
                >
                  <span className="mono absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink/60 px-1.5 text-[9px] text-white">{ZOOM}×</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="eyebrow pointer-events-none absolute bottom-4 left-4 text-white/70 [@media(hover:none)]:hidden">Passe o cursor para ampliar</p>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5 lg:col-start-8 lg:py-6">
          <Reveal>
            <p className="eyebrow text-stone-deep">Signature piece · Tiragem de 120 peças</p>
          </Reveal>
          <h2 id="sig-title" className="title wd-wide mt-5">
            <Lines lines={['Built around', 'the details.']} />
          </h2>
          <Reveal delay={0.1}>
            <div className="mt-8 flex items-baseline justify-between border-b border-ink pb-4">
              <p className="wd-exp text-[13px] font-[500] uppercase tracking-[0.14em]">Noiré Signature Coat</p>
              <p className="text-[15px] tabular-nums">{price(coat.price)}</p>
            </div>
          </Reveal>

          <ul className="mt-2">
            {spots.map((s, i) => (
              <li key={s.id} className="border-b border-line">
                <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="grid w-full grid-cols-[6.5rem_1fr] gap-4 py-5 text-left" aria-expanded={active === i}>
                  <span className={`eyebrow pt-1 transition-colors ${active === i ? 'text-ink' : 'text-stone'}`}>{s.label}</span>
                  <span>
                    <span className={`block text-[16px] transition-colors ${active === i ? 'text-ink' : 'text-stone-deep'}`}>{s.title}</span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="block pt-2 text-[14px] leading-relaxed text-stone-deep">{s.text}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <Reveal delay={0.1} className="mt-8 flex items-center gap-4">
            <span className="eyebrow text-stone-deep">Cores</span>
            {coat.colors.map((c) => (
              <span key={c.name} className="flex items-center gap-2 text-[13px]">
                <span className="size-3.5 rounded-full ring-1 ring-line" style={{ background: c.hex }} />
                {c.name}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <Link href="/produto/noire-signature-coat" className="btn btn-dark mt-10 w-full sm:w-auto">
              Ver o casaco
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
