'use client';

import { useState } from 'react';
import { signIn, signUp, getCurrentUser } from '@/lib/auth/client';
import { UserRole } from '@/lib/types/database';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Credenciales
    email: '',
    password: '',
    
    // Información personal básica
    fullName: '',
    phone: '',
    bio: '',
    website: '',
    
    // Dirección personal
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    
    // Información del negocio (solo proveedores)
    businessName: '',
    businessDescription: '',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
    businessAddress: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          // Mejorar mensajes de error para login
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email o contraseña incorrectos');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Por favor confirma tu email antes de iniciar sesión');
          } else {
            throw error;
          }
        }

        // Cerrar modal inmediatamente para mejor UX
        onClose();

        // Obtener el perfil del usuario después del login
        const { profile: userProfile } = await getCurrentUser();

        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess();
        }

        // Redirigir según el rol del usuario
        if (userProfile?.role === 'provider') {
          router.push('/dashboard/productos');
        } else if (userProfile?.role === 'client') {
          router.push('/productos');
        } else {
          router.push('/');
        }

        // Refrescar después de la redirección
        router.refresh();
      } else {
        // Validaciones adicionales para registro
        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        if (role === 'provider' && !formData.businessName.trim()) {
          throw new Error('El nombre del negocio es obligatorio para proveedores');
        }

        if (role === 'provider' && !formData.businessDescription.trim()) {
          throw new Error('La descripción del negocio es obligatoria para proveedores');
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          role,
          role === 'provider' ? formData.businessName : undefined,
          {
            // Información personal
            phone: formData.phone || undefined,
            bio: formData.bio || undefined,
            website: formData.website || undefined,
            
            // Dirección personal
            addressStreet: formData.addressStreet || undefined,
            addressCity: formData.addressCity || undefined,
            addressState: formData.addressState || undefined,
            addressPostalCode: formData.addressPostalCode || undefined,
            
            // Información del negocio (solo proveedores)
            businessDescription: role === 'provider' ? formData.businessDescription : undefined,
            businessPhone: role === 'provider' ? formData.businessPhone : undefined,
            businessEmail: role === 'provider' ? formData.businessEmail : undefined,
            businessWebsite: role === 'provider' ? formData.businessWebsite : undefined,
            businessAddress: role === 'provider' ? formData.businessAddress : undefined,
          }
        );

        if (error) {
          // Mejorar mensajes de error para registro
          if (error.message.includes('User already registered')) {
            throw new Error('Ya existe una cuenta con este email');
          } else if (error.message.includes('Password should be at least')) {
            throw new Error('La contraseña es muy débil');
          } else if (error.message.includes('Unable to validate email address')) {
            throw new Error('El formato del email no es válido');
          } else {
            throw error;
          }
        }

        alert('¡Cuenta creada exitosamente! Revisa tu email para confirmar la cuenta. Una vez confirmado, podrás iniciar sesión y tu perfil se creará automáticamente.');
        setMode('login');
        // Limpiar el formulario
        setFormData({
          email: '',
          password: '',
          fullName: '',
          phone: '',
          bio: '',
          website: '',
          addressStreet: '',
          addressCity: '',
          addressState: '',
          addressPostalCode: '',
          businessName: '',
          businessDescription: '',
          businessPhone: '',
          businessEmail: '',
          businessWebsite: '',
          businessAddress: '',
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Auth error:', error);
      setError(error.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${mode === 'login' ? 'max-w-md' : 'max-w-2xl'} w-full ${mode === 'signup' ? 'max-h-[90vh] overflow-y-auto' : ''} p-6`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Role Selector (solo en signup) */}
        {mode === 'signup' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo quieres usar LocalMarket?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  role === 'client'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="font-semibold">Cliente</div>
                <div className="text-xs text-gray-600">
                  Comprar productos
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  role === 'provider'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">🌱</div>
                <div className="font-semibold">Proveedor</div>
                <div className="text-xs text-gray-600">
                  Vender productos
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <>
              {/* Información Personal Básica */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección (Opcional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Calle y número"
                        value={formData.addressStreet}
                        onChange={(e) =>
                          setFormData({ ...formData, addressStreet: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={formData.addressCity}
                      onChange={(e) =>
                        setFormData({ ...formData, addressCity: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Código Postal"
                      value={formData.addressPostalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, addressPostalCode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos un poco sobre ti..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Información del Negocio (solo proveedores) */}
              {role === 'provider' && (
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Negocio</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Negocio *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) =>
                          setFormData({ ...formData, businessName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email del Negocio
                      </label>
                      <input
                        type="email"
                        value={formData.businessEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, businessEmail: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del Negocio *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe tu negocio, productos y filosofía..."
                      value={formData.businessDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, businessDescription: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono del Negocio
                    </label>
                    <input
                      type="tel"
                      value={formData.businessPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, businessPhone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sitio Web del Negocio
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.businessWebsite}
                        onChange={(e) =>
                          setFormData({ ...formData, businessWebsite: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección del Negocio
                      </label>
                      <input
                        type="text"
                        placeholder="Calle, número, ciudad..."
                        value={formData.businessAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, businessAddress: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Credenciales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading
              ? 'Cargando...'
              : mode === 'login'
              ? 'Iniciar Sesión'
              : 'Crear Cuenta'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-green-600 hover:underline font-medium"
              >
                Regístrate
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-green-600 hover:underline font-medium"
              >
                Inicia Sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
