'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

export function Dropdown<T extends string>({ label, value, options, onChange, align = 'right' }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open} aria-controls={id} className="flex h-10 items-center gap-2 text-[12px]">
        <span className="hidden text-stone-deep sm:inline">{label}:</span>
        <span>{current?.label}</span>
        <ChevronDown size={14} strokeWidth={1.25} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-full z-30 mt-1 min-w-52 border border-line bg-bone py-2 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.25)] ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            {options.map((o) => (
              <li key={o.value} role="option" aria-selected={o.value === value}>
                <button
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-mist"
                >
                  {o.label}
                  {o.value === value && <Check size={14} strokeWidth={1.5} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
