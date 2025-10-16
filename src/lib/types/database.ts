// =====================================================
// LocalMarket Database Types
// Generated from database/schema.sql
// =====================================================

export type UserRole = 'client' | 'provider' | 'admin';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ProductCategory = 
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'honey'
  | 'preserves'
  | 'crafts'
  | 'other';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          phone: string | null;
          avatar_url: string | null;
          business_name: string | null;
          business_description: string | null;
          business_address: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          business_name?: string | null;
          business_description?: string | null;
          business_address?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          business_name?: string | null;
          business_description?: string | null;
          business_address?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          description: string | null;
          category: ProductCategory;
          price: number;
          stock: number;
          unit: string;
          image_url: string | null;
          images: string[] | null;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          name: string;
          description?: string | null;
          category: ProductCategory;
          price: number;
          stock?: number;
          unit?: string;
          image_url?: string | null;
          images?: string[] | null;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          name?: string;
          description?: string | null;
          category?: ProductCategory;
          price?: number;
          stock?: number;
          unit?: string;
          image_url?: string | null;
          images?: string[] | null;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          price_snapshot: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          price_snapshot: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          price_snapshot?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          subtotal: number;
          tax: number;
          shipping_fee: number;
          total: number;
          shipping_name: string;
          shipping_phone: string;
          shipping_address: string;
          shipping_city: string | null;
          shipping_postal_code: string | null;
          notes: string | null;
          payment_intent_id: string | null;
          payment_method: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          subtotal: number;
          tax?: number;
          shipping_fee?: number;
          total: number;
          shipping_name: string;
          shipping_phone: string;
          shipping_address: string;
          shipping_city?: string | null;
          shipping_postal_code?: string | null;
          notes?: string | null;
          payment_intent_id?: string | null;
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          subtotal?: number;
          tax?: number;
          shipping_fee?: number;
          total?: number;
          shipping_name?: string;
          shipping_phone?: string;
          shipping_address?: string;
          shipping_city?: string | null;
          shipping_postal_code?: string | null;
          notes?: string | null;
          payment_intent_id?: string | null;
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          provider_id: string;
          product_name: string;
          product_description: string | null;
          product_image_url: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          provider_id: string;
          product_name: string;
          product_description?: string | null;
          product_image_url?: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          provider_id?: string;
          product_name?: string;
          product_description?: string | null;
          product_image_url?: string | null;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          order_id?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          order_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      products_with_provider: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          description: string | null;
          category: ProductCategory;
          price: number;
          stock: number;
          unit: string;
          image_url: string | null;
          images: string[] | null;
          is_active: boolean;
          is_featured: boolean;
          provider_business_name: string | null;
          provider_description: string | null;
          provider_verified: boolean;
          avg_rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      carts_with_totals: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
          updated_at: string;
          item_count: number;
          total: number;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductWithProvider = Database['public']['Views']['products_with_provider']['Row'];
export type Cart = Database['public']['Tables']['carts']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type CartWithTotals = Database['public']['Views']['carts_with_totals']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];

export interface ProductWithDetails extends Product {
  provider?: {
    business_name: string | null;
    business_description: string | null;
    is_verified: boolean;
  };
  avg_rating?: number;
  review_count?: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
