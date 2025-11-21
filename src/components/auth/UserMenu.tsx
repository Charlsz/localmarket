'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth/client';
import type { Profile } from '@/lib/types/database';
import AuthModal from './AuthModal';

export default function UserMenu() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { user, profile, error } = await getCurrentUser();
      
      if (error && user) {
        // Solo loguear errores si hay un usuario autenticado pero hay problemas con el perfil
        console.error('Error loading user profile:', error);
        // Si hay error de perfil pero el usuario está autenticado, intentar crear el perfil
        if (error.message && (
          error.message.includes('No rows found') || 
          error.message.includes('JSON object requested, multiple (or no) rows returned')
        )) {
          console.log('Perfil no encontrado, intentando crear uno básico...');
          // Aquí podríamos intentar crear un perfil básico, pero por ahora solo loggeamos
        }
      }
      
      setProfile(profile);
    } catch (error) {
      console.error('Unexpected error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setProfile(null);
      setIsOpen(false);
      // Redirigir usando router en lugar de window.location
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!profile) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Iniciar Sesión
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={loadUser}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
          {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium text-gray-900">
            {profile.full_name || 'Usuario'}
          </div>
          <div className="text-xs text-gray-500">
            {profile.role === 'provider' ? 'Proveedor' : 'Cliente'}
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {profile.full_name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
              {profile.business_name && (
                <p className="text-xs text-green-600 mt-1">{profile.business_name}</p>
              )}
            </div>

            <div className="py-1">
              <a
                href="/perfil"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </a>
            </div>

            <div className="border-t border-gray-200 py-1">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
