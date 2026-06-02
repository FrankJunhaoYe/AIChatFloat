import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(resolve(root, 'assets/icon.svg'));
const outDir = resolve(root, 'public/icon');
mkdirSync(outDir, { recursive: true });

const sizes = [16, 32, 48, 128];
for (const size of sizes) {
  const out = resolve(outDir, `${size}.png`);
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`wrote ${out}`);
}
