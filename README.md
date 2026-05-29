# Proyecto Agricultivo

Una aplicación web en React + Vite diseñada para apoyar a agricultores de La Libertad con datos de precios, alertas de mercado y recomendaciones de cultivo.

## Descripción

Este proyecto ofrece:

- Dashboard para usuarios con precios del día, alertas activas y recomendaciones.
- Datos específicos de cultivos y mercados de la región.

## Características principales

- Registro e inicio de sesión de agricultores.
- Rutas protegidas para usuarios autenticados.
- Integración con Supabase para autenticación y bases de datos.
- Interfaz UI basada en Tailwind CSS.
- Visualización de métricas de mercado y contenido dinámico.

## Tecnologías

- React 19
- Vite
- Tailwind CSS
- Supabase (`@supabase/supabase-js`)
- React Router DOM
- Recharts
- Lucide React
- ESLint

## Estructura del proyecto

```text
Proyecto-Agricultivo/
├─ src/
│  ├─ components/    # Componentes reutilizables (Navbar, Layout, tarjetas, alertas, etc.)
│  ├─ pages/         # Vistas de la aplicación (Home, Dashboard, Login, Admin, etc.)
│  ├─ js/            # Lógica de negocio, rutas, autenticación y cliente Supabase
│  ├─ assets/        # Imágenes, iconos y recursos estáticos de UI
│  ├─ App.jsx        # Entrada principal del componente React
│  ├─ main.jsx       # Renderiza la app en el DOM
│  └─ index.css      # Estilos globales y configuración de Tailwind
├─ public/           # Archivos estáticos públicos
├─ scripts/          # Scripts auxiliares (por ejemplo, crear admin en Supabase)
├─ package.json      # Dependencias y scripts del proyecto
├─ tailwind.config.js# Configuración de Tailwind CSS
├─ vite.config.js    # Configuración de Vite
└─ README.md         # Documentación del proyecto
```

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd Proyecto-Agricultivo
```

2. Instala las dependencias:

```bash
npm install
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto.
2. Agrega las variables de entorno de Supabase:

```env
VITE_SUPABASE_URL=https://tusupabase.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

3. Si quieres usar el script de administrador, define también:

```bash
SUPABASE_URL=https://tusupabase.supabase.co SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

4. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

## Requisitos

- Node.js 20+ recomendado
- npm
- Proyecto Supabase con tablas para `profiles`, `precios`, `alertas` y `recomendaciones`

## Integrantes del proyecto

1. .
2. .
3. 

---

