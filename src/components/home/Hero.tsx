'use client';

import React from 'react';
import Link from 'next/link';
import BackgroundPattern from '@/components/ui/BackgroundPattern';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      <BackgroundPattern variant="gradient" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Productos Locales,
            <span className="text-green-600"> Directamente</span> a tu Casa
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Conectamos productores locales con consumidores. Frescura garantizada, apoyando tu comunidad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/productos"
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-lg"
            >
              Explorar Productos
            </Link>
            <Link
              href="/productores"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-bold text-lg"
            >
              Ver Productores
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Productos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-1">100+</div>
              <div className="text-sm text-gray-600">Productores</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-1">1000+</div>
              <div className="text-sm text-gray-600">Clientes</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
