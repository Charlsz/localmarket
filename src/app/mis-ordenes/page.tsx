'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/client';
import { createClient } from '@/lib/supabase/client';
import type { Order, OrderWithItems } from '@/lib/types/database';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

function MisOrdenesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay mensaje de éxito
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    
    if (success === 'true' && orderId) {
      setShowSuccess(true);
      setSuccessOrderId(orderId);
      
      // Ocultar el mensaje después de 10 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }
    
    loadOrders();
  }, [searchParams]);

  const loadOrders = async () => {
    try {
      const { user, profile, error } = await getCurrentUser();

      if (error || !profile) {
        router.push('/');
        return;
      }

      setProfile(profile);

      // Cargar órdenes del usuario
      const supabase = createClient();
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
        console.error('Orders error details:', JSON.stringify(ordersError, null, 2));
        return;
      }

      console.log('Orders loaded:', ordersData?.length || 0, 'orders found');
      console.log('Orders data:', ordersData);

      // Transform the data to match OrderWithItems interface
      // Supabase returns 'order_items' but our interface expects 'items'
      const transformedOrders = (ordersData || []).map((order: any) => ({
        ...order,
        items: order.order_items || []
      }));

      console.log('Transformed orders:', transformedOrders);
      setOrders(transformedOrders as OrderWithItems[]);
    } catch (error) {
      console.error('Error loading orders:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'processing':
        return 'En proceso';
      case 'shipped':
        return 'Enviada';
      case 'delivered':
        return 'Entregada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mensaje de Éxito */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  ¡Pedido realizado con éxito!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Tu pedido ha sido confirmado y los productores han sido notificados.
                    Puedes ver el estado de tu pedido a continuación.
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-3 text-sm font-medium text-green-800 hover:text-green-900"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-600">
            <h1 className="text-2xl font-bold text-white">Mis Pedidos</h1>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                <p className="text-gray-600 mb-6">Cuando realices tu primer pedido, aparecerá aquí.</p>
                <button
                  onClick={() => router.push('/productos')}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    {/* Header de la orden */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Orden #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Información de envío */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Información de envío</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Destinatario:</span> {order.shipping_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dirección:</span> {order.shipping_address}
                        {order.shipping_city && `, ${order.shipping_city}`}
                        {order.shipping_postal_code && ` ${order.shipping_postal_code}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Teléfono:</span> {order.shipping_phone}
                      </p>
                    </div>

                    {/* Productos */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Productos</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.product_image_url ? (
                              <img
                                src={item.product_image_url}
                                alt={item.product_name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">📦</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.quantity} × {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totales */}
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impuestos:</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Envío:</span>
                          <span>{formatCurrency(order.shipping_fee)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notas */}
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-1">Notas del pedido</h5>
                        <p className="text-sm text-blue-800">{order.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MisOrdenesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    }>
      <MisOrdenesContent />
    </Suspense>
  );
}