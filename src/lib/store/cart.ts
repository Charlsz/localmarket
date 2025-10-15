import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { validateStock } from '@/lib/utils/cart'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  producer_id: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const items = get().items
        const existingItem = items.find(item => item.id === newItem.id)
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + 1
          if (validateStock(newQuantity, newItem.stock)) {
            set({
              items: items.map(item =>
                item.id === newItem.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            })
          }
        } else {
          if (validateStock(1, newItem.stock)) {
            set({
              items: [...items, { ...newItem, quantity: 1 }]
            })
          }
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          const item = get().items.find(item => item.id === id)
          if (item && validateStock(quantity, item.stock)) {
            set({
              items: get().items.map(item =>
                item.id === id ? { ...item, quantity } : item
              )
            })
          }
        }
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'localmarket-cart'
    }
  )
)