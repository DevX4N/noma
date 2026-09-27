'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { img } from '@/lib/img';
import { Lines } from '../reveal';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-white" aria-label="Nova coleção FW26">
      <motion.div className="absolute inset-x-0 top-14 h-[60svh] overflow-hidden lg:inset-0 lg:h-auto" style={{ y }}>
        <motion.div className="absolute inset-0" initial={{ scale: 1.12, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2.4, ease }}>
          <Image {...img('/images/h/hero.webp')} alt="Modelo com casaco oversized preto sobre fundo branco, campanha FW26" priority sizes="100vw" className="size-full object-cover object-[46%_12%]" />
        </motion.div>
      </motion.div>

      {/* Toda a camada de texto usa difference: preto sobre o branco, branco sobre o casaco. */}
      <motion.div
        style={{ y: textY }}
        className="gutter absolute inset-0 flex flex-col pb-[6svh] pt-[18svh] text-white mix-blend-difference lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-6 lg:pb-[7svh] lg:pt-[24svh]"
      >
        <motion.p className="eyebrow mb-auto lg:col-span-4 lg:row-start-1 lg:mb-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
          New Collection — FW26
        </motion.p>

        <h1 className="display text-[clamp(3.6rem,16vw,6.5rem)] lg:col-span-9 lg:row-start-3 lg:text-[clamp(5rem,9.4vw,11rem)]">
          <Lines animateOnMount delay={0.35} stagger={0.12} lines={['Designed', <span key="r" className="wd-grow inline-block">to remain.</span>]} />
        </h1>

        <div className="mt-7 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:mt-0 lg:text-right">
          <motion.p className="max-w-[19rem] text-[15px] leading-relaxed lg:ml-auto lg:max-w-[15rem]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1, ease }}>
            Peças essenciais criadas além das tendências.
          </motion.p>
          <motion.div className="mt-6 flex flex-col gap-2.5 xs:flex-row lg:flex-col lg:items-end" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1, ease }}>
            <Link href="/colecao/new" className="btn btn-light lg:w-60">
              Explorar coleção
            </Link>
            <Link href="/lookbook" className="btn btn-line-inv lg:w-60">
              Ver lookbook
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
