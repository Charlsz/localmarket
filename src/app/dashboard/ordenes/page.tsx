'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/client';
import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems } from '@/lib/types/database';

export default function DashboardOrdenesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { user, profile, error } = await getCurrentUser();

      if (error || !profile || profile.role !== 'provider') {
        router.push('/');
        return;
      }

      setProfile(profile);

      // Cargar órdenes que contienen productos de este proveedor
      const supabase = createClient();
      
      // Primero obtener los order_items del proveedor
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('provider_id', profile.id)
        .order('created_at', { ascending: false });

      if (itemsError) {
        console.error('Error loading order items:', itemsError);
        console.error('Order items error details:', JSON.stringify(itemsError, null, 2));
        return;
      }

      console.log('Order items loaded:', orderItemsData?.length || 0, 'items found');

      if (!orderItemsData || orderItemsData.length === 0) {
        console.log('No order items found for this provider');
        setOrders([]);
        return;
      }

      // Obtener los IDs únicos de órdenes
      const orderIds = [...new Set(orderItemsData.map(item => item.order_id))];

      // Cargar las órdenes completas
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
        console.error('Orders error details:', JSON.stringify(ordersError, null, 2));
        return;
      }

      console.log('Orders loaded:', ordersData?.length || 0, 'orders found');

      // Agrupar order_items por orden
      const ordersMap = new Map<string, OrderWithItems>();

      ordersData?.forEach((order: any) => {
        ordersMap.set(order.id, {
          ...order,
          items: []
        });
      });

      // Añadir los items a cada orden
      orderItemsData?.forEach((item: any) => {
        const order = ordersMap.get(item.order_id);
        if (order) {
          order.items.push(item);
        }
      });

      const finalOrders = Array.from(ordersMap.values());
      console.log('Final orders with items:', finalOrders.length, 'orders');
      console.log('Orders data:', finalOrders);
      
      setOrders(finalOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      await loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado de la orden');
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
          <div className="px-6 py-4 bg-green-600">
            <h1 className="text-2xl font-bold text-white">Órdenes Recibidas</h1>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes órdenes aún</h3>
                <p className="text-gray-600">Cuando los clientes compren tus productos, las órdenes aparecerán aquí.</p>
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
                        <p className="text-sm text-gray-600">
                          Cliente: {order.shipping_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Productos de este proveedor */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-medium text-gray-900">Tus Productos en esta Orden</h4>
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

                    {/* Información de envío */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Información de envío</h4>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Destinatario:</span> {order.shipping_name}
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Dirección:</span> {order.shipping_address}
                        {order.shipping_city && `, ${order.shipping_city}`}
                        {order.shipping_postal_code && ` ${order.shipping_postal_code}`}
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Teléfono:</span> {order.shipping_phone}
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Email:</span> Cliente - Ver en detalles
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {selectedOrder?.id === order.id ? 'Ocultar detalles' : 'Ver detalles completos'}
                      </button>

                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Confirmar
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                          >
                            En Proceso
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                          >
                            Enviar
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Entregado
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Detalles completos */}
                    {selectedOrder?.id === order.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-3">Resumen de la Orden Completa</h5>
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

                        {order.notes && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                            <h6 className="font-medium text-yellow-900 mb-1">Notas del cliente</h6>
                            <p className="text-sm text-yellow-800">{order.notes}</p>
                          </div>
                        )}
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