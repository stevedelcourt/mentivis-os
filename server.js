const fs = require('fs');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    fs.appendFileSync('/home/sc4bovu7233/nextapp/logs/app-startup.log', line);
  } catch (e) {
    // ignore
  }
  console.log(msg);
}

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// Force port 3001 to avoid EADDRINUSE on port 3000 (occupied by lsphp/Passenger error server).
// Passenger may inject its own PORT value — we override it here to ensure consistency.
process.env.PORT = '3001';

log(`[MentivisOS] Starting server on port ${process.env.PORT}`);
log(`[MentivisOS] CWD: ${process.cwd()}`);
log(`[MentivisOS] argv: ${JSON.stringify(process.argv)}`);
log(`[MentivisOS] env PORT: ${process.env.PORT}`);

const http = require('http');
const originalListen = http.Server.prototype.listen;
http.Server.prototype.listen = function(...args) {
  log(`[MentivisOS] http.Server.listen called with args: ${JSON.stringify(args)}`);
  return originalListen.apply(this, args);
};

try {
  require('./.next/standalone/server.js');
  log('[MentivisOS] standalone/server.js required successfully');
} catch (err) {
  log(`[MentivisOS] ERROR requiring standalone/server.js: ${err.message}`);
  throw err;
}
