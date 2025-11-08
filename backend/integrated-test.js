import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'src', 'server-simple.js');

console.log('🚀 Iniciando servidor...\n');

const server = spawn('node', [serverPath], {
  cwd: __dirname,
  stdio: 'pipe'
});

let serverReady = false;

// Capturar output del servidor
server.stdout.on('data', (data) => {
  console.log('📦 [SERVER]:', data.toString().trim());
  if (data.toString().includes('Servidor ejecutándose')) {
    serverReady = true;
    setTimeout(runTests, 1000);
  }
});

server.stderr.on('data', (data) => {
  console.error('❌ [SERVER ERROR]:', data.toString().trim());
});

async function runTests() {
  console.log('\n========== INICIANDO PRUEBAS ==========\n');
  
  try {
    // Test 1: Login
    console.log('🔐 Test 1: Login');
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trimpulso.cl',
        password: 'demo123'
      })
    });

    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.token) {
      console.log('✅ Login exitoso');
      console.log('   Token:', loginData.token.substring(0, 30) + '...');
      console.log('   Usuario:', loginData.user.email, '(' + loginData.user.role + ')');
      
      const token = loginData.token;

      // Test 2: Estadísticas de seguridad
      console.log('\n📊 Test 2: Estadísticas de seguridad');
      const statsRes = await fetch('http://localhost:3000/api/security/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const stats = await statsRes.json();
      console.log('✅ Estadísticas recibidas:');
      console.log('   Total DTEs:', stats.total);
      console.log('   Bloqueados:', stats.bloqueados);
      console.log('   Proveedores conocidos:', stats.proveedoresConocidos);
      console.log('   Score promedio:', stats.scorePromedio.toFixed(1));

      console.log('\n========== ✅ TODAS LAS PRUEBAS PASARON ==========\n');
    } else {
      console.log('❌ Login falló:', loginData);
    }
  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
  }

  console.log('🛑 Cerrando servidor...');
  server.kill();
  process.exit(0);
}

// Timeout de seguridad
setTimeout(() => {
  console.error('❌ Timeout: El servidor no respondió');
  server.kill();
  process.exit(1);
}, 10000);
