'use client'

import { useState } from 'react'
import { ShoppingCartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/store/cart'
import { ProductWithProvider } from '@/lib/types/database'

interface ProductDetailClientProps {
  product: ProductWithProvider
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (product.stock === 0 || quantity > product.stock) return

    setIsAdding(true)

    try {
      // Obtener la primera imagen disponible
      const productImage = product.image_url || (product.images && product.images.length > 0 ? product.images[0] : null)

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage || '/placeholder-product.jpg',
        producer_id: product.provider_id,
        stock: product.stock
      }, quantity)

      // Mostrar feedback visual
      setQuantity(1) // Reset quantity after adding
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const totalPrice = product.price * quantity

  return (
    <div className="space-y-4">
      {/* Controles de cantidad */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Cantidad:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          (Disponible: {product.stock})
        </span>
      </div>

      {/* Precio total */}
      <div className="flex items-center justify-between py-2 border-t border-gray-200">
        <span className="text-lg font-semibold text-gray-900">Total:</span>
        <span className="text-2xl font-bold text-green-600">
          ${totalPrice.toLocaleString('es-CO')}
        </span>
      </div>

      {/* Botón agregar al carrito */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAdding}
        className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
          product.stock === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdding
            ? 'bg-green-500 text-white cursor-wait'
            : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5 mr-2" />
        {product.stock === 0
          ? 'Producto agotado'
          : isAdding
          ? 'Agregando...'
          : 'Agregar al carrito'
        }
      </button>

      {/* Mensaje de éxito temporal */}
      {isAdding && (
        <div className="text-center text-green-600 font-medium">
          ¡Producto agregado al carrito!
        </div>
      )}
    </div>
  )
}