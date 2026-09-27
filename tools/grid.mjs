// uso: node tools/grid.mjs <out.png> <cols> <width> img1 img2 ...
import sharp from 'sharp';
const [out, cols, width, ...files] = process.argv.slice(2);
const W = +width, C = +cols;
const bufs = await Promise.all(files.map((f) => sharp(f).resize(W).toBuffer({ resolveWithObject: true })));
const rowH = [];
bufs.forEach((b, i) => { const r = Math.floor(i / C); rowH[r] = Math.max(rowH[r] ?? 0, b.info.height); });
const tops = rowH.map((_, r) => rowH.slice(0, r).reduce((a, x) => a + x + 10, 0));
await sharp({ create: { width: C * (W + 10), height: tops.at(-1) + rowH.at(-1), channels: 3, background: '#888' } })
  .composite(bufs.map((b, i) => ({ input: b.data, left: (i % C) * (W + 10), top: tops[Math.floor(i / C)] })))
  .png().toFile(out);
