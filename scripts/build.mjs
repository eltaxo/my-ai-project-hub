// Build de eltaxo.com — sitio vanilla estático.
// public/ es la fuente de verdad; dist/ es un espejo exacto (copia, sin transformación).
// Verificación incluida: el build falla si falta algo esencial.
import { cpSync, rmSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'public');
const dist = join(root, 'dist');

if (!existsSync(join(src, 'index.html'))) {
  console.error('✗ falta public/index.html');
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
cpSync(src, dist, { recursive: true });

// Verificación de artefactos esenciales
const required = [
  'index.html',
  'favicon.svg',
  'favicon.ico',
  'og-image.png',
  'robots.txt',
  'fonts/clash-display-500.woff2',
  'fonts/clash-display-600.woff2',
  'fonts/clash-display-700.woff2',
  'fonts/general-sans-400.woff2',
  'fonts/general-sans-500.woff2',
  'fonts/general-sans-600.woff2',
  'fonts/jetbrains-mono-var.woff2',
];
const missing = required.filter(f => !existsSync(join(dist, f)));
if (missing.length) {
  console.error('✗ faltan artefactos en dist/:', missing.join(', '));
  process.exit(1);
}

// Tamaño total del sitio (sin og:image, que es para redes)
let total = 0;
for (const f of required) {
  if (f === 'og-image.png') continue;
  total += statSync(join(dist, f)).size;
}
console.log(`✓ build OK — dist/ espejo de public/ (${(total / 1024).toFixed(1)} KB esenciales)`);
