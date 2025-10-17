'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types/database'

// Mapeo de categorías de inglés a español
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

// Mock data for demonstration (fallback)
const mockProducts = [
  {
    id: '1',
    name: 'Tomates cherry orgánicos',
    description: 'Tomates cherry cultivados de forma orgánica, perfectos para ensaladas',
    price: 4.50,
    category: 'Verduras',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer1',
    stock: 25,
    rating_avg: 4.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Queso artesanal de cabra',
    description: 'Queso cremoso de cabra elaborado artesanalmente en nuestra granja',
    price: 12.90,
    category: 'Lácteos',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer2',
    stock: 8,
    rating_avg: 4.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Miel de acacia pura',
    description: 'Miel 100% natural de flores de acacia, extraída sin aditivos',
    price: 8.75,
    category: 'Endulzantes',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer3',
    stock: 15,
    rating_avg: 4.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Naranjas valencianas',
    description: 'Naranjas frescas directamente del huerto, ideales para zumo',
    price: 3.20,
    category: 'Frutas',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer4',
    stock: 0,
    rating_avg: 4.6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Pan artesanal integral',
    description: 'Pan integral elaborado con masa madre y harina ecológica',
    price: 6.80,
    category: 'Panadería',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer5',
    stock: 12,
    rating_avg: 4.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Aceite de oliva virgen extra',
    description: 'Aceite de oliva primera prensada en frío de olivos centenarios',
    price: 15.50,
    category: 'Condimentos',
    images: ['/api/placeholder/300/300'],
    producer_id: 'producer6',
    stock: 6,
    rating_avg: 4.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const categories = [
  'Todas las categorías',
  'Vegetales',
  'Frutas',
  'Lácteos',
  'Panadería',
  'Miel',
  'Artesanías',
  'Otros'
]

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Obtener productos activos desde Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (productsError) {
        console.error('Error fetching products:', productsError)
        setError('Error al cargar los productos')
        return
      }

      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const productCategory = categoryMap[product.category] || product.category
    const matchesCategory = selectedCategory === 'Todas las categorías' || 
                           productCategory === selectedCategory
    
    const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseFloat(priceRange.max))
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Productos Locales
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
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-white text-green-600 shadow-lg'
                      : 'bg-green-500 text-white hover:bg-green-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Additional Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio mínimo
              </label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo
              </label>
              <input
                type="number"
                placeholder="100"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: Menor a mayor</option>
                <option value="price-high">Precio: Mayor a menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {sortedProducts.length} productos
            {selectedCategory !== 'Todas las categorías' && ` en "${selectedCategory}"`}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros o el término de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('Todas las categorías')
                setPriceRange({ min: '', max: '' })
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}