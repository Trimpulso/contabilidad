# 🔐 Security Analysis - Trimpulso Contabilidad

## 📋 Información de Organización

| Propiedad | Valor |
|-----------|-------|
| **Nombre del Directorio** | Trimpulso |
| **Dominio** | trimpulso.cl |
| **ID de Directorio (Tenant ID)** | `9c33f678-1021-46f8-8573-516a0de0929c` |
| **SharePoint URL** | https://trimpulso-my.sharepoint.com/ |
| **Usuario Admin** | job.llanos@trimpulso.cl |
| **ID del Objeto** | 13486155-477e-474b-9520-712c2b16864a |

---

## 🔑 Credenciales Requeridas para Azure AD

Para conectar automáticamente con SharePoint, necesitamos:

### 1. **Application Registration (Registro de Aplicación)**
   
Pasos en Azure Portal:
1. Ve a: https://portal.azure.com
2. Busca: "Azure Active Directory"
3. Ve a: "Registros de aplicaciones"
4. Haz clic: "+ Nuevo registro"
5. Nombre: `SharePoint-Contabilidad-Trimpulso`
6. Tipos de cuenta: "Solo mi organización"
7. Haz clic: "Registrar"

**A completar después del registro:**
```json
{
  "tenantId": "9c33f678-1021-46f8-8573-516a0de0929c",
  "clientId": "COMPLETAR_AQUI",
  "clientSecret": "COMPLETAR_AQUI",
  "siteUrl": "https://trimpulso-my.sharepoint.com/"
}
```

### 2. **Permisos Necesarios (Microsoft Graph)**

Agregar estos permisos en Azure:
- `Files.Read.All` - Leer archivos
- `Files.ReadWrite.All` - Leer y escribir archivos
- `Sites.Read.All` - Leer sitios
- `Sites.ReadWrite.All` - Escribir en sitios

---

## 📝 Configuración Local

### Archivo: `connectors/sharepoint/config.json`

**NUNCA** commitear este archivo a GitHub. Está en `.gitignore`.

Contenido local (solo en tu máquina):
```json
{
  "tenantId": "9c33f678-1021-46f8-8573-516a0de0929c",
  "clientId": "TU_CLIENT_ID_DE_AZURE",
  "clientSecret": "TU_CLIENT_SECRET_DE_AZURE",
  "siteUrl": "https://trimpulso-my.sharepoint.com/"
}
```

### Archivo: `.env`

También local, no en GitHub:
```env
SHAREPOINT_TENANT_ID=9c33f678-1021-46f8-8573-516a0de0929c
SHAREPOINT_CLIENT_ID=TU_CLIENT_ID
SHAREPOINT_CLIENT_SECRET=TU_CLIENT_SECRET
SHAREPOINT_SITE_URL=https://trimpulso-my.sharepoint.com/
```

---

## ✅ Flujo de Configuración Segura

```
1. Developer obtiene credenciales de Azure (en privado)
2. Crea config.json (NO se commitea)
3. Ejecuta: npm run sync
4. Archivo security_analysis.md → EN GITHUB (sin credenciales)
5. Otros devs leen este documento
6. Otros devs obtienen sus propias credenciales
7. Cada dev tiene config.json LOCAL
```

---

## 🔒 Seguridad en GitHub

### ✅ SÍ SE COMMITEAN:
- `.gitignore` ← Protege credenciales
- `security_analysis.md` ← Este archivo
- `config.example.json` ← Estructura sin valores
- `docs/SHAREPOINT_CREDENTIALS.md` ← Guía
- `connectors/sharepoint/sync.js` ← Script (sin credenciales)

### ❌ NO SE COMMITEAN:
- `config.json` ← Archivo real con credenciales
- `.env` ← Variables con secretos
- Cualquier archivo con contraseñas

---

## 🚀 Próximos Pasos

1. **Registrar App en Azure Portal**
   - Obtener: `clientId` y `clientSecret`
   - Agregar permisos Microsoft Graph

2. **Crear `config.json` local**
   ```bash
   cd connectors/sharepoint
   # Crear config.json con tus credenciales
   ```

3. **Probar conexión**
   ```bash
   npm run sync
   ```

4. **Commitear a GitHub**
   ```bash
   git add .
   git commit -m "Initial SharePoint configuration"
   git remote add origin https://github.com/Trimpulso/contabilidad.git
   git branch -M main
   git push -u origin main
   ```

---

## 📞 Contacto

- **Organización**: Trimpulso
- **Email**: job.llanos@trimpulso.cl
- **Repositorio**: https://github.com/Trimpulso/contabilidad/

---

**Última actualización**: 7 de noviembre de 2025
