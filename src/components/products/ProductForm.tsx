'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ui/ImageUploader';
import { useToast } from '@/components/ui/ToastContainer';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/client';

const categories = [
  { value: 'vegetables', label: 'Vegetales' },
  { value: 'fruits', label: 'Frutas' },
  { value: 'dairy', label: 'Lácteos' },
  { value: 'meat', label: 'Carnes' },
  { value: 'bakery', label: 'Panadería' },
  { value: 'honey', label: 'Miel' },
  { value: 'preserves', label: 'Conservas' },
  { value: 'crafts', label: 'Artesanías' },
  { value: 'other', label: 'Otros' },
];

const units = [
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'g', label: 'Gramo (g)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'docena', label: 'Docena' },
  { value: 'paquete', label: 'Paquete' },
];

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string | null;
    category: string;
    price: number;
    stock: number;
    unit: string;
    image_url?: string | null;
    images?: string[] | null;
    is_active: boolean;
    is_featured: boolean;
  };
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    unit: initialData?.unit || 'unidad',
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageUpload = async (files: File[]) => {
    setUploadingImages(true);
    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
      showToast('Imágenes subidas correctamente', 'success');
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast('Error al subir las imágenes', 'error');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || formData.price <= 0) {
      showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    if (images.length === 0) {
      showToast('Por favor agrega al menos una imagen', 'warning');
      return;
    }

    setLoading(true);

    try {
      const { user } = await getCurrentUser();
      
      if (!user) {
        showToast('Debes iniciar sesión', 'error');
        router.push('/login');
        return;
      }

      const supabase = createClient();

      const productData = {
        ...formData,
        provider_id: user.id,
        image_url: images[0],
        images: images,
      };

      if (isEdit && initialData?.id) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id)
          .eq('provider_id', user.id); // Asegurar que solo actualice sus propios productos

        if (error) throw error;
        showToast('Producto actualizado exitosamente', 'success');
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        showToast('Producto creado exitosamente', 'success');
      }

      router.push('/dashboard/productos');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error al guardar el producto', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del producto *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ej: Tomates orgánicos"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Describe tu producto..."
        />
      </div>

      {/* Categoría y Unidad */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unidad de medida *
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Precio y Stock */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Imágenes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes del producto *
        </label>
        <ImageUploader
          onUpload={handleImageUpload}
          currentImages={images}
          onRemove={handleRemoveImage}
          maxFiles={5}
          maxSizeMB={5}
        />
        {uploadingImages && (
          <p className="text-sm text-gray-500 mt-2">Subiendo imágenes...</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Producto activo</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Producto destacado</span>
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando...' : isEdit ? 'Actualizar producto' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
