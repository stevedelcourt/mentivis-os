const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = '3001';
process.env.HOSTNAME = '0.0.0.0';

const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
