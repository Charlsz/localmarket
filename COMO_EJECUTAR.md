# 🚀 Guía Rápida: Cómo Ejecutar LocalMarket en Local

## ✅ El Sistema Está Corriendo

**Frontend + Backend integrados** están ejecutándose en:
- 🌐 **Local:** http://localhost:3000
- 🌐 **Network:** http://10.0.0.118:3000

## 📖 Entendiendo la Arquitectura

### ¿Dónde está el "Backend"?

En Next.js 15, **el backend y frontend están en el mismo proyecto**:

```
Frontend (React) ──────────────┐
                               │
API Routes (Backend) ──────────┤ ← TODO EN LOCALHOST:3000
                               │
Supabase (Base de Datos) ──────┘ ← En la nube
```

### Las API Routes SON el Backend

Cuando ejecutas `npm run dev`, Next.js inicia:
1. ✅ **Frontend** - Páginas React en `/app`
2. ✅ **Backend** - API Routes en `/app/api`

**No necesitas un servidor backend separado.** Todo corre en el mismo puerto.

---

## 🔧 Configuración Paso a Paso

### 1️⃣ Variables de Entorno (IMPORTANTE)

Primero, necesitas configurar Supabase:

```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env.local

# 2. Edita .env.local con tus credenciales
```

**Contenido de `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2️⃣ Obtener Credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto nuevo (gratis)
3. En **Settings > API**, copia:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3️⃣ Ejecutar el Script SQL

1. En Supabase, ve a **SQL Editor**
2. Copia todo el contenido de `database/schema.sql`
3. Pégalo y ejecuta (Run)
4. Verifica que se crearon las tablas

### 4️⃣ Ejecutar el Proyecto

```bash
# Instalar dependencias (primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El servidor inicia en: **http://localhost:3000**

---

## 🧪 Probando las API Routes (Backend)

Puedes probar las APIs directamente desde el navegador o con herramientas como Thunder Client, Postman o curl.

### Ejemplo 1: Listar Productos

```bash
# Ver todos los productos
curl http://localhost:3000/api/products

# Filtrar por categoría
curl http://localhost:3000/api/products?category=fruits

# Solo productos destacados
curl http://localhost:3000/api/products?featured=true
```

### Ejemplo 2: Ver un Producto Específico

```bash
curl http://localhost:3000/api/products/[id-del-producto]
```

### Ejemplo 3: Obtener Usuario Actual (requiere autenticación)

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔍 Verificar que Todo Funciona

### ✅ Checklist de Verificación

1. **Frontend funcionando:**
   - [ ] Abrir http://localhost:3000
   - [ ] Ver la página de inicio
   - [ ] Navegar a "Productos"

2. **API Routes funcionando:**
   - [ ] Abrir http://localhost:3000/api/products
   - [ ] Deberías ver `{"data":[]}`

3. **Supabase conectado:**
   - [ ] Configurar `.env.local`
   - [ ] Refrescar la página
   - [ ] No debería haber errores en consola

---

## 🎯 Estructura de las APIs

### Endpoints Disponibles

```
📂 API Routes (Backend)

┣━ 🔐 /api/auth/me
┃   └─ GET - Obtener usuario actual
┃
┣━ 📦 /api/products
┃   ┣─ GET - Listar productos
┃   └─ POST - Crear producto (proveedor)
┃
┣━ 📦 /api/products/[id]
┃   ┣─ GET - Ver producto
┃   ┣─ PUT - Actualizar producto
┃   └─ DELETE - Eliminar producto
┃
┣━ 🛒 /api/cart
┃   ┣─ GET - Ver carrito
┃   ┣─ POST - Agregar al carrito
┃   └─ DELETE - Vaciar carrito
┃
┣━ 🛒 /api/cart/[itemId]
┃   ┣─ PUT - Actualizar cantidad
┃   └─ DELETE - Eliminar item
┃
┣━ 💰 /api/checkout
┃   └─ POST - Procesar compra
┃
┣━ 📋 /api/orders
┃   └─ GET - Listar mis órdenes
┃
┗━ 📋 /api/orders/[id]
    ┣─ GET - Ver orden
    └─ PUT - Actualizar estado
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Ejecutar build de producción
npm run start

# Linter
npm run lint
```

---

## 🐛 Troubleshooting

### Problema: "Error al obtener productos"

**Solución:**
1. Verifica que `.env.local` existe y tiene las credenciales correctas
2. Verifica que el script SQL se ejecutó en Supabase
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### Problema: Errores de TypeScript

Los errores de tipos son normales durante el desarrollo. Ejecuta:
```bash
npm run build
```
Si el build es exitoso, todo funciona correctamente.

### Problema: "Module not found"

```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Problema: Puerto 3000 ocupado

```bash
# Ejecutar en otro puerto
PORT=3001 npm run dev
```

---

## 📝 Flujo de Trabajo Recomendado

### Para Desarrollo Local:

1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Abre el navegador:**
   - Frontend: http://localhost:3000
   - Ver API: http://localhost:3000/api/products

3. **Edita el código:**
   - Los cambios se reflejan automáticamente (Hot Reload)

4. **Revisa logs:**
   - Errores del frontend: Consola del navegador (F12)
   - Errores del backend: Terminal donde corre `npm run dev`

---

## 🧪 Testing con Thunder Client (VSCode)

1. Instala la extensión "Thunder Client" en VSCode
2. Crea una nueva request
3. Prueba las APIs:

```
GET http://localhost:3000/api/products
GET http://localhost:3000/api/cart
POST http://localhost:3000/api/cart
```

---

## 📊 Monitoreo en Tiempo Real

### Ver Logs del Backend

Los `console.log()` en las API Routes aparecen en la terminal donde ejecutaste `npm run dev`.

### Ver Requests en Supabase

1. Ve a tu proyecto en Supabase
2. Abre **Logs > Query Performance**
3. Verás todas las consultas en tiempo real

---

## 🎉 ¡Todo Listo!

Ahora tienes:
- ✅ Frontend funcionando en http://localhost:3000
- ✅ Backend (API Routes) funcionando en las mismas rutas
- ✅ Base de datos conectada a Supabase
- ✅ Sistema completo operativo

### Próximos Pasos:

1. **Crear un usuario de prueba**
2. **Crear productos (como proveedor)**
3. **Probar el carrito (como cliente)**
4. **Realizar una compra de prueba**

---

**¿Necesitas ayuda?** Revisa `README_SETUP.md` para más detalles.
