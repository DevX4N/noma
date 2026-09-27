// uso: node tools/slice.mjs <full.png> <prefix> [chunk=1800] [scale=0.6]
import sharp from 'sharp';
const [f, prefix, chunk = '1800', scale = '0.6'] = process.argv.slice(2);
const m = await sharp(f).metadata();
let i = 0;
for (let top = 0; top < m.height; top += +chunk) {
  const h = Math.min(+chunk, m.height - top);
  await sharp(f).extract({ left: 0, top, width: m.width, height: h }).resize(Math.round(m.width * +scale)).png().toFile(`${prefix}-${i++}.png`);
}
console.log(m.width, m.height, 'slices', i);
