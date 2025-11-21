import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';

/**
 * GET /api/cart
 * Obtiene el carrito del usuario autenticado con sus items
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener o crear carrito para el usuario
    let { data: cart } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single() as { data: any };

    if (!cart) {
      // Crear carrito si no existe
      const { data: newCart, error: createError } = await (supabase
        .from('carts') as any)
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) throw createError;
      cart = newCart;
    }

    // Obtener items del carrito con información de productos
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (*)
      `)
      .eq('cart_id', cart!.id);

    if (itemsError) throw itemsError;

    // Calcular total
    const total = items?.reduce((sum, item: any) => {
      return sum + (item.quantity * item.price_snapshot);
    }, 0) || 0;

    return NextResponse.json({
      data: {
        cart,
        items: items || [],
        total
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener carrito' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Agrega un producto al carrito
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
    const { product_id, quantity = 1 } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id es requerido' },
        { status: 400 }
      );
    }

    // Obtener o crear carrito
    let { data: cart } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single() as { data: any };

    if (!cart) {
      const { data: newCart, error: createError } = await (supabase
        .from('carts') as any)
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) throw createError;
      cart = newCart;
    }

    // Obtener el producto para su precio actual
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price, stock')
      .eq('id', product_id)
      .single() as { data: any; error: any };

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      );
    }

    // Verificar si el producto ya está en el carrito
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart!.id)
      .eq('product_id', product_id)
      .single() as { data: any };

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: 'Stock insuficiente' },
          { status: 400 }
        );
      }

      const { data, error } = await (supabase
        .from('cart_items') as any)
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ data }, { status: 200 });
    } else {
      // Agregar nuevo item
      const { data, error} = await (supabase
        .from('cart_items') as any)
        .insert({
          cart_id: cart!.id,
          product_id,
          quantity,
          price_snapshot: product.price,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ data }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: error.message || 'Error al agregar al carrito' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Vacía el carrito del usuario
 */
export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single() as { data: any };

    if (!cart) {
      return NextResponse.json(
        { message: 'Carrito vacío' },
        { status: 200 }
      );
    }

    // Eliminar todos los items del carrito
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart!.id);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Carrito vaciado correctamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: error.message || 'Error al vaciar carrito' },
      { status: 500 }
    );
  }
}
