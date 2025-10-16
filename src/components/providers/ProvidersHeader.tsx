'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function ProvidersHeader() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'vegetables', name: 'Vegetales' },
    { id: 'fruits', name: 'Frutas' },
    { id: 'dairy', name: 'Lácteos' },
    { id: 'meat', name: 'Carnes' },
    { id: 'bakery', name: 'Panadería' },
    { id: 'honey', name: 'Miel' },
    { id: 'crafts', name: 'Artesanías' },
  ]

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Productores Locales
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Conecta directamente con agricultores, artesanos y productores de tu región
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mt-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación o tipo de producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white text-green-600 shadow-lg'
                    : 'bg-green-500 text-white hover:bg-green-400'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
