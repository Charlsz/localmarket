import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ShoppingBagIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid'
import ProductCard from '@/components/products/ProductCard'
import { ProductWithProvider } from '@/lib/types/database'

interface ProviderPageProps {
  params: Promise<{ id: string }>
}

interface ProviderData {
  id: string
  email: string
  full_name: string | null
  role: string
  phone: string | null
  avatar_url: string | null
  business_name: string | null
  business_description: string | null
  business_address: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
  products: ProductWithProvider[]
  stats: {
    total_products: number
    active_products: number
    avg_rating: number
    total_reviews: number
  }
}

// Función para obtener datos del proveedor desde la API
async function getProvider(id: string): Promise<ProviderData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/providers/${id}`, {
      cache: 'no-store' // Para desarrollo, en producción usar cache apropiado
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Error al cargar el proveedor')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching provider:', error)
    return null
  }
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { id } = await params
  const provider = await getProvider(id)

  if (!provider) {
    return {
      title: 'Productor no encontrado - LocalMarket'
    }
  }

  return {
    title: `${provider.business_name || 'Productor'} - LocalMarket`,
    description: provider.business_description || `Productos frescos de ${provider.business_name || 'nuestro productor local'}`,
    openGraph: {
      title: `${provider.business_name || 'Productor'} - LocalMarket`,
      description: provider.business_description || `Productos frescos de ${provider.business_name || 'nuestro productor local'}`,
      images: provider.avatar_url ? [provider.avatar_url] : [],
    },
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { id } = await params
  const provider = await getProvider(id)

  if (!provider) {
    notFound()
  }

  const initials = provider.business_name
    ? provider.business_name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navegación */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/productores"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a productores
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del proveedor */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-2xl shadow-lg">
                  {provider.avatar_url ? (
                    <Image
                      src={provider.avatar_url}
                      alt={provider.business_name || 'Productor'}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  ) : (
                    initials
                  )}
                </div>
                {provider.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                    <CheckBadgeIconSolid className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{provider.business_name}</h1>
                  {provider.is_verified && (
                    <span className="inline-flex items-center text-sm bg-white/20 text-white px-3 py-1 rounded-full">
                      <CheckBadgeIcon className="h-4 w-4 mr-1" />
                      Verificado
                    </span>
                  )}
                </div>

                {provider.business_description && (
                  <p className="text-green-100 text-lg mb-4 max-w-2xl">
                    {provider.business_description}
                  </p>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{provider.stats.total_products}</div>
                    <div className="text-green-100 text-sm">Productos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{provider.stats.avg_rating.toFixed(1)}</div>
                    <div className="text-green-100 text-sm">Calificación</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{provider.stats.total_reviews}</div>
                    <div className="text-green-100 text-sm">Reseñas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {provider.stats.avg_rating > 0 && (
                        <div className="flex items-center justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`h-4 w-4 ${
                                star <= provider.stats.avg_rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-green-100 text-sm">Estrellas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto y ubicación */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ubicación */}
              {provider.business_address && (
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ubicación</h3>
                    <p className="text-gray-600">{provider.business_address}</p>
                  </div>
                </div>
              )}

              {/* Contacto */}
              <div className="space-y-3">
                {provider.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Teléfono</h3>
                      <p className="text-gray-600">{provider.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{provider.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos del proveedor */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Productos de {provider.business_name}
            </h2>
            <div className="text-sm text-gray-600">
              {provider.stats.active_products} productos disponibles
            </div>
          </div>

          {provider.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {provider.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-600">
                Este productor aún no ha publicado productos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}