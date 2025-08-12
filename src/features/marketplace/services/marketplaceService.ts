import { Product, Service, CartItem } from '@entities/product'
import { Business } from '@entities/business'
import { CategoryService } from '../data/categories'

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

interface SearchResults<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

class MarketplaceService {
  private readonly storageKeys = {
    businesses: 'bazari-businesses',
    products: 'bazari-products',
    services: 'bazari-services',
    cart: 'bazari-cart'
  }

  // ============================================
  // BUSINESSES
  // ============================================

  private getBusinesses(): Record<string, Business> {
    try {
      const stored = localStorage.getItem(this.storageKeys.businesses)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  private saveBusinesses(businesses: Record<string, Business>): void {
    try {
      localStorage.setItem(this.storageKeys.businesses, JSON.stringify(businesses))
    } catch (error) {
      console.error('Erro ao salvar negócios:', error)
    }
  }

  async createBusiness(businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> {
    try {
      const businesses = this.getBusinesses()
      const id = `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const business: Business = {
        ...businessData,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      businesses[id] = business
      this.saveBusinesses(businesses)
      
      return business
    } catch (error) {
      throw new Error(`Erro ao criar negócio: ${error}`)
    }
  }

  async getBusiness(id: string): Promise<Business | null> {
    try {
      const businesses = this.getBusinesses()
      return businesses[id] || null
    } catch (error) {
      console.error('Erro ao buscar negócio:', error)
      return null
    }
  }

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
    try {
      const businesses = this.getBusinesses()
      const business = businesses[id]
      
      if (!business) {
        throw new Error('Negócio não encontrado')
      }

      const updatedBusiness = {
        ...business,
        ...updates,
        id,
        updatedAt: new Date()
      }

      businesses[id] = updatedBusiness
      this.saveBusinesses(businesses)
      
      return updatedBusiness
    } catch (error) {
      throw new Error(`Erro ao atualizar negócio: ${error}`)
    }
  }

  async searchBusinesses(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResults<Business>> {
    try {
      const businesses = Object.values(this.getBusinesses())
      
      let filtered = businesses.filter(business => business.isActive)
      
      // Filtro por texto
      if (query.trim()) {
        const searchTerm = query.toLowerCase()
        filtered = filtered.filter(business =>
          business.name.toLowerCase().includes(searchTerm) ||
          business.description.toLowerCase().includes(searchTerm) ||
          business.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Filtros
      if (filters.category) {
        const categoryIds = [filters.category, ...CategoryService.getAllDescendants(filters.category).map(c => c.id)]
        filtered = filtered.filter(business => categoryIds.includes(business.category.id))
      }

      if (filters.location) {
        filtered = filtered.filter(business =>
          business.address.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
          business.address.state.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }

      if (filters.rating) {
        filtered = filtered.filter(business => business.rating >= filters.rating!)
      }

      if (filters.isTokenized !== undefined) {
        filtered = filtered.filter(business => business.isTokenized === filters.isTokenized)
      }

      if (filters.isVerified !== undefined) {
        filtered = filtered.filter(business => business.isVerified === filters.isVerified)
      }

      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(business =>
          filters.tags!.some(tag =>
            business.tags.some(businessTag =>
              businessTag.toLowerCase().includes(tag.toLowerCase())
            )
          )
        )
      }

      // Ordenação
      filtered.sort((a, b) => {
        // Priorizar: featured > verified > rating > followers
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        if (a.isVerified && !b.isVerified) return -1
        if (!a.isVerified && b.isVerified) return 1
        if (a.rating !== b.rating) return b.rating - a.rating
        return b.followers - a.followers
      })

      // Paginação
      const start = (page - 1) * limit
      const items = filtered.slice(start, start + limit)
      
      return {
        items,
        total: filtered.length,
        page,
        limit,
        hasMore: start + limit < filtered.length
      }
    } catch (error) {
      console.error('Erro na busca de negócios:', error)
      return { items: [], total: 0, page, limit, hasMore: false }
    }
  }

  // ============================================
  // PRODUCTS
  // ============================================

  private getProducts(): Record<string, Product> {
    try {
      const stored = localStorage.getItem(this.storageKeys.products)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  private saveProducts(products: Record<string, Product>): void {
    try {
      localStorage.setItem(this.storageKeys.products, JSON.stringify(products))
    } catch (error) {
      console.error('Erro ao salvar produtos:', error)
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<Product> {
    try {
      const products = this.getProducts()
      const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const slug = this.generateSlug(productData.name)
      
      const product: Product = {
        ...productData,
        id,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      products[id] = product
      this.saveProducts(products)
      
      return product
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error}`)
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const products = this.getProducts()
      const product = products[id]
      
      if (product) {
        // Incrementar visualizações
        product.views = (product.views || 0) + 1
        products[id] = product
        this.saveProducts(products)
      }
      
      return product || null
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      return null
    }
  }

  async getProductsByBusiness(businessId: string): Promise<Product[]> {
    try {
      const products = Object.values(this.getProducts())
      return products.filter(product => product.businessId === businessId && product.isActive)
    } catch (error) {
      console.error('Erro ao buscar produtos do negócio:', error)
      return []
    }
  }

  async searchProducts(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResults<Product>> {
    try {
      const products = Object.values(this.getProducts())
      
      let filtered = products.filter(product => product.isActive)
      
      // Filtro por texto
      if (query.trim()) {
        const searchTerm = query.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.shortDescription?.toLowerCase().includes(searchTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Filtros
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category)
      }

      if (filters.priceMin !== undefined) {
        filtered = filtered.filter(product => product.price >= filters.priceMin!)
      }

      if (filters.priceMax !== undefined) {
        filtered = filtered.filter(product => product.price <= filters.priceMax!)
      }

      if (filters.rating) {
        filtered = filtered.filter(product => product.rating >= filters.rating!)
      }

      if (filters.isTokenized !== undefined) {
        filtered = filtered.filter(product => product.isTokenized === filters.isTokenized)
      }

      // Ordenação
      filtered.sort((a, b) => {
        // Priorizar: featured > rating > sales > views
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        if (a.rating !== b.rating) return b.rating - a.rating
        if (a.totalSales !== b.totalSales) return b.totalSales - a.totalSales
        return b.views - a.views
      })

      // Paginação
      const start = (page - 1) * limit
      const items = filtered.slice(start, start + limit)
      
      return {
        items,
        total: filtered.length,
        page,
        limit,
        hasMore: start + limit < filtered.length
      }
    } catch (error) {
      console.error('Erro na busca de produtos:', error)
      return { items: [], total: 0, page, limit, hasMore: false }
    }
  }

  // ============================================
  // CART
  // ============================================

  private getCart(userAddress: string): CartItem[] {
    try {
      const stored = localStorage.getItem(`${this.storageKeys.cart}_${userAddress}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private saveCart(userAddress: string, items: CartItem[]): void {
    try {
      localStorage.setItem(`${this.storageKeys.cart}_${userAddress}`, JSON.stringify(items))
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error)
    }
  }

  async addToCart(userAddress: string, productId: string, quantity: number = 1): Promise<CartItem[]> {
    try {
      const product = await this.getProduct(productId)
      if (!product) {
        throw new Error('Produto não encontrado')
      }

      const cart = this.getCart(userAddress)
      const existingItem = cart.find(item => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        const cartItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId,
          businessId: product.businessId,
          quantity,
          price: product.price,
          addedAt: new Date()
        }
        cart.push(cartItem)
      }

      this.saveCart(userAddress, cart)
      return cart
    } catch (error) {
      throw new Error(`Erro ao adicionar ao carrinho: ${error}`)
    }
  }

  async removeFromCart(userAddress: string, itemId: string): Promise<CartItem[]> {
    try {
      const cart = this.getCart(userAddress)
      const filtered = cart.filter(item => item.id !== itemId)
      this.saveCart(userAddress, filtered)
      return filtered
    } catch (error) {
      throw new Error(`Erro ao remover do carrinho: ${error}`)
    }
  }

  async updateCartItem(userAddress: string, itemId: string, quantity: number): Promise<CartItem[]> {
    try {
      const cart = this.getCart(userAddress)
      const item = cart.find(item => item.id === itemId)
      
      if (item) {
        if (quantity <= 0) {
          return this.removeFromCart(userAddress, itemId)
        }
        item.quantity = quantity
        this.saveCart(userAddress, cart)
      }
      
      return cart
    } catch (error) {
      throw new Error(`Erro ao atualizar item do carrinho: ${error}`)
    }
  }

  async getCartItems(userAddress: string): Promise<CartItem[]> {
    return this.getCart(userAddress)
  }

  async clearCart(userAddress: string): Promise<void> {
    this.saveCart(userAddress, [])
  }

  // ============================================
  // UTILS
  // ============================================

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // ============================================
  // ANALYTICS
  // ============================================

  async getMarketplaceStats(): Promise<{
    totalBusinesses: number
    totalProducts: number
    totalServices: number
    categoriesWithProducts: number
    averageRating: number
  }> {
    try {
      const businesses = Object.values(this.getBusinesses())
      const products = Object.values(this.getProducts())
      
      const totalBusinesses = businesses.filter(b => b.isActive).length
      const totalProducts = products.filter(p => p.isActive).length
      
      const categoriesWithProducts = new Set(products.map(p => p.category)).size
      
      const avgRating = products.length > 0 
        ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
        : 0

      return {
        totalBusinesses,
        totalProducts,
        totalServices: 0, // TODO: implementar services
        categoriesWithProducts,
        averageRating: Number(avgRating.toFixed(1))
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      return {
        totalBusinesses: 0,
        totalProducts: 0,
        totalServices: 0,
        categoriesWithProducts: 0,
        averageRating: 0
      }
    }
  }

  // ============================================
  // MOCK DATA INITIALIZATION
  // ============================================

  async initializeMockData(): Promise<void> {
    try {
      const businesses = this.getBusinesses()
      const products = this.getProducts()
      
      // Se já tem dados, não inicializar
      if (Object.keys(businesses).length > 0 || Object.keys(products).length > 0) {
        return
      }

      // Criar negócios mock
      const mockBusinesses = await this.createMockBusinesses()
      
      // Criar produtos mock
      for (const business of mockBusinesses) {
        await this.createMockProducts(business.id)
      }
      
    } catch (error) {
      console.error('Erro ao inicializar dados mock:', error)
    }
  }

  private async createMockBusinesses(): Promise<Business[]> {
    const mockData = [
      {
        name: 'TechCorp Solutions',
        description: 'Desenvolvimento de soluções tecnológicas inovadoras em blockchain e Web3',
        category: CategoryService.getCategory('blockchain')!,
        address: {
          street: 'Rua das Tecnologias, 123',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          zipCode: '01234-567'
        },
        rating: 4.8,
        reviewCount: 127,
        totalSales: 89,
        followers: 1234,
        tags: ['Blockchain', 'Smart Contracts', 'DeFi', 'Web3'],
        isTokenized: true,
        verificationLevel: 'verified' as const,
        isVerified: true,
        isFeatured: true
      },
      {
        name: 'Café da Vila',
        description: 'Café artesanal com grãos selecionados e ambiente aconchegante',
        category: CategoryService.getCategory('restaurantes')!,
        address: {
          street: 'Rua do Café, 456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'Brasil',
          zipCode: '20000-000'
        },
        rating: 4.5,
        reviewCount: 89,
        totalSales: 156,
        followers: 567,
        tags: ['Café', 'Artesanal', 'Orgânico', 'Local'],
        isTokenized: false,
        verificationLevel: 'basic' as const,
        isVerified: true,
        isFeatured: false
      },
      {
        name: 'Arte Digital Studio',
        description: 'Criação de NFTs exclusivos e arte digital personalizada',
        category: CategoryService.getCategory('nft-art')!,
        address: {
          street: 'Av. da Arte, 789',
          city: 'Belo Horizonte',
          state: 'MG',
          country: 'Brasil',
          zipCode: '30000-000'
        },
        rating: 4.9,
        reviewCount: 67,
        totalSales: 45,
        followers: 890,
        tags: ['NFT', 'Arte Digital', 'Ilustração', 'Design'],
        isTokenized: true,
        verificationLevel: 'premium' as const,
        isVerified: true,
        isFeatured: true
      }
    ]

    const createdBusinesses: Business[] = []
    
    for (const data of mockData) {
      const business = await this.createBusiness({
        ...data,
        ownerAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        email: `contato@${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+55 11 99999-9999',
        website: `https://${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
        isActive: true,
        socialLinks: {}
      })
      createdBusinesses.push(business)
    }
    
    return createdBusinesses
  }

  private async createMockProducts(businessId: string): Promise<void> {
    const business = await this.getBusiness(businessId)
    if (!business) return

    const productsByCategory: Record<string, any[]> = {
      'blockchain': [
        {
          name: 'Smart Contract Audit',
          description: 'Auditoria completa de smart contracts com relatório detalhado de segurança',
          price: 2500,
          category: 'smart-contracts',
          tags: ['Audit', 'Security', 'Solidity']
        },
        {
          name: 'DeFi Protocol Development',
          description: 'Desenvolvimento de protocolo DeFi personalizado com interface web',
          price: 15000,
          category: 'defi',
          tags: ['DeFi', 'Protocol', 'Frontend']
        }
      ],
      'restaurantes': [
        {
          name: 'Café Especial Brasileiro',
          description: 'Grãos 100% arábica torrados artesanalmente',
          price: 45,
          category: 'produtos-alimenticios',
          tags: ['Café', 'Arábica', 'Artesanal']
        },
        {
          name: 'Combo Café da Manhã',
          description: 'Café + croissant + suco natural',
          price: 25,
          category: 'combo',
          tags: ['Combo', 'Café da Manhã']
        }
      ],
      'nft-art': [
        {
          name: 'Avatar Collection #001',
          description: 'Coleção exclusiva de avatares pixelados únicos',
          price: 100,
          category: 'pfp-collections',
          tags: ['Avatar', 'Pixel Art', 'Collection'],
          isNFT: true
        },
        {
          name: 'Abstract Art Series',
          description: 'Série de arte abstrata generativa limitada',
          price: 250,
          category: 'generative-art',
          tags: ['Abstract', 'Generative', 'Limited'],
          isNFT: true
        }
      ]
    }

    const categoryProducts = productsByCategory[business.category.id] || []
    
    for (const productData of categoryProducts) {
      await this.createProduct({
        ...productData,
        businessId,
        shortDescription: productData.description.substring(0, 80) + '...',
        currency: 'BZR' as const,
        images: [{
          id: 'img1',
          url: `https://picsum.photos/400/400?random=${Date.now()}`,
          alt: productData.name,
          isMain: true,
          order: 1
        }],
        stock: Math.floor(Math.random() * 50) + 10,
        isUnlimited: false,
        trackInventory: true,
        isActive: true,
        isFeatured: Math.random() > 0.7,
        isDigital: business.category.id === 'blockchain' || business.category.id === 'nft-art',
        isTokenized: productData.isNFT || false,
        isNFT: productData.isNFT || false,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 50) + 5,
        totalSales: Math.floor(Math.random() * 100) + 10,
        views: Math.floor(Math.random() * 500) + 50
      })
    }
  }
}

export const marketplaceService = new MarketplaceService()
