'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/img';
import { nav } from '@/lib/nav';
import { useStore } from '@/lib/store';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';

const ICON = { size: 18, strokeWidth: 1.25 };

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setCartOpen, setSearchOpen, favorites, ready } = useStore();
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 520 && y > last.current + 2);
      if (y < last.current - 2) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
    setMenuOpen(false);
  }, [pathname]);

  // Barras sticky (filtros do catálogo) acompanham o header quando ele se esconde.
  useEffect(() => {
    document.documentElement.style.setProperty('--header-offset', hidden ? '0px' : 'var(--header-h)');
  }, [hidden]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMega(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (pathname.startsWith('/checkout')) return null;

  const transparent = isHome && !scrolled && mega === null && !menuOpen;
  const active = (href: string) => pathname === href.split('?')[0] || (href === '/journal' && pathname.startsWith('/journal'));
  const current = mega !== null ? nav[mega].mega : undefined;

  return (
    <>
      <header
        onMouseLeave={() => setMega(null)}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-silk)] ${hidden && mega === null && !menuOpen ? '-translate-y-full' : ''} ${transparent ? 'text-white mix-blend-difference' : ''}`}
      >
        <div
          className={`gutter relative grid h-16 grid-cols-[1fr_auto_1fr] items-center transition-colors duration-500 lg:h-[72px] ${
            transparent ? '' : 'border-b border-line bg-bone/90 text-ink backdrop-blur-xl'
          }`}
        >
          <div className="flex items-center">
            <button className="-ml-2 p-2 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-500 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ${menuOpen ? 'w-5 -translate-y-1.5 -rotate-45' : 'w-3.5'}`} />
              </span>
            </button>
            <Logo className="hidden lg:block" />
          </div>

          <Logo className="block lg:hidden" />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item, i) => (
                <li key={item.label} onMouseEnter={() => setMega(item.mega ? i : null)}>
                  <Link
                    href={item.href}
                    onFocus={() => setMega(item.mega ? i : null)}
                    aria-current={active(item.href) ? 'page' : undefined}
                    aria-expanded={item.mega ? mega === i : undefined}
                    className="link-u wd-wide text-[11px] font-[450] uppercase tracking-[0.16em]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2" aria-label="Buscar">
              <Search {...ICON} />
            </button>
            <Link href="/conta" className="hidden p-2 sm:block" aria-label="Conta">
              <User {...ICON} />
            </Link>
            <Link href="/favoritos" className="relative hidden p-2 sm:block" aria-label={`Favoritos (${favorites.length})`}>
              <Heart {...ICON} />
              {ready && favorites.length > 0 && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-current" />}
            </Link>
            <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 p-2 pr-0" aria-label={`Sacola (${count} itens)`}>
              <ShoppingBag {...ICON} className="lg:hidden" />
              <span className="wd-wide hidden text-[11px] font-[450] uppercase tracking-[0.16em] lg:inline">Sacola</span>
              <span className="mono relative inline-flex h-5 min-w-5 items-center justify-center overflow-hidden text-[11px] tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={ready ? count : 'x'}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ready ? `(${count})` : '(0)'}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {current && (
            <motion.div
              key="mega"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-bone lg:block"
            >
              <motion.div key={mega} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="gutter grid grid-cols-12 gap-8 py-12">
                {current.groups.map((g) => (
                  <div key={g.title} className="col-span-3">
                    <p className="eyebrow mb-6 text-stone-deep">{g.title}</p>
                    <ul className="space-y-3">
                      {g.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} className="link-u text-[15px] font-[350]">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href={current.feature.href} className="group col-span-4 col-start-9 grid grid-cols-[1fr_auto] items-end gap-6">
                  <span>
                    <span className="eyebrow block text-stone-deep">Em destaque</span>
                    <span className="mt-2 block text-[15px]">{current.feature.label}</span>
                  </span>
                  <span className="relative block h-56 w-44 overflow-hidden bg-mist">
                    <Image {...img(current.feature.image)} alt="" sizes="176px" className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-105" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {mega !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 hidden bg-ink/20 backdrop-blur-[2px] lg:block"
            onMouseEnter={() => setMega(null)}
            aria-hidden
          />
        )}
      </AnimatePresence>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
