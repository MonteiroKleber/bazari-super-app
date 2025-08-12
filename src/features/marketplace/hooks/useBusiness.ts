import { useState, useCallback, useEffect } from 'react'
import { marketplaceService } from '../services/marketplaceService'
import { Business } from '@entities/business'
import { Product } from '@entities/product'
import { useAuth } from '@features/auth/hooks/useAuth'

export function useBusiness(businessId?: string) {
  const { currentAccount } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [businessProducts, setBusinessProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Business
  const loadBusiness = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const businessData = await marketplaceService.getBusiness(id)
      setBusiness(businessData)
      
      if (businessData) {
        // Load business products
        const products = await marketplaceService.getProductsByBusiness(id)
        setBusinessProducts(products)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar negócio')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create Business
  const createBusiness = useCallback(async (businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentAccount?.address) {
      setError('Usuário não autenticado')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const newBusiness = await marketplaceService.createBusiness({
        ...businessData,
        ownerAddress: currentAccount.address
      })
      
      setBusiness(newBusiness)
      return newBusiness
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar negócio')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [currentAccount?.address])

  // Update Business
  const updateBusiness = useCallback(async (id: string, updates: Partial<Business>) => {
    if (!currentAccount?.address) {
      setError('Usuário não autenticado')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const updatedBusiness = await marketplaceService.updateBusiness(id, updates)
      setBusiness(updatedBusiness)
      return updatedBusiness
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar negócio')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [currentAccount?.address])

  // Create Product
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => {
    setIsLoading(true)
    setError(null)

    try {
      const newProduct = await marketplaceService.createProduct(productData)
      setBusinessProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load business on mount
  useEffect(() => {
    if (businessId) {
      loadBusiness(businessId)
    }
  }, [businessId, loadBusiness])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const isOwner = business?.ownerAddress === currentAccount?.address

  return {
    business,
    businessProducts,
    isLoading,
    error,
    isOwner,
    loadBusiness,
    createBusiness,
    updateBusiness,
    createProduct,
    clearError
  }
}
