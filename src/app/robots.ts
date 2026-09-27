import type { MetadataRoute } from 'next';

// Marca fictícia: fora dos buscadores até SITE_INDEXABLE=true.
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== 'true') return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' } };
}
