#!/usr/bin/env node

/**
 * Script de Validación SharePoint
 * Verifica que config.json esté correctamente configurado
 */

const fs = require('fs');
const path = require('path');

function validateConfig() {
  console.log('\n🔍 Validando configuración de SharePoint...\n');

  const configPath = path.join(__dirname, 'config.json');
  const examplePath = path.join(__dirname, 'config.example.json');

  // 1. Verificar que config.json existe
  if (!fs.existsSync(configPath)) {
    console.log('❌ FALTA: config.json');
    console.log('   Acción: Copia config.example.json a config.json\n');
    console.log('   $ cp config.example.json config.json\n');
    return false;
  }

  // 2. Cargar config.json
  let config;
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(content);
  } catch (error) {
    console.log('❌ ERROR: config.json no es JSON válido');
    console.log(`   ${error.message}\n`);
    return false;
  }

  // 3. Validar campos requeridos
  const requiredFields = ['tenantId', 'clientId', 'clientSecret', 'siteUrl'];
  const missing = [];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      missing.push(field);
    } else if (config[field].includes('OBTENER_DE') || config[field].includes('COMPLETAR')) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    console.log('❌ CAMPOS INCOMPLETOS:\n');
    missing.forEach(field => {
      console.log(`   • ${field}: Complete este campo en config.json`);
    });
    console.log('\n   Guía: docs/security_analysis.md\n');
    return false;
  }

  // 4. Validar formato de tenantId (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(config.tenantId)) {
    console.log('❌ TENANT_ID inválido');
    console.log(`   Esperado: UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)`);
    console.log(`   Recibido: ${config.tenantId}\n`);
    return false;
  }

  // 5. Validar URL de SharePoint
  if (!config.siteUrl.includes('sharepoint.com')) {
    console.log('❌ SITE_URL inválido');
    console.log(`   Esperado: URL con sharepoint.com`);
    console.log(`   Recibido: ${config.siteUrl}\n`);
    return false;
  }

  // 6. Todo está bien
  console.log('✅ CONFIGURACIÓN VÁLIDA\n');
  console.log('📋 Valores cargados:');
  console.log(`   • Tenant ID: ${config.tenantId}`);
  console.log(`   • Client ID: ${config.clientId.substring(0, 8)}...`);
  console.log(`   • Site URL: ${config.siteUrl}`);
  console.log('\n✅ Listo para conectar con SharePoint\n');
  
  return true;
}

// Ejecutar validación
const isValid = validateConfig();
process.exit(isValid ? 0 : 1);
