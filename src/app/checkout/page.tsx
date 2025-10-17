'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { getCurrentUser } from '@/lib/auth/client'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/auth/AuthModal'
import Image from 'next/image'
import { 
  CreditCardIcon, 
  TruckIcon, 
  MapPinIcon,
  PhoneIcon,
  UserIcon 
} from '@heroicons/react/24/outline'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getTotalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    deliveryMethod: 'home_delivery', // home_delivery o pickup
    paymentMethod: 'card', // Todos serán exitosos por ahora
    notes: ''
  })

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const { user, profile: userProfile } = await getCurrentUser()
      
      if (!user || !userProfile) {
        setShowAuthModal(true)
        setCheckingAuth(false)
        return
      }

      setProfile(userProfile)
      
      // Pre-llenar datos del perfil
      setFormData(prev => ({
        ...prev,
        shippingName: userProfile.full_name || '',
        shippingPhone: userProfile.phone || '',
        shippingAddress: userProfile.address_street || '',
        shippingCity: userProfile.address_city || '',
        shippingPostalCode: userProfile.address_postal_code || ''
      }))
      
      setCheckingAuth(false)
    } catch (error) {
      console.error('Error checking authentication:', error)
      setShowAuthModal(true)
      setCheckingAuth(false)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    checkAuthentication()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const subtotal = getTotalPrice()
  const shippingFee = formData.deliveryMethod === 'home_delivery' ? 2500 : 0
  const tax = subtotal * 0.13 // 13% IVA
  const total = subtotal + shippingFee + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile) {
      setShowAuthModal(true)
      return
    }

    if (items.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Crear la orden principal
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: profile.id,
          status: 'pending',
          payment_status: 'completed', // Todos los pagos son exitosos por ahora
          subtotal: subtotal,
          tax: tax,
          shipping_fee: shippingFee,
          total: total,
          shipping_name: formData.shippingName,
          shipping_phone: formData.shippingPhone,
          shipping_address: formData.shippingAddress,
          shipping_city: formData.shippingCity,
          shipping_postal_code: formData.shippingPostalCode,
          notes: formData.notes || null,
          payment_method: formData.paymentMethod
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        console.error('Order error details:', JSON.stringify(orderError, null, 2))
        throw new Error(`Error al crear la orden: ${orderError.message || JSON.stringify(orderError)}`)
      }

      // Crear los items de la orden
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        provider_id: item.producer_id,
        product_name: item.name,
        product_image_url: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        console.error('Order items error details:', JSON.stringify(itemsError, null, 2))
        throw new Error(`Error al crear los items de la orden: ${itemsError.message || JSON.stringify(itemsError)}`)
      }

      // Actualizar el stock de los productos
      for (const item of items) {
        // Primero obtener el stock actual
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single()

        if (product) {
          const { error: stockError } = await supabase
            .from('products')
            .update({ 
              stock: product.stock - item.quantity
            })
            .eq('id', item.id)

          if (stockError) {
            console.error('Error updating stock:', stockError)
          }
        }
      }

      // Limpiar el carrito
      clearCart()

      // Redirigir a la página de confirmación
      router.push(`/mis-ordenes?success=true&orderId=${order.id}`)
    } catch (error: any) {
      console.error('Error processing order:', error)
      alert(error.message || 'Error al procesar la orden. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega productos para continuar con la compra</p>
          <button
            onClick={() => router.push('/productos')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de Checkout */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información de Envío */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="h-6 w-6 text-green-600 mr-2" />
                    Información de Envío
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.shippingName}
                          onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Juan Pérez"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={formData.shippingPhone}
                          onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="8888-8888"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={formData.shippingPostalCode}
                        onChange={(e) => setFormData({ ...formData, shippingPostalCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="10101"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Calle, número, apartamento"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shippingCity}
                        onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="San José"
                      />
                    </div>
                  </div>
                </div>

                {/* Método de Entrega */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <TruckIcon className="h-6 w-6 text-green-600 mr-2" />
                    Método de Entrega
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="home_delivery"
                        checked={formData.deliveryMethod === 'home_delivery'}
                        onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                        className="h-4 w-4 text-green-600 focus:ring-green-600"
                      />
                      <div className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900">
                          Entrega a domicilio
                        </span>
                        <span className="block text-sm text-gray-500">
                          Recibe en tu casa - {formatPrice(2500)}
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={formData.deliveryMethod === 'pickup'}
                        onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                        className="h-4 w-4 text-green-600 focus:ring-green-600"
                      />
                      <div className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900">
                          Recoger en punto local
                        </span>
                        <span className="block text-sm text-gray-500">
                          Coordinar con el productor - Gratis
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Método de Pago */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCardIcon className="h-6 w-6 text-green-600 mr-2" />
                    Método de Pago
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="h-4 w-4 text-green-600 focus:ring-green-600"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">
                          Tarjeta de Crédito/Débito
                        </span>
                        <span className="block text-sm text-gray-500">
                          Pago seguro (Modo de prueba)
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="h-4 w-4 text-green-600 focus:ring-green-600"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">
                          Efectivo contra entrega
                        </span>
                        <span className="block text-sm text-gray-500">
                          Paga al recibir tu pedido
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notas adicionales */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Notas Adicionales (Opcional)
                  </h2>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </form>
            </div>

            {/* Resumen de la Orden */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Resumen de la Orden
                </h2>

                {/* Productos */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium text-gray-900">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (13%)</span>
                    <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-semibold text-green-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Al confirmar, aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Autenticación */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => router.push('/')}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  )
}
