'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { useScrollLock } from './smooth-scroll';

type Props = {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  side?: 'left' | 'right';
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
};

export function Drawer({ open, onClose, title, side = 'right', children, footer, width = 'sm:w-[460px]' }: Props) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus], button')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,[tabindex="0"]');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (last.focus(), e.preventDefault());
        else if (!e.shiftKey && document.activeElement === last) (first.focus(), e.preventDefault());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  const x = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={id}>
          <motion.div
            className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
            className={`absolute inset-y-0 ${side === 'right' ? 'right-0' : 'left-0'} flex w-full flex-col bg-bone ${width}`}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6 lg:h-[72px]">
              <h2 id={id} className="wd-wide text-[11px] font-[500] uppercase tracking-[0.18em]">
                {title}
              </h2>
              <button onClick={onClose} className="-mr-2 p-2" aria-label="Fechar">
                <X size={18} strokeWidth={1.25} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              {children}
            </div>
            {footer && <div className="shrink-0 border-t border-line bg-bone">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
