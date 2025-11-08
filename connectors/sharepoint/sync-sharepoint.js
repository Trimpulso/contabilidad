#!/usr/bin/env node

/**
 * Script para conectar con SharePoint y descargar especificaciones
 * 
 * Uso:
 *   node sync-sharepoint.js --config ./config.json --file "Especificaciones.docx"
 */

const SharePointConnector = require('./index');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Leer argumentos de línea de comandos
    const args = process.argv.slice(2);
    const configPath = args[args.indexOf('--config') + 1] || './config.json';
    const fileName = args[args.indexOf('--file') + 1];

    // Validar que config exista
    if (!fs.existsSync(configPath)) {
      console.error('❌ Archivo de configuración no encontrado:', configPath);
      console.error('📝 Por favor, copia config.example.json a config.json y completa tus credenciales');
      process.exit(1);
    }

    // Cargar configuración
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    // Crear conector
    const connector = new SharePointConnector(config.sharepoint);

    console.log('🔗 Conectando con SharePoint...\n');

    // Autenticar
    await connector.authenticate();

    if (fileName) {
      // Descargar archivo específico
      const outputPath = path.join(__dirname, '../../docs', fileName);
      await connector.downloadFile(fileName, outputPath);
    } else {
      // Listar archivos en raíz
      await connector.listFiles('/');
    }

    console.log('\n✅ Proceso completado');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
