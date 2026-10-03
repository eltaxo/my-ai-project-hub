// Servidor local de desarrollo — sirve public/ en http://127.0.0.1:8080
// Para QA con playwright: capturas, reduced-motion, teclado.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const base = join(root, 'public');
const port = process.env.PORT || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

createServer((req, res) => {
  let path = req.url.split('?')[0];
  if (path === '/') path = '/index.html';
  const file = join(base, path);
  if (!existsSync(file)) {
    res.writeHead(404).end('404');
    return;
  }
  const type = MIME[extname(file)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`sirviendo public/ en http://127.0.0.1:${port}`));
