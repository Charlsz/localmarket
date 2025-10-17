-- =====================================================
-- LocalMarket Database Schema
-- =====================================================
-- Ejecutar este script en el SQL Editor de Supabase
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Roles de usuario
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');

-- Estados de orden
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Estados de pago
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Categorías de productos (puedes expandir esto)
CREATE TYPE product_category AS ENUM (
  'vegetables',
  'fruits',
  'dairy',
  'meat',
  'bakery',
  'honey',
  'preserves',
  'crafts',
  'other'
);

-- =====================================================
-- TABLA: profiles
-- =====================================================
-- Extiende la tabla auth.users de Supabase
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'client',
  phone TEXT,
  avatar_url TEXT,
  
  -- Campos específicos para proveedores
  business_name TEXT,
  business_description TEXT,
  business_address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar búsquedas
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- =====================================================
-- TABLA: products
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Información básica del producto
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  
  -- Precio e inventario
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  unit TEXT DEFAULT 'unidad', -- kg, litro, unidad, etc.
  
  -- Imágenes
  image_url TEXT,
  images TEXT[], -- Array de URLs para múltiples imágenes
  
  -- Estado y destacados
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_products_provider ON products(provider_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- =====================================================
-- TABLA: carts
-- =====================================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Un carrito puede ser anónimo (sin user_id) o de un usuario registrado
  session_id TEXT, -- Para usuarios no autenticados
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: debe tener user_id O session_id
  CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- =====================================================
-- TABLA: cart_items
-- =====================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  
  -- Precio al momento de agregar (puede cambiar en el producto)
  price_snapshot DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un producto solo puede estar una vez en un carrito
  UNIQUE(cart_id, product_id)
);

-- Índices
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- =====================================================
-- TABLA: orders
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Número de orden legible (ej: ORD-20231015-001)
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Estado de la orden
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  
  -- Totales
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) DEFAULT 0 CHECK (tax >= 0),
  shipping_fee DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_fee >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  
  -- Información de envío
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  
  -- Notas
  notes TEXT,
  
  -- Información de pago (futura integración con Stripe)
  payment_intent_id TEXT, -- Stripe Payment Intent ID
  payment_method TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =====================================================
-- TABLA: order_items
-- =====================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Información del producto al momento de la compra
  product_name TEXT NOT NULL,
  product_description TEXT,
  product_image_url TEXT,
  
  -- Precio y cantidad
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_provider ON order_items(provider_id);

-- =====================================================
-- TABLA: reviews (opcional para MVP, preparado para futuro)
-- =====================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un usuario solo puede hacer una reseña por producto
  UNIQUE(product_id, user_id)
);

-- Índices
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas relevantes
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de orden único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 1;
  date_part TEXT := TO_CHAR(NOW(), 'YYYYMMDD');
BEGIN
  LOOP
    new_number := 'ORD-' || date_part || '-' || LPAD(counter::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_number);
    counter := counter + 1;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-generar order_number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Función para crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Si hay error, crear perfil mínimo
    INSERT INTO profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'client');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS: profiles
-- =====================================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Todos pueden ver perfiles de proveedores verificados (para mostrar información de la tienda)
CREATE POLICY "Public can view verified providers"
  ON profiles FOR SELECT
  USING (role = 'provider' AND is_verified = true);

-- =====================================================
-- POLÍTICAS RLS: products
-- =====================================================

-- Todos pueden ver productos activos
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Proveedores pueden ver todos sus productos
CREATE POLICY "Providers can view own products"
  ON products FOR SELECT
  USING (auth.uid() = provider_id);

-- Proveedores pueden crear productos
CREATE POLICY "Providers can create products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Proveedores pueden actualizar sus productos
CREATE POLICY "Providers can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = provider_id);

-- Proveedores pueden eliminar sus productos
CREATE POLICY "Providers can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = provider_id);

-- =====================================================
-- POLÍTICAS RLS: carts
-- =====================================================

-- Usuarios pueden ver su propio carrito
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios pueden crear su carrito
CREATE POLICY "Users can create own cart"
  ON carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar su carrito
CREATE POLICY "Users can update own cart"
  ON carts FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuarios pueden eliminar su carrito
CREATE POLICY "Users can delete own cart"
  ON carts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS: cart_items
-- =====================================================

-- Usuarios pueden ver items de su carrito
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- Usuarios pueden agregar items a su carrito
CREATE POLICY "Users can add items to own cart"
  ON cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- Usuarios pueden actualizar items de su carrito
CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- Usuarios pueden eliminar items de su carrito
CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS: orders
-- =====================================================

-- Usuarios pueden ver sus propias órdenes
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Proveedores pueden ver órdenes que contienen sus productos
CREATE POLICY "Providers can view orders with their products"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_items 
      WHERE order_items.order_id = orders.id 
      AND order_items.provider_id = auth.uid()
    )
  );

-- Usuarios pueden crear órdenes
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus órdenes (solo si están en pending)
CREATE POLICY "Users can update own pending orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- =====================================================
-- POLÍTICAS RLS: order_items
-- =====================================================

-- Usuarios pueden ver items de sus órdenes
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Proveedores pueden ver items de sus productos
CREATE POLICY "Providers can view own product order items"
  ON order_items FOR SELECT
  USING (auth.uid() = provider_id);

-- =====================================================
-- POLÍTICAS RLS: reviews
-- =====================================================

-- Todos pueden ver reseñas
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- Usuarios pueden crear reseñas para productos que compraron
CREATE POLICY "Users can create reviews for purchased products"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.product_id = reviews.product_id
      AND o.user_id = auth.uid()
      AND o.status = 'delivered'
    )
  );

-- Usuarios pueden actualizar sus propias reseñas
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuarios pueden eliminar sus propias reseñas
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de productos con información del proveedor
CREATE OR REPLACE VIEW products_with_provider AS
SELECT 
  p.*,
  pr.business_name as provider_business_name,
  pr.business_description as provider_description,
  pr.is_verified as provider_verified,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(DISTINCT r.id) as review_count
FROM products p
LEFT JOIN profiles pr ON p.provider_id = pr.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, pr.business_name, pr.business_description, pr.is_verified;

-- Vista de carritos con totales calculados
CREATE OR REPLACE VIEW carts_with_totals AS
SELECT 
  c.id,
  c.user_id,
  c.session_id,
  c.created_at,
  c.updated_at,
  COUNT(ci.id) as item_count,
  COALESCE(SUM(ci.quantity * ci.price_snapshot), 0) as total
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
GROUP BY c.id;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTADO)
-- =====================================================

-- Descomentar estas líneas si quieres datos de prueba

/*
-- Insertar un proveedor de ejemplo
INSERT INTO auth.users (id, email) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'provider@example.com');

INSERT INTO profiles (id, email, full_name, role, business_name, business_description, is_verified) VALUES
  ('11111111-1111-1111-1111-111111111111', 'provider@example.com', 'Juan Pérez', 'provider', 
   'Granja Pérez', 'Productos orgánicos frescos de nuestra granja familiar', true);

-- Insertar productos de ejemplo
INSERT INTO products (provider_id, name, description, category, price, stock, image_url, is_active, is_featured) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Tomates Orgánicos', 'Tomates frescos cultivados sin pesticidas', 'vegetables', 3.50, 100, '/images/tomatoes.jpg', true, true),
  ('11111111-1111-1111-1111-111111111111', 'Miel de Abeja', 'Miel pura de flores silvestres', 'honey', 8.99, 50, '/images/honey.jpg', true, true),
  ('11111111-1111-1111-1111-111111111111', 'Pan Artesanal', 'Pan de masa madre hecho a mano', 'bakery', 4.50, 30, '/images/bread.jpg', true, false);
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Para verificar que todo se creó correctamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
