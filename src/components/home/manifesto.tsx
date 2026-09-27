'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { Reveal } from '../reveal';

const lines = [
  ["We", "don't", 'design', 'for', 'seasons.'],
  ['We', 'design', 'for', 'time.'],
];

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.6'] });
  // A última linha se expande no eixo de largura conforme a leitura avança.
  const wd = useTransform(scrollYProgress, [0.45, 1], [75, 125]);
  const fvs = useTransform(wd, (v) => `'wdth' ${v.toFixed(1)}`);
  const total = lines.flat().length;
  let n = 0;

  return (
    <section ref={ref} aria-label="Manifesto" className="gutter bg-ink py-32 text-bone lg:py-48">
      <Reveal>
        <p className="eyebrow text-center text-bone/45">Manifesto</p>
      </Reveal>
      <h2 className="mx-auto mt-10 max-w-6xl text-center text-[clamp(2.3rem,7vw,7rem)] font-[260] leading-[1.02] tracking-[-0.035em]">
        {lines.map((line, li) => (
          <motion.span key={li} className="block" style={li === 1 ? { fontVariationSettings: fvs } : undefined}>
            {line.map((w) => {
              const i = n++;
              const start = (i / total) * 0.7;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, start + 0.18]}>
                  {w}
                </Word>
              );
            })}
          </motion.span>
        ))}
      </h2>
      <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-8 text-center">
        <div className="chrome-line w-24" />
        <Reveal>
          <p className="text-[15px] leading-relaxed text-bone/65">NOMA explora a interseção entre design, funcionalidade e permanência.</p>
        </Reveal>
      </div>
    </section>
  );
}
