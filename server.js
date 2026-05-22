const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// Force port 3001 to avoid EADDRINUSE on port 3000 (occupied by lsphp/Passenger error server).
// Passenger may inject its own PORT value — we override it here to ensure consistency.
process.env.PORT = '3001';
// Force hostname to 0.0.0.0 so the server listens on all interfaces.
// Passenger sets HOSTNAME to the server's FQDN (terre.o2switch.net), which breaks localhost access.
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
