# Dashboard — Guía Completa

## 📊 Interfaz Principal

La interfaz del dashboard está dividida en secciones:

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Dashboard Contabilidad + Meta              │
├─────────────────────────────────────────────────────┤
│  CONTROLES: Hoja | Categoría | Valor | Gráfico     │
├─────────────────────────────────────────────────────┤
│  ESTADÍSTICAS: Registros | Suma | Promedio | Máx   │
├─────────────────────────────────────────────────────┤
│  GRÁFICO (izq)            │  RESUMEN (der)         │
├─────────────────────────────────────────────────────┤
│  TABLA DE DATOS (ancho completo)                   │
└─────────────────────────────────────────────────────┘
```

## 🎮 Controles

### Selector de Hoja
Si tu Excel tiene múltiples hojas (Hoja1, Hoja2, etc.), selecciona cuál quieres visualizar.

**Ejemplo:**
```
Hoja1     ← Datos actuales
Hoja2
Historial
```

### Categoría
Columna de **texto** para agrupar y contar. El dashboard agregará los valores por cada categoría única.

**Ejemplo:**
- `Razon_Social_Emisor` → Agrupa por proveedor
- `Estado_RCV` → Agrupa por estado (Aceptado/Rechazado)
- `Tipo_DTE` → Agrupa por tipo de documento (33, 61, etc)

### Valor (numérico)
Columna **numérica** que se sumará para cada categoría.

**Ejemplo:**
- `Monto_Total` → Suma total por proveedor
- `Monto_IVA` → IVA total por estado
- `Codigo_Impto` → Conteo de códigos

### Tipo de Gráfico
Cambia el tipo de visualización:

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| **Barras** | Comparación rápida | Ventas por mes |
| **Línea** | Tendencias temporales | Evolución de montos |
| **Torta** | Proporción de total | % por categoría |

### Filtro Rápido
Busca en tiempo real en la tabla. Acepta cualquier texto y lo busca en todas las columnas.

**Ejemplo:**
- Escribir "Aceptado" → Filtra solo registros aceptados
- Escribir "2025-10" → Filtra solo de octubre

## 📈 Estadísticas Dinámicas

Se actualizan automáticamente según los filtros:

| Métrica | Significado |
|---------|------------|
| **Registros** | Total de filas visibles |
| **Suma** | Total de valores numéricos |
| **Promedio** | Media aritmética |
| **Máx** | Valor más alto |

## 🎬 Flujo de Uso Típico

### Caso 1: Analizar ventas por proveedor

1. **Categoría**: `Razon_Social_Emisor`
2. **Valor**: `Monto_Total`
3. **Tipo**: Barras
4. **Resultado**: Gráfico mostrando ingresos por proveedor

### Caso 2: Ver % de estado de documentos

1. **Categoría**: `Estado_RCV`
2. **Valor**: `Tipo_DTE` (para contar)
3. **Tipo**: Torta
4. **Resultado**: Proporción Aceptado/Rechazado

### Caso 3: Búsqueda específica

1. Escribe en **Filtro**: "76192801-K"
2. **Resultado**: Solo registros de ese RUT
3. Exporta CSV si necesitas guardar

## 📥 Exportación de Datos

Botón **📥 CSV**:
- Descarga tabla **filtrada actual** (no todos los datos)
- Formato: `export_YYYY-MM-DD.csv`
- Abre en Excel, Google Sheets, etc.

## 🔄 Actualizar Dashboard

### Opción 1: Refrescar Datos Locales
Botón **🔄 Refrescar** — Recalcula gráficos y tablas (sin descargar nuevos datos).

### Opción 2: Sincronizar desde SharePoint
Desde terminal (en tu máquina local):

```bash
cd connectors/sharepoint
npm run sync -- "tu-enlace-compartido"
```

Esto:
1. Descarga nuevo Excel
2. Parsea a JSON
3. Copia a `docs/data/`
4. Commit + push → Dashboard se actualiza en vivo

## 🔍 Solución de Problemas

### "Sin registros"
- Verifica que seleccionaste **Hoja** correcta
- El filtro puede ser muy restrictivo
- Intenta limpiar el filtro

### Gráfico no muestra datos
- **Categoría** está vacía o `null` en algunos registros
- **Valor** no es numérico (ej: texto en columna numérica)
- Comprueba en la tabla que los datos existen

### Tabla lenta con muchos registros
- El parser limita a 500 registros por hoja (editable en `sync.js`)
- Usa filtro para reducir filas visibles
- Considera dividir datos en múltiples hojas

### Fechas en formato raro
- Si ves números como "45931", son seriales de Excel
- El parser debería convertirlas a "2025-10-01"
- Si no sucede, asegúrate que la columna contenga "Fecha" en su nombre

## 🎨 Personalización

### Cambiar colores
Edita `docs/styles.css`:
```css
header {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  /* Cambia estos valores hexadecimales */
}
```

### Agregar más gráficos
Edita `docs/app.js`, busca `chartType` y añade:
```javascript
<option value="radar">Radar</option>
<option value="bubble">Burbuja</option>
```

Luego en `renderChart()` acepta esos tipos en Chart.js.

### Modificar estadísticas
En `docs/app.js`, función `computeStats()` — añade lo que necesites (mediana, desv. est., etc).

## 🌐 Responsive Design

| Dispositivo | Comportamiento |
|------------|----------------|
| Desktop (>900px) | 2 columnas (gráfico + resumen lado a lado) |
| Tablet (768-900px) | 1 columna, apilado |
| Móvil (<768px) | 1 columna, controles en stack, tabla scrollable |

En móvil:
- Tabla horizontal scrolleable
- Botones más grandes
- Estadísticas en grid 2x2

## 📚 Ejemplos de Datos

### Estructura Excel Recomendada

```
RUT_Emisor | Razon_Social | Fecha_Emision | Monto_Total | Estado_RCV
76192801-K | Proveedor A   | 2025-10-01   | 500000     | Aceptado
99500000-1 | Proveedor B   | 2025-10-05   | 100000     | Rechazado
```

### JSON Generado

```json
{
  "hojas": {
    "Hoja1": [
      {
        "RUT_Emisor": "76192801-K",
        "Razon_Social": "Proveedor A",
        "Fecha_Emision": "2025-10-01",
        "Monto_Total": 500000,
        "Estado_RCV": "Aceptado"
      }
    ]
  }
}
```

## ⚡ Tips de Productividad

1. **Favoritos del navegador** — Guarda https://trimpulso.github.io/Contabilidad/ en marcadores
2. **Exporta habitualmente** — Mantén backups locales de tus filtros favoritos
3. **Múltiples pestañas** — Abre 2 pestañas del mismo dashboard para comparar categorías
4. **Combina filtros** — Filtro + Categoría + Valor = análisis rápido y poderoso

---

**Última actualización:** 8 de noviembre de 2025
