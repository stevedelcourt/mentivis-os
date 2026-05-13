process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// Force port 3001 to avoid EADDRINUSE on port 3000 (occupied by lsphp/Passenger error server).
// Passenger may inject its own PORT value — we override it here to ensure consistency.
process.env.PORT = '3001';

console.log(`[MentivisOS] Starting server on port ${process.env.PORT}`);
console.log(`[MentivisOS] CWD: ${process.cwd()}`);

require('./.next/standalone/server.js');
