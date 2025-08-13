// src/features/marketplace/services/marketplaceService.ts
// Serviço principal do marketplace com integração de categorias

import { Product, Business } from '@entities'
import { CartItem } from '@entities/product'
import { CategoryService, categories } from '../data/categories'

interface SearchFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  location?: string
  isTokenized?: boolean
  isVerified?: boolean
  tags?: string[]
  isDigital?: boolean
}

interface SearchResult<T> {
  items: T[]
  total: number
  hasMore: boolean
  page: number
  limit: number
}

class MarketplaceService {
  private products: Product[] = []
  private businesses: Business[] = []
  private categoryService: CategoryService

  constructor() {
    this.categoryService = new CategoryService()
    this.initializeMockData()
  }

  // ============================================
  // MÉTODOS DE PRODUTOS
  // ============================================

  async searchProducts(
    query: string = '', 
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResult<Product>> {
    let filteredProducts = this.products.filter(product => product.isActive)

    // Filtro por query
    if (query.trim()) {
      const normalizedQuery = query.toLowerCase().trim()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      )
    }

    // Filtros específicos
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => {
        // Verifica categoria exata e subcategorias
        const categoryPath = this.categoryService.getCategoryPath(product.category)
        return categoryPath.some(cat => cat.id === filters.category)
      })
    }

    if (filters.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.priceMin!)
    }

    if (filters.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.priceMax!)
    }

    if (filters.rating !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.rating >= filters.rating!)
    }

    if (filters.isTokenized !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.isTokenized === filters.isTokenized)
    }

    if (filters.isDigital !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.isDigital === filters.isDigital)
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.tags!.some(tag => 
          product.tags.some(productTag => 
            productTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
    }

    // Paginação
    const total = filteredProducts.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      items: paginatedProducts,
      total,
      hasMore: endIndex < total,
      page,
      limit
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.products.unshift(newProduct)
    return newProduct
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(product => product.id === id)
    if (index === -1) return null

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    }

    return this.products[index]
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(product => product.id === id)
    if (index === -1) return false

    this.products.splice(index, 1)
    return true
  }

  // ============================================
  // MÉTODOS DE NEGÓCIOS
  // ============================================

  async searchBusinesses(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResult<Business>> {
    let filteredBusinesses = this.businesses.filter(business => business.isActive)

    // Filtro por query
    if (query.trim()) {
      const normalizedQuery = query.toLowerCase().trim()
      filteredBusinesses = filteredBusinesses.filter(business =>
        business.name.toLowerCase().includes(normalizedQuery) ||
        business.description.toLowerCase().includes(normalizedQuery) ||
        business.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      )
    }

    // Filtros específicos
    if (filters.category) {
      filteredBusinesses = filteredBusinesses.filter(business => {
        const categoryPath = this.categoryService.getCategoryPath(business.category.id)
        return categoryPath.some(cat => cat.id === filters.category)
      })
    }

    if (filters.isVerified !== undefined) {
      filteredBusinesses = filteredBusinesses.filter(business => business.isVerified === filters.isVerified)
    }

    if (filters.isTokenized !== undefined) {
      filteredBusinesses = filteredBusinesses.filter(business => business.isTokenized === filters.isTokenized)
    }

    if (filters.location) {
      filteredBusinesses = filteredBusinesses.filter(business =>
        business.address.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        business.address.state.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }

    // Paginação
    const total = filteredBusinesses.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex)

    return {
      items: paginatedBusinesses,
      total,
      hasMore: endIndex < total,
      page,
      limit
    }
  }

  async getBusinessById(id: string): Promise<Business | null> {
    return this.businesses.find(business => business.id === id) || null
  }

  async createBusiness(businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> {
    const newBusiness: Business = {
      ...businessData,
      id: `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.businesses.unshift(newBusiness)
    return newBusiness
  }

  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
    const index = this.businesses.findIndex(business => business.id === id)
    if (index === -1) return null

    this.businesses[index] = {
      ...this.businesses[index],
      ...updates,
      updatedAt: new Date()
    }

    return this.businesses[index]
  }

  async deleteBusiness(id: string): Promise<boolean> {
    const index = this.businesses.findIndex(business => business.id === id)
    if (index === -1) return false

    this.businesses.splice(index, 1)
    return true
  }

  // ============================================
  // MÉTODOS ESPECÍFICOS PARA DIGITAIS
  // ============================================

  async searchDigitalProducts(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResult<Product>> {
    return this.searchProducts(query, { ...filters, isDigital: true }, page, limit)
  }

  async getFeaturedDigitalProducts(limit: number = 8): Promise<Product[]> {
    const result = await this.searchProducts('', { isDigital: true }, 1, limit * 2)
    return result.items.filter(product => product.isFeatured).slice(0, limit)
  }

  async getDigitalProductsByCategory(categoryId: string, limit: number = 12): Promise<Product[]> {
    const result = await this.searchProducts('', { 
      category: categoryId, 
      isDigital: true 
    }, 1, limit)
    return result.items
  }

  // ============================================
  // MÉTODOS DE CATEGORIAS
  // ============================================

  getCategoryService(): CategoryService {
    return this.categoryService
  }

  async getCategories() {
    return this.categoryService.list()
  }

  async getCategoryById(id: string) {
    return this.categoryService.getById(id)
  }

  async getDigitalCategories() {
    return this.categoryService.getDigitalCategories()
  }

  async getPhysicalCategories() {
    return this.categoryService.getPhysicalCategories()
  }

 
// ============================================
// CARRINHO (em memória)
// ============================================

private carts: Map<string, CartItem[]> = new Map()

async getCartItems(userAddress: string): Promise<CartItem[]> {
  return this.carts.get(userAddress) || []
}

async addToCart(userAddress: string, productId: string, quantity: number = 1): Promise<CartItem[]> {
  const product = await this.getProductById(productId)
  if (!product) return this.getCartItems(userAddress)

  const cart = [...(this.carts.get(userAddress) || [])]
  const existing = cart.find(i => i.productId === productId)

  if (existing) {
    existing.quantity += quantity
    existing.price = product.price
  } else {
    cart.push({
      id: `${productId}-${Date.now()}`,
      productId,
      businessId: product.businessId,
      quantity,
      price: product.price,
      addedAt: new Date()
    })
  }

  this.carts.set(userAddress, cart)
  return cart
}

async removeFromCart(userAddress: string, itemId: string): Promise<CartItem[]> {
  const cart = [...(this.carts.get(userAddress) || [])]
  const next = cart.filter(i => i.id !== itemId)
  this.carts.set(userAddress, next)
  return next
}

async updateCartItem(userAddress: string, itemId: string, quantity: number): Promise<CartItem[]> {
  const cart = [...(this.carts.get(userAddress) || [])]
  const item = cart.find(i => i.id === itemId)
  if (item) {
    item.quantity = Math.max(1, quantity)
  }
  this.carts.set(userAddress, cart)
  return cart
}

async clearCart(userAddress: string): Promise<void> {
  this.carts.set(userAddress, [])
}

  // ============================================
  // INICIALIZAÇÃO DE DADOS MOCK
  // ============================================

  async initializeMockData() {
    // Mock Businesses
    const mockBusinesses = [
      {
        name: 'Tech Solutions Brasil',
        description: 'Empresa de desenvolvimento de software especializada em blockchain e Web3',
        ownerAddress: '0x1234...abcd',
        category: {
          id: 'desenvolvimento-software',
          name: 'Desenvolvimento de Software',
          level: 2,
          parent: 'tecnologia',
          children: [],
          isActive: true,
          order: 1
        },
        email: 'contato@techsolutions.com.br',
        phone: '+55 11 99999-9999',
        website: 'https://techsolutions.com.br',
        address: {
          street: 'Av. Paulista, 1000',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          zipCode: '01310-100'
        },
        isTokenized: true,
        tokenId: 'business_001',
        rating: 4.8,
        reviewCount: 127,
        totalSales: 523,
        verificationLevel: 'verified' as const,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        followers: 1250,
        tags: ['blockchain', 'web3', 'desenvolvimento', 'tecnologia']
      },
      {
        name: 'Arte Digital Studio',
        description: 'Estúdio especializado em criação de NFTs e arte digital tokenizada',
        ownerAddress: '0x5678...efgh',
        category: {
          id: 'design-grafico',
          name: 'Design Gráfico',
          level: 2,
          parent: 'tecnologia',
          children: [],
          isActive: true,
          order: 2
        },
        email: 'contato@artedigital.studio',
        address: {
          street: 'Rua das Flores, 500',
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'Brasil',
          zipCode: '22070-000'
        },
        isTokenized: true,
        tokenId: 'business_002',
        rating: 4.9,
        reviewCount: 89,
        totalSales: 256,
        verificationLevel: 'premium' as const,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        followers: 850,
        tags: ['nft', 'arte', 'design', 'digital']
      }
    ]

    // Criar businesses mock
    for (const businessData of mockBusinesses) {
      await this.createBusiness(businessData)
    }

    // Mock Products Físicos
    const mockPhysicalProducts = [
      {
        businessId: this.businesses[0].id,
        name: 'Consultoria em Blockchain',
        description: 'Consultoria especializada em implementação de soluções blockchain para empresas',
        shortDescription: 'Consultoria blockchain empresarial',
        price: 500,
        currency: 'BZR' as const,
        category: 'blockchain',
        tags: ['consultoria', 'blockchain', 'empresas'],
        images: [{
          id: 'img1',
          url: 'https://picsum.photos/400/300?random=1',
          alt: 'Consultoria Blockchain',
          isMain: true,
          order: 1
        }],
        stock: 10,
        isUnlimited: false,
        trackInventory: true,
        isTokenized: false,
        isNFT: false,
        isActive: true,
        isFeatured: false,
        isDigital: false,
        rating: 4.7,
        reviewCount: 23,
        totalSales: 45,
        views: 234
      }
    ]

    // Mock Products Digitais
    const mockDigitalProducts = [
      {
        businessId: this.businesses[0].id,
        name: 'Curso Completo de Web3 Development',
        description: 'Aprenda desenvolvimento Web3 do zero ao avançado com este curso tokenizado que inclui certificado NFT e acesso vitalício ao conteúdo.',
        shortDescription: 'Curso completo de Web3 com certificado NFT',
        price: 299,
        currency: 'BZR' as const,
        category: 'cursos-tokenizados',
        tags: ['Web3', 'Blockchain', 'Desenvolvimento', 'NFT'],
        images: [{
          id: 'img1',
          url: 'https://picsum.photos/400/300?random=digital1',
          alt: 'Curso Web3',
          isMain: true,
          order: 1
        }],
        stock: 0,
        isUnlimited: true,
        trackInventory: false,
        isTokenized: true,
        isNFT: true,
        isActive: true,
        isFeatured: true,
        isDigital: true,
        rating: 4.9,
        reviewCount: 156,
        totalSales: 523,
        views: 2340,
        // Campos específicos digitais
        royaltiesPct: 10,
        license: 'lifetime' as const,
        onchain: { 
          tokenId: 'digit_curso_001',
          chain: 'BazariChain' as const,
          txHash: '0x1234567890abcdef1234567890abcdef12345678'
        }
      },
      {
        businessId: this.businesses[0].id,
        name: 'E-book: DeFi Strategies 2024',
        description: 'Guia completo de estratégias DeFi tokenizado com updates exclusivos e acesso à comunidade privada de traders.',
        shortDescription: 'Guia definitivo de estratégias DeFi',
        price: 99,
        currency: 'BZR' as const,
        category: 'ebooks-digitais',
        tags: ['DeFi', 'Trading', 'Estratégias', 'Finanças'],
        images: [{
          id: 'img2',
          url: 'https://picsum.photos/400/300?random=digital2',
          alt: 'E-book DeFi',
          isMain: true,
          order: 1
        }],
        stock: 0,
        isUnlimited: true,
        trackInventory: false,
        isTokenized: true,
        isNFT: false,
        isActive: true,
        isFeatured: false,
        isDigital: true,
        rating: 4.6,
        reviewCount: 89,
        totalSales: 234,
        views: 1456,
        royaltiesPct: 5,
        license: 'days90' as const,
        onchain: {
          tokenId: 'digit_ebook_002', 
          chain: 'BazariChain' as const,
          txHash: '0x2345678901bcdef01234567890abcdef23456789'
        }
      },
      {
        businessId: this.businesses[1].id,
        name: 'NFT Art: Cosmic Collection #47',
        description: 'Arte digital exclusiva da coleção Cosmic, criada por artista verificado com direitos de revenda na DEX.',
        shortDescription: 'Arte digital exclusiva colecionável',
        price: 0.8,
        currency: 'BZR' as const,
        category: 'colecionaveis-digitais',
        tags: ['NFT', 'Arte', 'Colecionável', 'Exclusivo'],
        images: [{
          id: 'img3',
          url: 'https://picsum.photos/400/300?random=digital3',
          alt: 'NFT Cosmic',
          isMain: true,
          order: 1
        }],
        stock: 1,
        isUnlimited: false,
        trackInventory: true,
        isTokenized: true,
        isNFT: true,
        isActive: true,
        isFeatured: true,
        isDigital: true,
        rating: 4.8,
        reviewCount: 34,
        totalSales: 1,
        views: 567,
        royaltiesPct: 7.5,
        license: 'lifetime' as const,
        onchain: {
          tokenId: 'digit_nft_003',
          chain: 'BazariChain' as const,
          txHash: '0x3456789012cdef012345678901bcdef034567890'
        }
      },
      {
        businessId: this.businesses[0].id,
        name: 'Software: Trading Bot Pro',
        description: 'Bot de trading automatizado para DEX com estratégias avançadas e dashboard em tempo real.',
        shortDescription: 'Bot de trading automatizado profissional',
        price: 450,
        currency: 'BZR' as const,
        category: 'software',
        tags: ['Software', 'Trading', 'Bot', 'Automação'],
        images: [{
          id: 'img4',
          url: 'https://picsum.photos/400/300?random=digital4',
          alt: 'Trading Bot',
          isMain: true,
          order: 1
        }],
        stock: 100,
        isUnlimited: false,
        trackInventory: true,
        isTokenized: true,
        isNFT: false,
        isActive: true,
        isFeatured: false,
        isDigital: true,
        rating: 4.4,
        reviewCount: 67,
        totalSales: 89,
        views: 1234,
        royaltiesPct: 15,
        license: 'days30' as const,
        onchain: {
          tokenId: 'digit_soft_004',
          chain: 'BazariChain' as const
        }
      },
      {
        businessId: this.businesses[1].id,
        name: 'Sound Pack: Synthwave Collection',
        description: 'Coleção de samples e loops synthwave tokenizada com licença comercial inclusa.',
        shortDescription: 'Pack de samples synthwave profissional',
        price: 75,
        currency: 'BZR' as const,
        category: 'midias-digitais',
        tags: ['Música', 'Samples', 'Synthwave', 'Produção'],
        images: [{
          id: 'img5',
          url: 'https://picsum.photos/400/300?random=digital5',
          alt: 'Sound Pack',
          isMain: true,
          order: 1
        }],
        stock: 50,
        isUnlimited: false,
        trackInventory: true,
        isTokenized: true,
        isNFT: false,
        isActive: true,
        isFeatured: true,
        isDigital: true,
        rating: 4.7,
        reviewCount: 42,
        totalSales: 127,
        views: 890,
        royaltiesPct: 12,
        license: 'lifetime' as const,
        onchain: {
          tokenId: 'digit_sound_006',
          chain: 'BazariChain' as const
        }
      }
    ]

    // Criar produtos mock
    const allProducts = [...mockPhysicalProducts, ...mockDigitalProducts]
    for (const productData of allProducts) {
      await this.createProduct({
        ...productData,
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    console.log(`✅ Marketplace inicializado com ${this.businesses.length} negócios e ${this.products.length} produtos`)
  }

  // ============================================
  // MÉTODOS DE ESTATÍSTICAS
  // ============================================

  async getStats() {
    const digitalProducts = this.products.filter(p => p.isDigital)
    const physicalProducts = this.products.filter(p => !p.isDigital)
    
    return {
      products: {
        total: this.products.length,
        digital: digitalProducts.length,
        physical: physicalProducts.length,
        tokenized: this.products.filter(p => p.isTokenized).length
      },
      businesses: {
        total: this.businesses.length,
        verified: this.businesses.filter(b => b.isVerified).length,
        tokenized: this.businesses.filter(b => b.isTokenized).length
      },
      categories: this.categoryService.getStats()
    }
  }
}

// Instância singleton
export const marketplaceService = new MarketplaceService()

// Exports para compatibilidade
export default marketplaceService
export { SearchFilters, SearchResult }