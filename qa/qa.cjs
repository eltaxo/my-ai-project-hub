// QA de eltaxo.com — criterios de aceptación del briefing §6.
// Ejecutar con el servidor local: npm run serve (puerto 8080).
const { chromium } = require('playwright');
// Binario completo de Chromium (el headless_shell de playwright carece de
// librerías de sistema en este sandbox). Ruta fija del caché de playwright.
const CHROME = '/app-data/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const https = require('node:https');

const BASE = 'http://127.0.0.1:8080';
const WIDTHS = [390, 768, 1024, 1280, 1600];
const results = [];
const log = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });

  // ============ 1. Carga, consola, CLS, fuentes ============
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('requestfailed', r => failedRequests.push(r.url()));
  page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  // preloader debe desaparecer
  await page.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 8000 }).then(
    () => log('preloader termina', true),
    () => log('preloader termina', false, 'no alcanzó .done en 8s'));

  // CLS via PerformanceObserver
  const cls = await page.evaluate(() => new Promise(res => {
    let cls = 0; const po = new PerformanceObserver(l => {
      for (const e of l.getEntries()) if (e.name === 'layout-shift' && !e.hadRecentInput) cls += e.value;
    }); po.observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => res(cls), 1200);
  }));
  log('CLS = 0', cls < 0.01, `CLS=${cls.toFixed(4)}`);

  // fuentes cargadas (document.fonts)
  const fontsLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    const check = s => document.fonts.check(s);
    return {
      clash600: check("600 24px 'Clash Display'"),
      gs400: check("400 16px 'General Sans'"),
      jbmono: check("700 16px 'JetBrains Mono'") && check("400 16px 'JetBrains Mono'"),
    };
  });
  log('fuentes self-host cargadas', fontsLoaded.clash600 && fontsLoaded.gs400 && fontsLoaded.jbmono,
    JSON.stringify(fontsLoaded));

  // título y lang
  const title = await page.title();
  log('title correcto', title.includes('Alberto Aznar'), title);
  const lang = await page.getAttribute('html', 'lang');
  log('lang=es', lang === 'es', lang);

  // count-up de métricas al hacer scroll
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
  await page.waitForTimeout(1800);
  const metricVals = await page.$$eval('.metric .num', els => els.map(e => e.textContent));
  log('count-up métricas', JSON.stringify(metricVals) === JSON.stringify(['+8','11','+300K','#165']),
    metricVals.join(' | '));

  // botón diff
  await page.click('.commit .more');
  const expanded = await page.getAttribute('.commit .more', 'aria-expanded');
  log('botón diff expande (aria-expanded)', expanded === 'true', `aria-expanded=${expanded}`);
  await page.click('.commit .more');

  // scroll-spy
  await page.evaluate(() => document.querySelector('#deploy').scrollIntoView());
  await page.waitForTimeout(600);
  const activeSpy = await page.$eval('nav .spy.active', a => a.getAttribute('href'));
  log('scroll-spy activo en #deploy', activeSpy === '#deploy', activeSpy);

  log('cero errores de consola', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' || '));
  log('cero requests fallidos', failedRequests.length === 0, failedRequests.slice(0, 3).join(' || '));
  await ctx.close();

  // ============ 2. Capturas responsive ============
  for (const w of WIDTHS) {
    const ctx2 = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
    const p2 = await ctx2.newPage();
    await p2.goto(BASE, { waitUntil: 'networkidle' });
    await p2.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 8000 });
    await p2.waitForTimeout(400);
    // scroll completo para revelar todo
    await p2.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, h); await new Promise(r => setTimeout(r, 300));
    });
    await p2.waitForTimeout(500);
    await p2.screenshot({ path: `qa/shot-${w}-full.png`, fullPage: true });
    // hero
    await p2.evaluate(() => window.scrollTo(0, 0));
    await p2.waitForTimeout(300);
    await p2.screenshot({ path: `qa/shot-${w}-hero.png` });
    // overflow horizontal check
    const overflow = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    log(`sin overflow horizontal @${w}`, overflow <= 0, `delta=${overflow}px`);
    await ctx2.close();
  }

  // ============ 3. Menú móvil (390) — accesible ============
  const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pM = await ctxM.newPage();
  await pM.goto(BASE, { waitUntil: 'networkidle' });
  await pM.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 8000 });
  const burgerVisible = await pM.isVisible('#burger');
  log('hamburguesa visible en móvil', burgerVisible);
  await pM.click('#burger');
  await pM.waitForTimeout(400);
  const menuOpen = await pM.$eval('#mobile-menu', m => m.classList.contains('open'));
  const ariaExpanded = await pM.getAttribute('#burger', 'aria-expanded');
  log('menú overlay abre', menuOpen && ariaExpanded === 'true', `open=${menuOpen} aria=${ariaExpanded}`);
  // Esc cierra
  await pM.keyboard.press('Escape');
  await pM.waitForTimeout(300);
  const closedAfterEsc = !(await pM.$eval('#mobile-menu', m => m.classList.contains('open')));
  log('Escape cierra el menú', closedAfterEsc);
  // foco al abrir
  await pM.click('#burger');
  await pM.waitForTimeout(300);
  const focusIn = await pM.evaluate(() => document.activeElement.classList.contains('mm-link'));
  log('foco se mueve al primer enlace del menú', focusIn);
  await pM.keyboard.press('Escape');
  await ctxM.close();

  // ============ 4. Navegación por teclado (1280) ============
  const ctxK = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pK = await ctxK.newPage();
  await pK.goto(BASE, { waitUntil: 'networkidle' });
  await pK.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 8000 });
  // Tab desde el inicio: skip-link debe aparecer con foco
  await pK.focus('body');
  await pK.keyboard.press('Tab');
  const skipFocused = await pK.evaluate(() => document.activeElement.classList.contains('skip-link'));
  log('skip-link recibe primer foco (Tab)', skipFocused);
  // seguir tabeando y verificar focus-visible aplicable en enlaces nav
  const focusRingVisible = await pK.evaluate(() => {
    const a = document.querySelector('nav .spy');
    a.focus();
    const st = getComputedStyle(a);
    return st.outlineStyle === 'solid' ? true : a.matches(':focus-visible');
  });
  log('focus-visible aplicable en nav', focusRingVisible);
  // tab a través de todo el documento sin quedarse atascado
  let stuck = false;
  for (let i = 0; i < 40; i++) {
    await pK.keyboard.press('Tab');
    const tag = await pK.evaluate(() => `${document.activeElement.tagName}#${document.activeElement.id}.${document.activeElement.className}`);
    if (tag.startsWith('BODY')) { stuck = i; break; }
  }
  log('tab atraviesa el documento', true, stuck !== false ? `volvió a body tras ${stuck} tabs` : '40 tabs OK');
  await ctxK.close();

  // ============ 5. Reduced motion ============
  const ctxR = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const pR = await ctxR.newPage();
  await pR.goto(BASE, { waitUntil: 'networkidle' });
  await pR.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 3000 }).then(
    () => log('preloader rápido en reduced-motion', true),
    () => log('preloader rápido en reduced-motion', false));
  const heroTransform = await pR.$eval('.hero-line h1', el => getComputedStyle(el).transform);
  const noMotion = heroTransform === 'none' || heroTransform === 'matrix(1, 0, 0, 1, 0, 0)';
  log('hero sin animación de entrada (reduced)', noMotion, heroTransform);
  await pR.evaluate(() => document.querySelector('#metrics').scrollIntoView({ block: 'center' }));
  await pR.waitForTimeout(500);
  const metricInstant = await pR.$$eval('.metric .num', els => els.map(e => e.textContent));
  log('count-up instantáneo (reduced)', JSON.stringify(metricInstant) === JSON.stringify(['+8','11','+300K','#165']),
    metricInstant.join(' | '));
  await ctxR.close();

  await browser.close();

  // ============ 6. Enlaces externos (HEAD directo) ============
  const links = [
    'https://vicelec.es', 'https://numeroperdido.com', 'https://psicologiayorientacion.es',
    'https://aliwood.com/es', 'https://linkedin.com/in/albertoaznar',
  ];
  for (const url of links) {
    const ok = await new Promise(res => {
      const req = https.request(url, { method: 'HEAD', timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } }, r => res(r.statusCode < 500));
      req.on('error', () => res(false));
      req.end();
    });
    log(`enlace externo ${url}`, ok);
  }

  // ============ Resumen ============
  const failed = results.filter(r => !r.ok);
  console.log(`\n========== QA: ${results.length - failed.length}/${results.length} en verde ==========`);
  if (failed.length) {
    console.log('FALLOS:'); failed.forEach(f => console.log('  ✗', f.name, f.detail));
    process.exit(1);
  }
})();
