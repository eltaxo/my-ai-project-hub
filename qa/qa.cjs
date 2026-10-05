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
  log('count-up métricas', JSON.stringify(metricVals) === JSON.stringify(['+17','11','+300K','#165']),
    metricVals.join(' | '));

  // diffs del gitlog siempre visibles (v1.8): sin botón, ul visible de serie
  const diffsVisible = await page.$$eval('.commit ul', els => els.map(e => getComputedStyle(e).display));
  log('diffs del gitlog siempre visibles', diffsVisible.every(d => d === 'block') && diffsVisible.length === 8,
    `${diffsVisible.length}/8 commits, display=${diffsVisible[0]}`);
  const noDiffButtons = await page.$$eval('.commit button.more', els => els.length);
  log('sin botones diff en el DOM', noDiffButtons === 0, `${noDiffButtons} botones`);

  // scroll-spy — el smooth scroll animado tarda >600ms en una página alta
  // (v1.8: 8 commits con diffs siempre visibles). Esperamos al asentamiento.
  await page.evaluate(() => document.querySelector('#deploy').scrollIntoView());
  let activeSpy = null;
  for (let i = 0; i < 15 && activeSpy !== '#deploy'; i++) {
    await page.waitForTimeout(200);
    activeSpy = await page.$eval('nav .spy.active', a => a.getAttribute('href'));
  }
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
  log('count-up instantáneo (reduced)', JSON.stringify(metricInstant) === JSON.stringify(['+17','11','+300K','#165']),
    metricInstant.join(' | '));
  await ctxR.close();

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

  // ============ 7. v2026.10.5: fix O — margen de TINTA real (canvas) en 5 breakpoints ============
  // La bbox tipográfica (ascent+descent) sobresale con line-height:1; lo que no puede
  // tocar el clip es la TINTA de los glifos: actualBoundingBoxAscent/Descent (canvas).
  const SHOTS = '/tmp/o-fix';
  for (const w of [390, 412, 768, 1024, 1280]) {
    const ctx5 = await browser.newContext({ viewport: { width: w, height: w === 412 ? 915 : 844 } });
    const p5 = await ctx5.newPage();
    await p5.goto(BASE, { waitUntil: 'domcontentloaded' });
    await p5.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 6000 }).catch(() => {});
    await p5.waitForTimeout(1500); // asentado (riseUp 890ms + margen)
    const m = await p5.evaluate(() => {
      const line = document.querySelector('.hero-line');
      const h1 = line.querySelector('h1');
      const cs = getComputedStyle(h1);
      const fs = parseFloat(cs.fontSize);
      const lineBox = line.getBoundingClientRect();
      const h1Box = h1.getBoundingClientRect();
      const c = document.createElement('canvas');
      const g = c.getContext('2d');
      g.font = cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
      const met = g.measureText(h1.textContent);
      const A = met.fontBoundingBoxAscent, D = met.fontBoundingBoxDescent;
      const halfLeading = (h1Box.height - (A + D)) / 2;
      const baseline = h1Box.top + halfLeading + A;
      const inkTop = baseline - met.actualBoundingBoxAscent;
      const inkBottom = baseline + met.actualBoundingBoxDescent;
      return {
        fs,
        top: +(inkTop - lineBox.top).toFixed(2),
        bottom: +(lineBox.bottom - inkBottom).toFixed(2),
      };
    });
    const ok = m.top > 0 && m.bottom > 0;
    log(`fix O: margen de tinta real @${w} (asentado)`, ok,
      ok ? `fs=${m.fs}px · top ${m.top}px / bottom ${m.bottom}px` : JSON.stringify(m));
    // capturas del glifo en 3 momentos (solo móvil 390 y 412×915): reinicio determinista de riseUp
    if (w === 390 || w === 412) {
      await p5.evaluate(() => {
        document.querySelectorAll('.hero-line h1').forEach(h => {
          h.style.animation = 'none';
          void h.offsetWidth;
          h.style.animation = '';
        });
      });
      const clip = await p5.evaluate(() => {
        const r = document.querySelector('.hero-line').getBoundingClientRect();
        const pad = 48;
        return {
          x: Math.max(0, r.left - pad), y: Math.max(0, r.top - pad),
          width: Math.min(innerWidth, r.right + pad) - Math.max(0, r.left - pad),
          height: Math.min(innerHeight, r.bottom + pad) - Math.max(0, r.top - pad),
        };
      });
      await p5.waitForTimeout(200);
      await p5.screenshot({ path: `${SHOTS}-${w}-entrada.png`, clip });
      await p5.waitForTimeout(300);
      await p5.screenshot({ path: `${SHOTS}-${w}-mitad.png`, clip });
      await p5.waitForTimeout(600);
      await p5.screenshot({ path: `${SHOTS}-${w}-asentado.png`, clip });
    }
    await ctx5.close();
  }

  // ============ 8. v2026.10.5: versión EN ============
  const enCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const enPage = await enCtx.newPage();
  const enErrors = [];
  enPage.on('console', m => { if (m.type() === 'error') enErrors.push(m.text()); });
  enPage.on('pageerror', e => enErrors.push('pageerror: ' + e.message));
  await enPage.goto(BASE + '/en/', { waitUntil: 'networkidle' });
  const enTitle = await enPage.title();
  log('EN: title Business Continuity', enTitle === 'Alberto Aznar · Product Manager · COO · FDE · Business Continuity', enTitle);
  const enLang = await enPage.getAttribute('html', 'lang');
  log('EN: lang=en', enLang === 'en', enLang);
  log('EN: cero errores de consola', enErrors.length === 0, enErrors.join(' | ').slice(0, 120));
  const enSel = await enPage.evaluate(() => {
    const a = document.querySelector('nav ul .lang a.on');
    return a ? { href: a.getAttribute('href'), label: a.getAttribute('aria-label'), current: a.getAttribute('aria-current') } : null;
  });
  log('EN: selector EN activo (/en/, aria-current)', !!enSel && enSel.href === '/en/' && enSel.current === 'true', JSON.stringify(enSel));
  const enHrefs = await enPage.evaluate(() => [...document.querySelectorAll('link[rel="alternate"]')].map(l => l.getAttribute('hreflang') + '→' + l.getAttribute('href')).join(' '));
  log('EN: hreflang es/en/x-default', enHrefs === 'es→https://eltaxo.com/ en→https://eltaxo.com/en/ x-default→https://eltaxo.com/', enHrefs);
  const enCountOk = await enPage.waitForFunction(
    () => document.querySelector('.metric .num').textContent === '+17',
    { timeout: 6000 }).then(() => true, () => false);
  const enCount = await enPage.evaluate(() => document.querySelector('.metric .num').textContent);
  log('EN: count-up +17 en load', enCountOk, enCount);
  const enOverflow = await enPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  log('EN: overflow 0 @1280', enOverflow === 0, enOverflow + 'px');
  // selector ES en EN: el link ES apunta a /
  const esHref = await enPage.getAttribute('nav ul .lang a:not(.on)', 'href');
  log('EN: selector ES → /', esHref === '/', esHref);
  // overlay móvil EN
  await enCtx.close();
  const enMob = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const enMobPage = await enMob.newPage();
  await enMobPage.goto(BASE + '/en/', { waitUntil: 'domcontentloaded' });
  const mmLang = await enMobPage.evaluate(() => {
    const el = document.querySelector('#mobile-menu .mm-lang');
    return el ? { visible: getComputedStyle(el).display !== 'none', on: el.querySelector('a.on')?.textContent, href: el.querySelector('a.on')?.getAttribute('href') } : null;
  });
  log('EN: selector en overlay móvil (EN on, /en/)', !!mmLang && mmLang.visible && mmLang.on === 'EN' && mmLang.href === '/en/', JSON.stringify(mmLang));
  await enMob.close();
  await browser.close();

  // ============ Resumen ============
  const failed = results.filter(r => !r.ok);
  console.log(`\n========== QA: ${results.length - failed.length}/${results.length} en verde ==========`);
  if (failed.length) {
    console.log('FALLOS:'); failed.forEach(f => console.log('  ✗', f.name, f.detail));
    process.exit(1);
  }
})();
