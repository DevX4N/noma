'use client';

import { AnimatePresence, motion, useInView } from 'motion/react';
import { Heart, Minus, Plus, Ruler, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FREE_SHIPPING, PIX_DISCOUNT, installments, price, priceCents } from '@/lib/format';
import { img } from '@/lib/img';
import type { Product } from '@/lib/products';
import { useStore } from '@/lib/store';
import { Drawer } from './drawer';
import { useScrollLock } from './smooth-scroll';

const ease = [0.22, 1, 0.36, 1] as const;
const GENDER = { men: ['Masculino', '/colecao/masculino'], women: ['Feminino', '/colecao/feminino'], unisex: ['Essentials', '/colecao/essentials'] } as const;

export function ProductView({ product: p }: { product: Product }) {
  const { add, setCartOpen, isFav, toggleFav, notify } = useStore();
  const [color, setColor] = useState(p.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const buyRef = useRef<HTMLDivElement>(null);
  const buyVisible = useInView(buyRef, { margin: '0px 0px -40px 0px' });
  const fav = isFav(p.slug);
  const gallery = [...p.images, p.texture === 'dark' ? '/images/e/texture-dark.webp' : '/images/e/texture-light.webp'].filter((v, i, a) => a.indexOf(v) === i);
  const [gLabel, gHref] = GENDER[p.gender];

  const addToBag = () => {
    if (!size) {
      setSizeError(true);
      document.getElementById('size-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    add(p.slug, color, size);
    notify({ title: 'Adicionado à sacola', body: `${p.name} · ${color} · ${size}`, image: p.images[0] });
    setCartOpen(true);
  };

  return (
    <>
      <section className="grid grid-cols-1 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-[72px] xl:gap-14">
        {/* Galeria: carrossel no mobile, mosaico no desktop */}
        <div className="lg:col-span-7">
          <div className="relative lg:hidden">
            <div
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
              onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            >
              {gallery.map((src, i) => (
                <button key={src} onClick={() => setZoom(i)} className="relative aspect-[3/4] w-full shrink-0 snap-center bg-mist" aria-label={`Ampliar imagem ${i + 1}`}>
                  <Image {...img(src)} alt={i === 0 ? p.name : ''} priority={i === 0} sizes="100vw" className="size-full object-cover" />
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
              {gallery.map((_, i) => (
                <span key={i} className={`h-[2px] transition-all duration-500 ${slide === i ? 'w-6 bg-ink' : 'w-3 bg-ink/30'}`} />
              ))}
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-2 lg:grid">
            {gallery.map((src, i) => (
              <motion.button
                key={src}
                onClick={() => setZoom(i)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.08 }}
                className={`group relative cursor-zoom-in overflow-hidden bg-mist ${i === 0 || (gallery.length % 2 === 0 && i === gallery.length - 1) ? 'col-span-2 aspect-[4/5]' : 'aspect-[3/4]'}`}
                aria-label={`Ampliar imagem ${i + 1}`}
              >
                <Image {...img(src)} alt={i === 0 ? p.name : ''} priority={i === 0} sizes={i === 0 ? '58vw' : '29vw'} className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.03]" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Painel de compra */}
        <div className="gutter lg:col-span-5 lg:pl-0">
          <div className="pb-16 pt-8 lg:sticky lg:top-[72px] lg:pt-14">
            <nav aria-label="Trilha" className="eyebrow flex flex-wrap gap-2 text-stone-deep">
              <Link href="/" className="link-u">Início</Link>
              <span>/</span>
              <Link href={gHref} className="link-u">{gLabel}</Link>
              <span>/</span>
              <span className="text-ink">{p.category}</span>
            </nav>

            <div className="mt-8 flex items-start justify-between gap-6">
              <div>
                {(p.limited || p.isNew) && <p className="eyebrow mb-3 text-stone-deep">{p.limited ? 'Edição limitada · tiragem numerada' : 'Novo · FW26'}</p>}
                <h1 className="wd-wide text-[clamp(1.7rem,2.6vw,2.4rem)] font-[300] leading-[1.05] tracking-[-0.025em]">{p.name}</h1>
                <p className="mt-2 text-[13px] text-stone-deep">
                  {p.category} <span className="mono ml-2 text-[10px] text-stone">{p.sku}</span>
                </p>
              </div>
              <button onClick={() => toggleFav(p.slug)} aria-pressed={fav} aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'} className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center">
                <motion.span key={String(fav)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                  <Heart size={20} strokeWidth={1.2} className={fav ? 'fill-ink' : ''} />
                </motion.span>
              </button>
            </div>

            <div className="mt-6">
              <p className="text-[20px] tabular-nums">{price(p.price)}</p>
              <p className="mt-1 text-[13px] text-stone-deep">
                ou {installments(p.price)} · <span className="text-ink">{priceCents(p.price * (1 - PIX_DISCOUNT))} no PIX</span>
              </p>
            </div>

            <div className="mt-9">
              <p className="text-[13px]">
                Cor: <span className="text-stone-deep">{color}</span>
              </p>
              <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Cor">
                {p.colors.map((c) => (
                  <button
                    key={c.name}
                    role="radio"
                    aria-checked={color === c.name}
                    aria-label={c.name}
                    onClick={() => setColor(c.name)}
                    className={`grid size-10 place-items-center rounded-full border transition-colors ${color === c.name ? 'border-ink' : 'border-transparent hover:border-line'}`}
                  >
                    <span className="size-7 rounded-full ring-1 ring-line" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div id="size-picker" className="mt-8">
              <div className="flex items-center justify-between">
                <p className={`text-[13px] transition-colors ${sizeError ? 'text-danger' : ''}`}>
                  Tamanho{size ? <span className="text-stone-deep">: {size}</span> : sizeError ? ' — selecione para continuar' : ''}
                </p>
                <button onClick={() => setGuide(true)} className="link-u flex items-center gap-1.5 text-[12px] text-stone-deep">
                  <Ruler size={14} strokeWidth={1.25} /> Guia de tamanhos
                </button>
              </div>
              <motion.div
                role="radiogroup"
                aria-label="Tamanho"
                className="mt-3 grid grid-cols-5 gap-1.5"
                animate={sizeError ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.45 }}
                onAnimationComplete={() => sizeError && setTimeout(() => setSizeError(false), 1600)}
              >
                {['PP', 'P', 'M', 'G', 'GG'].map((s) => {
                  const available = p.sizes.includes(s) && !p.soldOut?.includes(s);
                  return (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={size === s}
                      disabled={!available}
                      onClick={() => (setSize(s), setSizeError(false))}
                      aria-label={available ? s : `${s} indisponível`}
                      className={`mono relative h-12 border text-[12px] transition-colors disabled:cursor-not-allowed disabled:text-stone ${
                        size === s ? 'border-ink bg-ink text-bone' : sizeError ? 'border-danger/50' : 'border-line hover:border-ink'
                      }`}
                    >
                      {s}
                      {!available && <span className="absolute inset-0 m-auto h-px w-[70%] rotate-[-22deg] bg-stone/60" />}
                    </button>
                  );
                })}
              </motion.div>
              {p.soldOut?.length ? <p className="mt-2 text-[12px] text-stone-deep">Tamanho {p.soldOut.join(', ')} esgotado. Reposição limitada em novembro.</p> : null}
            </div>

            <div ref={buyRef} className="mt-8 grid grid-cols-[1fr_auto] gap-2">
              <button onClick={addToBag} className="btn btn-dark h-14">
                Adicionar à sacola
              </button>
              <button onClick={() => toggleFav(p.slug)} aria-pressed={fav} aria-label="Favoritar" className="btn btn-line h-14 w-14 px-0">
                <Heart size={18} strokeWidth={1.2} className={fav ? 'fill-current' : ''} />
              </button>
            </div>

            <ul className="mt-6 space-y-1.5 text-[12.5px] text-stone-deep">
              <li>Frete grátis acima de {price(FREE_SHIPPING)} · Entrega em 2 a 5 dias úteis</li>
              <li>Primeira troca grátis em até 30 dias</li>
            </ul>

            <div className="mt-10 border-t border-line">
              <Accordion title="Details" defaultOpen>
                <p>{p.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-stone" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Shipping">
                <p>Envio em até 24h úteis após a confirmação do pagamento. Frete grátis para compras acima de {price(FREE_SHIPPING)}; abaixo disso, R$ 39 para todo o Brasil.</p>
                <p className="mt-3">Capitais do Sudeste: 2 a 3 dias úteis. Demais regiões: 3 a 7 dias úteis. Retirada gratuita no showroom do Bom Retiro, São Paulo.</p>
              </Accordion>
              <Accordion title="Materials">
                <p className="text-ink">{p.composition}</p>
                <p className="mt-3">{p.origin}</p>
              </Accordion>
              <Accordion title="Care">
                <ul className="space-y-1.5">
                  {p.care.map((c) => (
                    <li key={c} className="flex gap-3">
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-stone" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Barra fixa no mobile quando o botão principal sai da tela */}
      <AnimatePresence>
        {!buyVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-bone/95 px-4 py-3 backdrop-blur-xl lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px]">{p.name}</p>
              <p className="text-[12px] text-stone-deep">
                {price(p.price)}
                {size && ` · ${size}`}
              </p>
            </div>
            <button onClick={addToBag} className="btn btn-dark h-12 px-5">
              {size ? 'Adicionar' : 'Escolher tamanho'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuide open={guide} onClose={() => setGuide(false)} product={p} />
      <Zoom images={gallery} index={zoom} onClose={() => setZoom(null)} onIndex={setZoom} alt={p.name} />
    </>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left">
        <span className="wd-exp text-[11px] font-[500] uppercase tracking-[0.18em]">{title}</span>
        {open ? <Minus size={14} strokeWidth={1.25} /> : <Plus size={14} strokeWidth={1.25} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
            <div className="pb-6 text-[14px] leading-relaxed text-stone-deep">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TOPS = [
  ['PP', '84–88', '68–72', '64'],
  ['P', '88–94', '72–78', '66'],
  ['M', '94–100', '78–84', '68'],
  ['G', '100–106', '84–90', '70'],
  ['GG', '106–112', '90–96', '72'],
];
const BOTTOMS = [
  ['PP', '64–68', '86–90', '78'],
  ['P', '68–74', '90–96', '80'],
  ['M', '74–80', '96–102', '81'],
  ['G', '80–86', '102–108', '82'],
  ['GG', '86–92', '108–114', '83'],
];

function SizeGuide({ open, onClose, product }: { open: boolean; onClose: () => void; product: Product }) {
  const bottom = product.category === 'Bottom';
  const rows = bottom ? BOTTOMS : TOPS;
  const cols = bottom ? ['Tam.', 'Cintura', 'Quadril', 'Entrepernas'] : ['Tam.', 'Peito', 'Cintura', 'Comprimento'];
  return (
    <Drawer open={open} onClose={onClose} title="Guia de tamanhos" width="sm:w-[520px]">
      <div className="px-6 py-8">
        <p className="wd-wide text-[22px] font-[300] tracking-[-0.02em]">{product.name}</p>
        <p className="mt-2 text-[13px] text-stone-deep">Medidas do corpo em centímetros. Em caso de dúvida entre dois tamanhos, escolha o maior para um caimento mais solto.</p>
        <table className="mt-8 w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-ink">
              {cols.map((c) => (
                <th key={c} scope="col" className="eyebrow pb-3 font-normal text-stone-deep">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-line">
                {r.map((v, i) => (i === 0 ? <th key={i} scope="row" className="mono py-3.5 font-normal">{v}</th> : <td key={i} className="py-3.5 tabular-nums">{v}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-10 bg-mist p-6">
          <p className="eyebrow text-stone-deep">Como medir</p>
          <ul className="mt-4 space-y-3 text-[13px] leading-relaxed">
            <li><span className="text-ink">Peito:</span> <span className="text-stone-deep">contorne a parte mais larga, passando sob as axilas.</span></li>
            <li><span className="text-ink">Cintura:</span> <span className="text-stone-deep">meça na altura do umbigo, sem apertar a fita.</span></li>
            <li><span className="text-ink">Quadril:</span> <span className="text-stone-deep">contorne a parte mais larga, com os pés juntos.</span></li>
          </ul>
        </div>
        <p className="mt-6 text-[12px] text-stone-deep">Ainda com dúvida? Nossa equipe responde pelo WhatsApp em até 1 hora, de segunda a sábado.</p>
      </div>
    </Drawer>
  );
}

function Zoom({ images, index, onClose, onIndex, alt }: { images: string[]; index: number | null; onClose: () => void; onIndex: (i: number) => void; alt: string }) {
  const [origin, setOrigin] = useState('50% 50%');
  useScrollLock(index !== null);
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, images.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div className="fixed inset-0 z-[65] bg-bone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} role="dialog" aria-modal="true" aria-label="Imagem ampliada">
          <div
            className="absolute inset-0 cursor-zoom-out overflow-hidden"
            onClick={onClose}
            onMouseMove={(e) => setOrigin(`${(e.clientX / window.innerWidth) * 100}% ${(e.clientY / window.innerHeight) * 100}%`)}
          >
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="size-full">
                <Image {...img(images[index])} alt={alt} sizes="100vw" quality={85} className="size-full object-contain transition-transform duration-300 ease-out lg:scale-[1.6] lg:object-cover" style={{ transformOrigin: origin }} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <span className="mono text-[11px]">
              {index + 1} / {images.length}
            </span>
            <button onClick={onClose} className="grid size-10 place-items-center bg-bone/80 backdrop-blur" aria-label="Fechar">
              <X size={18} strokeWidth={1.25} />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {images.map((src, i) => (
              <button key={src} onClick={() => onIndex(i)} aria-label={`Imagem ${i + 1}`} className={`relative h-16 w-12 overflow-hidden transition-opacity ${i === index ? 'ring-1 ring-ink' : 'opacity-50 hover:opacity-100'}`}>
                <Image {...img(src)} alt="" sizes="48px" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
