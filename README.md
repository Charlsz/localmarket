# LocalMarket

**Eslogan:** *"Conectando productores locales con tu comunidad"*

Plataforma digital que facilita la comercialización de productos agrícolas, artesanales y alimenticios de productores locales. Conecta directamente a agricultores, artesanos y pequeños productores con consumidores que buscan productos frescos, sostenibles y de proximidad.

##  Problema que resuelve

- **Dificultad de productores locales** para llegar a más clientes
- **Consumidores** que buscan productos frescos pero no conocen productores cercanos  
- **Falta de canales digitales** para comercio local

## Estado del proyecto

### **Sprint 1 Completado** - Setup y Base
- [x] Configuración Next.js 15 + Supabase
- [x] Sistema de layout responsivo
- [x] Diseño de base de datos
- [x] Landing page implementada

### **Componentes principales implementados**
- [x] **ProductCard** - Tarjeta de producto reutilizable
  - Imagen, nombre, precio, rating
  - Botón "Agregar al carrito"
  - Estado de stock disponible
  - Badge de producto destacado
- [x] **ShoppingCart** - Carrito de compras completo
  - Lista de productos en carrito
  - Control de cantidades (+/−)
  - Cálculo de totales en tiempo real
  - Persistencia en localStorage
  - Botón para proceder al checkout

### **Páginas implementadas**
- [x] **Página de inicio** con hero section y productos destacados
- [x] **Catálogo de productos** con búsqueda y filtros avanzados
- [x] **Página "Cómo funciona"** explicando el proceso

### **En desarrollo (Próximos Sprints)**
- [ ] Sistema de autenticación con Supabase Auth
- [ ] CRUD completo de productos para productores
- [ ] Proceso de checkout en 4 pasos
- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Panel de administración
- [ ] Sistema de reseñas y calificaciones

## Stack tecnológico

### **Frontend**
- **Framework:** Next.js 15 con App Router
- **Lenguaje:** TypeScript
- **Styling:** Tailwind CSS + Headless UI
- **Estado:** Zustand con persistencia
- **Formularios:** React Hook Form + Zod
- **Iconos:** Heroicons

### **Backend & Base de datos**
- **Runtime:** Node.js (Next.js API Routes)
- **Base de datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth
- **Storage:** Supabase Storage
- **Pagos:** Stripe/MercadoPago SDK

### **DevOps**
- **Deploy:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Monitoring:** GitHub Actions
- **Gestión:** GitHub Projects

## Instalación y desarrollo

### **Requisitos previos**
- Node.js 20+
- npm o yarn
- Cuenta de Supabase (para base de datos)

### **1. Clonar el repositorio**
```bash
git clone https://github.com/Charlsz/localmarket.git
cd localmarket
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **4. Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### **5. Build para producción**
```bash
npm run build
```

## Estructura del proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── layout.tsx         # Layout principal con Header/Footer
│   ├── page.tsx           # Landing page
│   ├── productos/         # Catálogo con filtros y búsqueda
│   └── como-funciona/     # Información de la plataforma
├── components/
│   ├── layout/            # Componentes de estructura
│   │   ├── Header.tsx     # Navegación con carrito integrado
│   │   └── Footer.tsx     # Footer con enlaces
│   ├── products/          # Componentes de productos
│   │   └── ProductCard.tsx # Tarjeta de producto
│   └── cart/              # Componentes del carrito
│       └── ShoppingCart.tsx # Carrito lateral
├── lib/
│   ├── supabase/          # Configuración Supabase
│   ├── store/             # Estados con Zustand
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilidades
└── styles/
    └── globals.css        # Estilos globales
```

## Funcionalidades principales

### **A. Gestión de Usuarios y Roles** (En desarrollo)
- **Registro/Login** (consumidores y productores)
- **Perfiles diferenciados** (consumidor, productor, administrador)
- **Verificación de productores** (documentación)
- **Gestión de datos de contacto y ubicación**

### **B. Catálogo y Gestión de Productos** (Parcial)
- **CRUD completo de productos** (solo productores) - En desarrollo
- **Categorización** (frutas, verduras, lácteos, artesanías, etc.) - Implementado
- **Gestión de inventario** en tiempo real - En desarrollo
- **Subida múltiple de imágenes** por producto - En desarrollo
- **Búsqueda y filtros** (categoría, precio, ubicación, rating) - Implementado

### **C. Sistema de Pedidos y Carrito** (Implementado)
- **Carrito de compras** persistente - Implementado
- **Proceso de checkout** en 4 pasos - En desarrollo
- **Cálculo automático** de totales - Implementado
- **Gestión de métodos de entrega** (recogida, delivery) - En desarrollo

### **D. Sistema de Pagos** (En desarrollo)
- **Integración con pasarela de pagos** (Stripe/MercadoPago)
- **Historial de transacciones**
- **Sistema de comisiones** (5% por transacción)
- **Reembolsos y cancelaciones**

### **E. Sistema de Reseñas y Calificaciones** (En desarrollo)
- **Valoraciones** por producto y vendedor
- **Comentarios verificados** (solo compradores)
- **Sistema de reputación** con badges
- **Moderación** de reseñas

### **F. Panel de Administración** (En desarrollo)
- **Dashboard** con métricas clave
- **Gestión de usuarios** y verificación
- **Moderación** de productos y reseñas
- **Reportes** de ventas y comisiones

## Plan de desarrollo

### **Metodología:** Scrum + DevOps

#### **Sprints planificados (8 semanas)**

**Sprint 1 (Semanas 1-2): Setup y Base** - Completado
- Configuración Next.js + Supabase
- Layout y navegación
- Landing page
- Componentes base (ProductCard, ShoppingCart)

**Sprint 2 (Semanas 3-4): Autenticación y Productos** - En desarrollo
- Sistema de autenticación y roles
- CRUD completo de productos
- Subida de imágenes (Supabase Storage)
- Perfiles de productores

**Sprint 3 (Semanas 5-6): Sistema de Pedidos** - Pendiente
- Proceso de checkout completo
- Historial de pedidos
- Estados del pedido
- Notificaciones

**Sprint 4 (Semanas 7-8): Features Finales** - Pendiente
- Sistema de reseñas
- Panel de administración
- Testing y optimización
- Deploy y monitoring

## Modelo de datos

### **Entidades principales (Supabase)**

```sql
-- Usuarios (extends Supabase Auth)
profiles {
  user_id: UUID (FK),
  full_name: TEXT,
  avatar_url: TEXT,
  phone: TEXT,
  address: TEXT,
  role: ENUM(consumer, producer, admin),
  verification_status: ENUM(pending, verified, rejected)
}

-- Productos
products {
  id: UUID,
  name: TEXT,
  description: TEXT,
  price: DECIMAL,
  category: TEXT,
  images: TEXT[],
  producer_id: UUID (FK),
  stock: INTEGER,
  rating_avg: DECIMAL
}

-- Pedidos
orders {
  id: UUID,
  consumer_id: UUID (FK),
  total_amount: DECIMAL,
  status: ENUM(pending, confirmed, preparing, ready, delivered, cancelled),
  shipping_address: TEXT
}

-- Items del pedido
order_items {
  order_id: UUID (FK),
  product_id: UUID (FK),
  quantity: INTEGER,
  unit_price: DECIMAL
}

-- Reseñas
reviews {
  id: UUID,
  product_id: UUID (FK),
  user_id: UUID (FK),
  rating: INTEGER,
  comment: TEXT
}
```

## Deploy

### **GitHub Pages**
El proyecto está configurado para deploy automático en GitHub Pages mediante GitHub Actions.

**URL de producción:** [https://charlsz.github.io/localmarket/](https://charlsz.github.io/localmarket/)

#### **Configuración del deploy:**

1. **Variables de entorno requeridas** (GitHub Secrets):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Workflow automático:**
   - Se ejecuta en cada push a `master`
   - Build optimizado para export estático
   - Deploy directo a GitHub Pages

#### **Pipeline CI/CD:**
```
GitHub Push → Build (Next.js) → Test → Deploy (GitHub Pages)
```

## Presupuesto estimado

| Concepto | Costo Mensual | Total (2 meses) |
|----------|---------------|------------------|
| **Desarrollo** (4 personas) | $2,000 | $4,000 |
| **Supabase** (Plan Pro) | $25 | $50 |
| **GitHub** (Hosting) | $0 | $0 |
| **Dominio** (opcional) | $15 | $15 |
| **Servicios externos** | $20 | $40 |
| **Contingencias** (15%) | - | $615 |
| **TOTAL** | | **$4,720** |

## Contribuir

1. Fork del proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

## Contacto y soporte

- **Repositorio:** [github.com/Charlsz/localmarket](https://github.com/Charlsz/localmarket)
- **Issues:** [Reportar problemas](https://github.com/Charlsz/localmarket/issues)
- **Documentación:** [Wiki del proyecto](https://github.com/Charlsz/localmarket/wiki)

---

**LocalMarket** - *Conectando productores locales con tu comunidad*