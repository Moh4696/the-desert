import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('public');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2'};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
    const meta = await stat(file);
    if (!meta.isFile()) throw new Error('Not a file');
    const data = await readFile(file);
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    if (req.headers.range && extname(file) === '.mp4') {
      const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!match) { res.writeHead(416); return res.end(); }
      const start = Number(match[1]), end = Math.min(match[2] ? Number(match[2]) : data.length - 1, data.length - 1);
      if (start > end) { res.writeHead(416, {'Content-Range':`bytes */${data.length}`}); return res.end(); }
      res.writeHead(206, {'Content-Range':`bytes ${start}-${end}/${data.length}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});
      return res.end(data.subarray(start, end + 1));
    }
    res.writeHead(200, {'Content-Length':data.length}); res.end(data);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`The Desert is ready at http://localhost:${process.env.PORT || 4173}`));
