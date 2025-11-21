import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';

/**
 * POST /api/checkout
 * Crea una orden desde el carrito actual
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      notes,
    } = body;

    // Validar campos requeridos
    if (!shipping_name || !shipping_phone || !shipping_address) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: shipping_name, shipping_phone, shipping_address' },
        { status: 400 }
      );
    }

    // Obtener el carrito del usuario
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single() as { data: any };

    if (!cart) {
      return NextResponse.json(
        { error: 'No tienes un carrito activo' },
        { status: 404 }
      );
    }

    // Obtener items del carrito con información de productos
    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products!inner (*)
      `)
      .eq('cart_id', cart!.id) as { data: any[] | null; error: any };

    if (itemsError) throw itemsError;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Tu carrito está vacío' },
        { status: 400 }
      );
    }

    // Validar stock de todos los productos
    for (const item of cartItems) {
      const product = item.product as any;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Calcular totales
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.price_snapshot);
    }, 0);

    const tax = subtotal * 0.0; // 0% de impuesto por ahora
    const shipping_fee = 0; // Envío gratis por ahora
    const total = subtotal + tax + shipping_fee;

    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Crear la orden
    const { data: order, error: orderError } = await (supabase
      .from('orders') as any)
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        subtotal,
        tax,
        shipping_fee,
        total,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        notes,
        status: 'pending',
        payment_status: 'completed',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Crear items de la orden y actualizar stock
    const orderItems: any[] = [];
    for (const item of cartItems) {
      const product = item.product as any;
      
      const { data: orderItem, error: orderItemError } = await (supabase
        .from('order_items') as any)
        .insert({
          order_id: order.id,
          product_id: product.id,
          provider_id: product.provider_id,
          product_name: product.name,
          product_description: product.description,
          product_image_url: product.image_url,
          quantity: item.quantity,
          unit_price: item.price_snapshot,
          subtotal: item.quantity * item.price_snapshot,
        })
        .select()
        .single();

      if (orderItemError) throw orderItemError;
      orderItems.push(orderItem);

      // Actualizar stock del producto
      const newStock = product.stock - item.quantity;
      const { error: stockError } = await (supabase
        .from('products') as any)
        .update({ stock: newStock })
        .eq('id', product.id);

      if (stockError) throw stockError;
    }

    // Vaciar el carrito
    const { error: clearCartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart!.id);

    if (clearCartError) throw clearCartError;

    // Retornar la orden completa con sus items
    return NextResponse.json({
      data: {
        ...order,
        items: orderItems,
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear la orden' },
      { status: 500 }
    );
  }
}
