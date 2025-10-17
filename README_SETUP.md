# 🌱 LocalMarket - Setup del Proyecto

Este es un MVP de LocalMarket: una plataforma que conecta productores locales con consumidores.

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratis en [supabase.com](https://supabase.com))

## 🚀 Guía de Instalación Paso a Paso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Charlsz/localmarket.git
cd localmarket
git checkout feature/mvp-backend-integration
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar Supabase

#### A. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda la URL y la Anon Key del proyecto

#### B. Ejecutar el script SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia todo el contenido del archivo `database/schema.sql`
3. Pégalo en el editor y ejecuta (Run)
4. Verifica que todas las tablas se crearon correctamente

#### C. Configurar autenticación

1. En Supabase, ve a **Authentication > Settings**
2. Habilita "Email" como método de autenticación
3. En "Site URL" y "Redirect URLs" agrega:
   - Local: `http://localhost:3000`
   - Producción: `https://tu-dominio.vercel.app`

### 4️⃣ Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 5️⃣ Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
localmarket/
├── database/
│   └── schema.sql              # Script SQL completo para Supabase
├── src/
│   ├── app/
│   │   ├── api/                # API Routes (Backend)
│   │   │   ├── products/       # CRUD de productos
│   │   │   ├── cart/           # Gestión de carrito
│   │   │   ├── checkout/       # Proceso de compra
│   │   │   └── orders/         # Gestión de órdenes
│   │   ├── productos/          # Página de catálogo
│   │   └── como-funciona/      # Página informativa
│   ├── components/
│   │   ├── auth/               # Componentes de autenticación
│   │   ├── cart/               # Componentes del carrito
│   │   ├── layout/             # Header, Footer
│   │   └── products/           # Componentes de productos
│   └── lib/
│       ├── auth/               # Helpers de autenticación
│       │   ├── server.ts       # Para Server Components
│       │   └── client.ts       # Para Client Components
│       ├── supabase/           # Clientes de Supabase
│       ├── types/              # Tipos TypeScript
│       └── utils/              # Utilidades
└── README_SETUP.md             # Este archivo
```

## 🔑 Roles de Usuario

El sistema soporta 3 roles:

1. **Cliente (client)**: Puede comprar productos
2. **Proveedor (provider)**: Puede vender productos  
3. **Admin (admin)**: Gestión completa del sistema

## 🛠️ API Routes Disponibles

### Productos

- `GET /api/products` - Listar productos
- `GET /api/products?category=fruits` - Filtrar por categoría
- `GET /api/products?featured=true` - Solo destacados
- `GET /api/products?myProducts=true` - Mis productos (proveedor)
- `GET /api/products/[id]` - Ver un producto
- `POST /api/products` - Crear producto (proveedor)
- `PUT /api/products/[id]` - Actualizar producto (proveedor)
- `DELETE /api/products/[id]` - Eliminar producto (proveedor)

### Carrito

- `GET /api/cart` - Ver mi carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/[itemId]` - Actualizar cantidad
- `DELETE /api/cart/[itemId]` - Eliminar item
- `DELETE /api/cart` - Vaciar carrito

### Checkout y Órdenes

- `POST /api/checkout` - Crear orden desde el carrito
- `GET /api/orders` - Ver mis órdenes
- `GET /api/orders/[id]` - Ver una orden específica
- `PUT /api/orders/[id]` - Actualizar estado (admin)

## 🧪 Probar el Sistema

### Como Cliente

1. Crea una cuenta seleccionando "Cliente"
2. Navega al catálogo de productos
3. Agrega productos al carrito
4. Completa el checkout

### Como Proveedor

1. Crea una cuenta seleccionando "Proveedor"
2. Ingresa el nombre de tu negocio
3. Crea tus productos desde el panel
4. Los productos aparecerán en el catálogo público

## 🚢 Deployment en Vercel

### 1. Conectar el repositorio

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy
vercel
```

O usa la interfaz web de Vercel:
1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno

### 2. Configurar variables de entorno en Vercel

En el dashboard de Vercel, agrega:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Deploy automático

Cada push a `feature/mvp-backend-integration` desplegará automáticamente.

## 🔐 Seguridad

- ✅ Row Level Security (RLS) habilitado en Supabase
- ✅ Autenticación con JWT tokens
- ✅ Validación de roles en API Routes
- ✅ Políticas de acceso por usuario

## 🎨 Categorías de Productos Disponibles

- `vegetables` - Vegetales
- `fruits` - Frutas
- `dairy` - Lácteos
- `meat` - Carnes
- `bakery` - Panadería
- `honey` - Miel
- `preserves` - Conservas
- `crafts` - Artesanías
- `other` - Otros

## 📝 Tareas Pendientes (Futuro)

- [ ] Integración con Stripe para pagos reales
- [ ] Sistema de calificaciones y reseñas
- [ ] Notificaciones por email
- [ ] Panel de administración para proveedores
- [ ] Búsqueda avanzada con filtros
- [ ] Sistema de favoritos
- [ ] Chat entre cliente y proveedor
- [ ] Gestión de inventario avanzada

## 🐛 Troubleshooting

### Error: "No tienes un carrito activo"

Asegúrate de estar autenticado y que la tabla `carts` tiene los permisos RLS correctos.

### Error: "No autorizado"

Verifica que el token de autenticación sea válido y que las variables de entorno estén configuradas.

### Errores de TypeScript en desarrollo

Algunos errores menores de tipos pueden aparecer durante el desarrollo pero no afectan la funcionalidad. Ejecuta `npm run build` para verificar si hay errores críticos.

## 📞 Soporte

Para preguntas o problemas, abre un issue en GitHub.

---

**¡Listo para empezar!** 🚀

Desarrollado con ❤️ usando Next.js 15 + Supabase
