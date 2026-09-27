export type NavItem = {
  label: string;
  href: string;
  mega?: { groups: { title: string; links: { label: string; href: string }[] }[]; feature: { image: string; label: string; href: string } };
};

const cat = (base: string, c: string) => `${base}?categoria=${encodeURIComponent(c)}`;

export const nav: NavItem[] = [
  {
    label: 'New Collection',
    href: '/colecao/new',
    mega: {
      groups: [
        { title: 'FW26', links: [{ label: 'Ver tudo', href: '/colecao/new' }, { label: 'Outerwear', href: cat('/colecao/new', 'Outerwear') }, { label: 'Knitwear', href: cat('/colecao/new', 'Knitwear') }, { label: 'Tailoring', href: cat('/colecao/new', 'Tailoring') }] },
        { title: 'Editorial', links: [{ label: 'The Silence Collection', href: '/lookbook' }, { label: 'Lookbook FW26', href: '/lookbook' }, { label: 'Behind the Collection', href: '/journal/behind-the-collection' }] },
      ],
      feature: { image: '/images/e/look-1.webp', label: 'Lookbook FW26', href: '/lookbook' },
    },
  },
  {
    label: 'Masculino',
    href: '/colecao/masculino',
    mega: {
      groups: [
        { title: 'Roupas', links: [{ label: 'Ver tudo', href: '/colecao/masculino' }, { label: 'Outerwear', href: cat('/colecao/masculino', 'Outerwear') }, { label: 'Knitwear', href: cat('/colecao/masculino', 'Knitwear') }, { label: 'Camisas', href: cat('/colecao/masculino', 'Shirts') }, { label: 'Calças', href: cat('/colecao/masculino', 'Bottom') }, { label: 'Essentials', href: cat('/colecao/masculino', 'Essentials') }] },
        { title: 'Destaques', links: [{ label: 'Novidades', href: '/colecao/new' }, { label: 'Mais vendidos', href: '/colecao/masculino?ordem=vendidos' }] },
      ],
      feature: { image: '/images/p/camel-overcoat-1.webp', label: 'Camel Wool Overcoat', href: '/produto/camel-overcoat' },
    },
  },
  {
    label: 'Feminino',
    href: '/colecao/feminino',
    mega: {
      groups: [
        { title: 'Roupas', links: [{ label: 'Ver tudo', href: '/colecao/feminino' }, { label: 'Outerwear', href: cat('/colecao/feminino', 'Outerwear') }, { label: 'Knitwear', href: cat('/colecao/feminino', 'Knitwear') }, { label: 'Tailoring', href: cat('/colecao/feminino', 'Tailoring') }, { label: 'Calças', href: cat('/colecao/feminino', 'Bottom') }] },
        { title: 'Destaques', links: [{ label: 'Novidades', href: '/colecao/new' }, { label: 'Mais vendidos', href: '/colecao/feminino?ordem=vendidos' }] },
      ],
      feature: { image: '/images/p/noire-coat-1.webp', label: 'Noiré Signature Coat', href: '/produto/noire-signature-coat' },
    },
  },
  { label: 'Essentials', href: '/colecao/essentials' },
  { label: 'Journal', href: '/journal' },
];

export const footerNav = [
  { title: 'Shop', links: [{ label: 'New Arrivals', href: '/colecao/new' }, { label: 'Men', href: '/colecao/masculino' }, { label: 'Women', href: '/colecao/feminino' }, { label: 'Essentials', href: '/colecao/essentials' }] },
  { title: 'Information', links: [{ label: 'Sobre', href: '/journal/behind-the-collection' }, { label: 'Journal', href: '/journal' }, { label: 'Materials', href: '/journal/materials-that-matter' }, { label: 'Stores', href: '#' }] },
  { title: 'Support', links: [{ label: 'Shipping', href: '#' }, { label: 'Exchanges', href: '#' }, { label: 'Contact', href: '#' }, { label: 'FAQ', href: '#' }] },
];

export const social = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'TikTok', href: '#' },
];
