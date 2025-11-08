import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('🔐 Probando login con credenciales...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trimpulso.cl',
        password: 'demo123'
      })
    });

    console.log(`📊 Status HTTP: ${response.status}`);
    const data = await response.json();
    console.log('✅ Respuesta:', JSON.stringify(data, null, 2));
    
    if (data.token) {
      console.log('\n🔑 Token recibido:', data.token.substring(0, 30) + '...');
    } else {
      console.log('\n❌ No se recibió token');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
