// One-off asset optimization: crush large PNGs to WebP and generate an OG cover.
// Run: node scripts/optimize-assets.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { statSync, existsSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const raw = join(root, 'raw-assets'); // unoptimized source images (not deployed)
const kb = (p) => existsSync(p) ? Math.round(statSync(p).size / 1024) : 0;

const jobs = [
  { src: 'logo.png', out: 'logo.webp', width: 620, trim: true }, // trim surrounding whitespace so it reads larger
  { src: 'mockup.png', out: 'mockup.webp', width: 760 },
  { src: 'image1.png', out: 'image1.webp', width: 1200 },
];

for (const j of jobs) {
  const srcPath = join(raw, j.src);
  if (!existsSync(srcPath)) { console.log(`skip ${j.src} (missing)`); continue; }
  const outPath = join(pub, j.out);
  const before = kb(srcPath);
  let pipe = sharp(srcPath);
  if (j.trim) pipe = pipe.trim({ threshold: 10 });
  await pipe.resize({ width: j.width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(outPath);
  console.log(`${j.src} (${before}KB) → ${j.out} (${kb(outPath)}KB)`);
}

// OG cover 1200x630 — richer composite: gradient + grid + aurora, app phone mockup, trust pills
const pill = (x, label) => `
    <g transform="translate(${x},452)">
      <rect x="0" y="0" width="232" height="54" rx="27" fill="#ffffff" opacity="0.14"/>
      <circle cx="31" cy="27" r="13" fill="#ffffff" opacity="0.92"/>
      <path d="M25.5 27 l4 4 l7 -8" fill="none" stroke="#1E7A4C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="54" y="35" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${label}</text>
    </g>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#173E70"/><stop offset="0.55" stop-color="#1E4E8C"/><stop offset="1" stop-color="#2BB673"/>
    </linearGradient>
    <radialGradient id="aur" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#7FE3B4" stop-opacity="0.5"/><stop offset="1" stop-color="#7FE3B4" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0 H0 V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1010" cy="90" r="300" fill="url(#aur)"/>
  <circle cx="120" cy="600" r="240" fill="#ffffff" opacity="0.04"/>
  <!-- device shadow plate (phone composited on top) -->
  <rect x="824" y="28" width="296" height="600" rx="44" fill="#000000" opacity="0.22" filter="url(#soft)"/>
  <text x="92" y="232" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#9FE3C4" letter-spacing="1">NIGERIA'S TRUSTED PROPERTY APP</text>
  <text x="90" y="330" font-family="Helvetica, Arial, sans-serif" font-size="96" font-weight="800" fill="#ffffff" letter-spacing="-3">RentEase 9ja</text>
  <text x="92" y="398" font-family="Helvetica, Arial, sans-serif" font-size="36" font-weight="500" fill="#E8F0FF">Rent · Buy · Sell property in Nigeria — safely.</text>
  ${pill(92, 'Verified listings')}
  ${pill(336, 'Secure payments')}
</svg>`;

// Render base, then composite the real app mockup
const phoneH = 588;
const phoneW = Math.round(phoneH * 760 / 1648);
const phone = await sharp(join(pub, 'mockup.webp'))
  .resize({ height: phoneH })
  .png()
  .toBuffer();
await sharp(Buffer.from(og))
  .composite([{ input: phone, top: Math.round((630 - phoneH) / 2), left: 1200 - phoneW - 96 }])
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(join(pub, 'og-cover.png'));
console.log(`og-cover.png (${kb(join(pub, 'og-cover.png'))}KB) generated`);
