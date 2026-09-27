import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Catalog } from '@/components/catalog';
import { Lines, Reveal } from '@/components/reveal';
import { collectionBySlug, collections, products } from '@/lib/products';

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = collectionBySlug((await params).slug);
  return c ? { title: c.title, description: c.intro } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const count = products.filter(c.filter).length;

  return (
    <>
      <header className="gutter grid grid-cols-1 gap-8 pb-10 pt-32 lg:grid-cols-12 lg:items-end lg:pb-14 lg:pt-44">
        <div className="lg:col-span-8">
          <nav aria-label="Trilha" className="eyebrow flex gap-2 text-stone-deep">
            <Link href="/" className="link-u">Início</Link>
            <span>/</span>
            <span className="text-ink">{c.eyebrow}</span>
          </nav>
          <h1 className="wd-exp mt-6 text-[clamp(2.4rem,7.4vw,7.5rem)] font-[250] uppercase leading-[0.9] tracking-[-0.03em]">
            <Lines animateOnMount lines={c.title.split(' ').length > 2 ? [c.title.split(' ').slice(0, -1).join(' '), c.title.split(' ').slice(-1)[0]] : [c.title]} />
          </h1>
        </div>
        <Reveal className="lg:col-span-3 lg:col-start-10 lg:pb-3" delay={0.3}>
          <p className="text-[15px] leading-relaxed text-stone-deep">{c.intro}</p>
          <p className="mono mt-4 text-[11px]">{count} peças</p>
        </Reveal>
      </header>
      <Suspense>
        <Catalog slug={slug} />
      </Suspense>
    </>
  );
}
