process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const port = process.env.PORT || 3000;

require('./.next/standalone/server.js');
