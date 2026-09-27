// Baixa as fotos (licença Unsplash), gera WebP otimizado em public/images e
// src/lib/images.json com dimensões + blur placeholder.
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

const W = { p: 1400, e: 1800, j: 1400, h: 2600 };
const list = [
  // hero / editoriais
  ['h', 'hero', '1603189343302-e603f7add05a'],
  ['e', 'silence', '1607207496684-3e09f039cfe6'],
  ['e', 'silence-2', '1779912217745-c4b2e7cd5aa4'],
  ['e', 'cat-men', '1694676798971-1b148f222416'],
  ['e', 'cat-women', '1762331224129-783a3ea1fc3f'],
  ['e', 'cat-essentials', '1633943934209-31b7f3775fee'],
  ['e', 'signature', '1705798543468-5b951da25e1e'],
  ['e', 'look-1', '1779912217680-b7b449e62237'],
  ['e', 'look-2', '1779912217700-ff65abca0f79'],
  ['e', 'look-3', '1588713611500-8bf627fd3fb9'],
  ['e', 'look-4', '1567973296782-49e492d1e08a'],
  ['e', 'look-5', '1694677812728-78ebb3f53579'],
  ['e', 'look-6', '1587115924362-622c3fa065bd'],
  ['e', 'look-7', '1550246140-18d9dd4a6438'],
  ['e', 'look-8', '1642959272187-2a1c3882f64f'],
  ['e', 'texture-dark', '1636716016297-a7b3f4b5e3e8'],
  ['e', 'texture-light', '1602706294170-1fed8eecd9f9'],
  // journal
  ['j', 'architecture', '1737442981890-0a87ef3ce9f5'],
  ['j', 'behind', '1771555557406-d1cae82cdbca'],
  ['j', 'materials', '1636716016297-a7b3f4b5e3e8'],
  ['j', 'stairs', '1619280771206-d8330a0be617'],
  ['j', 'folded', '1548768041-2fceab4c0b85'],
  ['j', 'curve', '1501761073634-2faabf89f9c8'],
  // produtos
  ['p', 'structured-jacket-1', '1761882298264-42de6c5983b6'],
  ['p', 'structured-jacket-2', '1761637316697-c7f4e4d7b49f'],
  ['p', 'camel-overcoat-1', '1619603364904-c0498317e145'],
  ['p', 'camel-overcoat-2', '1619603364937-8d7af41ef206'],
  ['p', 'essential-tee-1', '1778671394516-8270eac13c42'],
  ['p', 'essential-tee-2', '1586790170083-2f9ceadc732d'],
  ['p', 'essential-tee-3', '1592994238317-fcf75c5466fd'],
  ['p', 'tailored-trouser-1', '1744535814652-9cd3a3dea348'],
  ['p', 'tailored-trouser-2', '1775680978611-4bbc221f3944'],
  ['p', 'oversized-knit-1', '1672239859152-ff064044e0fb'],
  ['p', 'oversized-knit-2', '1627903803195-a1966b5c6fdc'],
  ['p', 'crew-knit-1', '1749224445782-297c6fe4f4ec'],
  ['p', 'crew-knit-2', '1608852756362-2cab885fe809'],
  ['p', 'long-sleeve-1', '1760245773960-200dbe893696'],
  ['p', 'long-sleeve-2', '1694676799027-33e237cf007a'],
  ['p', 'double-trench-1', '1737508945707-ebdccee97cc5'],
  ['p', 'double-trench-2', '1618886614638-80e3c103d31a'],
  ['p', 'linen-shirt-1', '1713881842156-3d9ef36418cc'],
  ['p', 'linen-shirt-2', '1591357037205-166318b51afd'],
  ['p', 'linen-shirt-3', '1713881676551-b16f22ce4719'],
  ['p', 'silence-trench-1', '1663343683182-70885ae0a792'],
  ['p', 'silence-trench-2', '1683642765591-2370edc15193'],
  ['p', 'noire-coat-1', '1705798543468-5b951da25e1e'],
  ['p', 'noire-coat-2', '1613835070570-ea55914f207a'],
  ['p', 'grey-coat-1', '1613915617430-8ab0fd7c6baf'],
  ['p', 'grey-coat-2', '1637915166704-c9008a922e12'],
  ['p', 'wide-trouser-1', '1713145872217-1005fd433ba0'],
  ['p', 'wide-trouser-2', '1591911894795-253b780dc774'],
  ['p', 'merino-turtleneck-1', '1586447824351-f7df69280137'],
  ['p', 'merino-turtleneck-2', '1758922584983-82ffd5720c6a'],
  ['p', 'tailored-blazer-1', '1624468472674-b162e9086bfe'],
  ['p', 'tailored-blazer-2', '1584273143981-41c073dfe8f8'],
  ['p', 'ivory-blazer-1', '1627130697816-4d71dbfe6a5b'],
  ['p', 'ivory-blazer-2', '1580651214613-f4692d6d138f'],
];

const meta = {};
await Promise.all(list.map(async ([kind, name, id]) => {
  const dir = `public/images/${kind}`;
  mkdirSync(dir, { recursive: true });
  const out = `${dir}/${name}.webp`;
  if (!existsSync(out)) {
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2800&q=85&fm=jpg`);
    if (!res.ok) { console.error('FAIL', name, res.status); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: W[kind], withoutEnlargement: true }).webp({ quality: 76, effort: 6 }).toFile(out);
  }
  const m = await sharp(out).metadata();
  const blur = await sharp(out).resize(12).webp({ quality: 40 }).toBuffer();
  meta[`/images/${kind}/${name}.webp`] = { w: m.width, h: m.height, blur: `data:image/webp;base64,${blur.toString('base64')}` };
  console.log(name, m.width + 'x' + m.height);
}));
writeFileSync('src/lib/images.json', JSON.stringify(meta, null, 0));
console.log('images:', Object.keys(meta).length);
