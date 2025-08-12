export interface Business {
  id: string
  name: string
  description: string
  ownerAddress: string
  category: BusinessCategory
  subcategory?: string
  
  // Informações básicas
  email?: string
  phone?: string
  website?: string
  
  // Localização
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  
  // Mídia
  logoUrl?: string
  logoCid?: string
  bannerUrl?: string
  bannerCid?: string
  images?: string[]
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  tokenContract?: string
  
  // Métricas
  rating: number
  reviewCount: number
  totalSales: number
  verificationLevel: 'none' | 'basic' | 'verified' | 'premium'
  
  // Status
  isActive: boolean
  isVerified: boolean
  isFeatured: boolean
  
  // Social
  followers: number
  socialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }
  
  // Horários
  businessHours?: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  
  // Metadata
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BusinessCategory {
  id: string
  name: string
  level: number
  parent?: string
  children?: string[]
  icon?: string
  description?: string
}

export interface BusinessStats {
  totalBusinesses: number
  verifiedBusinesses: number
  tokenizedBusinesses: number
  categoriesWithBusinesses: number
  topCategories: Array<{
    category: string
    count: number
  }>
}
