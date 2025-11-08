import fetch from 'node-fetch';

async function testConnection() {
  try {
    console.log('🔐 Intentando conectar a http://localhost:3000/api/auth/login');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trimpulso.cl',
        password: 'demo123'
      }),
      timeout: 5000
    });

    console.log(`✅ Respuesta HTTP: ${response.status}`);
    const data = await response.json();
    console.log('✅ Datos recibidos:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testConnection();
