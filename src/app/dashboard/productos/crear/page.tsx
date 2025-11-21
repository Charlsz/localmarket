import { Metadata } from 'next';
import ProductForm from '@/components/products/ProductForm';

export const metadata: Metadata = {
  title: 'Crear Producto - LocalMarket',
  description: 'Publica un nuevo producto en LocalMarket',
};

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Nuevo Producto
          </h1>
          <p className="text-gray-600">
            Completa el formulario para publicar tu producto
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
