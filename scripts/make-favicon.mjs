// Generate the website favicon set from the app's standard launcher icon
// (assets/icons/app_icon.png in the Flutter app, copied to raw-assets here).
// Run: node scripts/make-favicon.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeFileSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const SRC = join(root, 'raw-assets', 'app_icon.png'); // the standard app icon

const pngAt = (size) =>
  sharp(SRC).resize(size, size, { fit: 'cover' }).png().toBuffer();

// Build a multi-size .ico from PNG-encoded frames (Vista+ format).
function buildIco(frames) {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type: icon
  header.writeUInt16LE(count, 4);  // image count
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  frames.forEach((f, i) => {
    const b = i * 16;
    dir.writeUInt8(f.size >= 256 ? 0 : f.size, b + 0); // width (0 => 256)
    dir.writeUInt8(f.size >= 256 ? 0 : f.size, b + 1); // height
    dir.writeUInt8(0, b + 2);  // palette
    dir.writeUInt8(0, b + 3);  // reserved
    dir.writeUInt16LE(1, b + 4);   // color planes
    dir.writeUInt16LE(32, b + 6);  // bits per pixel
    dir.writeUInt32LE(f.data.length, b + 8);  // size of PNG data
    dir.writeUInt32LE(offset, b + 12);        // offset
    offset += f.data.length;
  });
  return Buffer.concat([header, dir, ...frames.map((f) => f.data)]);
}

const sizes = [16, 32, 48, 64];
const frames = [];
for (const size of sizes) frames.push({ size, data: await pngAt(size) });
writeFileSync(join(pub, 'favicon.ico'), buildIco(frames));
console.log('favicon.ico written (' + sizes.join('/') + ') from app_icon.png');

await sharp(SRC).resize(32, 32).png().toFile(join(pub, 'favicon.png'));
await sharp(SRC).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));
console.log('favicon.png (32) + apple-touch-icon.png (180) written');
