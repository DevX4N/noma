import data from './images.json';

type Meta = { w: number; h: number; blur: string };
const table = data as Record<string, Meta>;

/** Props prontas para next/image a partir do caminho em /public. */
export function img(src: string) {
  const m = table[src];
  if (!m) throw new Error(`Imagem não preparada: ${src}`);
  return { src, width: m.w, height: m.h, placeholder: 'blur' as const, blurDataURL: m.blur };
}

export function blur(src: string) {
  return table[src]?.blur;
}

/** Variante para <Image fill>: sem width/height. */
export function imgFill(src: string) {
  const { width: _w, height: _h, ...rest } = img(src);
  return rest;
}
