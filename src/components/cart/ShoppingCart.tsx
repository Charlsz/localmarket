'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 flex items-center">
                          <ShoppingCartIcon className="h-6 w-6 mr-2 text-green-600" />
                          Carrito de compras
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Cerrar panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        <div className="flow-root">
                          {items.length === 0 ? (
                            <div className="text-center py-12">
                              <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                              <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
                              <p className="text-gray-400">Agrega productos para comenzar</p>
                            </div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={80}
                                      height={80}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <Link href={`/productos/${item.id}`} onClick={onClose}>
                                            {item.name}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">{formatPrice(item.price)}</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      {/* Quantity Controls */}
                                      <div className="flex items-center space-x-2">
                                        <button
                                          type="button"
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                          disabled={item.quantity <= 1}
                                        >
                                          <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <span className="text-gray-900 font-medium min-w-[2rem] text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                          disabled={item.quantity >= item.stock}
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                        >
                                          <TrashIcon className="h-4 w-4 mr-1" />
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {/* Total */}
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                          <p>Subtotal ({totalItems} productos)</p>
                          <p>{formatPrice(totalPrice)}</p>
                        </div>
                        
                        <p className="mt-0.5 text-sm text-gray-500 mb-4">
                          Los gastos de envío se calcularán en el checkout.
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Link
                            href="/checkout"
                            onClick={onClose}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
                          >
                            Proceder al checkout
                          </Link>
                          
                          <button
                            type="button"
                            onClick={clearCart}
                            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                          >
                            Vaciar carrito
                          </button>
                        </div>

                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            o{' '}
                            <button
                              type="button"
                              className="font-medium text-green-600 hover:text-green-500"
                              onClick={onClose}
                            >
                              Continuar comprando
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}