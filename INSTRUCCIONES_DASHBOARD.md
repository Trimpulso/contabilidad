# 🚀 Instrucciones para Usar el Dashboard de Alertas

## Opción 1: Desarrollo Local (Recomendado)

### Paso 1: Inicia el servidor backend

```powershell
cd C:\github\Contabilidad\backend\src
node server-simple.js
```

Deberías ver:
```
✅ Cargados 5 registros desde JSON
🔒 Sistema de alertas inicializado con 4 proveedores conocidos
🚀 Servidor ejecutándose en http://localhost:3000
```

### Paso 2: Abre el dashboard en tu navegador

**Opción A (Local):**
```
http://localhost:3000/docs/alertas.html
```

**Opción B (GitHub Pages):**
```
https://trimpulso.github.io/Contabilidad/alertas.html
```

### Paso 3: Configura la URL del servidor (si usas GitHub Pages)

Si abres desde GitHub Pages:
1. Se pedirá automáticamente la URL del servidor backend
2. Ingresa: `http://localhost:3000/api`
3. O usa el botón ⚙️ Servidor para cambiarla

### Paso 4: Inicia sesión

- **Usuario:** `admin@trimpulso.cl`
- **Contraseña:** `demo123`

---

## Opción 2: Pruebas Automatizadas

Para validar que todo funciona sin abrir navegador:

```powershell
node C:\github\Contabilidad\backend\integrated-test.js
```

Resultado esperado:
```
✅ Login exitoso
✅ Estadísticas recibidas
✅ TODAS LAS PRUEBAS PASARON
```

---

## 🔑 Credenciales Disponibles

### Admin
- Email: `admin@trimpulso.cl`
- Contraseña: `demo123`

### Usuario Regular
- Email: `user@trimpulso.cl`
- Contraseña: `demo123`

---

## 📊 Qué Verás en el Dashboard

### Estadísticas Globales
- **Total DTEs analizados:** 5
- **Bloqueados:** 2 (Empresa Fantasma SpA, Proveedor Dudoso Ltda.)
- **Requieren aprobación:** 0
- **Proveedores conocidos:** 4
- **Score promedio:** 44.0/100

### Alertas Detectadas

**🚨 CRÍTICO (Bloqueados automáticamente):**
1. **Empresa Fantasma SpA** - Score: 100/100
   - Emisor nuevo, región Magallanes, monto anormal ($17.85M), folio sospechoso (9999)

2. **Proveedor Dudoso Ltda.** - Score: 95/100
   - Emisor nuevo, región Arica, monto anormal ($29.75M), folio sospechoso (1111)

**✅ BAJO (Aprobados automáticamente):**
- Proveedor A S.A. (3 registros)
- Proveedor B Ltda. (1 registro)

---

## 🔧 Solución de Problemas

### Error: "Error en login: Failed to fetch"

**Causa:** El servidor no está disponible

**Solución:** 
1. Verifica que el servidor esté corriendo en la terminal
2. Confirma que el puerto 3000 está disponible:
   ```powershell
   netstat -ano | Select-String ":3000"
   ```

### Error: "La URL del servidor es incorrecta"

**Causa:** GitHub Pages intenta conectar a URL incorrecta

**Solución:**
1. Haz clic en el botón ⚙️ Servidor
2. Ingresa la URL correcta: `http://localhost:3000/api`
3. Recarga la página

### Las credenciales no funcionan

**Causa:** El servidor no está inicializado correctamente

**Solución:**
1. Reinicia el servidor backend
2. Ejecuta las pruebas integradas para validar:
   ```powershell
   node C:\github\Contabilidad\backend\integrated-test.js
   ```

---

## 📱 URLs Importantes

- **Dashboard Principal:** https://trimpulso.github.io/Contabilidad/
- **Dashboard de Alertas:** https://trimpulso.github.io/Contabilidad/alertas.html
- **Repositorio GitHub:** https://github.com/Trimpulso/Contabilidad
- **API Backend (Local):** http://localhost:3000/api

---

## 🎯 Características del Sistema de Alertas

✅ **8 reglas de detección automática:**
1. Emisores nuevos
2. Regiones diferentes
3. Montos anormales
4. Recepción inmediata
5. Folios sospechosos
6. Pendiente + Monto alto
7. IVA incorrecto
8. Razón social sospechosa

✅ **Sistema de scoring:**
- 0-20: ✅ BAJO (Aprobado)
- 21-50: ⚠️ MEDIO (Revisión manual)
- 51-100: 🚨 CRÍTICO (Bloqueado)

✅ **Bloqueo automático:**
- DTEs con score > 50 son bloqueados automáticamente

✅ **Historial de datos:**
- El sistema aprende de los DTEs históricos
- 4 proveedores conocidos del histórico

---

**Versión:** 2.0.0  
**Última actualización:** 8 de noviembre de 2025
