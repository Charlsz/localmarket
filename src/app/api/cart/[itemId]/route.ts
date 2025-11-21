import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';

/**
 * PUT /api/cart/[itemId]
 * Actualiza la cantidad de un item del carrito
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Verificar que el item pertenece al usuario
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('*, cart:carts!inner(user_id), product:products!inner(stock)')
      .eq('id', itemId)
      .single() as { data: any };

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      );
    }

    // TypeScript assertion to fix type issues
    const cart = cartItem.cart as any;
    const product = cartItem.product as any;

    if (cart.user_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este item' },
        { status: 403 }
      );
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase
      .from('cart_items') as any)
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/[itemId]
 * Elimina un item del carrito
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el item pertenece al usuario
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('*, cart:carts!inner(user_id)')
      .eq('id', itemId)
      .single() as { data: any };

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      );
    }

    const cart = cartItem.cart as any;

    if (cart.user_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este item' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Item eliminado correctamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar item' },
      { status: 500 }
    );
  }
}
