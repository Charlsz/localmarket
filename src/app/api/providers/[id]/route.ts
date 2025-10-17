import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server';
import { ProductWithProvider } from '@/lib/types/database';

/**
 * GET /api/providers/[id]
 * Obtiene información de un proveedor específico con sus productos
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Obtener información del proveedor
    const { data: provider, error: providerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'provider')
      .single();

    if (providerError) {
      if (providerError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proveedor no encontrado' },
          { status: 404 }
        );
      }
      throw providerError;
    }

    if (!provider) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      );
    }

    // Obtener productos del proveedor
    const { data: products, error: productsError } = await supabase
      .from('products_with_provider')
      .select('*')
      .eq('provider_id', id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching provider products:', productsError);
      // No fallar si no se pueden obtener productos, devolver proveedor sin productos
    }

    // Calcular estadísticas del proveedor
    const productList: ProductWithProvider[] = products || [];
    const stats = {
      total_products: productList.length,
      active_products: productList.filter(p => p.is_active).length,
      avg_rating: productList.length > 0
        ? productList.reduce((sum, p) => sum + (p.avg_rating || 0), 0) / productList.length
        : 0,
      total_reviews: productList.reduce((sum, p) => sum + (p.review_count || 0), 0)
    };

    return NextResponse.json({
      data: {
        ...(provider as any),
        products: productList,
        stats
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener proveedor' },
      { status: 500 }
    );
  }
}