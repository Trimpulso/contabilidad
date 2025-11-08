# ⚡ QUICK START - Sistema Contable Inteligente

## 🚀 Inicio en 5 minutos

### 1️⃣ Setup Inicial
```bash
# Navega al proyecto
cd c:\github\Contabilidad

# Ejecuta el script de instalación
node setup.js
```

### 2️⃣ Configura tus credenciales
```bash
# Edita .env con tus valores
notepad .env

# Edita config.json de SharePoint
notepad connectors/sharepoint/config.json
```

### 3️⃣ Inicia desarrollo
```bash
# Backend + Frontend
npm run dev
```

---

## 📁 Archivos Creados

```
✅ .gitignore              - Configuración Git
✅ .env.example            - Variables de entorno ejemplo
✅ package.json            - Dependencias principales
✅ README.md               - Documentación principal
✅ setup.js                - Script de instalación

📂 connectors/
   ├── sharepoint/
   │   ├── index.js        - Conector SharePoint
   │   ├── package.json
   │   ├── config.example.json
   │   └── sync-sharepoint.js

📂 docs/
   ├── DEVELOPMENT.md      - Guía de desarrollo
   ├── ARCHITECTURE.md     - Diagrama de arquitectura
   ├── SHAREPOINT_SETUP.md - Configuración Azure/SharePoint
   ├── API.md              - Documentación API (próxima)
   └── DATABASE.md         - Esquema BD (próxima)

📂 backend/                - API Express (próxima)
📂 frontend/               - React/Vue App (próxima)
📂 database/               - Migraciones SQL (próxima)
```

---

## 🔗 Conectar SharePoint

### Opción A: Rápido (Sin SharePoint)
Si aún no tienes credenciales, puedes trabajar sin SharePoint:
```bash
npm run dev
# El sistema funciona sin datos de SharePoint
```

### Opción B: Con SharePoint
Sigue estos pasos:

1. **Registra una App en Azure**
   - Ve a https://portal.azure.com
   - Azure AD → Registros de aplicaciones → Nuevo
   - Copia: Tenant ID, Client ID, Client Secret
   - [Guía detallada →](./docs/SHAREPOINT_SETUP.md)

2. **Configura credenciales**
   ```bash
   cd connectors/sharepoint
   
   # Edita config.json
   notepad config.json
   
   # Completa:
   # - tenantId
   # - clientId
   # - clientSecret
   # - siteUrl
   ```

3. **Descarga archivos**
   ```bash
   npm run sync -- --config ./config.json --file "Especificaciones.docx"
   ```

---

## 📊 Arquitectura

```
┌─────────────────┐
│  Frontend (React)│  ← Dashboard, Transacciones, Chat
└────────┬────────┘
         │ REST API
         ↓
┌─────────────────┐
│  Backend (Node) │  ← Controllers, Services, Validación
└────────┬────────┘
         │
    ┌────┴────────────┬────────────┐
    ↓                 ↓            ↓
┌──────────┐   ┌────────────┐  ┌──────────┐
│  Database│   │  Claude AI │  │SharePoint│
│ (SQL)    │   │  (ChatBot) │  │(Docs)    │
└──────────┘   └────────────┘  └──────────┘
```

---

## 🎯 Próximos Pasos

### Ya Completado ✅
- [x] Estructura de carpetas
- [x] Conector SharePoint
- [x] Documentación
- [x] Scripts de setup

### Por Hacer 🔄
- [ ] Backend (Express + Base de datos)
- [ ] Frontend (React Dashboard)
- [ ] Claude ChatBot integration
- [ ] Tests completos

---

## 📚 Documentación

| Documento | Propósito |
|-----------|-----------|
| [DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Cómo desarrollar |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Diseño del sistema |
| [SHAREPOINT_SETUP.md](./docs/SHAREPOINT_SETUP.md) | Configurar Azure AD |

---

## 💡 Comandos Útiles

```bash
# Instalar todo
npm install

# Iniciar desarrollo
npm run dev

# Solo Backend
cd backend && npm run dev

# Solo Frontend
cd frontend && npm run dev

# Descargar de SharePoint
npm run sync-specs

# Build producción
npm run build

# Tests
npm test
```

---

## 🆘 Ayuda

**¿Error al instalar?**
```bash
# Limpia node_modules y reinstala
rm -r node_modules package-lock.json
npm install
```

**¿SharePoint no conecta?**
- Verifica config.json: `notepad connectors/sharepoint/config.json`
- Lee: [SHAREPOINT_SETUP.md](./docs/SHAREPOINT_SETUP.md)

**¿Puerto 3000 en uso?**
```bash
# Edita .env y cambia PORT=3001
notepad .env
```

---

## 🤝 ¿Necesitas Ayuda?

Contacta al equipo o revisa la documentación en la carpeta `docs/`

**Happy Coding! 🚀**
