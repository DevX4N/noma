'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { img } from '@/lib/img';
import { useStore } from '@/lib/store';

export function ToastHost() {
  const { toast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:bottom-6" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 bg-ink p-2 pr-5 text-bone shadow-[0_20px_60px_-20px_rgb(0_0_0/0.5)]"
          >
            {toast.image && (
              <span className="relative h-14 w-11 shrink-0 overflow-hidden">
                <Image {...img(toast.image)} alt="" sizes="44px" className="size-full object-cover" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[13px]">{toast.title}</span>
              {toast.body && <span className="block truncate text-[12px] text-bone/60">{toast.body}</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
