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
  { src: 'logo.png', out: 'logo.webp', width: 420 },
  { src: 'mockup.png', out: 'mockup.webp', width: 760 },
  { src: 'image1.png', out: 'image1.webp', width: 1200 },
];

for (const j of jobs) {
  const srcPath = join(raw, j.src);
  if (!existsSync(srcPath)) { console.log(`skip ${j.src} (missing)`); continue; }
  const outPath = join(pub, j.out);
  const before = kb(srcPath);
  await sharp(srcPath).resize({ width: j.width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outPath);
  console.log(`${j.src} (${before}KB) → ${j.out} (${kb(outPath)}KB)`);
}

// OG cover 1200x630
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1E4E8C"/><stop offset="1" stop-color="#2BB673"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="980" cy="120" r="320" fill="#ffffff" opacity="0.06"/>
  <circle cx="180" cy="560" r="240" fill="#ffffff" opacity="0.05"/>
  <text x="90" y="270" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="800" fill="#ffffff" letter-spacing="-2">RentEase 9ja</text>
  <text x="92" y="345" font-family="Helvetica, Arial, sans-serif" font-size="38" font-weight="500" fill="#E8F0FF">Rent · Buy · Sell property in Nigeria — safely.</text>
  <g transform="translate(92,420)">
    <rect x="0" y="0" width="250" height="56" rx="28" fill="#ffffff" opacity="0.16"/>
    <text x="34" y="37" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">✓ Verified listings</text>
    <rect x="276" y="0" width="250" height="56" rx="28" fill="#ffffff" opacity="0.16"/>
    <text x="310" y="37" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">✓ Secure payments</text>
  </g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(join(pub, 'og-cover.png'));
console.log(`og-cover.png (${kb(join(pub, 'og-cover.png'))}KB) generated`);
