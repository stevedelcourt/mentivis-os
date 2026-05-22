const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const next = require('next');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = '3001';
process.env.HOSTNAME = '0.0.0.0';

const MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/_next/static/')) {
      const relPath = pathname.replace('/_next/static/', '');
      const filePath = path.join(__dirname, '.next', 'static', relPath);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const mime = MIME[ext] || 'application/octet-stream';
        const needsPrefix = filePath.includes('8058-') ||
                            filePath.includes('polyfills-42372ed130431b0a') ||
                            filePath.includes('page-fd1be9258fa18787');
        if (needsPrefix) {
          res.writeHead(200, {
            'Content-Type': mime,
            'Cache-Control': 'public, max-age=31536000, immutable',
          });
          res.write(Buffer.from('void 0;\n'));
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Type': mime,
            'Cache-Control': 'public, max-age=31536000, immutable',
          });
          fs.createReadStream(filePath).pipe(res);
        }
        return;
      }
    }

    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
