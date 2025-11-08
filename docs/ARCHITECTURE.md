# 🏗️ Arquitectura del Sistema

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE / FRONTEND                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React/Vue App                                       │   │
│  │  ├── Dashboard Contable                             │   │
│  │  ├── Formularios de Transacciones                   │   │
│  │  ├── Reportes                                        │   │
│  │  └── Chat Interface (ChatBot)                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
        ┌────────────────────────────────────────┐
        │      API REST (Express.js)             │
        │  http://localhost:3000/api             │
        └────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND / LÓGICA DE NEGOCIO                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Controllers │  │   Services   │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Servicios de Negocio                    │   │
│  │  ├── AccountingService                              │   │
│  │  ├── TransactionService                             │   │
│  │  ├── ReportService                                  │   │
│  │  └── ChatBotService                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
              ↓                          ↓
    ┌─────────────────────┐   ┌─────────────────────┐
    │   BASE DE DATOS     │   │   CLAUDE API        │
    │  ┌──────────────┐   │   │  ┌──────────────┐   │
    │  │ Transacciones│   │   │  │ Conversaciones│  │
    │  │ Cuentas      │   │   │  │ Análisis AI   │  │
    │  │ Reportes     │   │   │  └──────────────┘   │
    │  │ Asientos     │   │   └─────────────────────┘
    │  └──────────────┘   │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │   SHAREPOINT        │
    │  (Especificaciones)  │
    └─────────────────────┘
```

## 🔄 Flujo de Datos

### 1. Transacción Contable
```
Usuario → Frontend → API POST /transactions → Service → DB → Dashboard
```

### 2. Consulta al ChatBot
```
Usuario → Chat UI → API POST /chat/message → Claude API → Response → UI
```

### 3. Descarga de SharePoint
```
Admin → setup-sharepoint → Azure OAuth → SP Connector → Download Files → /docs
```

## 🧩 Componentes Principales

### Backend (Node.js + Express)

#### Controllers
- `AccountsController` - Gestión de cuentas
- `TransactionsController` - Registro de transacciones
- `ReportsController` - Generación de reportes
- `ChatBotController` - Interfaz de chat

#### Services
- `AccountingService` - Lógica contable (débitos, créditos, balances)
- `TransactionService` - CRUD de transacciones
- `ReportService` - Generación de reportes (balance, P&L)
- `ChatBotService` - Integración con Claude

#### Models (ORM - Sequelize)
```
Account (Plan de Cuentas)
├── id
├── code
├── name
├── type (Asset, Liability, Equity, Income, Expense)
├── balance
└── createdAt

Transaction
├── id
├── date
├── description
├── debitAccountId
├── creditAccountId
├── amount
└── createdAt

JournalEntry
├── id
├── transactionId
├── accountId
├── debit
├── credit
└── createdAt

ChatMessage
├── id
├── userMessage
├── botResponse
├── context (datos contables relevantes)
└── createdAt
```

### Frontend (React/Vue)

#### Vistas Principales
- **Dashboard** - Overview de cuentas y balances
- **Transacciones** - CRUD de transacciones
- **Reportes** - Visualización de reportes contables
- **ChatBot** - Interfaz conversacional

#### Componentes Reutilizables
- `AccountSelector` - Dropdown de cuentas
- `TransactionForm` - Formulario de transacciones
- `DataTable` - Tabla genérica con paginación
- `Charts` - Gráficos de reportes
- `ChatWindow` - Ventana de chat

### Conectores

#### SharePoint Connector
```javascript
SharePointConnector
├── authenticate()
├── listFiles()
├── downloadFile()
└── uploadFile()
```

#### Claude Integration
```javascript
ClaudeService
├── initialize(apiKey)
├── sendMessage(userMessage, context)
├── analyzeTransaction(transaction)
└── generateInsights(data)
```

## 🔐 Seguridad

### Autenticación
- JWT Tokens (Bearer)
- Refresh tokens con expiration

### Autorización
- Rol-based access control (RBAC)
- Permisos por módulo

### Validación
- Input sanitization
- SQL injection prevention (ORM)
- CORS configuration

## 📊 Base de Datos

### Entidad-Relación

```
Account
  ├─ 1:N → Transaction (debit)
  ├─ 1:N → Transaction (credit)
  └─ 1:N → JournalEntry

Transaction
  └─ 1:N → JournalEntry

ChatMessage
  └─ N:1 → User
```

### Índices Importantes
- `Account.code` (único)
- `Transaction.date` (búsquedas por período)
- `JournalEntry.accountId` (reportes)

## 🔄 Ciclo de Desarrollo

### 1. Agregar Nueva Transacción
```
API POST /api/transactions
  → TransactionController.create()
  → TransactionService.validateAndCreate()
  → Create Transaction + Create 2 JournalEntries
  → Update Account balances
  → Emit event to Dashboard
```

### 2. Generar Reporte
```
API GET /api/reports/balance-sheet
  → ReportController.getBalanceSheet()
  → ReportService.calculateBalances()
  → Fetch all Accounts
  → Calculate totals by type
  → Return formatted report
```

### 3. Chat Query
```
API POST /api/chat/message
  → ChatBotController.sendMessage()
  → ChatBotService.processMessage()
  → Extract context (últimas transacciones, balances)
  → Send to Claude with context
  → Store conversation
  → Return response
```

## 📈 Escalabilidad

### Base de Datos
- Indexación estratégica
- Particionamiento de transacciones por período
- Denormalización para reportes

### Backend
- Caché de reportes (Redis)
- Job queue para reportes pesados (Bull)
- Load balancing

### Frontend
- Code splitting
- Lazy loading de componentes
- Virtualización de listas grandes

## 🚀 Despliegue

### Entornos
- **Development** - localhost:3000
- **Staging** - staging.contabilidad.com
- **Production** - contabilidad.com

### Stack Recomendado
- Backend: Docker + Node.js + PostgreSQL
- Frontend: Vercel o Netlify
- Database: AWS RDS o PlanetScale
- Claude API: Configurado en env variables
