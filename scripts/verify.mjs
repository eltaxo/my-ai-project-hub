// Verificación estática del sitio — corre en CI y localmente.
// Comprueba estructura, copy v1.8, enlaces, metas de accesibilidad/SEO y assets.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(join(root, 'public', 'index.html'), 'utf8');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? '✓' : '✗'} ${name}`);
  if (!cond) failures++;
};

// Estructura
check('lang="es"', html.includes('<html lang="es">'));
check('meta description', /<meta name="description" content="[^"]{80,}"/.test(html));
check('OG image', html.includes('og:image'));
check('canonical', html.includes('rel="canonical"'));
check('preloader', html.includes('id="preloader"'));
check('nav con aria-label', html.includes('nav aria-label="Principal"'));
check('hamburguesa aria-label', html.includes('aria-label="Abrir menú de navegación"'));
check('skip-link', html.includes('class="skip-link"'));
check('4 secciones', ['id="readme"', 'id="releases"', 'id="log"', 'id="deploy"'].every(id => html.includes(id)));
check('focus-visible global', html.includes(':focus-visible{outline:2px solid var(--accent)'));

// Copy v1.8 (integridad literal)
const copyPhrases = [
  'Product Manager <em>· COO</em>',
  'Product Manager · COO · FDE · Continuidad de negocio · San Sebastián de los Reyes, Madrid',
  'Llevo desde 2009 trabajando en digital. La mayor parte de mi carrera fui <strong>director de operaciones</strong>',
  '12 especialidades, equipo de 7 psicólogas, tarifas públicas y captación de primeras citas',
  'juego de mesa de cálculo mental que diseñé, produje con Tabletop Creator y distribuye Asmodee',
  'Grado Superior en Administración de Sistemas Informáticos · IES Abastos · 2007–2009',
  '¿Hablamos<em>_</em>',
  'Empecé en digital dirigiendo el área de atención al cliente',
  'The Mini Ofango',
];
for (const p of copyPhrases) check(`copy: "${p.slice(0, 48)}…"`, html.includes(p));

// Métricas v1.8
check('métrica +17 años en digital', html.includes('data-count="17"') && html.includes('años en digital'));
check('métrica proyectos entregados', html.includes('proyectos entregados'));
check('count // 8 commits', html.includes('// 8 commits'));

// Purga de em-dash (U+2014) — cero en todo el HTML servido
check('cero em-dash (U+2014) en el HTML', !html.includes('\u2014'));

// Diffs del gitlog siempre visibles (v1.8): sin botones diff/hide
check('sin botones diff (siempre visibles)', !html.includes('class="more"') && !html.includes('aria-controls="diff-'));

// Enlaces del copy
for (const href of [
  'https://vicelec.es', 'https://numeroperdido.com', 'https://psicologiayorientacion.es',
  'https://aliwood.com/es', 'mailto:eltaxo@gmail.com', 'tel:+34625187200',
  'https://linkedin.com/in/albertoaznar',
]) check(`enlace ${href}`, html.includes(href));

// Assets
const assets = [
  'favicon.svg', 'favicon.ico', 'favicon-32x32.png', 'favicon-16x16.png',
  'apple-touch-icon.png', 'og-image.png', 'robots.txt',
  'fonts/clash-display-600.woff2', 'fonts/jetbrains-mono-var.woff2',
];
for (const a of assets) check(`asset ${a}`, existsSync(join(root, 'public', a)));

// reduced-motion
check('prefers-reduced-motion en CSS', html.includes('@media (prefers-reduced-motion:reduce)'));

if (failures) {
  console.error(`\n✗ ${failures} verificaciones fallidas`);
  process.exit(1);
}
console.log('\n✓ verificación estática completa');
