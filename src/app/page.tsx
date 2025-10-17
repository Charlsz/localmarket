'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import { ChevronRightIcon, ShieldCheckIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { getCurrentUser } from '@/lib/auth/client'
import type { Profile } from '@/lib/types/database'

// Mock data for demonstration (no se usará si el usuario está autenticado)
const featuredProducts = [
  {
    id: '1',
    provider_id: 'provider1',
    name: 'Tomates cherry orgánicos',
    description: 'Tomates cherry cultivados de forma orgánica, perfectos para ensaladas',
    price: 4.50,
    category: 'vegetables' as const,
    unit: 'kg',
    stock: 25,
    image_url: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    provider_id: 'provider2',
    name: 'Queso artesanal de cabra',
    description: 'Queso cremoso de cabra elaborado artesanalmente en nuestra granja',
    price: 12.90,
    category: 'dairy' as const,
    unit: 'kg',
    stock: 8,
    image_url: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    provider_id: 'provider3',
    name: 'Miel de acacia pura',
    description: 'Miel 100% natural de flores de acacia, extraída sin aditivos',
    price: 8.75,
    category: 'honey' as const,
    unit: 'kg',
    stock: 15,
    image_url: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function Home() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthAndRedirect()
  }, [])

  const checkAuthAndRedirect = async () => {
    try {
      const { profile: userProfile } = await getCurrentUser()
      
      if (userProfile) {
        // Usuario autenticado - redirigir según rol
        if (userProfile.role === 'provider') {
          router.push('/dashboard/productos')
        } else {
          router.push('/productos')
        }
      } else {
        // No autenticado - mostrar landing page
        setProfile(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si hay perfil (usuario autenticado), no mostrar nada (está redirigiendo)
  if (profile) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Conectando productores locales con tu comunidad
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Descubre productos frescos, sostenibles y de proximidad directamente 
                de agricultores y artesanos locales. Apoya tu comunidad mientras 
                disfrutas de la mejor calidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/productos"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Explorar productos
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/como-funciona"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
                >
                  Cómo funciona
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-green-500 rounded-lg shadow-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    🌱 LocalMarket 🥕
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir LocalMarket?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conectamos directamente a productores locales con consumidores conscientes, 
              creando una comunidad más sostenible y saludable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Productos verificados
              </h3>
              <p className="text-gray-600">
                Todos nuestros productores son verificados para garantizar 
                la calidad y autenticidad de sus productos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Entrega rápida
              </h3>
              <p className="text-gray-600">
                Recibe tus productos frescos directamente del productor 
                en tiempo récord o recógelos en puntos locales.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comunidad local
              </h3>
              <p className="text-gray-600">
                Apoya a los productores de tu región y fortalece 
                la economía local mientras cuidas el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Productos destacados
              </h2>
              <p className="text-gray-600">
                Descubre los productos más populares de nuestra comunidad
              </p>
            </div>
            <Link
              href="/productos"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              Ver todos
              <ChevronRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Productores locales</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-green-100">Productos disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Clientes satisfechos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Eres productor local?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y lleva tus productos directamente 
            a miles de consumidores que valoran lo local y sostenible.
          </p>
          <Link
            href="/vendedor"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
          >
            Vende con nosotros
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}