// Isolated static host for browser tests. Never reuses an unrelated development server.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname, join } from 'node:path';
const root = resolve('dist');
const port = Number(process.argv[2] || 4325);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
};
createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method || '')) {
      res.writeHead(405).end();
      return;
    }
    const pathname = decodeURIComponent(
      new URL(req.url || '/', `http://127.0.0.1:${port}`).pathname
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(join(root, '404.html')).catch(() => Buffer.from('Not found')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Static QA server: http://127.0.0.1:${port}`));
