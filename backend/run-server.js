#!/usr/bin/env node

import('./src/server-simple.js').catch(err => {
  console.error('❌ Error al iniciar servidor:', err);
  process.exit(1);
});
