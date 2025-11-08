# Configuración de Permisos para SharePoint

## Estado Actual
✅ Aplicación registrada: **Contabilidad-Dashboard**  
✅ CLIENT_ID: `7f6191c8-099e-4233-9024-1413bc1f458f`  
✅ CLIENT_SECRET: Obtenido  
❌ Permisos: **NECESITAN CONFIGURARSE**

## Problema Encontrado
La aplicación intenta acceder a SharePoint pero devuelve error: `General exception while processing`

Esto ocurre porque la app NO tiene los permisos necesarios en Azure AD para acceder a SharePoint.

## Solución: Agregar Permisos en Azure AD

### Paso 1: Ir a la Aplicación en Entra ID
1. Abre: https://portal.azure.com
2. Busca "Registros de aplicaciones"
3. Selecciona: **Contabilidad-Dashboard**

### Paso 2: Acceder a Permisos de API
1. En el menú izquierdo, haz click en: **Permisos de API**
2. Verás una sección "Permisos configurados"

### Paso 3: Agregar Permisos para Microsoft Graph
1. Haz click en: **+ Agregar un permiso**
2. Selecciona: **Microsoft Graph**
3. Elige: **Permisos de aplicación** (NO delegados)

### Paso 4: Buscar y Seleccionar Permisos
En la búsqueda, busca y selecciona estos permisos:

**REQUERIDOS (mínimo):**
- [ ] `Sites.Read.All` - Leer todos los sitios SharePoint
- [ ] `Files.Read.All` - Leer todos los archivos

**OPCIONALES (para descarga futura):**
- [ ] `Files.ReadWrite.All` - Leer y escribir archivos

### Paso 5: Otorgar Consentimiento como Admin
Una vez agregados los permisos:

1. Verás el botón: **Otorgar consentimiento del administrador para [Organización]**
2. Haz click en ese botón
3. Confirma en el diálogo que aparece

**IMPORTANTE:** Este paso requiere permisos de **administrador**. Si no eres admin:
- Pide a tu administrador de TI que realice este paso
- O usa "Solicitar consentimiento" para que apruebe

### Paso 6: Verificar la Instalación
Los permisos deben aparecer así:

```
✅ Sites.Read.All (Consentimiento otorgado por [Organización])
✅ Files.Read.All (Consentimiento otorgado por [Organización])
```

## URL Rápida
Directo a permisos: 
```
https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/APIPermissions/appId/7f6191c8-099e-4233-9024-1413bc1f458f
```

## Después de Agregar Permisos

Una vez completado, ejecuta nuevamente:

```bash
cd connectors/sharepoint
npm run sync
```

Deberías ver el listado de archivos de SharePoint.

## Ayuda Adicional

### Si ves error "General exception while processing"
- ✅ Verifica que agregaste los permisos correctamente
- ✅ Espera 5-10 minutos para que se propaguen los cambios
- ✅ Confirma que otorgaste el consentimiento del admin

### Si ves error "Invalid token claims"
- La credencial no tiene los permisos. Vuelve a Paso 1.

### Si nada funciona
1. Copia los permisos exactos mostrados arriba
2. Ve a Azure Portal
3. Navega a "Registros de aplicaciones" → "Contabilidad-Dashboard"
4. Sección "Permisos de API"
5. Captura screenshot y comparte los permisos que ves
