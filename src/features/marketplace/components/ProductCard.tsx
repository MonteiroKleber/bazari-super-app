// 🔧 CORREÇÃO: ProductCard.tsx - Rating Stars Loop
// Problema: [...Array(5)].map((_, i) => pode tentar converter _ para string

import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@entities/product'
import { Card, Button, Badge, Icons } from '@shared/ui'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  showBusiness?: boolean
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showBusiness = true
}) => {
  // 🔧 FUNÇÃO HELPER: Renderizar estrelas com validação
  const renderRatingStars = (rating: number) => {
    // Validação rigorosa do rating
    const safeRating = typeof rating === 'number' && !isNaN(rating) && rating >= 0 ? rating : 0
    const filledStars = Math.floor(Math.min(safeRating, 5)) // Limite máximo de 5 estrelas
    
    return (
      <div className="flex items-center">
        {/* 🔧 CORREÇÃO: Array.from() com validação explícita */}
        {Array.from({ length: 5 }, (_, starIndex) => {
          // Validação extra: garantir que starIndex é número
          const index = typeof starIndex === 'number' ? starIndex : 0
          
          return (
            <Icons.Star
              key={`product-${product?.id || 'unknown'}-star-${index}`} // 🔧 Key única e segura
              className={`w-4 h-4 ${
                index < filledStars
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300'
              }`}
            />
          )
        })}
      </div>
    )
  }

  // 🔧 VALIDAÇÕES: Garantir que product existe e tem propriedades válidas
  if (!product || typeof product !== 'object') {
    return null // Evita renderizar se product é inválido
  }

  const {
    id = '',
    name = 'Produto sem nome',
    price = 0,
    rating = 0,
    reviewCount = 0,
    totalSales = 0,
    stock = 0,
    trackInventory = false,
    currency = 'BZR'
  } = product

  return (
    <Card className="overflow-hidden">
      {/* ... conteúdo da imagem */}
      
      <div className="p-4">
        {/* Nome do produto */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {/* 🔧 VALIDAÇÃO: Garantir que name é string */}
          {typeof name === 'string' ? name : 'Produto sem nome'}
        </h3>

        {/* Preço */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {/* 🔧 VALIDAÇÃO: Formatar preço com segurança */}
            {typeof price === 'number' && !isNaN(price) 
              ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: currency === 'BRL' ? 'BRL' : 'USD'
                }).format(price)
              : 'Preço não disponível'
            }
          </span>
          
          {currency === 'BZR' && (
            <Badge variant="primary" size="sm">BZR</Badge>
          )}
        </div>

        {/* Rating e Vendas - VERSÃO CORRIGIDA */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {/* 🔧 USAR FUNÇÃO HELPER */}
            {renderRatingStars(rating)}
            <span className="text-sm text-gray-600">
              {/* 🔧 VALIDAÇÃO: Garantir número válido */}
              ({typeof reviewCount === 'number' && !isNaN(reviewCount) ? reviewCount : 0})
            </span>
          </div>
          
          <span className="text-sm text-gray-600">
            {/* 🔧 VALIDAÇÃO: Converter totalSales com segurança */}
            {typeof totalSales === 'number' && !isNaN(totalSales) ? totalSales : 0} vendas
          </span>
        </div>

        {/* Estoque - VERSÃO CORRIGIDA */}
        {trackInventory && (
          <div className="mb-3">
            {/* 🔧 VALIDAÇÃO: Verificar se stock é número válido */}
            {typeof stock === 'number' && !isNaN(stock) && stock > 0 ? (
              <span className={`text-sm ${
                stock < 10 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {stock < 10 ? `Apenas ${stock} restantes` : 'Em estoque'}
              </span>
            ) : (
              <span className="text-sm text-red-600">Fora de estoque</span>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="space-y-2">
          <Button
            onClick={() => onAddToCart?.(id)}
            disabled={trackInventory && (typeof stock !== 'number' || stock <= 0)}
            className="w-full"
            size="sm"
          >
            <Icons.ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </Card>
  )
}