export interface Business {
  id: string
  ownerId: string
  name: string
  description: string
  category: string
  images: string[]
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  
  // Métricas
  rating: number
  reviewsCount: number
  salesCount: number
  
  // Status
  status: 'active' | 'inactive' | 'suspended'
  verified: boolean
  createdAt: Date
  updatedAt: Date
}
