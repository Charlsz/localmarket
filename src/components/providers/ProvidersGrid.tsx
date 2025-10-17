'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPinIcon, 
  CheckBadgeIcon,
  ShoppingBagIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid'
import { createClient } from '@/lib/supabase/client'

interface Provider {
  id: string
  business_name: string
  business_description: string | null
  business_address: string | null
  avatar_url: string | null
  is_verified: boolean
  product_count?: number
  avg_rating?: number
  categories?: string[]
}

export default function ProvidersGrid() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Obtener proveedores verificados desde Supabase
      const { data: providersData, error: providersError } = await supabase
        .from('profiles')
        .select('id, business_name, business_description, business_address, avatar_url, is_verified')
        .eq('role', 'provider')
        .eq('is_verified', true)
        .order('business_name')

      if (providersError) {
        console.error('Error fetching providers:', providersError)
        setError('Error al cargar los productores')
        return
      }

      if (!providersData || providersData.length === 0) {
        setProviders([])
        return
      }

      // Para cada proveedor, contar sus productos activos
      const providersWithCounts = await Promise.all(
        providersData.map(async (provider) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', provider.id)
            .eq('is_active', true)

          return {
            ...provider,
            product_count: count || 0,
          }
        })
      )

      setProviders(providersWithCounts)
    } catch (error) {
      console.error('Error fetching providers:', error)
      setError('Error al cargar los productores')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ShoppingBagIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {error}
        </h3>
        <p className="text-gray-600 mb-4">
          Hubo un problema al conectar con la base de datos
        </p>
        <button
          onClick={fetchProviders}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay productores disponibles
        </h3>
        <p className="text-gray-600">
          Pronto tendremos más productores locales disponibles
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  )
}

function ProviderCard({ provider }: { provider: Provider }) {
  const initials = provider.business_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <Link href={`/productores/${provider.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
        {/* Header con Avatar */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-xl shadow-lg">
                {provider.avatar_url ? (
                  <Image
                    src={provider.avatar_url}
                    alt={provider.business_name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  initials
                )}
              </div>
              {provider.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <CheckBadgeIconSolid className="h-5 w-5 text-blue-500" />
                </div>
              )}
            </div>

            {/* Nombre y Verificación */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg group-hover:underline">
                {provider.business_name}
              </h3>
              {provider.is_verified && (
                <span className="inline-flex items-center text-xs text-green-100 mt-1">
                  <CheckBadgeIcon className="h-4 w-4 mr-1" />
                  Verificado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {provider.business_description || 'Productor local de calidad'}
          </p>

          {/* Ubicación */}
          {provider.business_address && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{provider.business_address}</span>
            </div>
          )}

          {/* Categorías */}
          {provider.categories && provider.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {provider.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <ShoppingBagIcon className="h-4 w-4 mr-1" />
              <span>{provider.product_count || 0} productos</span>
            </div>
            {provider.avg_rating && (
              <div className="flex items-center text-sm text-gray-600">
                <StarIcon className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{provider.avg_rating}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Ver Productos
          </button>
        </div>
      </div>
    </Link>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="bg-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
