import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';

/**
 * GET /api/products
 * Obtiene todos los productos activos o los productos del proveedor autenticado
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const myProducts = searchParams.get('myProducts') === 'true';
    const search = searchParams.get('search');

    const supabase = await createServerSupabaseClient();

    // Si se solicitan solo los productos del proveedor autenticado
    if (myProducts) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }

      let query = supabase
        .from('products')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return NextResponse.json({ data }, { status: 200 });
    }

    // Consulta pública de productos
    let query = supabase
      .from('products_with_provider')
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Crea un nuevo producto (solo proveedores)
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

    // Verificar que el usuario es un proveedor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'provider') {
      return NextResponse.json(
        { error: 'Solo los proveedores pueden crear productos' },
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
      is_featured
    } = body;

    // Validación básica
    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, category, price' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        provider_id: user.id,
        name,
        description,
        category,
        price: parseFloat(price),
        stock: stock || 0,
        unit: unit || 'unidad',
        image_url,
        images,
        is_featured: is_featured || false,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear producto' },
      { status: 500 }
    );
  }
}
