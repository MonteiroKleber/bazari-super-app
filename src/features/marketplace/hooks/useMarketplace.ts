import { useState, useCallback, useEffect } from 'react'
import { marketplaceService } from '../services/marketplaceService'
import { Product, CartItem } from '@entities/product'
import { Business } from '@entities/business'
import { useAuth } from '@features/auth/hooks/useAuth'

interface SearchFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  location?: string
  isTokenized?: boolean
  isVerified?: boolean
  tags?: string[]
}

export function useMarketplace() {
  const { currentAccount } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Products
  const [products, setProducts] = useState<Product[]>([])
  const [productsTotal, setProductsTotal] = useState(0)
  const [productsPage, setProductsPage] = useState(1)
  const [hasMoreProducts, setHasMoreProducts] = useState(true)

  // Businesses
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [businessesTotal, setBusinessesTotal] = useState(0)
  const [businessesPage, setBusinessesPage] = useState(1)
  const [hasMoreBusinesses, setHasMoreBusinesses] = useState(true)

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  // Search Products
  const searchProducts = useCallback(async (
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20,
    append: boolean = false
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const results = await marketplaceService.searchProducts(query, filters, page, limit)
      
      if (append) {
        setProducts(prev => [...prev, ...results.items])
      } else {
        setProducts(results.items)
      }
      
      setProductsTotal(results.total)
      setProductsPage(results.page)
      setHasMoreProducts(results.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca de produtos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Search Businesses
  const searchBusinesses = useCallback(async (
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20,
    append: boolean = false
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const results = await marketplaceService.searchBusinesses(query, filters, page, limit)
      
      if (append) {
        setBusinesses(prev => [...prev, ...results.items])
      } else {
        setBusinesses(results.items)
      }
      
      setBusinessesTotal(results.total)
      setBusinessesPage(results.page)
      setHasMoreBusinesses(results.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca de negócios')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load More Products
  const loadMoreProducts = useCallback(async (
    query: string = '',
    filters: SearchFilters = {}
  ) => {
    if (!hasMoreProducts || isLoading) return
    await searchProducts(query, filters, productsPage + 1, 20, true)
  }, [hasMoreProducts, isLoading, productsPage, searchProducts])

  // Load More Businesses
  const loadMoreBusinesses = useCallback(async (
    query: string = '',
    filters: SearchFilters = {}
  ) => {
    if (!hasMoreBusinesses || isLoading) return
    await searchBusinesses(query, filters, businessesPage + 1, 20, true)
  }, [hasMoreBusinesses, isLoading, businessesPage, searchBusinesses])

  // Cart Operations
  const loadCart = useCallback(async () => {
    if (!currentAccount?.address) return

    try {
      const items = await marketplaceService.getCartItems(currentAccount.address)
      setCartItems(items)
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setCartTotal(total)
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err)
    }
  }, [currentAccount?.address])

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!currentAccount?.address) {
      setError('Usuário não autenticado')
      return false
    }

    try {
      setIsLoading(true)
      const updatedCart = await marketplaceService.addToCart(
        currentAccount.address, 
        productId, 
        quantity
      )
      
      setCartItems(updatedCart)
      const total = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setCartTotal(total)
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [currentAccount?.address])

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!currentAccount?.address) return false

    try {
      const updatedCart = await marketplaceService.removeFromCart(currentAccount.address, itemId)
      setCartItems(updatedCart)
      
      const total = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setCartTotal(total)
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover do carrinho')
      return false
    }
  }, [currentAccount?.address])

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    if (!currentAccount?.address) return false

    try {
      const updatedCart = await marketplaceService.updateCartItem(
        currentAccount.address, 
        itemId, 
        quantity
      )
      
      setCartItems(updatedCart)
      const total = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setCartTotal(total)
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar carrinho')
      return false
    }
  }, [currentAccount?.address])

  const clearCart = useCallback(async () => {
    if (!currentAccount?.address) return false

    try {
      await marketplaceService.clearCart(currentAccount.address)
      setCartItems([])
      setCartTotal(0)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao limpar carrinho')
      return false
    }
  }, [currentAccount?.address])

  // Initialize cart on mount
  useEffect(() => {
    loadCart()
  }, [loadCart])

  // Initialize mock data
  useEffect(() => {
    marketplaceService.initializeMockData()
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // States
    products,
    businesses,
    cartItems,
    cartTotal,
    isLoading,
    error,
    
    // Pagination
    productsTotal,
    businessesTotal,
    hasMoreProducts,
    hasMoreBusinesses,
    
    // Actions
    searchProducts,
    searchBusinesses,
    loadMoreProducts,
    loadMoreBusinesses,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    loadCart,
    clearError,
    
    // Utils
    cartItemsCount: cartItems.length,
    hasCartItems: cartItems.length > 0
  }
}
