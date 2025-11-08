# 🔨 Guía de Desarrollo

## 📋 Tabla de Contenidos
- [Setup Inicial](#setup-inicial)
- [Conectar SharePoint](#conectar-sharepoint)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo Backend](#desarrollo-backend)
- [Desarrollo Frontend](#desarrollo-frontend)
- [Testing](#testing)

## Setup Inicial

### 1. Clonar y preparar el proyecto:
```bash
git clone <repo-url>
cd Contabilidad
npm install
```

### 2. Crear archivos de configuración:
```bash
cp .env.example .env
cd connectors/sharepoint
cp config.example.json config.json
# Editar config.json con tus credenciales
```

### 3. Instalar dependencias de cada módulo:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../connectors/sharepoint && npm install
```

## Conectar SharePoint

### Paso 1: Configurar Azure AD
Ver: [Guía de Setup SharePoint](./SHAREPOINT_SETUP.md)

### Paso 2: Descargar especificaciones:
```bash
npm run sync-specs -- --config ./connectors/sharepoint/config.json --file "Especificaciones.docx"
```

### Paso 3: Validar descarga:
```bash
ls -la docs/
# Debería mostrar "Especificaciones.docx"
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── models/          # Esquemas Sequelize/Mongoose
│   ├── routes/          # Express routes
│   ├── services/        # Lógica de negocio
│   ├── controllers/      # Controladores
│   ├── middleware/       # Custom middleware
│   ├── utils/           # Utilidades
│   └── index.js         # Entry point
├── migrations/          # DB migrations
├── tests/
└── package.json

frontend/
├── src/
│   ├── components/      # Componentes React/Vue
│   ├── pages/           # Páginas
│   ├── services/        # API calls
│   ├── styles/
│   └── App.js
└── package.json

connectors/
├── sharepoint/          # Conector SharePoint
└── claude/              # Integración Claude API
```

## Desarrollo Backend

### Tecnologías:
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base Datos**: PostgreSQL / SQLite
- **ORM**: Sequelize
- **Autenticación**: JWT

### Variables de entorno (.env):
```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=contabilidad
DB_USER=postgres
DB_PASSWORD=password

# Claude API
CLAUDE_API_KEY=sk-...

# SharePoint
SHAREPOINT_TENANT_ID=...
SHAREPOINT_CLIENT_ID=...
SHAREPOINT_CLIENT_SECRET=...
```

### Iniciar desarrollo:
```bash
cd backend
npm run dev
# Accede a http://localhost:3000
```

### Crear una nueva ruta:
1. Crear controller en `src/controllers/`
2. Crear rutas en `src/routes/`
3. Registrar en `src/index.js`

Ejemplo:
```javascript
// src/controllers/accountsController.js
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// src/routes/accounts.js
const express = require('express');
const controller = require('../controllers/accountsController');
const router = express.Router();

router.get('/', controller.getAccounts);
module.exports = router;

// src/index.js
const accountsRoutes = require('./routes/accounts');
app.use('/api/accounts', accountsRoutes);
```

## Desarrollo Frontend

### Tecnologías:
- **Framework**: React 18 o Vue 3
- **Styling**: Tailwind CSS
- **Estado**: Redux o Pinia
- **HTTP**: Axios

### Instalar dependencias:
```bash
cd frontend
npm install
npm run dev
# Accede a http://localhost:5173
```

### Estructura de componentes:
```
components/
├── Accounting/
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   └── ReportViewer.jsx
├── ChatBot/
│   ├── ChatWindow.jsx
│   ├── MessageList.jsx
│   └── InputBox.jsx
└── Common/
    ├── Header.jsx
    ├── Sidebar.jsx
    └── Footer.jsx
```

## Testing

### Backend:
```bash
cd backend
npm test                # Ejecutar todos los tests
npm run test:watch     # Watch mode
npm run test:coverage  # Cobertura
```

### Frontend:
```bash
cd frontend
npm test
npm run test:watch
```

## 🔗 Comandos Útiles

```bash
# Instalar todo desde raíz
npm install

# Iniciar en desarrollo (backend + frontend)
npm run dev

# Ver logs de SharePoint sync
npm run sync-specs -- --debug

# Ejecutar migraciones de DB
npm run db:migrate

# Build para producción
npm run build
```

## 📚 Documentación Adicional

- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [ChatBot Integration](./CHATBOT.md)
- [SharePoint Setup](./SHAREPOINT_SETUP.md)

## 🆘 Ayuda

¿Problemas? Revisa:
1. Que Node.js esté actualizado: `node --version`
2. Que las dependencias estén instaladas: `npm install`
3. Las variables de entorno en `.env`
4. Los logs en `logs/` carpeta
