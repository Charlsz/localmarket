/**
 * Utility functions for cart operations
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price)
}

export const calculateTotal = (items: { price: number; quantity: number }[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const calculateTotalItems = (items: { quantity: number }[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export const generateOrderId = (): string => {
  return `LM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export const validateStock = (requestedQuantity: number, availableStock: number): boolean => {
  return requestedQuantity <= availableStock && availableStock > 0
}

export const getCartSummary = (items: { name: string; quantity: number; price: number }[]) => {
  const totalItems = calculateTotalItems(items)
  const totalPrice = calculateTotal(items)
  const itemCount = items.length
  
  return {
    totalItems,
    totalPrice,
    itemCount,
    formattedTotal: formatPrice(totalPrice)
  }
}