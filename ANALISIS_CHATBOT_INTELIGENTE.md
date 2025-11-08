# 🤖 Análisis: Chatbot Inteligente de Contabilidad (CAI)

## Ejecutivo: Recomendación Final

**✅ RECOMENDACIÓN:** Chatbot **EMBEBIDO en GitHub Pages** con arquitectura **Híbrida Local + API**

**Por qué:** 
- ✅ Acceso inmediato (sin infraestructura adicional)
- ✅ Funciona 100% sin servidor backend
- ✅ Integración directa con datos existentes (localStorage + JSON)
- ✅ Puede mejorar a versión IA en el futuro sin redesign
- ⏱️ Implementación rápida (2-3 horas para MVP)

---

## 1️⃣ Análisis Comparativo: Power Apps vs Web Embebida

### Opción A: Power Apps (Microsoft Power Platform)

#### Ventajas ✅
```
✅ Integración nativa con Dataverse
✅ Acceso a SharePoint y sistemas Microsoft
✅ Seguridad corporativa OOB
✅ UI/UX profesional pre-construida
✅ Connectors listos para BD
✅ Auditoría y compliance integrados
✅ Soporte de Power Automate
```

#### Desventajas ❌
```
❌ Costo: Licencias por usuario ($10-20/mes c/u)
❌ Curva de aprendizaje (Power Fx language)
❌ Dependencia del ecosistema Microsoft
❌ Ciclo de deployment más lento
❌ No funciona sin conexión
❌ Menos flexible para customización profunda
```

#### Ideal para:
- Empresas con Stack Microsoft establecido
- Ambiente corporativo cerrado
- Requisitos complejos de integración B2B
- Usuarios con licencias M365 ya

#### Tiempo implementación: 1-2 semanas

---

### Opción B: Web Embebida en GitHub Pages (RECOMENDADA)

#### Ventajas ✅
```
✅ Cero costos de infraestructura
✅ Acceso inmediato: abrir URL y usar
✅ Funciona 100% offline (datos en JSON local)
✅ Sincronización con localStorage existente
✅ Fácil de iterar y mejorar
✅ Escalable: migrar a backend cuando sea necesario
✅ Integración perfecta con dashboards actuales
✅ JavaScript nativo (sin vendor lock-in)
```

#### Desventajas ⚠️
```
⚠️ IA básica inicial (patrón-matching en JSON)
⚠️ Requiere backend simple para IA avanzada
⚠️ Seguridad manejada manualmente
⚠️ Límites de complejidad sin servidor
```

#### Ideal para:
- **Implementación actual (Contabilidad Inteligente)**
- Equipos pequeños/medianos
- MVP rápido
- Datos públicos o semi-públicos
- Flexibilidad de iteración

#### Tiempo implementación: 2-3 horas (MVP) → 1 semana (v1 completa)

---

## 2️⃣ Arquitectura Recomendada: Chatbot Híbrido Local + API

```
┌─────────────────────────────────────────────────────────┐
│           USUARIO FINAL (GitHub Pages)                  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🤖 CHATBOT UI EMBEBIDA                         │   │
│  │  (Cuadro chat flotante en esquina)              │   │
│  │                                                 │   │
│  │  Usuario: "¿Cuánta deuda pendiente tengo?"     │   │
│  │  Bot: "Tu deuda pendiente es $500M..."         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │   CAPA DE PROCESAMIENTO LOCAL      │
        ├───────────────────────────────────┤
        │ 1. Intent Recognition (Regex)     │
        │ 2. Entity Extraction              │
        │ 3. Context Management             │
        │ 4. localStorage Sync              │
        └───────────────────────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │   FUENTES DE DATOS                │
        ├───────────────────────────────────┤
        │ • docs/data/contabilidad.json    │ ← DTEs, histórico
        │ • localStorage (historial)       │ ← Decisiones de alertas
        │ • localStorage (excepciones)     │ ← Excepciones aprobadas
        │ • docs/data/kpis.json (nuevo)   │ ← Métricas KPIs
        │ • docs/data/knowledge.json (nuevo)│ ← Conocimiento contable
        └───────────────────────────────────┘
                        ↓ (Opcional futuro)
        ┌───────────────────────────────────┐
        │   BACK-END OPCIONAL (FASE 4)      │
        ├───────────────────────────────────┤
        │ • Node.js API con IA (GPT/local) │
        │ • Ollama/LLaMA para IA local     │
        │ • Embeddings + Vector DB         │
        │ • Conexión a ERP Softland        │
        └───────────────────────────────────┘
```

---

## 3️⃣ Tipos de Preguntas que Soportará el Chatbot

### Tier 1: Preguntas Simples (Regex + Lookup) - MVP v1

#### 🔴 Preguntas de Riesgo/Alertas
```
🔍 "¿Cuántas facturas están en riesgo crítico?"
   → Respuesta: "Hay 2 facturas en riesgo CRÍTICO"
   
🔍 "¿Qué facturas fueron bloqueadas?"
   → Respuesta: "Empresa Fantasma y Proveedor Dudoso"

🔍 "¿Cuál fue la justificación para aprobar..."
   → Respuesta: Lee localStorage de excepciones

🔍 "Dame el score de la factura 1001"
   → Respuesta: "Score 10/100 - BAJO RIESGO"
```

#### 💰 Preguntas de Finanzas
```
💸 "¿Cuál es la deuda total?"
   → Respuesta: Suma todos los montos de DTEs

💸 "¿Cuántos proveedores tengo?"
   → Respuesta: Cuenta RUTs únicos

💸 "¿Cuál es el monto promedio de facturas?"
   → Respuesta: Calcula promedio
```

#### ⚙️ Preguntas Operacionales
```
⚙️ "¿Cuántas facturas fueron aprobadas?"
   → Respuesta: Lee historialAcciones del localStorage

⚙️ "¿Cuántas excepciones tengo?"
   → Respuesta: Cuenta excepcionesAprobadas

⚙️ "¿Cuál es la tasa de automatización?"
   → Respuesta: Calcula (DTEs aprobados / total)
```

### Tier 2: Preguntas Conversacionales (NLP básica) - v1.5

```
"Muéstrame facturas con región sospechosa"
→ Filtra en tiempo real

"¿Qué pasó con el DTE 9999?"
→ Busca en historial

"Dame un resumen ejecutivo"
→ Genera reporte rápido
```

### Tier 3: Preguntas Avanzadas (Backend IA) - FASE 4

```
"¿Por qué esto es riesgo crítico?"
→ Explicación del scoring

"¿Cuál es mi situación financiera?"
→ Análisis cruzado de datos

"¿Qué recomendaciones tienes?"
→ IA generativa con contexto
```

---

## 4️⃣ Estructura de Datos: Knowledge Base JSON

### Archivo: `docs/data/chatbot-knowledge.json`

```json
{
  "intents": [
    {
      "id": "riesgo_critico",
      "keywords": ["riesgo", "crítico", "bloqueado", "peligro"],
      "questions": [
        "¿Cuántas facturas están en riesgo crítico?",
        "¿Qué DTEs fueron bloqueados?",
        "Muéstrame facturas críticas"
      ],
      "handler": "getRiesgoCritico",
      "data_source": "contabilidad.json + analysis"
    },
    {
      "id": "deuda_total",
      "keywords": ["deuda", "pendiente", "debo", "monto"],
      "questions": [
        "¿Cuál es la deuda total?",
        "¿Cuánto debo a proveedores?",
        "Deuda pendiente"
      ],
      "handler": "getDeudaTotal",
      "data_source": "contabilidad.json"
    },
    {
      "id": "excepciones",
      "keywords": ["excepción", "aprobada", "supervisada"],
      "questions": [
        "¿Cuántas excepciones tengo?",
        "¿Por qué se aprobó esta excepción?",
        "Muéstrame las excepciones"
      ],
      "handler": "getExcepciones",
      "data_source": "localStorage.excepcionesAprobadas"
    },
    {
      "id": "proveedor_info",
      "keywords": ["proveedor", "rut", "empresa", "fantasma"],
      "questions": [
        "¿Cuál es el riesgo del proveedor X?",
        "¿Información del proveedor Y?",
        "¿Qué sé del RUT 12.345.678-9?"
      ],
      "handler": "getProveedorInfo",
      "data_source": "contabilidad.json"
    }
  ],
  "knowledge": [
    {
      "topic": "Cuenta 400",
      "question": "¿Qué es la Cuenta 400?",
      "answer": "La Cuenta 400 es una cuenta contable de Pasivo que registra las obligaciones con proveedores. Diferente de Acreedores (Cuenta 210)...",
      "keywords": ["cuenta 400", "proveedores", "pasivo"]
    },
    {
      "topic": "Diferencia Proveedores vs Acreedores",
      "question": "¿Cuál es la diferencia entre Proveedores y Acreedores?",
      "answer": "Proveedores (Cta 400) = obligaciones por compra de mercancía. Acreedores (Cta 210) = obligaciones por otros conceptos...",
      "keywords": ["diferencia", "proveedores", "acreedores"]
    }
  ],
  "responses": {
    "greeting": "¡Hola! Soy CAI, tu asistente contable inteligente. Puedo ayudarte con preguntas sobre alertas, deuda, riesgos y proveedores. ¿Qué necesitas saber?",
    "error": "No entendí bien tu pregunta. Intenta preguntar sobre: riesgos, deuda, proveedores, excepciones o conceptos contables.",
    "no_data": "No tengo información disponible sobre eso en este momento."
  }
}
```

---

## 5️⃣ Flujo de Interacción del Usuario

```
┌─────────────────────────────────────────────────────────┐
│ Usuario ve Dashboard Principal (index.html)             │
│                                                         │
│  [Esquina inferior derecha]                            │
│  ┌─────────────────────┐                               │
│  │ 💬 CAI Bot          │                               │
│  │ (Botón flotante)    │                               │
│  └─────────────────────┘                               │
└─────────────────────────────────────────────────────────┘
                        ↓ (Click)
┌─────────────────────────────────────────────────────────┐
│ Se abre VENTANA FLOTANTE del chat                       │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🤖 CAI - Asistente Contable                     │ X │
│  ├──────────────────────────────────────────────────┤  │
│  │ Bot: ¡Hola! ¿Qué necesitas saber?              │  │
│  │                                                  │  │
│  │ [Chat history...]                               │  │
│  │                                                  │  │
│  │ Usuario: "¿cuánta deuda pendiente?"             │  │
│  │ Bot: Tu deuda es $500.2M con...                │  │
│  │                                                  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 📝 Escribe tu pregunta...          [Enviar 📤]  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 6️⃣ Tecnologías por Fase

### FASE MVP (Semana 1) - Embebida sin IA

```javascript
// Stack mínimo
{
  "Frontend": {
    "HTML/CSS": "Ventana flotante",
    "JavaScript": "Intent matching con regex",
    "Librería": "Ninguna (vanilla JS)"
  },
  "Backend": "NONE - Todo en cliente",
  "Data": "JSON estático + localStorage",
  "IA": "Pattern matching con regex/keywords"
}
```

**Costo:** $0
**Tiempo:** 2-3 horas
**Dependencias:** 0

---

### FASE v1.5 (Semana 3) - NLP Básica

```javascript
{
  "Frontend": "Mismo",
  "Backend": "Node.js simple (opcional)",
  "IA": "Simple-NLP library o Compromise.js",
  "Data": "JSON + localStorage",
  "Mejoras": "Extracción de entidades, sinónimos"
}
```

**Costo:** $0-50 (si hosting backend)
**Tiempo:** 1 semana
**Dependencias:** 2-3 (NLP libs)

---

### FASE v2 (Mes 1-2) - Backend + IA Real

```javascript
{
  "Frontend": "Chat embebida + UI mejorada",
  "Backend": "Express.js + OpenAI API",
  "IA": "GPT-4 o Ollama local",
  "Data": "MongoDB + Elasticsearch",
  "Mejoras": "RAG (Retrieval Augmented Generation)",
  "Integration": "APIs a Softland/PreviRed"
}
```

**Costo:** $10-100/mes (APIs IA + hosting)
**Tiempo:** 4-6 semanas
**Dependencias:** 10+

---

## 7️⃣ Ubicación del Chatbot en Interfaz

### Opción 1: Botón Flotante Esquina (RECOMENDADA)
```
┌─────────────────────┐
│ Dashboard Principal │
│                     │
│                     │
│                     │
│                           [💬 CAI]  ← Botón flotante
└─────────────────────┘                abajo a la derecha
```

**Ventajas:** No ocupa espacio, accesible desde cualquier lado

---

### Opción 2: Sidebar Desplegable
```
┌─────────────────────┬──────────────┐
│ Dashboard Principal │ 💬 Chat      │
│                     │              │
│                     │ [Conversación]
│                     │              │
└─────────────────────┴──────────────┘
```

**Ventajas:** Siempre visible, más real estate

---

### Opción 3: Tab Separada
```
[📊 Dashboard] [🚨 Alertas] [📈 KPIs] [🤖 CAI] ← Nueva tab
```

**Ventajas:** No distrae del dashboard

---

## 8️⃣ Casos de Uso por Rol

### 👨‍💼 Contador Operativo
```
"¿Cuántas facturas pendientes de revisar?"
→ Cuenta DTEs con estado = pendiente

"Muéstrame riesgos por región"
→ Agrupa por Region_Emisor + score

"¿Quién es 'Empresa Fantasma'?"
→ Muestra datos del proveedor
```

### 👨‍💻 Gerente Financiero
```
"¿Cuál es mi deuda total a 30 días?"
→ Filtra por Fecha_Vencimiento

"Proyección de flujo de caja"
→ Usa datos de KPIs

"¿Cuál es mi tasa de automatización?"
→ Calcula (Aprobados auto / Total)
```

### 👔 Director Ejecutivo
```
"Dame un resumen ejecutivo"
→ Genera reporte con KPIs clave

"¿Hay riesgos críticos a nivel CEO?"
→ Filtro CRÍTICO + sumas

"¿Qué excepciones fueron aprobadas este mes?"
→ Lee localStorage + filtro temporal
```

---

## 9️⃣ Plan de Implementación Recomendado

### SEMANA 1: MVP
```
Día 1-2: Crear interfaz flotante del chat
Día 3-4: Implementar 5 intents básicos (riesgo, deuda, proveedores, etc)
Día 5: Integrar con localStorage y contabilidad.json
Día 6: Testing y refinamiento
Día 7: Deploy a GitHub Pages
```

### SEMANA 2-3: Mejoras
```
• Agregar NLP básico
• Expandir knowledge base
• UI polishing
• Agregar filtros avanzados
```

### SEMANA 4+: Backend IA (Opcional)
```
• Implementar backend Node.js
• Integrar API IA (GPT/Ollama)
• RAG + embeddings
• Integración con Softland
```

---

## 🔟 Recomendación Final Resumida

| Aspecto | Decisión |
|---------|----------|
| **Ubicación** | Embebida en GitHub Pages (no Power Apps) |
| **Interfaz** | Botón flotante en esquina (chat window) |
| **MVP Timeline** | 2-3 días de desarrollo |
| **Tecnología** | JavaScript vanilla + JSON |
| **IA Inicial** | Pattern matching con regex (sin modelo) |
| **Evolución** | Backend + LLM cuando sea necesario |
| **Costo** | $0 (MVP) → $50-100/mes (v2 con IA) |
| **Ventaja Clave** | Integración perfecta + sin vendor lock-in |

---

## ✅ Próximos Pasos

1. **¿Apruebas la arquitectura embebida en web?**
2. **¿Ubicación en botón flotante?**
3. **¿Cuáles son las 5 preguntas TOP que necesitas responder?**
4. **¿Quieres MVP en 2 días o versión con NLP en 1 semana?**

