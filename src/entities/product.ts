export interface Product {
  id: string
  businessId: string
  name: string
  description: string
  shortDescription?: string
  
  // Preços
  price: number
  originalPrice?: number
  currency: 'BZR' | 'USD' | 'BRL'
  
  // Categoria
  category: string
  subcategory?: string
  tags: string[]
  
  // Mídia
  images: ProductImage[]
  videos?: string[]
  
  // Estoque
  stock: number
  sku?: string
  isUnlimited: boolean
  trackInventory: boolean
  
  // Variações
  variants?: ProductVariant[]
  
  // Shipping
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  isNFT: boolean
  
  // Status
  isActive: boolean
  isFeatured: boolean
  isDigital: boolean
  
  // Métricas
  rating: number
  reviewCount: number
  totalSales: number
  views: number
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  slug: string
  
  // Metadata
  createdAt: Date
  updatedAt: Date

royaltiesPct?: number              // 0–25
  license?: 'lifetime' | 'days30' | 'days90'
  onchain?: { 
    tokenId: string
    txHash?: string
    chain: 'BazariChain' 
  }

}

export interface ProductImage {
  id: string
  url: string
  cid?: string
  alt: string
  isMain: boolean
  order: number
}

export interface ProductVariant {
  id: string
  name: string
  options: VariantOption[]
  price?: number
  stock?: number
  sku?: string
  image?: string
}

export interface VariantOption {
  name: string
  value: string
}

export interface Service {
  id: string
  businessId: string
  name: string
  description: string
  
  // Preços
  price: number
  priceType: 'fixed' | 'hourly' | 'daily' | 'project'
  currency: 'BZR' | 'USD' | 'BRL'
  
  // Categoria
  category: string
  subcategory?: string
  tags: string[]
  
  // Mídia
  images: ProductImage[]
  
  // Duração
  duration?: number
  durationType?: 'minutes' | 'hours' | 'days' | 'weeks'
  
  // Disponibilidade
  isAvailable: boolean
  maxBookings?: number
  
  // Tokenização
  isTokenized: boolean
  isNFT: boolean
  
  // Status
  isActive: boolean
  isFeatured: boolean
  isOnline: boolean
  
  // Métricas
  rating: number
  reviewCount: number
  totalBookings: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId?: string
  serviceId?: string
  businessId: string
  quantity: number
  selectedVariant?: ProductVariant
  price: number
  addedAt: Date
}

export interface Cart {
  id: string
  userAddress: string
  items: CartItem[]
  totalAmount: number
  currency: string
  createdAt: Date
  updatedAt: Date
}
