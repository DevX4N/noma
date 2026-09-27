'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { footerNav, social } from '@/lib/nav';
import { Newsletter } from './newsletter';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/checkout')) return null;

  return (
    <>
      <Newsletter />
      <footer className="overflow-hidden bg-ink text-bone">
        <div className="gutter grid grid-cols-2 gap-x-6 gap-y-12 pb-16 pt-20 md:grid-cols-12 lg:pt-28">
          <div className="col-span-2 md:col-span-4">
            <p className="wd-wide max-w-xs text-[20px] font-[300] leading-snug tracking-[-0.01em]">Essenciais contemporâneos para quem não precisa chamar atenção para ser notado.</p>
            <p className="mt-6 text-[13px] text-bone/55">Ateliê e showroom · Bom Retiro, São Paulo</p>
          </div>
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2">
              <p className="eyebrow mb-5 text-bone/45">{col.title}</p>
              <ul className="space-y-2.5 text-[14px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-u text-bone/85 hover:text-bone">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="md:col-span-2">
            <p className="eyebrow mb-5 text-bone/45">Social</p>
            <ul className="space-y-2.5 text-[14px]">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-u text-bone/85 hover:text-bone">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gutter" aria-hidden>
          <div className="chrome-line opacity-40" />
          <p className="chrome-text animate-chrome wd-exp select-none whitespace-nowrap pt-[2vw] text-center text-[25.5vw] font-[620] leading-[0.78] tracking-[0.04em]">NOMA</p>
        </div>

        <div className="gutter flex flex-col gap-3 border-t border-line-inv py-6 text-[11px] text-bone/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 NOMA. Marca fictícia — projeto conceitual de portfólio.</p>
          <p className="eyebrow">PIX · Visa · Mastercard · Amex · Elo · Apple Pay · Google Pay</p>
        </div>
      </footer>
    </>
  );
}
