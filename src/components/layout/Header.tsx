'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import ShoppingCart from '@/components/cart/ShoppingCart'
import UserMenu from '@/components/auth/UserMenu'
import { getCurrentUser } from '@/lib/auth/client'
import type { Profile } from '@/lib/types/database'
import { 
  ShoppingCartIcon, 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Subscribirse correctamente al store del carrito
  const hasHydrated = useCartStore((state) => state._hasHydrated)
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    setMounted(true)
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      const { profile } = await getCurrentUser()
      setProfile(profile)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const isProvider = profile?.role === 'provider'
  const isClient = !loading && profile?.role === 'client'
  const isGuest = !loading && !profile
  const isAuthenticated = !loading && !!profile

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img 
                  src="/localmarketlogo.jpg" 
                  alt="LocalMarket Logo" 
                  className="w-10 h-10 rounded-full object-cover shadow-md"
                />
                <span className="text-xl font-bold text-gray-900 hidden sm:inline">LocalMarket</span>
              </Link>
            </div>

            {/* Navigation Links - Desktop - Centrado */}
            <nav className="hidden md:flex items-center justify-center flex-1 space-x-1">
              {mounted && !loading && profile ? (
                <>
                  {isProvider ? (
                    <>
                      <Link 
                        href="/dashboard/productos" 
                        className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                      >
                        Mis Productos
                      </Link>
                      <Link 
                        href="/dashboard/ordenes" 
                        className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                      >
                        Órdenes
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/productos" 
                        className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                      >
                        Productos
                      </Link>
                      <Link 
                        href="/productores" 
                        className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                      >
                        Productores
                      </Link>
                      <Link 
                        href="/mis-ordenes" 
                        className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                      >
                        Mis Órdenes
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    href="/productos" 
                    className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                  >
                    Productos
                  </Link>
                  <Link 
                    href="/productores" 
                    className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                  >
                    Productores
                  </Link>
                  <Link 
                    href="/como-funciona" 
                    className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                  >
                    Cómo funciona
                  </Link>
                </>
              )}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Cart - Solo para usuarios autenticados y que no sean proveedores */}
              {mounted && hasHydrated && !loading && isAuthenticated && !isProvider && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-md">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              <UserMenu />

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all ml-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menú de navegación"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {mounted && !loading && profile ? (
                <>
                  {isProvider ? (
                    <>
                      <Link 
                        href="/dashboard/productos" 
                        className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mis Productos
                      </Link>
                      <Link 
                        href="/dashboard/ordenes" 
                        className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Órdenes
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/productos" 
                        className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Productos
                      </Link>
                      <Link 
                        href="/productores" 
                        className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Productores
                      </Link>
                      <Link 
                        href="/mis-ordenes" 
                        className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mis Órdenes
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    href="/productos" 
                    className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Productos
                  </Link>
                  <Link 
                    href="/productores" 
                    className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Productores
                  </Link>
                  <Link 
                    href="/como-funciona" 
                    className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cómo funciona
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Shopping Cart Sidebar - Solo para clientes */}
      {mounted && hasHydrated && !loading && !isProvider && (
        <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  )
}