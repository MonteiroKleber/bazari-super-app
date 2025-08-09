export interface User {
  id: string
  address: string
  name: string
  email?: string
  bio?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  marketValue?: number
  
  // Reputação
  reputation: number
  followersCount: number
  followingCount: number
  postsCount: number
}
