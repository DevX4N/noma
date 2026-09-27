'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { img } from '@/lib/img';
import { ImageReveal, Lines, Reveal } from '../reveal';

export function Editorial() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['10%', '-14%']);

  return (
    <section ref={ref} aria-labelledby="ed-title" className="gutter grid grid-cols-1 gap-12 pb-28 lg:grid-cols-12 lg:gap-6 lg:pb-40">
      <ImageReveal className="relative aspect-[4/5] bg-mist lg:col-span-6 lg:aspect-[3/4]">
        <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y }}>
          <Image {...img('/images/e/silence.webp')} alt="Modelo com trench claro sobre roupa preta, em preto e branco" sizes="(min-width:1024px) 50vw, 100vw" className="size-full object-cover" />
        </motion.div>
      </ImageReveal>

      <div className="flex flex-col lg:col-span-5 lg:col-start-8">
        <div className="lg:sticky lg:top-32 lg:pt-[8vw]">
          <Reveal>
            <p className="eyebrow text-stone-deep">Editorial · FW26</p>
          </Reveal>
          <h2 id="ed-title" className="wd-exp mt-6 text-[clamp(2.1rem,4.4vw,4.4rem)] font-[260] uppercase leading-[0.95] tracking-[-0.02em]">
            <Lines lines={['The Silence', 'Collection']} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-[16px] leading-relaxed text-stone-deep">
              Uma coleção construída sobre formas, texturas e silêncio. Peças criadas para permanecer quando as tendências desaparecem.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <Link href="/lookbook" className="btn btn-line mt-10">
              Discover the collection
            </Link>
          </Reveal>

          <motion.div style={{ y: y2 }} className="mt-16 hidden w-[58%] lg:ml-auto lg:block">
            <ImageReveal className="relative aspect-[3/4] bg-mist" delay={0.2}>
              <Image {...img('/images/e/silence-2.webp')} alt="Detalhe de casaco escuro da Silence Collection" sizes="22vw" className="size-full object-cover" />
            </ImageReveal>
            <p className="mono mt-3 text-[10px] text-stone-deep">Silence Trench — lã e viscose, tiragem numerada</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
