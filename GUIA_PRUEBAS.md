# 🧪 Guía de Pruebas del MVP - LocalMarket

## ⚠️ IMPORTANTE: Configuración Previa

Antes de probar, asegúrate de:

1. ✅ Tener el servidor corriendo: `npm run dev`
2. ✅ Tener Supabase configurado con el script SQL ejecutado
3. ✅ Tener `.env.local` con tus credenciales de Supabase

**Si NO tienes `.env.local` configurado:**
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
```

---

## 📋 Plan de Pruebas Completo

### Fase 1️⃣: Verificación del Frontend Base

#### ✅ Test 1: Página de Inicio
```
URL: http://localhost:3000
```

**Qué verificar:**
- [ ] La página carga sin errores
- [ ] Se ve el Header con logo "LocalMarket"
- [ ] Hay un botón de usuario/login en la esquina superior derecha
- [ ] Se ve la sección Hero principal
- [ ] Hay productos destacados (si los hay en la BD)
- [ ] El Footer se muestra correctamente

**Errores esperados (si no hay .env.local):**
- "Error al cargar productos"
- Esto es NORMAL si aún no configuraste Supabase

---

#### ✅ Test 2: Página de Productos
```
URL: http://localhost:3000/productos/
```

**Qué verificar:**
- [ ] Se muestra el catálogo de productos
- [ ] Hay barra de búsqueda
- [ ] Hay filtros por categoría
- [ ] Los productos se muestran en cards (si hay en BD)
- [ ] Cada card tiene imagen, nombre, precio
- [ ] Botón "Agregar al carrito" visible

**Acción:**
- Intenta usar los filtros de categoría
- Usa la barra de búsqueda

---

#### ✅ Test 3: Página "Cómo Funciona"
```
URL: http://localhost:3000/como-funciona/
```

**Qué verificar:**
- [ ] La página carga correctamente
- [ ] Se muestra información sobre el proceso
- [ ] Hay pasos explicados visualmente
- [ ] Links funcionan correctamente

---

### Fase 2️⃣: Pruebas de las API Routes (Backend)

#### ✅ Test 4: API de Productos (Pública)
```
URL: http://localhost:3000/api/products
```

**Método: GET (abre en el navegador)**

**Respuesta esperada SI está configurado Supabase:**
```json
{
  "data": []  // o array con productos si ya creaste algunos
}
```

**Respuesta esperada SI NO está configurado:**
```json
{
  "error": "algún mensaje de error"
}
```

**Pruebas adicionales:**
- `http://localhost:3000/api/products?category=fruits`
- `http://localhost:3000/api/products?featured=true`

---

#### ✅ Test 5: API de Usuario Actual
```
URL: http://localhost:3000/api/auth/me
```

**Método: GET (abre en el navegador)**

**Respuesta esperada SIN autenticación:**
```json
{
  "error": "No autenticado"
}
```

**Esto es CORRECTO.** Aún no has iniciado sesión.

---

#### ✅ Test 6: API de Carrito
```
URL: http://localhost:3000/api/cart
```

**Método: GET**

**Respuesta esperada:**
```json
{
  "error": "No autorizado"
}
```

**Esto es CORRECTO.** Necesitas estar autenticado.

---

### Fase 3️⃣: Pruebas con Thunder Client / Postman

Si tienes Thunder Client en VSCode o Postman:

#### Test 7: Crear un Producto (requiere auth)

```http
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Tomate Orgánico",
  "description": "Tomates frescos de la huerta",
  "category": "vegetables",
  "price": 3.50,
  "stock": 100,
  "unit": "kg",
  "image_url": "https://via.placeholder.com/300",
  "is_featured": true
}
```

**Respuesta esperada:**
```json
{
  "error": "No autorizado"
}
```

**Esto es correcto** porque necesitas estar autenticado como proveedor.

---

### Fase 4️⃣: Pruebas de Componentes UI

#### ✅ Test 8: Carrito de Compras

**Abrir el carrito:**
- Click en el ícono del carrito (esquina superior derecha)
- Debe abrirse un panel lateral

**Qué verificar:**
- [ ] El panel se desliza desde la derecha
- [ ] Muestra "Tu carrito está vacío" (si no hay productos)
- [ ] Tiene botón de cerrar (X)
- [ ] Tiene sección de totales
- [ ] Botón "Proceder al checkout" (deshabilitado si vacío)

**Cerrar el carrito:**
- Click en X o fuera del panel
- Debe cerrarse suavemente

---

#### ✅ Test 9: Header Responsivo

**Prueba en diferentes tamaños:**

1. **Desktop (pantalla grande):**
   - [ ] Logo visible a la izquierda
   - [ ] Menú de navegación visible
   - [ ] Carrito e ícono de usuario visibles

2. **Mobile (pantalla pequeña):**
   - [ ] Logo visible
   - [ ] Botón de menú hamburguesa visible
   - [ ] Click en hamburguesa abre menú
   - [ ] Carrito e ícono de usuario visibles

**Cómo probar:**
- Abre DevTools (F12)
- Click en "Toggle device toolbar"
- Prueba diferentes tamaños

---

### Fase 5️⃣: Flujo Completo (Con Supabase Configurado)

#### ✅ Test 10: Registro de Usuario

**NOTA:** Solo funciona si tienes Supabase configurado.

**Pasos:**
1. Click en ícono de usuario (Header)
2. Se abre modal de login
3. Click en "Registrarse"
4. Selecciona "Cliente" o "Proveedor"
5. Completa el formulario:
   - Email
   - Contraseña
   - Nombre completo
   - (Nombre del negocio si es proveedor)
6. Click en "Registrarse"

**Qué verificar:**
- [ ] Modal se abre correctamente
- [ ] Selector de rol funciona
- [ ] Formularios validan campos
- [ ] Mensajes de error claros
- [ ] Al registrarse exitosamente, modal se cierra
- [ ] Usuario aparece logueado en Header

---

#### ✅ Test 11: Iniciar Sesión

**Pasos:**
1. Click en ícono de usuario
2. Ingresa email y contraseña
3. Click en "Iniciar Sesión"

**Qué verificar:**
- [ ] Login exitoso
- [ ] Modal se cierra
- [ ] Header muestra tu avatar/inicial
- [ ] Puedes ver tu perfil

---

#### ✅ Test 12: Menú de Usuario (UserMenu)

**Pasos:**
1. Estando logueado, click en tu avatar (Header)
2. Se abre dropdown

**Qué verificar para CLIENTE:**
- [ ] Muestra tu nombre
- [ ] Muestra rol "Cliente"
- [ ] Opción "Mis Pedidos"
- [ ] Opción "Configuración"
- [ ] Opción "Cerrar Sesión"

**Qué verificar para PROVEEDOR:**
- [ ] Muestra tu nombre
- [ ] Muestra rol "Proveedor"
- [ ] Muestra nombre del negocio
- [ ] Opción "Mi Dashboard"
- [ ] Opción "Mis Productos"
- [ ] Opción "Configuración"
- [ ] Opción "Cerrar Sesión"

---

#### ✅ Test 13: Crear Producto (Como Proveedor)

**Requisitos:**
- Estar logueado como PROVEEDOR
- Tener Supabase configurado

**Usando Thunder Client / Postman:**

```http
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer TU_TOKEN_SUPABASE

{
  "name": "Manzanas Rojas",
  "description": "Manzanas frescas de la región",
  "category": "fruits",
  "price": 4.99,
  "stock": 50,
  "unit": "kg",
  "is_featured": true
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "id": "uuid-generado",
    "name": "Manzanas Rojas",
    ...
  }
}
```

---

#### ✅ Test 14: Agregar Producto al Carrito

**Requisitos:**
- Estar logueado como CLIENTE
- Tener productos en la BD

**Pasos:**
1. Ve a `/productos/`
2. Click en "Agregar al carrito" en cualquier producto
3. Abre el carrito (click en ícono)

**Qué verificar:**
- [ ] Producto aparece en el carrito
- [ ] Muestra imagen, nombre, precio
- [ ] Puedes cambiar cantidad (+/-)
- [ ] Total se calcula correctamente
- [ ] Puedes eliminar el producto
- [ ] Botón "Proceder al checkout" se habilita

---

#### ✅ Test 15: Proceso de Checkout

**Requisitos:**
- Tener productos en el carrito
- Estar logueado

**Pasos:**
1. Abre el carrito
2. Click en "Proceder al checkout"
3. Completa formulario de envío:
   - Nombre completo
   - Teléfono
   - Dirección
   - Ciudad
   - Código postal
4. Click en "Confirmar Orden"

**Qué verificar:**
- [ ] Formulario valida campos requeridos
- [ ] Muestra resumen de la orden
- [ ] Muestra total correcto
- [ ] Orden se crea exitosamente
- [ ] Carrito se vacía
- [ ] Redirecciona o muestra confirmación

---

#### ✅ Test 16: Ver Mis Órdenes

**Pasos:**
1. Click en avatar (Header)
2. Click en "Mis Pedidos"
3. O navega a la ruta de órdenes

**Qué verificar:**
- [ ] Se muestran tus órdenes
- [ ] Cada orden muestra:
  - Número de orden
  - Fecha
  - Total
  - Estado
  - Productos

---

### Fase 6️⃣: Verificación de Seguridad (RLS)

#### ✅ Test 17: Intentar Acceder a Recursos Protegidos

**Sin autenticación, intenta:**

```
GET http://localhost:3000/api/cart
```
**Debe retornar:** `{"error": "No autorizado"}`

```
POST http://localhost:3000/api/products
```
**Debe retornar:** `{"error": "No autorizado"}`

**Como CLIENTE, intenta crear un producto:**
**Debe retornar:** `{"error": "Solo los proveedores pueden crear productos"}`

---

## 🐛 Problemas Comunes y Soluciones

### Error: "No se pueden cargar productos"

**Causa:** Supabase no está configurado o el script SQL no se ejecutó.

**Solución:**
1. Verifica `.env.local`
2. Ejecuta el script SQL en Supabase
3. Reinicia el servidor

---

### Error: "No autorizado" en todas las peticiones

**Causa:** No estás autenticado o el token expiró.

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Intenta de nuevo

---

### El carrito no guarda productos

**Causa:** Problema con autenticación o base de datos.

**Solución:**
1. Verifica que estás logueado
2. Abre consola del navegador (F12)
3. Revisa errores en la pestaña Console
4. Revisa Network para ver las peticiones

---

## 📊 Checklist Final de Funcionalidades

### Frontend ✅
- [ ] Página de inicio carga
- [ ] Catálogo de productos funciona
- [ ] Carrito se abre y cierra
- [ ] Header responsivo
- [ ] Footer visible

### Autenticación ✅
- [ ] Registro de cliente funciona
- [ ] Registro de proveedor funciona
- [ ] Login funciona
- [ ] UserMenu se muestra correctamente
- [ ] Logout funciona

### Productos ✅
- [ ] Listar productos públicos
- [ ] Ver detalle de producto
- [ ] Crear producto (proveedor)
- [ ] Editar producto (proveedor)
- [ ] Eliminar producto (proveedor)

### Carrito ✅
- [ ] Agregar productos al carrito
- [ ] Actualizar cantidad
- [ ] Eliminar productos del carrito
- [ ] Ver total calculado
- [ ] Vaciar carrito

### Checkout ✅
- [ ] Formulario de envío
- [ ] Validación de datos
- [ ] Creación de orden
- [ ] Confirmación de orden

### Órdenes ✅
- [ ] Ver mis órdenes
- [ ] Ver detalle de orden
- [ ] Estados de orden correctos

---

## 🎯 Siguiente Nivel: Pruebas Avanzadas

Una vez que todo lo anterior funciona:

1. **Prueba el RLS de Supabase**
   - Intenta editar producto de otro proveedor (debe fallar)
   - Intenta ver carrito de otro usuario (debe fallar)

2. **Prueba casos límite**
   - Intenta agregar más productos que el stock disponible
   - Intenta checkout con carrito vacío
   - Intenta crear producto sin campos requeridos

3. **Prueba rendimiento**
   - Agrega muchos productos al carrito
   - Crea varias órdenes
   - Verifica que las consultas son rápidas

---

## 📝 Reportar Problemas

Si encuentras algún error, anota:
1. ¿Qué estabas haciendo?
2. ¿Qué esperabas que pasara?
3. ¿Qué pasó en realidad?
4. Captura de pantalla (si aplica)
5. Mensaje de error en consola (F12)

---

**¡Feliz Testing!** 🚀

Recuerda que este es un MVP, algunas funcionalidades pueden requerir pulido adicional.
