'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, SlidersHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { img } from '@/lib/img';
import { CATEGORIES, MATERIALS, SIZES, collectionBySlug, products, type Product } from '@/lib/products';
import { Drawer } from './drawer';
import { Dropdown } from './dropdown';
import { ProductCard } from './product-card';

type Sort = 'recentes' | 'vendidos' | 'menor' | 'maior';
const sorts: { value: Sort; label: string }[] = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'vendidos', label: 'Mais vendidos' },
  { value: 'menor', label: 'Menor preço' },
  { value: 'maior', label: 'Maior preço' },
];
const PRICES = [
  { id: 'ate-500', label: 'Até R$ 500', min: 0, max: 500 },
  { id: '500-1000', label: 'R$ 500 – R$ 1.000', min: 500, max: 1000 },
  { id: '1000-1500', label: 'R$ 1.000 – R$ 1.500', min: 1000, max: 1500 },
  { id: '1500', label: 'Acima de R$ 1.500', min: 1500, max: Infinity },
];
const CAT_LABEL: Record<string, string> = { Shirts: 'Camisas', Bottom: 'Calças' };

type Filters = { cat: string[]; size: string[]; color: string[]; material: string[]; price: string[] };
const empty: Filters = { cat: [], size: [], color: [], material: [], price: [] };

function apply(list: Product[], f: Filters) {
  return list.filter(
    (p) =>
      (!f.cat.length || f.cat.includes(p.category)) &&
      (!f.size.length || f.size.some((s) => p.sizes.includes(s) && !p.soldOut?.includes(s))) &&
      (!f.color.length || p.colors.some((c) => f.color.includes(c.name))) &&
      (!f.material.length || f.material.includes(p.material)) &&
      (!f.price.length || f.price.some((id) => { const r = PRICES.find((x) => x.id === id)!; return p.price >= r.min && p.price < r.max; })),
  );
}

export function Catalog({ slug }: { slug: string }) {
  const collection = collectionBySlug(slug)!;
  const base = useMemo(() => products.filter(collection.filter), [collection]);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCat = params.get('categoria');
  const [filters, setFilters] = useState<Filters>({ ...empty, cat: initialCat && CATEGORIES.includes(initialCat as never) ? [initialCat] : [] });
  const [sort, setSort] = useState<Sort>((sorts.find((s) => s.value === params.get('ordem'))?.value as Sort) ?? 'recentes');
  const [open, setOpen] = useState(false);
  const [dense, setDense] = useState(true);

  const syncUrl = (f: Filters, s: Sort) => {
    const q = new URLSearchParams();
    if (f.cat.length === 1) q.set('categoria', f.cat[0]);
    if (s !== 'recentes') q.set('ordem', s);
    router.replace(`${pathname}${q.size ? `?${q}` : ''}`, { scroll: false });
  };
  const update = (f: Filters) => {
    setFilters(f);
    syncUrl(f, sort);
  };
  const toggle = (key: keyof Filters, v: string) => update({ ...filters, [key]: filters[key].includes(v) ? filters[key].filter((x) => x !== v) : [...filters[key], v] });

  const list = useMemo(() => {
    const out = apply(base, filters);
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      recentes: (a, b) => b.drop - a.drop,
      vendidos: (a, b) => a.rank - b.rank,
      menor: (a, b) => a.price - b.price,
      maior: (a, b) => b.price - a.price,
    };
    return [...out].sort(by[sort]);
  }, [base, filters, sort]);

  const cats = CATEGORIES.filter((c) => base.some((p) => p.category === c));
  const colors = [...new Map(base.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];
  const materials = MATERIALS.filter((m) => base.some((p) => p.material === m));
  const activeCount = Object.values(filters).reduce((a, v) => a + v.length, 0);
  const chips = [
    ...filters.cat.map((v) => ({ key: 'cat' as const, v, label: CAT_LABEL[v] ?? v })),
    ...filters.size.map((v) => ({ key: 'size' as const, v, label: `Tam. ${v}` })),
    ...filters.color.map((v) => ({ key: 'color' as const, v, label: v })),
    ...filters.material.map((v) => ({ key: 'material' as const, v, label: v })),
    ...filters.price.map((v) => ({ key: 'price' as const, v, label: PRICES.find((p) => p.id === v)!.label })),
  ];
  const preview = (f: Filters) => apply(base, f).length;

  return (
    <>
      <div className="sticky z-30 border-y border-line bg-bone/92 backdrop-blur-xl transition-[top] duration-500 ease-[var(--ease-silk)]" style={{ top: 'var(--header-offset)' }}>
        <div className="gutter flex h-14 items-center gap-4">
          <button onClick={() => setOpen(true)} className="flex h-10 shrink-0 items-center gap-2.5 text-[12px]">
            <SlidersHorizontal size={15} strokeWidth={1.25} />
            Filtros
            {activeCount > 0 && <span className="mono grid size-5 place-items-center rounded-full bg-ink text-[10px] text-bone">{activeCount}</span>}
          </button>
          <span className="h-5 w-px shrink-0 bg-line" />
          <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto">
            <button onClick={() => update({ ...filters, cat: [] })} className={`h-8 shrink-0 px-3 text-[12px] transition-colors ${filters.cat.length === 0 ? 'bg-ink text-bone' : 'hover:bg-mist'}`}>
              Todos
            </button>
            {cats.map((c) => (
              <button key={c} onClick={() => update({ ...filters, cat: filters.cat.length === 1 && filters.cat[0] === c ? [] : [c] })} className={`h-8 shrink-0 px-3 text-[12px] transition-colors ${filters.cat.length === 1 && filters.cat[0] === c ? 'bg-ink text-bone' : 'hover:bg-mist'}`}>
                {CAT_LABEL[c] ?? c}
              </button>
            ))}
          </div>
          <span className="mono hidden shrink-0 text-[11px] text-stone-deep md:inline">{list.length} peças</span>
          <Dropdown label="Ordenar" value={sort} options={sorts} onChange={(s) => (setSort(s), syncUrl(filters, s))} />
          <div className="hidden items-center gap-1 lg:flex" role="group" aria-label="Visualização da grade">
            {[true, false].map((d) => (
              <button key={String(d)} onClick={() => setDense(d)} aria-pressed={dense === d} aria-label={d ? '4 por linha' : '2 por linha'} className={`grid size-8 place-items-center transition-opacity ${dense === d ? '' : 'opacity-35 hover:opacity-70'}`}>
                <span className={`grid gap-[2px] ${d ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  {Array.from({ length: d ? 8 : 4 }).map((_, i) => (
                    <span key={i} className={`bg-ink ${d ? 'h-[6px] w-[3px]' : 'h-[6px] w-[6px]'}`} />
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="gutter pb-28 pt-6">
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 pb-6">
                {chips.map((c) => (
                  <button key={c.key + c.v} onClick={() => toggle(c.key, c.v)} className="flex h-8 items-center gap-2 border border-line px-3 text-[12px] transition-colors hover:border-ink">
                    {c.label} <X size={12} strokeWidth={1.5} />
                  </button>
                ))}
                <button onClick={() => update(empty)} className="link-u ml-2 text-[12px] text-stone-deep">
                  Limpar tudo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {list.length === 0 ? (
          <div className="flex flex-col items-start py-24">
            <p className="wd-wide text-[26px] font-[300] tracking-[-0.02em]">Nenhuma peça com esses filtros.</p>
            <p className="mt-2 text-[14px] text-stone-deep">Remova um filtro ou veja toda a coleção.</p>
            <button onClick={() => update(empty)} className="btn btn-dark mt-8">
              Limpar filtros
            </button>
          </div>
        ) : (
          <motion.ul layout className={`grid grid-cols-2 gap-x-3 gap-y-12 lg:gap-x-5 lg:gap-y-16 ${dense ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
            <AnimatePresence mode="popLayout">
              {list.flatMap((p, i) => {
                const items = [
                  <motion.li key={p.slug} layout="position" exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    <ProductCard product={p} index={i} priority={i < 4} sizes={dense ? '(min-width:1024px) 24vw, 48vw' : '(min-width:1024px) 48vw, 48vw'} />
                  </motion.li>,
                ];
                if (i === 3 && list.length > 6 && dense) items.push(<EditorialTile key="editorial" slug={slug} />);
                return items;
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        title={`Filtros${activeCount ? ` (${activeCount})` : ''}`}
        width="sm:w-[400px]"
        footer={
          <div className="grid grid-cols-2 gap-3 p-5">
            <button onClick={() => update(empty)} className="btn btn-line" disabled={!activeCount}>
              Limpar
            </button>
            <button onClick={() => setOpen(false)} className="btn btn-dark px-4">
              Ver {preview(filters)} {preview(filters) === 1 ? 'peça' : 'peças'}
            </button>
          </div>
        }
      >
        <div className="px-6">
          <Group title="Categoria" count={filters.cat.length} defaultOpen>
            {cats.map((c) => (
              <Check key={c} label={CAT_LABEL[c] ?? c} checked={filters.cat.includes(c)} onChange={() => toggle('cat', c)} count={preview({ ...filters, cat: [c] })} />
            ))}
          </Group>
          <Group title="Tamanho" count={filters.size.length} defaultOpen>
            <div className="grid grid-cols-5 gap-1.5">
              {SIZES.map((s) => (
                <button key={s} onClick={() => toggle('size', s)} aria-pressed={filters.size.includes(s)} className={`mono h-10 border text-[11px] transition-colors ${filters.size.includes(s) ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink'}`}>
                  {s}
                </button>
              ))}
            </div>
          </Group>
          <Group title="Cor" count={filters.color.length} defaultOpen>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {colors.map((c) => (
                <button key={c.name} onClick={() => toggle('color', c.name)} aria-pressed={filters.color.includes(c.name)} className="flex items-center gap-3 py-1.5 text-left text-[13px]">
                  <span className={`grid size-6 place-items-center rounded-full border transition-colors ${filters.color.includes(c.name) ? 'border-ink' : 'border-transparent'}`}>
                    <span className="size-4 rounded-full ring-1 ring-line" style={{ background: c.hex }} />
                  </span>
                  {c.name}
                </button>
              ))}
            </div>
          </Group>
          <Group title="Material" count={filters.material.length}>
            {materials.map((m) => (
              <Check key={m} label={m} checked={filters.material.includes(m)} onChange={() => toggle('material', m)} count={preview({ ...filters, material: [m] })} />
            ))}
          </Group>
          <Group title="Preço" count={filters.price.length}>
            {PRICES.map((r) => (
              <Check key={r.id} label={r.label} checked={filters.price.includes(r.id)} onChange={() => toggle('price', r.id)} count={preview({ ...filters, price: [r.id] })} />
            ))}
          </Group>
        </div>
      </Drawer>
    </>
  );
}

function Group({ title, count, children, defaultOpen = false }: { title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left">
        <span className="wd-wide text-[11px] font-[500] uppercase tracking-[0.16em]">
          {title} {count > 0 && <span className="mono ml-1 text-stone-deep">({count})</span>}
        </span>
        {open ? <Minus size={14} strokeWidth={1.25} /> : <Plus size={14} strokeWidth={1.25} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Check({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count: number }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 py-1.5 text-[13px] ${count === 0 && !checked ? 'opacity-40' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="grid size-4 place-items-center border border-ink/40 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2">
        {checked && <svg viewBox="0 0 12 12" className="size-2.5 text-bone"><path d="M2 6.2 4.8 9 10 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>}
      </span>
      <span className="flex-1">{label}</span>
      <span className="mono text-[10px] text-stone">{count}</span>
    </label>
  );
}

function EditorialTile({ slug }: { slug: string }) {
  const tile = slug === 'essentials'
    ? { image: '/images/j/folded.webp', eyebrow: 'Journal', title: 'The Folded Wardrobe', href: '/journal/the-folded-wardrobe' }
    : { image: '/images/e/look-4.webp', eyebrow: 'Editorial', title: 'The Silence Collection', href: '/lookbook' };
  return (
    <motion.li layout="position" className="col-span-2 row-span-1">
      <Link href={tile.href} className="group relative block aspect-[3/2] overflow-hidden bg-ink lg:aspect-auto lg:h-full">
        <Image {...img(tile.image)} alt="" sizes="(min-width:1024px) 48vw, 96vw" className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.04]" />
        <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/60 to-transparent p-6 text-bone lg:p-8">
          <span className="eyebrow text-bone/70">{tile.eyebrow}</span>
          <span className="wd-exp mt-2 text-[clamp(1.4rem,2.6vw,2.4rem)] font-[280] uppercase leading-none">{tile.title}</span>
          <span className="mt-4 inline-flex items-center gap-2 text-[12px]">
            Descobrir <ArrowRight size={14} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </motion.li>
  );
}
