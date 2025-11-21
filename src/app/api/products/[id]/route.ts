import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';

interface ProductOwnership {
  provider_id: string;
}

/**
 * GET /api/products/[id]
 * Obtiene un producto específico por ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('products_with_provider')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Actualiza un producto existente (solo el proveedor dueño)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el producto pertenece al usuario
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('provider_id')
      .eq('id', id)
      .single<ProductOwnership>();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (product.provider_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar este producto' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      stock,
      unit,
      image_url,
      images,
      is_featured,
      is_active
    } = body;

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = parseFloat(price);
    if (stock !== undefined) updates.stock = stock;
    if (unit !== undefined) updates.unit = unit;
    if (image_url !== undefined) updates.image_url = image_url;
    if (images !== undefined) updates.images = images;
    if (is_featured !== undefined) updates.is_featured = is_featured;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await (supabase
      .from('products') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Elimina un producto (solo el proveedor dueño)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el producto pertenece al usuario
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('provider_id')
      .eq('id', id)
      .single<ProductOwnership>();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (product.provider_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este producto' },
        { status: 403 }
      );
    }

    // En lugar de eliminar, marcamos como inactivo (soft delete)
    const { error } = await (supabase
      .from('products') as any)
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Producto eliminado correctamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
