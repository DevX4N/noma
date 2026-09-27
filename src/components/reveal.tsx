'use client';

import { motion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'p' | 'li' | 'span' }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1, ease, delay }}>
      {children}
    </M>
  );
}

/** Revela cada linha deslizando de dentro de uma máscara. */
export function Lines({ lines, className, delay = 0, stagger = 0.09, animateOnMount = false }: { lines: React.ReactNode[]; className?: string; delay?: number; stagger?: number; animateOnMount?: boolean }) {
  // O gatilho fica no contêiner: a linha em si começa fora da máscara e nunca "intersecta".
  const trigger = animateOnMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } };
  return (
    <motion.span className={`block ${className ?? ''}`} initial="hidden" {...trigger}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1.1, ease, delay: delay + i * stagger } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Imagem que entra com uma cortina e leve zoom. */
export function ImageReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(12% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, ease, delay }}
    >
      <motion.div className="size-full" initial={{ scale: 1.12 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1.8, ease, delay }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
