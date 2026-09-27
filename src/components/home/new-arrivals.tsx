import Link from 'next/link';
import { newArrivals } from '@/lib/products';
import { ProductCard } from '../product-card';
import { Lines, Reveal } from '../reveal';

export function NewArrivals() {
  return (
    <section aria-labelledby="na-title" className="gutter pb-24 pt-24 lg:pb-36 lg:pt-32">
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <Reveal>
            <p className="eyebrow text-stone-deep">FW26 · Chegou esta semana</p>
          </Reveal>
          <h2 id="na-title" className="title wd-wide mt-4">
            <Lines lines={['New Arrivals']} />
          </h2>
        </div>
        <Reveal>
          <Link href="/colecao/new" className="link-u shrink-0 text-[12px] uppercase tracking-[0.14em] wd-wide">
            Ver todos
          </Link>
        </Reveal>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4 lg:gap-x-5">
        {newArrivals.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
