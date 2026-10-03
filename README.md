# eltaxo.com — SHIP/LOG

Portfolio de Alberto Aznar. Concepto **SHIP/LOG**: la carrera como release log —
secciones son versiones, puestos son commits, proyectos son features shipped.

- **Stack**: HTML/CSS/JS vanilla. Sin framework, sin build step real, sin dependencias.
- **Fuentes**: self-host (Clash Display + General Sans de Fontshare, JetBrains Mono
  variable subsetting a los codepoints del copy) — `public/fonts/`, `font-display: swap`.
- **Deploy**: GitHub Actions → rsync por SSH al VPS (solo con tag `v*`).

## Estructura

```
public/          ← el sitio (fuente de verdad)
  index.html     ← one-pager completo (CSS y JS inline, cero requests extra)
  fonts.css      ← @font-face self-host
  fonts/         ← 7 woff2 (~160KB)
  favicon.*, og-image.png, robots.txt
scripts/
  build.mjs      ← dist/ = espejo de public/ + verificación de artefactos
  verify.mjs     ← verificación estática (copy, enlaces, metas, a11y)
  serve.mjs      ← servidor local para QA
.github/workflows/ci.yml
```

## Desarrollo

```bash
npm run build    # dist/ espejo de public/ + checks
npm run verify   # verificación estática del copy/enlaces/metas
npm run serve    # http://127.0.0.1:8080
```

## Deploy

1. Push a `main` → CI corre build + verify (quality gate).
2. Tag `v*` → CI despliega: rsync `dist/` → VPS (`/var/www/sites/eltaxo/dist/`).
3. Requiere secrets/vars de Actions: `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`.

**Rollback**: redeploy del tag anterior, o restaurar la copia previa en el VPS.

## Tokens de diseño (SPEC — no tocar sin dirección de arte)

Base `#0B0D10` · elevated `#12151B` · inset `#08090C` · fg `#F2F1EC` · muted `#9AA3B2`
· accent `#00FF80` (SHIPPED) · accent-2 `#FFB454` (LIVE) · archived `#5A6472` · border `#1E232C`.
Verde quirúrgico, nunca fondo grande. JetBrains Mono es la voz del sistema.
