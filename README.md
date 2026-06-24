# 🌱 AgroAlert - Plataforma de Inteligencia Agrícola


**AgroAlert** es una aplicación web diseñada específicamente para agricultores de la región de La Libertad. Su objetivo principal es proporcionar datos de mercado claros y actualizados para ayudar a los agricultores a tomar decisiones más rentables, evitando pérdidas por sobreproducción y mejorando la planificación de sus siembras y ventas.

## ✨ Características Principales

- 📊 **Precios del Día:** Monitoreo en tiempo real de los precios de cultivos en los principales mercados (ej. La Hermelinda).
- 🔔 **Alertas Tempranas:** Notificaciones preventivas sobre posibles caídas de precios, baja demanda o exceso de oferta.
- 📈 **Historial de Datos:** Análisis gráfico de las variaciones de precios en los últimos 30 o 60 días para una mejor proyección.
- 💡 **Recomendaciones Inteligentes:** Sugerencias basadas en datos sobre qué cultivos son más rentables según la temporada y demanda.
- 🔐 **Panel Administrativo:** Gestión integral de usuarios, precios, alertas y recomendaciones del mercado.
- 📱 **Diseño PWA / Offline:** Capacidad de funcionar en modo offline y ser instalada como una aplicación progresiva.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React (Íconos)
- **Enrutamiento:** React Router DOM v7
- **Gráficos:** Recharts
- **Backend / Base de Datos:** Supabase (Autenticación y Base de Datos)
- **Herramientas de Desarrollo:** ESLint, PostCSS

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu sistema local:
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (Gestor de paquetes de Node)

## 🚀 Instalación y Configuración

1. **Clonar el repositorio** (Si aplica):
   ```bash
   git clone https://github.com/tu-usuario/proyecto-agricultivo.git
   cd proyecto-agricultivo
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**: 
   El proyecto utiliza Supabase. Necesitas crear un archivo `.env` en la raíz del proyecto basado en las credenciales de tu proyecto en Supabase:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
   
4. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles
En el directorio del proyecto, puedes ejecutar:

- `npm run dev`: Inicia el servidor de desarrollo utilizando Vite.
- `npm run build`: Construye la aplicación para producción en la carpeta dist.
- `npm run preview`: Previsualiza la versión de producción localmente.
- `npm run lint`: Ejecuta ESLint para buscar y advertir sobre errores en el código.
- `npm run seed:admin`: Script especial de Node para crear el usuario administrador inicial.

## 📂 Estructura del Proyecto

```text
proyecto-agricultivo/
├── public/                # Archivos estáticos
├── scripts/               # Scripts de utilidad (ej. seed_admin)
├── src/                   # Código fuente principal
│   ├── assets/            # Imágenes, fuentes, etc.
│   ├── components/        # Componentes reutilizables de React (Navbar, Cards, etc.)
│   ├── js/                # Lógica de negocio, autenticación, router y config de Supabase
│   ├── pages/             # Vistas de la aplicación (Home, Dashboard, Admin, etc.)
│   ├── App.jsx            # Componente raíz de la UI
│   ├── index.css          # Estilos globales y configuración de Tailwind
│   └── main.jsx           # Punto de entrada de React
├── .env                   # Variables de entorno (no versionado)
├── package.json           # Dependencias y scripts del proyecto
├── tailwind.config.js     # Configuración de Tailwind CSS
└── vite.config.js         # Configuración del empaquetador Vite
  ```

## 🤝 Contribución

1. Haz un Fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/NuevaCaracteristica`).
3. Haz Commit de tus cambios (`git commit -m 'Añadir alguna NuevaCaracteristica'`).
4. Haz Push a la rama (`git push origin feature/NuevaCaracteristica`).
5. Abre un Pull Request.
