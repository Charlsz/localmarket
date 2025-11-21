# LocalMarket

**Eslogan:** *"Conectando productores locales con tu comunidad"*

**URL de producción:** [https://localmarket-seven.vercel.app/](https://localmarket-seven.vercel.app/)

Plataforma digital que facilita la comercialización de productos agrícolas, artesanales y alimenticios de productores locales. Conecta directamente a agricultores, artesanos y pequeños productores con consumidores que buscan productos frescos, sostenibles y de proximidad.

## Problema que resuelve

- **Dificultad de productores locales** para llegar a más clientes
- **Consumidores** que buscan productos frescos pero no conocen productores cercanos  
- **Falta de canales digitales** para comercio local

## Estado del proyecto

### MVP Backend Integration - Completado

**Funcionalidades implementadas:**

#### Sistema de Autenticación
- Registro y login con Supabase Auth
- Roles diferenciados (consumidor/proveedor)
- Modal de autenticación con validación
- Gestión de sesión y estado de usuario
- Perfil de usuario con datos completos
- Menú de usuario con opciones según rol

#### Gestión de Productos
- CRUD completo de productos para proveedores
- API Routes para productos (`/api/products`)
- Página de detalle de producto con información completa
- Catálogo con búsqueda y filtros avanzados
- Tarjetas de producto con imagen, precio y rating
- Integración con Supabase Storage para imágenes
- Control de inventario y stock

#### Sistema de Proveedores
- Listado de proveedores con grid responsivo
- Página de detalle de proveedor con sus productos
- API Routes para proveedores (`/api/providers`)
- Filtros y búsqueda de proveedores
- Información completa del proveedor

#### Carrito de Compras
- Carrito persistente con Zustand
- API Routes para gestión del carrito (`/api/cart`)
- Control de cantidades y totales en tiempo real
- Integración con backend para persistencia
- Actualización automática de precios

#### Sistema de Órdenes
- Proceso de checkout completo en 4 pasos
- API Routes para órdenes (`/api/orders`, `/api/checkout`)
- Página "Mis Órdenes" con historial completo
- Estados de orden (pendiente, confirmado, preparando, listo, entregado, cancelado)
- Detalles de orden con items y totales
- Seguimiento de órdenes en tiempo real

#### Dashboard de Proveedor
- Panel de gestión de productos (`/dashboard/productos`)
- Panel de gestión de órdenes recibidas (`/dashboard/ordenes`)
- Actualización de estados de órdenes
- Formularios para crear y editar productos
- Vista de estadísticas básicas

#### Páginas Adicionales
- Página de perfil de usuario (`/perfil`)
- Página de inicio con productos destacados
- Página "Cómo funciona" (`/como-funciona`)
- Sistema de navegación completo

### Próximas funcionalidades
- Sistema de pagos (Stripe/MercadoPago)
- Sistema de reseñas y calificaciones
- Panel de administración completo
- Notificaciones en tiempo real
- Sistema de mensajería entre usuarios
- Análisis y reportes avanzados

## Stack tecnológico

### Frontend
- **Framework:** Next.js 15.5.5 con App Router
- **Lenguaje:** TypeScript 5
- **Styling:** Tailwind CSS 4 + Headless UI 2.2
- **Estado:** Zustand 4.4 con persistencia
- **Formularios:** React Hook Form 7.65 + Zod 4.1
- **Iconos:** Heroicons 2.2 + Lucide React 0.545

### Backend y Base de datos
- **Runtime:** Node.js (Next.js API Routes)
- **Base de datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth con SSR
- **Storage:** Supabase Storage
- **ORM:** Supabase JS 2.75
- **Auth Helpers:** @supabase/ssr 0.7

### DevOps
- **Deploy:** Vercel
- **CI/CD:** GitHub Actions
- **Control de versiones:** Git + GitHub
- **Gestión:** GitHub Projects

## Instalación y desarrollo

### Requisitos previos
- Node.js 20+
- npm o yarn
- Cuenta de Supabase (gratuita)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Charlsz/localmarket.git
cd localmarket
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Obtener las credenciales de Supabase:**
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Settings > API > Project URL (copia `NEXT_PUBLIC_SUPABASE_URL`)
3. Settings > API > Project API keys > anon public (copia `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Configurar base de datos

1. En tu proyecto de Supabase, ve a SQL Editor
2. Ejecuta el script `database/schema.sql` para crear las tablas
3. Configura Row Level Security (RLS) según las políticas del schema

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 6. Build para producción
```bash
npm run build
npm start
```

## Estructura del proyecto

```
localmarket/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/              # Autenticación
│   │   │   ├── cart/              # Carrito de compras
│   │   │   ├── checkout/          # Proceso de pago
│   │   │   ├── orders/            # Gestión de órdenes
│   │   │   ├── products/          # CRUD de productos
│   │   │   └── providers/         # Proveedores
│   │   ├── checkout/              # Página de checkout
│   │   ├── como-funciona/         # Información de la plataforma
│   │   ├── dashboard/             # Dashboard de proveedor
│   │   │   ├── ordenes/          # Gestión de órdenes
│   │   │   └── productos/        # Gestión de productos
│   │   ├── mis-ordenes/           # Historial de órdenes
│   │   ├── perfil/                # Perfil de usuario
│   │   ├── productores/           # Listado y detalle de proveedores
│   │   ├── productos/             # Catálogo y detalle de productos
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página de inicio
│   ├── components/
│   │   ├── auth/                  # Componentes de autenticación
│   │   │   ├── AuthModal.tsx     # Modal de login/registro
│   │   │   └── UserMenu.tsx      # Menú de usuario
│   │   ├── cart/                  # Componentes del carrito
│   │   │   └── ShoppingCart.tsx  # Carrito lateral
│   │   ├── layout/                # Componentes de estructura
│   │   │   ├── Header.tsx        # Navegación principal
│   │   │   └── Footer.tsx        # Footer
│   │   ├── products/              # Componentes de productos
│   │   │   └── ProductCard.tsx   # Tarjeta de producto
│   │   └── providers/             # Componentes de proveedores
│   │       ├── ProvidersGrid.tsx # Grid de proveedores
│   │       └── ProvidersHeader.tsx
│   └── lib/
│       ├── auth/                  # Utilidades de autenticación
│       │   ├── client.ts         # Auth cliente
│       │   └── server.ts         # Auth servidor
│       ├── store/                 # Estados globales
│       │   └── cart.ts           # Estado del carrito
│       ├── supabase/              # Configuración Supabase
│       ├── types/                 # Tipos TypeScript
│       └── utils/                 # Utilidades generales
├── database/                       # Scripts SQL
│   └── schema.sql                 # Esquema completo
├── public/                         # Archivos estáticos
├── .env.local                      # Variables de entorno (no incluido)
├── next.config.ts                  # Configuración Next.js
├── tailwind.config.ts              # Configuración Tailwind
├── tsconfig.json                   # Configuración TypeScript
└── vercel.json                     # Configuración Vercel
```

## Modelo de datos

### Tablas principales

**profiles**
- Extiende la autenticación de Supabase
- Campos: id, email, full_name, phone, address, role, created_at, updated_at
- Roles: consumer, provider

**products**
- Productos ofrecidos por proveedores
- Campos: id, name, description, price, category, image_url, provider_id, stock, rating_avg, created_at, updated_at
- Relación: provider_id -> profiles(id)

**orders**
- Órdenes de compra
- Campos: id, consumer_id, total_amount, status, shipping_address, delivery_method, created_at, updated_at
- Estados: pending, confirmed, preparing, ready, delivered, cancelled
- Relación: consumer_id -> profiles(id)

**order_items**
- Items de cada orden
- Campos: id, order_id, product_id, quantity, unit_price
- Relaciones: order_id -> orders(id), product_id -> products(id)

**cart_items**
- Items en el carrito (temporal)
- Campos: id, user_id, product_id, quantity, created_at, updated_at
- Relaciones: user_id -> profiles(id), product_id -> products(id)

## API Routes

### Autenticación
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/products` - Listar productos con filtros
- `GET /api/products/[id]` - Obtener detalle de producto
- `POST /api/products` - Crear producto (solo proveedores)
- `PUT /api/products/[id]` - Actualizar producto (solo proveedores)
- `DELETE /api/products/[id]` - Eliminar producto (solo proveedores)

### Proveedores
- `GET /api/providers` - Listar proveedores
- `GET /api/providers/[id]` - Obtener detalle de proveedor

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar item al carrito
- `PUT /api/cart/[itemId]` - Actualizar cantidad
- `DELETE /api/cart/[itemId]` - Eliminar item del carrito

### Órdenes
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/[id]` - Obtener detalle de orden
- `POST /api/checkout` - Crear orden desde el carrito
- `PUT /api/orders/[id]` - Actualizar estado de orden (solo proveedores)

## Deploy en Vercel

### Configuración automática

El proyecto está configurado para deploy automático en Vercel:

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. El deploy se ejecutará automáticamente en cada push a `master`

### Configuración manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

El archivo `vercel.json` incluye la configuración necesaria para el routing y cache.

## Seguridad

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS configuradas:

- **profiles**: Los usuarios solo pueden leer y actualizar su propio perfil
- **products**: Lectura pública, escritura solo para el proveedor dueño
- **orders**: Usuarios solo ven sus propias órdenes
- **order_items**: Acceso solo a través de la orden asociada
- **cart_items**: Usuarios solo ven y modifican sus propios items

### Autenticación

- Tokens JWT manejados por Supabase Auth
- Sesiones con cookies HTTPOnly
- Refresh tokens automáticos
- Protección CSRF

## Contribuir

### Workflow de contribución

1. Fork del proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

### Estándares de código

- TypeScript estricto
- ESLint para linting
- Prettier para formateo
- Conventional Commits para mensajes

## Scripts disponibles

```bash
# Desarrollo con Turbopack
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## Soporte y contacto

- **Repositorio:** [github.com/Charlsz/localmarket](https://github.com/Charlsz/localmarket)
- **Issues:** [Reportar problemas](https://github.com/Charlsz/localmarket/issues)
- **Documentación:** Ver archivos en `database/` para scripts SQL

## Licencia

Este proyecto es privado y está en desarrollo.

## Nuevos Componentes UI

### Componentes de Página Principal

- **Hero**: Sección principal con título, descripción y estadísticas
- **Benefits**: Sección de beneficios con iconos y descripciones
- **FeaturedProducts**: Productos destacados con carga dinámica desde Supabase
- **HowItWorks**: Explicación de cómo funciona la plataforma en 4 pasos
- **CallToAction**: Llamado a la acción para productores

### Componentes de UI

- **BackgroundPattern**: Patrones de fondo decorativos (dots, grid, gradient)
- **ConfirmDialog**: Modal de confirmación personalizable
- **ImageUploader**: Subida de imágenes con drag & drop
- **ToastContainer**: Sistema de notificaciones toast con useToast hook
- **SEOHead**: Componente para gestión de meta tags

### Mejoras de SEO

- Metadata completa en layout con OpenGraph y Twitter Cards
- Sitemap.xml dinámico
- robots.txt configurado
- Páginas de error personalizadas (error.tsx, not-found.tsx)
- Manifest.json para PWA

### Hooks Personalizados

- **useSEO**: Hook para gestión de metadata en el cliente

### Estilos

- **colors.ts**: Sistema de colores centralizado con paleta completa

---

**LocalMarket** - *Conectando productores locales con tu comunidad*

