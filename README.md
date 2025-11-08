# Sistema Contable Trimpulso - Conexión SharePoint

Conector para sincronizar especificaciones y datos del sistema contable con SharePoint de Microsoft 365.

## 📋 Información

| Propiedad | Valor |
|-----------|-------|
| **Organización** | Trimpulso |
| **Dominio** | trimpulso.cl |
| **SharePoint** | https://trimpulso-my.sharepoint.com/ |
| **Repositorio** | https://github.com/Trimpulso/contabilidad/ |
| **Email de Contacto** | job.llanos@trimpulso.cl |

## 🚀 Inicio Rápido

### 1. Clonar repositorio
```bash
git clone https://github.com/Trimpulso/contabilidad.git
cd contabilidad
```

### 2. Instalar dependencias
```bash
cd connectors/sharepoint
npm install
```

### 3. Configurar credenciales
```bash
# Copia el archivo de ejemplo
cp config.example.json config.json

# Edita config.json con tus credenciales de Azure
# (No se commitea a GitHub por seguridad)
```

### 4. Validar configuración
```bash
npm run validate
```

### 5. Conectar con SharePoint
```bash
npm run sync
```

## 📁 Estructura

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
