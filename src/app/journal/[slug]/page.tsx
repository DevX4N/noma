import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JournalCard } from '@/components/journal-card';
import { ProductCard } from '@/components/product-card';
import { ImageReveal, Lines, Reveal } from '@/components/reveal';
import { img } from '@/lib/img';
import { articleBySlug, articles } from '@/lib/journal';
import { bySlug } from '@/lib/products';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = articleBySlug((await params).slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { images: [{ url: a.image }] } } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const idx = articles.indexOf(a);
  const more = [articles[(idx + 1) % articles.length], articles[(idx + 2) % articles.length], articles[(idx + 3) % articles.length]];
  const shop = (a.products ?? []).map((s) => bySlug(s)!).filter(Boolean);

  return (
    <article>
      <header className="gutter pb-12 pt-32 lg:pt-44">
        <nav aria-label="Trilha" className="eyebrow flex gap-2 text-stone-deep">
          <Link href="/journal" className="link-u">Journal</Link>
          <span>/</span>
          <span className="text-ink">{a.category}</span>
        </nav>
        <h1 className="wd-wide mt-8 max-w-5xl text-[clamp(2.4rem,6.4vw,6.4rem)] font-[250] leading-[0.95] tracking-[-0.04em]">
          <Lines animateOnMount lines={[a.title]} />
        </h1>
        <p className="mono mt-8 flex gap-4 text-[11px] text-stone-deep">
          <span>N.º {a.number}</span>
          <span>{a.date}</span>
          <span>{a.readingTime} de leitura</span>
        </p>
      </header>

      <ImageReveal className="gutter relative">
        <div className="relative aspect-[16/9] overflow-hidden bg-mist lg:aspect-[21/9]">
          <Image {...img(a.image)} alt="" priority sizes="100vw" className="size-full object-cover" />
        </div>
      </ImageReveal>

      <div className="gutter grid grid-cols-1 gap-10 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-3">
          <p className="text-[17px] leading-relaxed">{a.excerpt}</p>
        </Reveal>
        <div className="space-y-8 text-[16px] leading-[1.8] text-stone-deep lg:col-span-6 lg:col-start-5">
          {a.body.map((b, i) => (
            <Reveal key={i}>
              {b.heading && <h2 className="wd-wide mb-4 text-[22px] font-[350] tracking-[-0.01em] text-ink">{b.heading}</h2>}
              <p>{b.text}</p>
            </Reveal>
          ))}
          {a.quote && (
            <Reveal>
              <blockquote className="wd-wide my-16 border-l border-ink pl-6 text-[clamp(1.6rem,2.6vw,2.3rem)] font-[280] leading-tight tracking-[-0.02em] text-ink">“{a.quote}”</blockquote>
            </Reveal>
          )}
        </div>
      </div>

      {shop.length > 0 && (
        <section aria-labelledby="shop-title" className="gutter border-t border-line py-20 lg:py-28">
          <h2 id="shop-title" className="title wd-wide mb-10 lg:mb-14">
            <Lines lines={['Peças do artigo']} />
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4 lg:gap-x-5">
            {shop.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="more-title" className="gutter border-t border-line py-20 lg:py-28">
        <h2 id="more-title" className="title wd-wide mb-10 lg:mb-14">
          <Lines lines={['Continue lendo']} />
        </h2>
        <div className="grid grid-cols-1 gap-x-5 gap-y-14 md:grid-cols-3">
          {more.map((m, i) => (
            <JournalCard key={m.slug} a={m} index={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
