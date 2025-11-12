# 🤖 Chatbot CAI v3.0 - Modo Híbrido con IA

## ✅ Configuración Completada

### API Key Configurada
- **Proveedor:** Google AI Studio (Gemini 1.5 Flash)
- **Proyecto:** 1088932799783
- **Estado:** ✅ Activa

---

## 🔒 IMPORTANTE: Proteger API Key

La API key está visible en el código. Para evitar uso no autorizado:

### Paso 1: Configurar HTTP Referrer (RECOMENDADO)

1. Ve a: https://aistudio.google.com/app/apikey
2. Click en tu API key: `AIzaSyBhNELpAFBh_jrD_R7s8OthrTp5LRzQFDg`
3. En "Application restrictions" → Selecciona **"HTTP referrers (web sites)"**
4. Click "Add an item"
5. Agrega estos dominios:
   ```
   https://trimpulso.github.io/*
   http://localhost:*
   http://127.0.0.1:*
   ```
6. Click "Done" y guarda

**Resultado:** Solo tu sitio web podrá usar la API key.

---

## 🚀 Uso del Chatbot

### Comandos Rápidos (Sin IA)
- `1` → Riesgo crítico
- `2` → Deuda total
- `3` → Excepciones
- `4` → Aprobados
- `5` → Listar proveedores
- `6` → Info proveedor

### Modo IA (Con Gemini)
1. Escribe: `activar ia`
2. Haz preguntas naturales:
   - "¿Qué proveedores tienen mayor riesgo y por qué?"
   - "Dame un resumen de las facturas de Empresa Fantasma"
   - "¿Cuál es el patrón de riesgo en Magallanes?"
   - "Recomiéndame qué facturas revisar primero"

### Otros Comandos
- `desactivar ia` → Volver a comandos rápidos
- `stats ia` → Ver uso de API y caché
- `help` → Ver ayuda completa

---

## 📊 Límites y Optimizaciones

### Límites Gratuitos de Gemini
- ✅ **15 requests/minuto**
- ✅ **1,500 requests/día**
- ✅ **Gratis para siempre**

### Optimizaciones Implementadas
1. **Caché inteligente:** Respuestas repetidas se guardan 1 hora
2. **Comandos híbridos:** Preguntas comunes usan intents (instantáneo)
3. **Límite conservador:** Máximo 60 requests/hora por seguridad

---

## 🛠️ Troubleshooting

### "API Key no configurada"
- Verifica que `chatbot-ia.js` tiene la key correcta
- Recarga la página (Ctrl + F5)

### "Límite de requests alcanzado"
- Espera 1 hora o usa comandos 1-6
- Revisa stats: `stats ia`

### "Error de conexión con IA"
- Verifica que los HTTP Referrers están configurados
- Abre DevTools (F12) → Console para ver el error exacto
- Verifica que la API key no expiró

---

## 📁 Archivos del Sistema

```
docs/chatbot/
├── chatbot.js           # Lógica principal (intents + híbrido)
├── chatbot-ia.js        # Módulo IA con Gemini
├── chatbot.css          # Estilos UI
├── chatbot.html         # Estructura HTML
└── README-IA.md         # Este archivo
```

---

## 🔐 Seguridad

⚠️ **NUNCA** compartas tu API key públicamente
⚠️ **SIEMPRE** configura HTTP Referrers
⚠️ Si la key se expone, revócala y genera una nueva

---

## 📈 Próximos Pasos (Opcional)

1. **Netlify Functions:** Ocultar API key en backend serverless
2. **Más intents:** Agregar análisis predictivo
3. **Conversación con memoria:** Recordar contexto de conversación
4. **Integración con tablas:** Leer datos directamente del JSON en tiempo real

---

**Versión:** 3.0.0  
**Fecha:** 11/11/2025  
**Autor:** CAI Team
