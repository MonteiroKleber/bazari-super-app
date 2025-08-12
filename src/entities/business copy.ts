export interface Business {
  id: string
  ownerId: string
  name: string
  description: string
  category: BusinessCategory
  subcategories: string[]
  images: string[]
  coverImage?: string
  location?: BusinessLocation
  contact: BusinessContact
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  nftMetadata?: NFTMetadata
  
  // Métricas
  rating: number
  reviewsCount: number
  salesCount: number
  revenue: number
  
  // Status
  status: 'active' | 'inactive' | 'suspended'
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BusinessCategory {
  level1: string
  level2: string
  level3?: string
  level4?: string
}

export interface BusinessLocation {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface BusinessContact {
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
}
