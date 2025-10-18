import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid'
import ProductDetailClient from './ProductDetailClient'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// Función para obtener datos del producto desde la API
async function getProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, {
      cache: 'no-store' // Para desarrollo, en producción usar cache apropiado
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Error al cargar el producto')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Producto no encontrado - LocalMarket'
    }
  }

  return {
    title: `${product.name} - LocalMarket`,
    description: product.description || `Compra ${product.name} de productores locales en LocalMarket`,
    openGraph: {
      title: `${product.name} - LocalMarket`,
      description: product.description || `Producto fresco de productores locales`,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Mapeo de categorías
  const categoryMap: { [key: string]: string } = {
    'vegetables': 'Vegetales',
    'fruits': 'Frutas',
    'dairy': 'Lácteos',
    'meat': 'Carnes',
    'bakery': 'Panadería',
    'honey': 'Miel',
    'preserves': 'Conservas',
    'crafts': 'Artesanías',
    'other': 'Otros'
  }

  const displayCategory = categoryMap[product.category] || product.category

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navegación */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/productos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a productos
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg shadow-md overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 text-center">
                    <svg className="mx-auto h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-lg">Sin imagen</span>
                  </div>
                </div>
              )}
            </div>

            {/* Galería adicional si hay más imágenes */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image: string, index: number) => (
                  <div key={index} className="aspect-square relative bg-white rounded border overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Categoría y nombre */}
            <div>
              <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium mb-3">
                {displayCategory}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Información del proveedor */}
              <div className="flex items-center space-x-3 mb-4">
                <Link
                  href={`/productores/${product.provider_id}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {product.provider_business_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      {product.provider_business_name || 'Productor desconocido'}
                    </span>
                    {product.provider_verified && (
                      <div className="flex items-center text-xs text-blue-600">
                        <CheckBadgeIconSolid className="h-3 w-3 mr-1" />
                        Verificado
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Rating y reseñas */}
            {product.avg_rating && product.avg_rating > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIconSolid
                      key={star}
                      className={`h-5 w-5 ${
                        star <= product.avg_rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.avg_rating.toFixed(1)} ({product.review_count || 0} reseñas)
                </span>
              </div>
            )}

            {/* Precio y stock */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                  <span className="text-gray-500 ml-2">
                    / {product.unit}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                </div>
              </div>

              {/* Descripción */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Información del proveedor */}
              {product.provider_description && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Sobre el productor</h3>
                  <p className="text-gray-600 text-sm">
                    {product.provider_description}
                  </p>
                </div>
              )}

              {/* Componente cliente para el carrito */}
              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>

        {/* Productos relacionados o del mismo proveedor */}
        <div className="mt-12">
          <div className="text-center">
            <Link
              href={`/productores/${product.provider_id}`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Ver todos los productos de {product.provider_business_name}
              <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
