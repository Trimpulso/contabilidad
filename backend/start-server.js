#!/usr/bin/env node
// Script para mantener el servidor activo

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'src', 'server-simple.js');

console.log('🚀 Iniciando servidor persistente...');
console.log(`📍 Ruta del servidor: ${serverPath}`);

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('error', (err) => {
  console.error('❌ Error al iniciar servidor:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`⚠️ Servidor cerrado con código: ${code}`);
  console.log('🔄 Reiniciando en 3 segundos...');
  setTimeout(() => {
    process.exit(0);
  }, 3000);
});

process.on('SIGINT', () => {
  console.log('\n📴 Cerrando servidor...');
  server.kill();
  process.exit(0);
});
