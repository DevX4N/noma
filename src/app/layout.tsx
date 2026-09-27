import type { Metadata, Viewport } from 'next';
import { Martian_Mono, Mona_Sans } from 'next/font/google';
import { CartDrawer } from '@/components/cart-drawer';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SearchOverlay } from '@/components/search-overlay';
import { SmoothScroll } from '@/components/smooth-scroll';
import { ToastHost } from '@/components/toast';
import { StoreProvider } from '@/lib/store';
import './globals.css';

const mona = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona', display: 'swap' });
const martian = Martian_Mono({ subsets: ['latin'], axes: ['wdth'], variable: '--font-martian', display: 'swap' });

const indexable = process.env.SITE_INDEXABLE === 'true';
const description = 'Essenciais contemporâneos para quem não precisa chamar atenção para ser notado. Coleção FW26: outerwear, knitwear e alfaiataria em lã, merino e linho.';

export const metadata: Metadata = {
  metadataBase: new URL('https://noma.store'),
  title: { default: 'NOMA — Designed to remain', template: '%s — NOMA' },
  description,
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'NOMA',
    title: 'NOMA — Designed to remain',
    description,
    images: [{ url: '/images/h/hero.webp', width: 2600, height: 1950, alt: 'Campanha NOMA FW26' }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#f2f1ed', colorScheme: 'light' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${mona.variable} ${martian.variable}`}>
      <body>
        <StoreProvider>
          <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone">
            Pular para o conteúdo
          </a>
          <SmoothScroll />
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <ToastHost />
        </StoreProvider>
      </body>
    </html>
  );
}
