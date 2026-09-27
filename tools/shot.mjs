// uso: node tools/shot.mjs <path> <out.png> [width=1440] [height=900] [--full] [--wait=ms] [--scroll=y]
import puppeteer from 'puppeteer-core';
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const [path, out, w = '1440', h = '900'] = args.filter((a) => !a.startsWith('--'));
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768, deviceScaleFactor: 1 });
await p.goto('http://localhost:3012' + path, { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, +(flags.wait ?? 3500)));
if (flags.full) {
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += +h * 0.5) { await p.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 250)); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1500));
  await p.screenshot({ path: out, fullPage: true });
} else {
  if (flags.scroll) { await p.evaluate((y) => window.scrollTo(0, y), +flags.scroll); await new Promise((r) => setTimeout(r, 2200)); }
  await p.screenshot({ path: out });
}
console.log(errs.join('\n') || 'no errors');
await b.close();
