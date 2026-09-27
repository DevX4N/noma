// uso: node sheet.mjs out.png id1 id2 ...  -> grade 6 col com rótulo
import sharp from 'sharp';
const [out, ...ids] = process.argv.slice(2);
const TW = 220, TH = 300, C = 6;
const rows = Math.ceil(ids.length / C);
const comps = [];
await Promise.all(ids.map(async (id, i) => {
  try {
    const r = await fetch(`https://images.unsplash.com/photo-${id}?w=440&q=60&fm=jpg`);
    const buf = Buffer.from(await r.arrayBuffer());
    const img = await sharp(buf).resize(TW, TH, { fit: 'cover' }).toBuffer();
    const label = Buffer.from(`<svg width="${TW}" height="22"><rect width="100%" height="100%" fill="#000"/><text x="4" y="16" font-size="14" fill="#fff" font-family="Arial">${i}: ${id.slice(0,13)}</text></svg>`);
    comps.push({ input: img, left: (i % C) * (TW + 6), top: Math.floor(i / C) * (TH + 28) });
    comps.push({ input: label, left: (i % C) * (TW + 6), top: Math.floor(i / C) * (TH + 28) + TH });
  } catch (e) { console.error('fail', id); }
}));
await sharp({ create: { width: C * (TW + 6), height: rows * (TH + 28), channels: 3, background: '#666' } }).composite(comps).png().toFile(out);
console.log(ids.map((id, i) => i + '=' + id).join(' '));
