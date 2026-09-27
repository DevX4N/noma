'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { Lines } from '@/components/reveal';
import { bySlug, newArrivals } from '@/lib/products';
import { useStore } from '@/lib/store';

export default function FavoritesPage() {
  const { favorites, ready } = useStore();
  const list = favorites.map((s) => bySlug(s)).filter((p) => !!p);

  return (
    <div className="gutter pb-28 pt-32 lg:pt-44">
      <p className="eyebrow text-stone-deep">Sua seleção</p>
      <h1 className="wd-exp mt-6 text-[clamp(2.4rem,7vw,7rem)] font-[250] uppercase leading-[0.9] tracking-[-0.03em]">
        <Lines animateOnMount lines={['Favoritos']} />
      </h1>
      <p className="mono mt-6 text-[11px] text-stone-deep">{ready ? `${list.length} ${list.length === 1 ? 'peça salva' : 'peças salvas'}` : ' '}</p>

      {ready && list.length === 0 ? (
        <div className="mt-16 border-t border-line pt-16">
          <p className="wd-wide text-[26px] font-[300] tracking-[-0.02em]">Nenhuma peça salva ainda.</p>
          <p className="mt-2 text-[14px] text-stone-deep">Toque no coração de qualquer peça para guardá-la aqui.</p>
          <p className="eyebrow mb-8 mt-16 text-stone-deep">Para começar</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4 lg:gap-x-5">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 border-t border-line pt-12 lg:grid-cols-4 lg:gap-x-5">
          {list.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      )}
      {ready && list.length > 0 && (
        <Link href="/colecao/new" className="link-u mt-16 inline-block text-[12px] uppercase tracking-[0.14em]">
          Continuar explorando
        </Link>
      )}
    </div>
  );
}
