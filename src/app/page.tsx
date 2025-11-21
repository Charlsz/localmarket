'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SEOHead from '@/components/SEOHead'
import Hero from '@/components/home/Hero'
import Benefits from '@/components/home/Benefits'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import HowItWorks from '@/components/home/HowItWorks'
import CallToAction from '@/components/home/CallToAction'
import { getCurrentUser } from '@/lib/auth/client'
import type { Profile } from '@/lib/types/database'

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
      <SEOHead 
        title="LocalMarket - Productos Locales Directamente a tu Casa"
        description="Conectamos productores locales con consumidores. Productos frescos, sostenibles y de calidad directamente de tu comunidad."
        keywords="productos locales, mercado local, productores locales, comida fresca, agricultura local, comercio local, sostenible"
      />
      
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <HowItWorks />
      <CallToAction />
    </div>
  )
}