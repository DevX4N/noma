import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JournalCard } from '@/components/journal-card';
import { Lines, Reveal } from '@/components/reveal';
import { img } from '@/lib/img';
import { articles } from '@/lib/journal';

export const metadata: Metadata = { title: 'Journal', description: 'Ensaios sobre design, bastidores do ateliê e os materiais por trás de cada peça NOMA.' };

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <header className="gutter pb-12 pt-32 lg:pb-16 lg:pt-44">
        <p className="eyebrow text-stone-deep">Ensaios, bastidores e materiais</p>
        <h1 className="wd-exp mt-6 text-[clamp(3rem,11vw,11rem)] font-[240] uppercase leading-[0.85] tracking-[-0.04em]">
          <Lines animateOnMount lines={['Journal']} />
        </h1>
      </header>

      <section className="gutter pb-20">
        <Link href={`/journal/${lead.slug}`} className="group grid grid-cols-1 gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7">
            <span className="relative block aspect-[4/3] overflow-hidden bg-mist">
              <Image {...img(lead.image)} alt="" priority sizes="(min-width:1024px) 58vw, 100vw" className="size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.04]" />
            </span>
          </Reveal>
          <Reveal className="flex flex-col lg:col-span-4 lg:col-start-9" delay={0.15}>
            <span className="flex items-center gap-3">
              <span className="mono text-[11px]">{lead.number}</span>
              <span className="h-px w-6 bg-line" />
              <span className="eyebrow text-stone-deep">{lead.category} · {lead.readingTime}</span>
            </span>
            <span className="wd-wide mt-6 block text-[clamp(2rem,3.4vw,3.2rem)] font-[280] leading-[1.02] tracking-[-0.03em]">{lead.title}</span>
            <span className="mt-6 block text-[15px] leading-relaxed text-stone-deep">{lead.excerpt}</span>
            <span className="link-u mt-8 self-start text-[12px] uppercase tracking-[0.14em] group-hover:[background-size:100%_1px]">Ler artigo</span>
          </Reveal>
        </Link>
      </section>

      <section className="gutter grid grid-cols-1 gap-x-5 gap-y-16 border-t border-line pb-28 pt-12 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a, i) => (
          <JournalCard key={a.slug} a={a} index={i} />
        ))}
      </section>
    </>
  );
}
