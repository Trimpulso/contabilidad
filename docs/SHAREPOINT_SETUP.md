# 🔗 Conector SharePoint

Este módulo te permite conectar con SharePoint de Microsoft 365 para descargar las especificaciones del proyecto.

## 📋 Requisitos Previos

1. Cuenta Microsoft 365 con acceso a SharePoint
2. Permisos de administrador para crear aplicación Azure AD
3. Node.js 14+ instalado

## 🔐 Obtener Credenciales de SharePoint

### Paso 1: Registrar Aplicación en Azure AD

1. Ve a [Azure Portal](https://portal.azure.com)
2. Busca "Azure Active Directory" → "Registros de aplicaciones"
3. Click en "+ Nuevo registro"
4. Completa:
   - **Nombre**: "Contabilidad-Connector"
   - **Tipos de cuenta soportados**: "Solo mi organización"
5. Click en "Registrar"

### Paso 2: Crear Secreto de Cliente

1. En la app registrada, ve a "Certificados y secretos"
2. Click en "+ Nuevo secreto de cliente"
3. Descripción: "Contabilidad SharePoint Sync"
4. Vencimiento: "24 meses" (o según necesites)
5. **Copia el valor del secreto** (solo aparece una vez)

### Paso 3: Configurar Permisos

1. Ve a "Permisos de API"
2. Click en "+ Agregar permiso"
3. Selecciona "Microsoft Graph"
4. Busca y selecciona:
   - `Files.Read.All`
   - `Files.ReadWrite.All`
   - `Sites.Read.All`
5. Click en "Agregar permisos"

### Paso 4: Obtener Tenant ID

En la app registrada, en "Información general" copia el **"Directory (tenant) ID"**

## ⚙️ Configuración

1. Copia el archivo de ejemplo:
```bash
cp config.example.json config.json
```

2. Edita `config.json` con tus credenciales:
```json
{
  "sharepoint": {
    "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "clientSecret": "tu_secreto_aqui",
    "siteUrl": "https://tu-empresa.sharepoint.com/sites/Contabilidad"
  }
}
```

**⚠️ IMPORTANTE**: Nunca commits `config.json` a GitHub. Ya está en `.gitignore`.

## 🚀 Uso

### Instalar dependencias:
```bash
npm install
```

### Listar archivos en SharePoint:
```bash
npm run sync-list
```

### Descargar archivo específico:
```bash
npm run sync -- --config ./config.json --file "Especificaciones.docx"
```

### Desde código JavaScript:
```javascript
const SharePointConnector = require('./index');

const connector = new SharePointConnector({
  tenantId: 'TU_TENANT_ID',
  clientId: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  siteUrl: 'https://...'
});

// Autenticar
await connector.authenticate();

// Descargar archivo
await connector.downloadFile('Especificaciones.docx', './docs/specs.docx');
```

## 📝 Métodos Disponibles

- `authenticate()` - Obtiene token de acceso
- `listFiles(folderPath)` - Lista archivos en una carpeta
- `downloadFile(fileName, outputPath)` - Descarga un archivo
- `uploadFile(localPath, remoteFileName)` - Carga un archivo

## 🐛 Solución de Problemas

### Error: "Invalid client"
→ Verifica que `clientId` y `clientSecret` sean correctos

### Error: "Insufficient privileges"
→ Los permisos no fueron agregados. Intenta agregar el permiso nuevamente

### Error: "Not found"
→ El archivo no existe en SharePoint o la ruta es incorrecta

## 📖 Más Información

- [Microsoft Graph API Docs](https://docs.microsoft.com/en-us/graph/api/overview)
- [SharePoint Developer Docs](https://docs.microsoft.com/en-us/sharepoint/dev/)
