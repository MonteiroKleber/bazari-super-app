import { FC, useState, useEffect } from 'react'
import { useMarketplace } from '../hooks/useMarketplace'
import { marketplaceService } from '../services/marketplaceService'
import { Product } from '@entities/product'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export const Cart: FC<CartProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateCartItem,
    clearCart,
    isLoading
  } = useMarketplace()

  const [productDetails, setProductDetails] = useState<Record<string, Product>>({})

  // Load product details for cart items
  useEffect(() => {
    const loadProductDetails = async () => {
      const details: Record<string, Product> = {}
      
      for (const item of cartItems) {
        if (item.productId && !details[item.productId]) {
          const product = await marketplaceService.getProduct(item.productId)
          if (product) {
            details[item.productId] = product
          }
        }
      }
      
      setProductDetails(details)
    }

    if (cartItems.length > 0) {
      loadProductDetails()
    }
  }, [cartItems])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL' // TODO: Handle different currencies
    }).format(price)
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateCartItem(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    alert('Checkout em desenvolvimento!')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Carrinho ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <Icons.ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Carrinho vazio
                </h3>
                <p className="text-gray-600 text-center">
                  Adicione alguns produtos para começar suas compras
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => {
                  const product = item.productId ? productDetails[item.productId] : null
                  const mainImage = product?.images.find(img => img.isMain) || product?.images[0]

                  return (
                    <Card key={item.id}>
                      <div className="p-4">
                        <div className="flex space-x-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {mainImage ? (
                              <img
                                src={mainImage.url}
                                alt={mainImage.alt}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icons.Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {product?.name || 'Produto'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price)}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={isLoading}
                              >
                                <Icons.Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={isLoading}
                              >
                                <Icons.Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
                            disabled={isLoading}
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <span className="text-sm font-medium">
                            Subtotal: {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Finalizar Compra
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => clearCart()}
                  className="w-full"
                >
                  Limpar Carrinho
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
