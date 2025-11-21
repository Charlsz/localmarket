'use client';

import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/client';
import { useToast } from '@/components/ui/ToastContainer';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  providerId: string;
}

export default function ProductReviews({ productId, providerId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadReviews();
    checkReviewEligibility();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const { user } = await getCurrentUser();
      
      if (!user) {
        setCanReview(false);
        return;
      }

      setCurrentUserId(user.id);

      // No puede hacer review si es el proveedor del producto
      if (user.id === providerId) {
        setCanReview(false);
        return;
      }

      // Verificar si ya ha hecho review
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setHasReviewed(true);
        setCanReview(false);
      } else {
        setCanReview(true);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      showToast('Debes iniciar sesión para dejar una reseña', 'warning');
      return;
    }

    if (rating === 0) {
      showToast('Por favor selecciona una calificación', 'warning');
      return;
    }

    if (comment.trim().length < 10) {
      showToast('El comentario debe tener al menos 10 caracteres', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: currentUserId,
          rating,
          comment: comment.trim(),
        });

      if (error) throw error;

      showToast('¡Reseña publicada exitosamente!', 'success');
      setRating(0);
      setComment('');
      setCanReview(false);
      setHasReviewed(true);
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('Error al publicar la reseña', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  const renderStars = (count: number, interactive = false, onHover?: (rating: number) => void, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive ? (hoverRating || rating) >= star : count >= star;
          const StarComponent = filled ? StarIcon : StarOutlineIcon;
          
          return (
            <StarComponent
              key={star}
              className={`h-5 w-5 ${
                interactive 
                  ? 'cursor-pointer transition-colors hover:text-yellow-400' 
                  : ''
              } ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
              onMouseEnter={() => interactive && onHover && onHover(star)}
              onMouseLeave={() => interactive && onHover && onHover(0)}
              onClick={() => interactive && onClick && onClick(star)}
            />
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reseñas</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(calculateAverageRating()))}
              <span className="text-2xl font-bold text-gray-900">
                {calculateAverageRating().toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        )}
      </div>

      {/* Formulario de reseña */}
      {canReview && (
        <form onSubmit={handleSubmitReview} className="mb-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Deja tu reseña
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación
            </label>
            {renderStars(
              rating,
              true,
              setHoverRating,
              setRating
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Comparte tu experiencia con este producto..."
              required
              minLength={10}
            />
            <p className="text-sm text-gray-500 mt-1">
              Mínimo 10 caracteres ({comment.length}/10)
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Publicando...' : 'Publicar reseña'}
          </button>
        </form>
      )}

      {!canReview && !hasReviewed && currentUserId === providerId && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            No puedes dejar reseñas en tus propios productos.
          </p>
        </div>
      )}

      {hasReviewed && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Ya has dejado una reseña para este producto.
          </p>
        </div>
      )}

      {!currentUserId && (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <a href="/login" className="text-green-600 hover:underline">
              Inicia sesión
            </a>{' '}
            para dejar una reseña.
          </p>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aún no hay reseñas para este producto. ¡Sé el primero!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.profiles?.avatar_url ? (
                    <img
                      src={review.profiles.avatar_url}
                      alt={review.profiles.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">
                        {review.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.profiles?.full_name || 'Usuario'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
