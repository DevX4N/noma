import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/img';
import type { Article } from '@/lib/journal';
import { Reveal } from './reveal';

export function JournalCard({ a, index = 0, sizes = '(min-width:1024px) 31vw, 90vw' }: { a: Article; index?: number; sizes?: string }) {
  return (
    <Reveal delay={(index % 3) * 0.1} className="h-full">
      <Link href={`/journal/${a.slug}`} className="group block">
        <span className="relative block aspect-[4/5] overflow-hidden bg-mist">
          <Image {...img(a.image)} alt="" sizes={sizes} className="size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.05]" />
        </span>
        <span className="mt-5 flex items-center gap-3">
          <span className="mono text-[11px]">{a.number}</span>
          <span className="h-px w-6 bg-line" />
          <span className="eyebrow text-stone-deep">{a.category}</span>
        </span>
        <span className="mt-3 block text-[19px] font-[350] leading-snug tracking-[-0.01em]">
          <span className="link-u group-hover:[background-size:100%_1px]">{a.title}</span>
        </span>
        <span className="mt-2 block max-w-sm text-[14px] leading-relaxed text-stone-deep">{a.excerpt}</span>
      </Link>
    </Reveal>
  );
}
