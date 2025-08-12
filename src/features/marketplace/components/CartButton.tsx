import { FC, useState } from 'react'
import { useMarketplace } from '../hooks/useMarketplace'
import { Cart } from './Cart'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

export const CartButton: FC = () => {
  const { cartItemsCount, cartTotal } = useMarketplace()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsCartOpen(true)}
        className="relative"
      >
        <Icons.ShoppingCart className="w-5 h-5" />
        {cartItemsCount > 0 && (
          <Badge
            variant="error"
            size="sm"
            className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs"
          >
            {cartItemsCount}
          </Badge>
        )}
        <span className="hidden md:inline ml-2">
          {cartTotal > 0 ? formatPrice(cartTotal) : 'Carrinho'}
        </span>
      </Button>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  )
}
