# Sistema Contable Inteligente 📊

**Dashboard contable en vivo con sincronización automática desde SharePoint.**

[![Dashboard](https://img.shields.io/badge/Dashboard-Online-blue?style=flat-square)](https://trimpulso.github.io/Contabilidad/)
[![GitHub](https://img.shields.io/badge/Repo-GitHub-black?style=flat-square)](https://github.com/Trimpulso/Contabilidad)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🎯 Características

✅ **Dashboard en tiempo real** — Gráficos interactivos (barras, líneas, tortas)  
✅ **Sincronización SharePoint** — Descarga automática de Excel vía enlace compartido  
✅ **Responsivo** — Funciona en desktop, tablet y móvil  
✅ **Sin backend** — Estático en GitHub Pages  
✅ **Agregaciones dinámicas** — Suma, promedio, máximo por categoría  
✅ **Exportación CSV** — Descarga datos filtrados  
✅ **Conversión de fechas** — Seriales Excel → ISO (YYYY-MM-DD)  

## 🚀 Acceso Rápido

**Dashboard en vivo:**  
👉 https://trimpulso.github.io/Contabilidad/

**Repositorio:**  
👉 https://github.com/Trimpulso/Contabilidad

## 📖 Guía de Uso del Dashboard

### 1. Seleccionar Datos
- **Hoja**: Elige entre múltiples hojas del Excel
- **Categoría**: Selecciona columna de texto para agrupar
- **Valor**: Selecciona columna numérica para agregar

### 2. Visualización
- **Tipo Gráfico**: Alterna entre Barras / Línea / Torta
- **Filtro**: Busca en tiempo real en la tabla
- **Estadísticas**: Ve Registros, Suma, Promedio, Máximo

### 3. Acciones
- 📥 **CSV**: Exporta datos filtrados
- 🔄 **Refrescar**: Recalcula los datos

## 🔄 Actualizar Datos desde SharePoint

Ejecuta el script de sincronización desde tu terminal:

```bash
cd connectors/sharepoint
npm install
npm run sync -- "TU_ENLACE_COMPARTIDO_SHAREPOINT"
```

**Ejemplo de enlace:**
```
https://trimpulso-my.sharepoint.com/:x:/g/personal/job_llanos_trimpulso_cl/EftXAVUNC-...
```

**Resultado:**
- ✅ `data/Contabilida.xlsx` — Archivo original
- ✅ `data/contabilidad.json` — Datos parseados
- ✅ `docs/data/contabilidad.json` — Copia para GitHub Pages
- 🔄 `git push` — Actualiza dashboard en vivo

## 🏗️ Arquitectura

```
Contabilidad/
├── docs/                      # 🌐 GitHub Pages (frontend)
│   ├── index.html            # Dashboard principal
│   ├── app.js                # Lógica + agregaciones
│   ├── styles.css            # Estilos responsivos
│   └── data/
│       └── contabilidad.json # JSON consumido
├── connectors/sharepoint/    # 🔗 Sincronización
│   ├── sync.js               # Descarga + parseo Excel
│   ├── config.json           # Credenciales (git-ignored)
│   └── package.json
├── data/                     # 💾 Backup local
│   ├── Contabilida.xlsx
│   └── contabilidad.json
└── README.md
```

## 🔐 Seguridad

- ✅ Credenciales Azure en `.gitignore`
- ✅ Dashboard estático sin backend
- ✅ Permisos requeridos: `Files.Read.All`, `Sites.Read.All` (consentimiento admin)
- ✅ Datos JSON públicos en Pages

## 🛠️ Desarrollo Local

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
git clone https://github.com/Trimpulso/Contabilidad.git
cd Contabilidad/connectors/sharepoint
npm install
```

### Configurar Credenciales Azure
```bash
cp config.example.json config.json
# Edita config.json con:
# - tenantId
# - clientId
# - clientSecret
# - siteUrl
# - userEmail
```

### Probar Localmente
```bash
# Opción 1: Live Server (VS Code)
# Click derecho en docs/index.html → "Open with Live Server"

# Opción 2: Python
python -m http.server 8000 --directory docs

# Opción 3: Node
npx http-server docs -p 8000
```

Abre: http://localhost:8000

### Ejecutar Sincronización
```bash
npm run sync -- "https://enlace-compartido-sharepoint"
```

## 📊 Ejemplo de Datos

**Estructura JSON generada desde Excel:**
```json
{
  "fuente": "Contabilida.xlsx",
  "generado": "2025-11-08T04:41:05.040Z",
  "hojas": {
    "Hoja1": [
      {
        "RUT_Emisor": "76192801-K",
        "Razon_Social_Emisor": "Proveedor A S.A.",
        "Tipo_DTE": 33,
        "Fecha_Emision": "2025-10-01",
        "Monto_Total": 595000,
        "Estado_RCV": "Aceptado"
      }
    ]
  }
}
```

## 🔮 Roadmap

- [ ] Backend Node.js + Base de datos
- [ ] Autenticación / Login
- [ ] Tabla dinámica (Pivot)
- [ ] Más gráficos (Cascada, Dispersión)
- [ ] Alertas / Notificaciones
- [ ] API REST
- [ ] Descarga PDF

## 📝 Licencia

MIT — Libre para usar y modificar.

## 🤝 Contacto

Email: job.llanos@trimpulso.cl  
GitHub: https://github.com/Trimpulso/Contabilidad

---

**Última actualización:** 8 de noviembre de 2025

```
contabilidad/
├── connectors/
│   └── sharepoint/
│       ├── sync.js              # Script de sincronización
│       ├── validate.js          # Validación de config
│       ├── config.example.json  # Template (sí se commitea)
│       ├── config.json          # Local, NO se commitea
│       └── package.json
├── docs/
│   ├── security_analysis.md     # Información de seguridad
│   └── SHAREPOINT_CREDENTIALS.md # Guía de credenciales
├── .gitignore                   # Protege credenciales
└── README.md                    # Este archivo
```

## � Seguridad

- ✅ `config.json` está en `.gitignore` (NO se commitea)
- ✅ `security_analysis.md` SÍ está en GitHub (sin credenciales)
- ✅ Cada desarrollador tiene su propio `config.json` local
- ✅ Las credenciales se obtienen de Azure AD

## 📖 Documentación

- **[security_analysis.md](./docs/security_analysis.md)** - Información de seguridad y configuración
- **[SHAREPOINT_CREDENTIALS.md](./docs/SHAREPOINT_CREDENTIALS.md)** - Cómo obtener credenciales de Azure
- **[INICIO.txt](./INICIO.txt)** - Guía paso a paso

## 🛠️ Comandos Disponibles

```bash
# Validar configuración
npm run validate

# Conectar y listar archivos
npm run sync

# Descargar archivo específico
npm run sync nombredelarchivo.docx
```

## 📝 Contribuir

1. Clona el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcion`
3. Haz cambios y commitea: `git commit -am 'Descripción'`
4. Push: `git push origin feature/nueva-funcion`
5. Abre un Pull Request

## 📞 Soporte

- **Email**: job.llanos@trimpulso.cl
- **Organización**: Trimpulso
- **GitHub Issues**: https://github.com/Trimpulso/contabilidad/issues

---

**Última actualización**: 7 de noviembre de 2025
