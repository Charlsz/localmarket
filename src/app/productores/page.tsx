'use client'

import { Suspense, useState } from 'react'
import ProvidersGrid from '@/components/providers/ProvidersGrid'
import { 
  UserGroupIcon,
  MapPinIcon,
  CheckBadgeIcon,
  SparklesIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function ProductoresPage() {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Nuestros Productores
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Conoce a las personas detrás de los productos que amas
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <UserGroupIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">150+</h3>
              <p className="text-gray-600 mt-1">Productores Activos</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <MapPinIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">25+</h3>
              <p className="text-gray-600 mt-1">Municipios</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckBadgeIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">100%</h3>
              <p className="text-gray-600 mt-1">Verificados</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-amber-100 rounded-full">
                  <SparklesIcon className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600 mt-1">Productos Frescos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Nuestros Productores
          </h2>
          <p className="text-lg text-gray-600">
            Conoce a las personas detrás de los productos que amas
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <ProvidersGrid searchTerm={searchTerm} />
        </Suspense>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Eres productor local?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y lleva tus productos a más clientes
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg">
            Registrarme como Productor
          </button>
        </div>
      </section>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  )
}
