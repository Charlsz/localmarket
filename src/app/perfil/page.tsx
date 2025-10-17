'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, updateProfile } from '@/lib/auth/client';
import type { Profile } from '@/lib/types/database';

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { user, profile, error } = await getCurrentUser();

      if (error || !profile) {
        router.push('/');
        return;
      }

      setProfile(profile);
      setFormData(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await updateProfile(profile.id, formData);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error al actualizar el perfil');
        return;
      }

      alert('Perfil actualizado correctamente');
      loadProfile(); // Recargar el perfil
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Debes iniciar sesión para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-600">
            <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address_street || ''}
                  onChange={(e) => handleInputChange('address_street', e.target.value)}
                  placeholder="Calle y número"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Información de Proveedor (solo si es proveedor) */}
            {profile.role === 'provider' && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Negocio</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Negocio
                      </label>
                      <input
                        type="text"
                        value={formData.business_name || ''}
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del Negocio
                    </label>
                    <textarea
                      value={formData.business_description || ''}
                      onChange={(e) => handleInputChange('business_description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Describe tu negocio, productos que ofreces, etc."
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}