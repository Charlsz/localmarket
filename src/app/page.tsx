'use client'

import SEOHead from '@/components/SEOHead'
import Hero from '@/components/home/Hero'
import Benefits from '@/components/home/Benefits'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import HowItWorks from '@/components/home/HowItWorks'
import CallToAction from '@/components/home/CallToAction'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="LocalMarket - Conecta con Productores Locales"
        description="Descubre y compra productos frescos directamente de agricultores, artesanos y productores locales. Apoya la economía local y disfruta de productos de calidad."
        keywords="productos locales, agricultura local, mercado local, productores, artesanos, alimentos frescos, comercio local"
      />
      
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <HowItWorks />
      <CallToAction />
    </div>
  )
}