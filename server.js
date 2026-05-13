process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// Force port 3001 to avoid EADDRINUSE on port 3000 (occupied by lsphp/Passenger error server).
// Passenger may inject its own PORT value — we override it here to ensure consistency.
process.env.PORT = '3001';
// Force hostname to 0.0.0.0 so the server listens on all interfaces.
// Passenger sets HOSTNAME to the server's FQDN (terre.o2switch.net), which breaks localhost access.
process.env.HOSTNAME = '0.0.0.0';

require('./.next/standalone/server.js');
