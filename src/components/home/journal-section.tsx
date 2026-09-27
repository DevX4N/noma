import Link from 'next/link';
import { articles } from '@/lib/journal';
import { JournalCard } from '../journal-card';
import { Lines, Reveal } from '../reveal';

export function JournalSection() {
  return (
    <section aria-labelledby="jr-title" className="gutter py-24 lg:py-36">
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <Reveal>
            <p className="eyebrow text-stone-deep">Ensaios, bastidores e materiais</p>
          </Reveal>
          <h2 id="jr-title" className="title wd-wide mt-4">
            <Lines lines={['Journal']} />
          </h2>
        </div>
        <Reveal>
          <Link href="/journal" className="link-u wd-wide shrink-0 text-[12px] uppercase tracking-[0.14em]">
            Todos os artigos
          </Link>
        </Reveal>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
        {articles.slice(0, 3).map((a, i) => (
          <div key={a.slug} className="w-[78vw] shrink-0 snap-start md:w-auto">
            <JournalCard a={a} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
