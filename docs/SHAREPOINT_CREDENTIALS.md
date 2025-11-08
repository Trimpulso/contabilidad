# 🔐 Obtener Credenciales SharePoint - Guía Rápida

## ¿Por qué necesitamos esto?

Para conectar con SharePoint de forma automática y segura, necesitamos:
- **Tenant ID** - Identificador de tu organización en Azure
- **Client ID** - Identificador de la aplicación
- **Client Secret** - Contraseña de la aplicación

Esto es DIFERENTE a tus credenciales de usuario.

## 📋 Pasos para Obtener Credenciales

### 1️⃣ Accede a Azure Portal
- Ve a: https://portal.azure.com
- Inicia sesión con tu cuenta Microsoft 365

### 2️⃣ Encuentra tu Tenant ID
1. Busca "Azure Active Directory" en la barra superior
2. Ve a "Información de inquilino"
3. Copia el **ID del directorio (inquilino)**
   ```
   Este es tu TENANT ID
   ```

### 3️⃣ Registra una Nueva Aplicación
1. En Azure AD, ve a "Registros de aplicaciones"
2. Haz clic en "+ Nuevo registro"
3. Rellena:
   - **Nombre**: "SharePoint-Contabilidad"
   - **Tipos de cuenta soportados**: "Solo mi organización"
4. Haz clic en "Registrar"

### 4️⃣ Copia el Client ID
1. En la app registrada, en "Información general"
2. Copia el **ID de aplicación (cliente)**
   ```
   Este es tu CLIENT ID
   ```

### 5️⃣ Crea el Client Secret
1. En la app, ve a "Certificados y secretos"
2. Haz clic en "+ Nuevo secreto de cliente"
3. Descripción: "SharePoint Sync"
4. Vencimiento: "24 meses"
5. Copia el **Valor** (solo aparece una vez)
   ```
   Este es tu CLIENT SECRET
   ```

### 6️⃣ Agrega Permisos
1. En la app, ve a "Permisos de API"
2. Haz clic en "+ Agregar permiso"
3. Selecciona "Microsoft Graph"
4. Busca estas permisos:
   - `Files.Read.All`
   - `Files.ReadWrite.All`
   - `Sites.Read.All`
5. Agrégalos

### 7️⃣ Configura el Archivo
Edita `connectors/sharepoint/config.json`:

```json
{
  "tenantId": "PEGA_AQUI_TU_TENANT_ID",
  "clientId": "PEGA_AQUI_TU_CLIENT_ID",
  "clientSecret": "PEGA_AQUI_TU_CLIENT_SECRET",
  "siteUrl": "https://tuempresa.sharepoint.com/sites/Contabilidad"
}
```

## ✅ ¿Listo?

Ejecuta:
```bash
cd connectors/sharepoint
npm install
npm run sync
```

## 🆘 Problemas?

**"Error: Invalid client"**
→ Verifica que tenantId, clientId y clientSecret sean correctos

**"Error: Insufficient privileges"**
→ Los permisos no se completaron. Intenta nuevamente en Azure AD

**"Error: Not found"**
→ El sitio SharePoint no existe o la URL es incorrecta

---

**Más información**: Microsoft Graph API
https://docs.microsoft.com/en-us/graph/api/overview
