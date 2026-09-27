import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ImageReveal, Lines, Reveal } from '@/components/reveal';
import { price } from '@/lib/format';
import { img } from '@/lib/img';
import { bySlug } from '@/lib/products';

export const metadata: Metadata = { title: 'Lookbook FW26 — The Silence Collection', description: 'Formas, texturas e silêncio. O lookbook da coleção FW26.' };

// Cada look aponta para as peças que aparecem (ou dialogam) com a foto.
const looks = [
  { image: '/images/e/look-2.webp', span: 'lg:col-span-7', aspect: 'aspect-[3/4]', caption: 'Look 01', items: ['noire-signature-coat', 'merino-turtleneck'] },
  { image: '/images/e/look-3.webp', span: 'lg:col-span-4 lg:col-start-9 lg:mt-[30vh]', aspect: 'aspect-[3/4]', caption: 'Look 02', items: ['structured-jacket', 'tailored-trouser'] },
  { image: '/images/e/look-4.webp', span: 'lg:col-span-5 lg:col-start-2', aspect: 'aspect-[4/5]', caption: 'Look 03', items: ['silence-trench'] },
  { image: '/images/e/look-6.webp', span: 'lg:col-span-5 lg:col-start-8 lg:mt-[18vh]', aspect: 'aspect-[3/4]', caption: 'Look 04', items: ['oversized-knit', 'wide-tailored-trouser'] },
  { image: '/images/e/look-1.webp', span: 'lg:col-span-8 lg:col-start-3', aspect: 'aspect-[4/5] lg:aspect-[16/11]', caption: 'Look 05', items: ['tailored-blazer', 'grey-wool-coat'] },
  { image: '/images/e/look-5.webp', span: 'lg:col-span-4', aspect: 'aspect-[3/4]', caption: 'Look 06', items: ['heavy-long-sleeve', 'double-trench'] },
  { image: '/images/e/look-8.webp', span: 'lg:col-span-4 lg:mt-[12vh]', aspect: 'aspect-[3/4]', caption: 'Look 07', items: ['crew-knit'] },
  { image: '/images/e/look-7.webp', span: 'lg:col-span-4 lg:mt-[24vh]', aspect: 'aspect-[3/4]', caption: 'Look 08', items: ['essential-tee', 'tailored-trouser'] },
];

export default function LookbookPage() {
  return (
    <>
      <header className="gutter grid grid-cols-1 gap-8 pb-16 pt-32 lg:grid-cols-12 lg:items-end lg:pb-24 lg:pt-44">
        <div className="lg:col-span-8">
          <p className="eyebrow text-stone-deep">Lookbook · FW26</p>
          <h1 className="wd-exp mt-6 text-[clamp(2.4rem,7.4vw,7.5rem)] font-[250] uppercase leading-[0.9] tracking-[-0.03em]">
            <Lines animateOnMount lines={['The Silence', 'Collection']} />
          </h1>
        </div>
        <Reveal className="lg:col-span-3 lg:col-start-10" delay={0.3}>
          <p className="text-[15px] leading-relaxed text-stone-deep">Uma coleção construída sobre formas, texturas e silêncio. Peças criadas para permanecer quando as tendências desaparecem.</p>
        </Reveal>
      </header>

      <section className="gutter grid grid-cols-1 gap-x-6 gap-y-16 pb-32 lg:grid-cols-12 lg:gap-y-28">
        {looks.map((l, i) => (
          <figure key={l.image} className={l.span}>
            <ImageReveal className={`relative ${l.aspect} bg-mist`}>
              <Image {...img(l.image)} alt={`${l.caption} da coleção FW26`} priority={i === 0} sizes="(min-width:1024px) 60vw, 100vw" className="size-full object-cover object-[50%_22%]" />
            </ImageReveal>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span className="mono text-[11px]">{l.caption}</span>
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                {l.items.map((s) => {
                  const p = bySlug(s)!;
                  return (
                    <Link key={s} href={`/produto/${s}`} className="link-u text-[13px]">
                      {p.name} <span className="text-stone-deep">· {price(p.price)}</span>
                    </Link>
                  );
                })}
              </span>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="gutter border-t border-line py-24 text-center">
        <p className="wd-wide mx-auto max-w-2xl text-[clamp(1.6rem,3vw,2.6rem)] font-[280] leading-tight tracking-[-0.02em]">Todas as peças da FW26 têm tiragem numerada.</p>
        <Link href="/colecao/new" className="btn btn-dark mt-10">Explorar coleção</Link>
      </section>
    </>
  );
}
