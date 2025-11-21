import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductForm from '@/components/products/ProductForm';
import { createServerSupabaseClient } from '@/lib/auth/server';
import type { ProductWithProvider } from '@/lib/types/database';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<ProductWithProvider | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('products_with_provider')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Producto no encontrado - LocalMarket',
    };
  }

  return {
    title: `Editar ${product.name} - LocalMarket`,
    description: `Editar producto ${product.name}`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Producto
          </h1>
          <p className="text-gray-600">
            Actualiza la información de tu producto
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm initialData={product} isEdit />
        </div>
      </div>
    </div>
  );
}
