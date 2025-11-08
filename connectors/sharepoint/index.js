// SharePoint Connector - Descarga especificaciones del proyecto
// Este módulo se conecta a SharePoint usando Microsoft Graph API

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class SharePointConnector {
  constructor(config) {
    this.tenantId = config.tenantId;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.siteUrl = config.siteUrl;
    this.accessToken = null;
  }

  /**
   * Obtiene token de acceso usando OAuth2
   */
  async authenticate() {
    try {
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
      console.log('✅ Autenticación con SharePoint exitosa');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error de autenticación:', error.message);
      throw error;
    }
  }

  /**
   * Lista archivos en una carpeta de SharePoint
   */
  async listFiles(folderPath) {
    if (!this.accessToken) await this.authenticate();

    try {
      const url = `https://graph.microsoft.com/v1.0/sites/root/drive/root:${folderPath}:/children`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });

      console.log(`📁 Archivos en ${folderPath}:`);
      response.data.value.forEach(file => {
        console.log(`  - ${file.name}`);
      });

      return response.data.value;
    } catch (error) {
      console.error('❌ Error listando archivos:', error.message);
      throw error;
    }
  }

  /**
   * Descarga un archivo de SharePoint
   */
  async downloadFile(fileName, outputPath) {
    if (!this.accessToken) await this.authenticate();

    try {
      const url = `https://graph.microsoft.com/v1.0/sites/root/drive/root:/${fileName}:/content`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      });

      await fs.writeFile(outputPath, response.data);
      console.log(`✅ Archivo descargado: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error descargando archivo:', error.message);
      throw error;
    }
  }

  /**
   * Carga un archivo a SharePoint
   */
  async uploadFile(localPath, remoteFileName) {
    if (!this.accessToken) await this.authenticate();

    try {
      const fileContent = await fs.readFile(localPath);
      const url = `https://graph.microsoft.com/v1.0/sites/root/drive/root:/${remoteFileName}:/content`;
      
      const response = await axios.put(url, fileContent, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });

      console.log(`✅ Archivo cargado: ${remoteFileName}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error cargando archivo:', error.message);
      throw error;
    }
  }
}

// Exportar
module.exports = SharePointConnector;
