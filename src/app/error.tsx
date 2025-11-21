'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Algo salió mal
          </h1>
          <p className="text-gray-600 mb-8">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>
          {error.message && (
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Si el problema persiste, por favor contacta con soporte.
          </p>
        </div>
      </div>
    </div>
  );
}
