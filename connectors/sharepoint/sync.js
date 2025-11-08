#!/usr/bin/env node

/**
 * Script de Sincronización SharePoint
 * Conecta con Microsoft 365 y descarga/sube archivos
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class SharePointSync {
  constructor(config) {
    this.tenantId = config.tenantId;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.siteUrl = config.siteUrl;
    this.accessToken = null;
  }

  /**
   * Obtener token de acceso
   */
  async authenticate() {
    try {
      console.log('🔐 Autenticando con Azure AD...');
      
      const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
      
      const response = await axios.post(tokenUrl, null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        }
      });

      this.accessToken = response.data.access_token;
      console.log('✅ Autenticación exitosa\n');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error de autenticación:', error.response?.data?.error_description || error.message);
      process.exit(1);
    }
  }

  /**
   * Listar archivos en SharePoint
   */
  async listFiles(folderPath = '') {
    if (!this.accessToken) await this.authenticate();

    try {
      console.log(`📁 Listando archivos en SharePoint...\n`);
      
      const url = `https://graph.microsoft.com/v1.0/sites/root/drive/root${folderPath}:/children`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.value && response.data.value.length > 0) {
        response.data.value.forEach((item, index) => {
          const icon = item.folder ? '📁' : '📄';
          console.log(`${index + 1}. ${icon} ${item.name}`);
        });
      } else {
        console.log('No hay archivos en esta ubicación');
      }

      return response.data.value;
    } catch (error) {
      console.error('❌ Error listando archivos:', error.response?.data?.error?.message || error.message);
      return [];
    }
  }

  /**
   * Descargar archivo
   */
  async downloadFile(fileName) {
    if (!this.accessToken) await this.authenticate();

    try {
      console.log(`\n📥 Descargando: ${fileName}`);
      
      const url = `https://graph.microsoft.com/v1.0/sites/root/drive/root:/${fileName}:/content`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      });

      // Crear carpeta data si no existe
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const outputPath = path.join(dataDir, fileName);
      fs.writeFileSync(outputPath, response.data);
      
      console.log(`✅ Descargado: ${outputPath}\n`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error descargando:', error.response?.data?.error?.message || error.message);
      return null;
    }
  }
}

// Main
async function main() {
  try {
    // Cargar configuración
    const configPath = path.join(__dirname, 'config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ Archivo config.json no encontrado');
      console.log('   Crear: connectors/sharepoint/config.json');
      console.log('   Con tus credenciales de Azure AD');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    // Validar configuración
    if (!config.tenantId || !config.clientId || !config.clientSecret) {
      console.error('❌ Configuración incompleta en config.json');
      console.log('   Necesitas: tenantId, clientId, clientSecret, siteUrl');
      process.exit(1);
    }

    const sync = new SharePointSync(config);

    console.log('\n========================================');
    console.log('🔗 SINCRONIZACIÓN SHAREPOINT');
    console.log('========================================\n');

    // Autenticar
    await sync.authenticate();

    // Listar archivos
    const files = await sync.listFiles();

    // Si hay argumentos, descargar archivo específico
    const args = process.argv.slice(2);
    if (args.length > 0) {
      const fileName = args[0];
      await sync.downloadFile(fileName);
    }

    console.log('========================================');
    console.log('✅ Proceso completado');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
