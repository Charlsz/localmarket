'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/store/cart'
import { getCurrentUser } from '@/lib/auth/client'
import { Product } from '@/lib/types/database'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { user } = await getCurrentUser()
    setIsAuthenticated(!!user)
  }

  // Obtener la primera imagen disponible
  const productImage = product.image_url || (product.images && product.images.length > 0 ? product.images[0] : null)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Redirigir a login
      router.push('/login?redirect=/productos')
      return
    }
    
    if (product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage || '/placeholder-product.jpg',
        producer_id: product.provider_id,
        stock: product.stock
      })
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        )
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
        )
      }
    }
    return stars
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
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
    <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
      featured ? 'ring-2 ring-green-500' : ''
    }`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
          Destacado
        </div>
      )}

      {/* Stock Badge */}
      {product.stock === 0 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
          Agotado
        </div>
      )}

      <Link href={`/productos/${product.id}`}>
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {!imageError && productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-gray-400 text-center">
                <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Sin imagen</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-2">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              {displayCategory}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description || 'Sin descripción'}
          </p>

          {/* Price and Unit */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                / {product.unit}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Stock: {product.stock}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
          }`}
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}