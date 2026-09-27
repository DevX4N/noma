'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { img } from '@/lib/img';
import { collections, products } from '@/lib/products';
import { Reveal } from '../reveal';

const blocks = [
  { label: 'Men', slug: 'masculino', image: '/images/e/cat-men.webp', pos: 'object-[50%_30%]' },
  { label: 'Women', slug: 'feminino', image: '/images/e/cat-women.webp', pos: 'object-[50%_45%]' },
  { label: 'Essentials', slug: 'essentials', image: '/images/e/cat-essentials.webp', pos: 'object-center' },
];

export function Categories() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section aria-label="Categorias" className="gutter pb-28 lg:pb-40">
      <Reveal className="flex flex-col gap-3 lg:h-[82vh] lg:min-h-[560px] lg:flex-row" y={40}>
        {blocks.map((b, i) => {
          const c = collections.find((x) => x.slug === b.slug)!;
          const count = products.filter(c.filter).length;
          const dim = active !== null && active !== i;
          return (
            <Link
              key={b.slug}
              href={`/colecao/${b.slug}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              style={{ flexGrow: active === i ? 1.55 : 1 }}
              className="group relative block aspect-[4/5] overflow-hidden lg:basis-0 bg-ink transition-[flex-grow] duration-[1.1s] ease-[var(--ease-silk)] sm:aspect-[16/10] lg:aspect-auto"
            >
              <Image
                {...img(b.image)}
                alt=""
                sizes="(min-width:1024px) 45vw, 100vw"
                className={`size-full object-cover ${b.pos} transition-[transform,opacity,filter] duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04] ${dim ? 'opacity-45 grayscale' : 'opacity-90'}`}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-bone lg:p-7">
                <span>
                  <span className="eyebrow block text-bone/70">{count} peças</span>
                  <span className="wd-exp mt-2 block text-[clamp(2rem,3.6vw,3.4rem)] font-[280] uppercase leading-none tracking-[-0.01em]">{b.label}</span>
                </span>
                <span className="grid size-11 place-items-center rounded-full border border-bone/40 transition-[background-color,color,transform] duration-700 ease-[var(--ease-silk)] group-hover:rotate-45 group-hover:bg-bone group-hover:text-ink">
                  <ArrowUpRight size={18} strokeWidth={1.25} />
                </span>
              </span>
            </Link>
          );
        })}
      </Reveal>
    </section>
  );
}
