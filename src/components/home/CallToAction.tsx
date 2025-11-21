'use client';

import React from 'react';
import Link from 'next/link';
import BackgroundPattern from '@/components/ui/BackgroundPattern';

export default function CallToAction() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700 overflow-hidden">
      <BackgroundPattern variant="dots" className="opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Eres Productor Local?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Únete a nuestra comunidad y llega a más clientes. Vende tus productos directamente sin intermediarios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              Regístrate como Productor
            </Link>
            <Link
              href="/como-funciona"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bold text-lg"
            >
              Conoce Más
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">0%</div>
              <div className="text-sm opacity-90">Comisión el primer mes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Tu tienda siempre abierta</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">∞</div>
              <div className="text-sm opacity-90">Clientes potenciales</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
