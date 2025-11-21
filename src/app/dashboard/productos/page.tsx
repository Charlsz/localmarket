'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from '@/lib/auth/client';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/ToastContainer';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Product, ProductCategory } from '@/lib/types/database';

export default function DashboardProductosPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'vegetables' as ProductCategory,
    price: 0,
    stock: 0,
    unit: 'unidad',
    image_url: '',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { user, profile, error } = await getCurrentUser();

      if (error || !profile || profile.role !== 'provider') {
        router.push('/');
        return;
      }

      setProfile(profile);

      // Cargar productos del proveedor
      const supabase = createClient();
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('provider_id', profile.id)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error loading products:', productsError);
        return;
      }

      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading products:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);

      if (error) throw error;

      showToast('Producto eliminado exitosamente', 'success');
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Error al eliminar el producto', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'vegetables',
      price: 0,
      stock: 0,
      unit: 'unidad',
      image_url: '',
      is_active: true,
      is_featured: false
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    try {
      const supabase = createClient();
      
      if (editingProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        showToast('Producto actualizado exitosamente', 'success');
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('products')
          .insert({
            ...formData,
            provider_id: profile.id
          });

        if (error) throw error;
        showToast('Producto creado exitosamente', 'success');
      }

      // Resetear formulario
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error al guardar el producto', 'error');
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      showToast(
        `Producto ${!product.is_active ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
      await loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      showToast('Error al actualizar el estado del producto', 'error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryText = (category: string) => {
    const categories = {
      vegetables: 'Verduras',
      fruits: 'Frutas',
      dairy: 'Lácteos',
      meat: 'Carne',
      bakery: 'Panadería',
      honey: 'Miel',
      preserves: 'Conservas',
      crafts: 'Artesanía',
      other: 'Otro'
    };
    return categories[category as keyof typeof categories] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile || profile.role !== 'provider') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Esta página es solo para proveedores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-600 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Mis Productos</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Producto'}
            </button>
          </div>

          <div className="p-6">
            {/* Formulario */}
            {showForm && (
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="vegetables">🌱 Verduras</option>
                        <option value="fruits">🍎 Frutas</option>
                        <option value="dairy">🥛 Lácteos</option>
                        <option value="meat">🥩 Carne</option>
                        <option value="bakery">🍞 Panadería</option>
                        <option value="honey">🍯 Miel</option>
                        <option value="preserves">🥫 Conservas</option>
                        <option value="crafts">🎨 Artesanía</option>
                        <option value="other">📦 Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Describe tu producto..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio (€) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidad *
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="kg">Kilogramos (kg)</option>
                        <option value="g">Gramos (g)</option>
                        <option value="unidad">Unidad</option>
                        <option value="litro">Litro (L)</option>
                        <option value="botella">Botella</option>
                        <option value="caja">Caja</option>
                        <option value="paquete">Paquete</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Botón para crear producto */}
            <div className="mb-6">
              <Link
                href="/dashboard/productos/crear"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Nuevo Producto
              </Link>
            </div>

            {/* Lista de productos */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes productos aún</h3>
                <p className="text-gray-600 mb-6">Crea tu primer producto para empezar a vender.</p>
                <Link
                  href="/dashboard/productos/crear"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Crear Primer Producto
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description || 'Sin descripción'}
                    </p>

                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Categoría:</span> {getCategoryText(product.category)}</p>
                      <p><span className="font-medium">Precio:</span> {formatCurrency(product.price)}/{product.unit}</p>
                      <p><span className="font-medium">Stock:</span> {product.stock} {product.unit}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <button
                        onClick={() => toggleProductStatus(product)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${
                          product.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {product.is_active ? 'Desactivar' : 'Activar'}
                      </button>

                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/productos/editar/${product.id}`}
                          className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dialog de confirmación para eliminar */}
            <ConfirmDialog
              isOpen={deleteDialogOpen}
              title="Eliminar producto"
              message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
              confirmText="Eliminar"
              cancelText="Cancelar"
              onConfirm={handleDeleteConfirm}
              onCancel={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
              variant="danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
}