import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { ProductView } from '@/components/product-view';
import { Lines } from '@/components/reveal';
import { bySlug, products, related } from '@/lib/products';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  return { title: p.name, description: p.description, openGraph: { images: [{ url: p.images[0] }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const look = related(p, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    description: p.description,
    brand: { '@type': 'Brand', name: 'NOMA' },
    image: p.images.map((i) => `https://noma.store${i}`),
    offers: { '@type': 'Offer', priceCurrency: 'BRL', price: p.price, availability: 'https://schema.org/InStock' },
  };

  return (
    <>
      <ProductView product={p} />
      <section aria-labelledby="ctl-title" className="gutter border-t border-line py-24 lg:py-32">
        <div className="mb-10 flex items-end justify-between lg:mb-14">
          <h2 id="ctl-title" className="title wd-wide">
            <Lines lines={['Complete the look']} />
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4 lg:gap-x-5">
          {look.map((x, i) => (
            <ProductCard key={x.slug} product={x} index={i} />
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
