'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/img';
import { nav, social } from '@/lib/nav';
import { useStore } from '@/lib/store';
import { useScrollLock } from './smooth-scroll';

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { favorites, ready } = useStore();
  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.5, ease } }}
          transition={{ duration: 0.7, ease }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bone pt-16 lg:hidden"
          data-lenis-prevent
        >
          <nav aria-label="Menu" className="gutter flex-1 pt-10">
            <ul>
              {nav.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.7, ease }}
                  className="border-b border-line"
                >
                  <Link href={item.href} onClick={onClose} className="flex items-baseline justify-between py-4">
                    <span className="wd-wide text-[clamp(1.9rem,8.5vw,2.75rem)] font-[280] leading-none tracking-[-0.03em]">{item.label}</span>
                    {item.label === 'New Collection' && <span className="eyebrow text-stone-deep">FW26</span>}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4">
              {['/images/e/look-1.webp', '/images/p/noire-coat-1.webp', '/images/p/essential-tee-1.webp', '/images/e/look-3.webp'].map((src, i) => (
                <Link key={src} href={i === 0 || i === 3 ? '/lookbook' : i === 1 ? '/produto/noire-signature-coat' : '/produto/essential-tee'} onClick={onClose} className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden bg-mist">
                  <Image {...img(src)} alt="" sizes="128px" className="size-full object-cover" />
                </Link>
              ))}
            </motion.div>
          </nav>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.6 }} className="gutter mt-10 grid grid-cols-2 gap-y-3 border-t border-line py-8 text-[13px]">
            <Link href="/conta" onClick={onClose}>Minha conta</Link>
            <Link href="/favoritos" onClick={onClose}>Favoritos {ready && favorites.length > 0 && `(${favorites.length})`}</Link>
            <Link href="/lookbook" onClick={onClose}>Lookbook</Link>
            <a href="#">Atendimento</a>
            <div className="col-span-2 mt-4 flex gap-6 text-stone-deep">
              {social.map((s) => (
                <a key={s.label} href={s.href} className="eyebrow">
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
