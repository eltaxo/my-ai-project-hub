const { chromium } = require('playwright');
const CHROME = '/app-data/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const BASE = 'http://127.0.0.1:8080';
const results = [];
const log = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`); };
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [label, path] of [['ES', '/'], ['EN', '/en/']]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 8000 }).catch(() => {});
    // bloque deploy: solo LinkedIn primary, sin mailto/tel
    const links = await page.evaluate(() => {
      const block = document.querySelector('#deploy .deploy');
      const btns = [...block.querySelectorAll('.links a')].map(a => ({ cls: a.className, href: a.getAttribute('href'), text: a.textContent.trim() }));
      const html = block.innerHTML;
      return { btns, hasMailto: html.includes('mailto:'), hasTel: html.includes('tel:'), hasGhost: html.includes('btn ghost') };
    });
    log(`${label}: solo LinkedIn en .links`, links.btns.length === 1 && links.btns[0].text === 'LinkedIn', JSON.stringify(links.btns));
    log(`${label}: LinkedIn .btn.primary`, links.btns[0]?.cls === 'btn primary', links.btns[0]?.cls);
    log(`${label}: sin mailto/tel en bloque deploy`, !links.hasMailto && !links.hasTel && !links.hasGhost, `mailto=${links.hasMailto} tel=${links.hasTel} ghost=${links.hasGhost}`);
    log(`${label}: cero errores de consola`, errors.length === 0, errors.join('|').slice(0, 100));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    log(`${label}: overflow 0 @1280`, overflow === 0, overflow + 'px');
    // título y H2 intactos
    const h2 = await page.textContent('#deploy .deploy .body h2');
    log(`${label}: H2 contacto intacto`, label === 'ES' ? h2.includes('Hablamos') : h2.includes("Let's talk"), h2.trim());
    const loc = await page.textContent('#deploy .contact-meta');
    log(`${label}: location intacto`, loc.includes('San Sebastián'), loc.trim().slice(0, 60));
    await ctx.close();
    // overflow móvil
    const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pM = await ctxM.newPage();
    await pM.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    await pM.waitForFunction(() => document.getElementById('preloader').classList.contains('done'), { timeout: 8000 }).catch(() => {});
    const ovM = await pM.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    log(`${label}: overflow 0 @390`, ovM === 0, ovM + 'px');
    await ctxM.close();
  }
  // enlaces externos (los 5, HEAD)
  const https = require('node:https');
  for (const url of ['https://vicelec.es', 'https://numeroperdido.com', 'https://psicologiayorientacion.es', 'https://aliwood.com/es', 'https://linkedin.com/in/albertoaznar']) {
    const ok = await new Promise(res => {
      const req = https.request(url, { method: 'HEAD', timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } }, r => res(r.statusCode < 500));
      req.on('error', () => res(false)); req.end();
    });
    log(`enlace externo ${url}`, ok);
  }
  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log(`\n========== QA rápido v2026.10.6: ${results.length - failed.length}/${results.length} en verde ==========`);
  if (failed.length) { failed.forEach(f => console.log('  ✗', f.name, f.detail)); process.exit(1); }
})();
