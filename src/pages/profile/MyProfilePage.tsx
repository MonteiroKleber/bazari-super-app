// src/pages/profile/MyProfilePage.tsx
// ✅ ATUALIZADO: Tela final do Perfil Tokenizado com correções de segurança
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { Button, Card, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui'
import { Icons } from '@shared/ui'

// ✅ UTILS DE RENDERIZAÇÃO SEGURA (evita TypeError: can't convert item to string)
const safeString = (value: unknown, fallback = ''): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value.toString()
  return String(value)
}

const safeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

const safeFormatNumber = (value: unknown): string => {
  const num = safeNumber(value, 0)
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const safeCurrency = (value: unknown): string => {
  const numValue = safeNumber(value, 0)
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  } catch {
    return `R$ ${numValue.toFixed(2)}`
  }
}

const safeDate = (value: unknown): string => {
  if (!value) return ''
  try {
    const date = value instanceof Date ? value : new Date(String(value))
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

// ✅ COMPONENTES LOCAIS DO PERFIL (apenas neste módulo)
interface ProfilePost {
  id: string
  content: string
  images?: string[]
  createdAt: Date
  likes: number
  comments: number
  shares: number
  isLiked: boolean
}

interface ProfileStats {
  followers: number
  following: number
  posts: number
  tokenValue: number
  reputation: number
  totalEarnings: number
}

// ✅ DADOS MOCK LOCAIS (não afeta outras funcionalidades)
const mockUserProfile = {
  id: '1',
  name: 'Maria Santos',
  username: 'maria_santos',
  bio: 'Empreendedora digital apaixonada por Web3 e sustentabilidade. 🌱 Criando o futuro descentralizado.',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
  location: 'São Paulo, Brasil',
  website: 'https://mariasantos.com',
  isTokenized: true,
  tokenId: 'BZR-0001',
  isVerified: true,
  joinedAt: '2023-01-15',
  stats: {
    followers: 2847,
    following: 892,
    posts: 156,
    tokenValue: 1250.80,
    reputation: 95,
    totalEarnings: 5780.50
  } as ProfileStats
}

const mockPosts: ProfilePost[] = [
  {
    id: '1',
    content: 'Acabei de tokenizar meu novo projeto sustentável! 🌱 A descentralização é o futuro da economia verde. Quem mais está construindo soluções Web3 para o meio ambiente?',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'],
    createdAt: new Date('2024-01-15T10:30:00'),
    likes: 89,
    comments: 23,
    shares: 12,
    isLiked: false
  },
  {
    id: '2',
    content: 'Workshop sobre NFTs e tokenização de perfis foi incrível! Obrigada a todos que participaram. Em breve teremos mais eventos. 🚀',
    createdAt: new Date('2024-01-12T14:20:00'),
    likes: 145,
    comments: 34,
    shares: 8,
    isLiked: true
  },
  {
    id: '3',
    content: 'A economia descentralizada está revolucionando como fazemos negócios. Meu token pessoal valorizou 15% este mês! 📈 #Web3 #DeFi',
    createdAt: new Date('2024-01-08T16:45:00'),
    likes: 67,
    comments: 15,
    shares: 5,
    isLiked: false
  }
]

export const MyProfilePage: FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, currentAccount } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [posts, setPosts] = useState<ProfilePost[]>(mockPosts)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }
  }, [isAuthenticated, navigate])

  // ✅ HANDLERS LOCAIS (apenas UI, sem afetar outras funcionalidades)
  const handleLikePost = (postId: string) => {
    if (typeof postId !== 'string') return
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: safeNumber(post.likes) + (post.isLiked ? -1 : 1)
          }
        : post
    ))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ HEADER/HERO COM CAPA */}
      <div className="relative">
        {/* Imagem de Capa */}
        <div 
          className="h-64 bg-gradient-to-r from-[#8B0000] to-[#FFB300] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${safeString(mockUserProfile.coverImage)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 to-transparent"></div>
        </div>

        {/* Informações do Perfil */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative -mt-20 pb-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                <div className="relative">
                  <img
                    src={safeString(mockUserProfile.avatar, '/default-avatar.png')} // 🔧 Fallback seguro
                    alt={safeString(mockUserProfile.name, 'Avatar do usuário')} // 🔧 Alt seguro
                    className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl"
                  />
                  {/* Badge de Tokenização */}
                  {mockUserProfile.isTokenized && (
                    <div className="absolute -bottom-1 -right-1 bg-[#FFB300] rounded-full p-2 border-2 border-white">
                      <Icons.Package className="w-4 h-4 text-[#1C1C1C]" />
                    </div>
                  )}
                </div>

                {/* Info e Ações */}
                <div className="flex-1 mt-4 sm:mt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-[#1C1C1C]">
                          {safeString(mockUserProfile.name, 'Usuário')}
                        </h1>
                        {mockUserProfile.isVerified && (
                          <Icons.Check className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-[#8B0000] font-medium">
                        @{safeString(mockUserProfile.username, 'usuario')}
                      </p>
                    </div>

                    {/* Ações do Perfil */}
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                      <Button
                        onClick={() => navigate('/profile/edit')}
                        variant="outline"
                        className="border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white"
                      >
                        <Icons.Settings className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                      <Button className="bg-[#8B0000] hover:bg-[#8B0000]/90 text-white">
                        <Icons.Plus className="w-4 h-4 mr-2" />
                        Criar Post
                      </Button>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="mt-3 text-[#1C1C1C] max-w-2xl">
                    {safeString(mockUserProfile.bio)}
                  </p>

                  {/* Informações Adicionais */}
                  <div className="flex flex-wrap items-center space-x-4 mt-3 text-sm text-gray-600">
                    {mockUserProfile.location && (
                      <div className="flex items-center">
                        <Icons.Building className="w-4 h-4 mr-1" />
                        {safeString(mockUserProfile.location)}
                      </div>
                    )}
                    {mockUserProfile.website && (
                      <div className="flex items-center">
                        <Icons.X className="w-4 h-4 mr-1" />
                        <a 
                          href={safeString(mockUserProfile.website)} 
                          className="text-[#8B0000] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {safeString(mockUserProfile.website).replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Icons.User className="w-4 h-4 mr-1" />
                      Desde {safeDate(mockUserProfile.joinedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MÉTRICAS E ESTATÍSTICAS */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {/* Seguidores */}
            <Card className="text-center p-4 border border-[#8B0000]/20">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeFormatNumber(mockUserProfile.stats.followers)}
              </div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </Card>

            {/* Seguindo */}
            <Card className="text-center p-4 border border-[#8B0000]/20">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeFormatNumber(mockUserProfile.stats.following)}
              </div>
              <div className="text-sm text-gray-600">Seguindo</div>
            </Card>

            {/* Posts */}
            <Card className="text-center p-4 border border-[#8B0000]/20">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeNumber(mockUserProfile.stats.posts)}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </Card>

            {/* Valor do Token */}
            <Card className="text-center p-4 border border-[#FFB300]/30 bg-[#FFB300]/10">
              <div className="text-2xl font-bold text-[#8B0000]">
                {safeCurrency(mockUserProfile.stats.tokenValue)}
              </div>
              <div className="text-sm text-[#8B0000]">Token BZR</div>
            </Card>

            {/* Reputação */}
            <Card className="text-center p-4 border border-[#8B0000]/20">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeNumber(mockUserProfile.stats.reputation)}%
              </div>
              <div className="text-sm text-gray-600">Reputação</div>
            </Card>
          </div>
        </div>
      </div>

      {/* ✅ CONTEÚDO PRINCIPAL - TABS */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white border border-[#8B0000]/20">
              <TabsTrigger value="posts" className="text-[#1C1C1C] data-[state=active]:bg-[#8B0000] data-[state=active]:text-white">
                <Icons.Heart className="w-4 h-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="tokens" className="text-[#1C1C1C] data-[state=active]:bg-[#8B0000] data-[state=active]:text-white">
                <Icons.Package className="w-4 h-4 mr-2" />
                Meu Token
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-[#1C1C1C] data-[state=active]:bg-[#8B0000] data-[state=active]:text-white">
                <Icons.Settings className="w-4 h-4 mr-2" />
                Estatísticas
              </TabsTrigger>
            </TabsList>

            {/* ✅ FEED DE POSTS (Rede Social Integrada) */}
            <TabsContent value="posts" className="space-y-6 mt-6">
              {posts.map((post) => (
                <Card key={safeString(post.id)} className="p-6 border border-[#8B0000]/20">
                  {/* Header do Post */}
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={safeString(mockUserProfile.avatar, '/default-avatar.png')}
                      alt={safeString(mockUserProfile.name, 'Avatar')}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#1C1C1C]">
                          {safeString(mockUserProfile.name, 'Usuário')}
                        </span>
                        <span className="text-[#8B0000]">
                          @{safeString(mockUserProfile.username, 'usuario')}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 text-sm">
                          {safeDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Post */}
                  <div className="mb-4">
                    <p className="text-[#1C1C1C] leading-relaxed">
                      {safeString(post.content)}
                    </p>
                    {post.images && post.images.length > 0 && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img
                          src={safeString(post.images[0], '/placeholder-image.png')}
                          alt="Imagem do post"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Ações do Post */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 ${
                        post.isLiked ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <Icons.Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{safeNumber(post.likes)}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500">
                      <Icons.X className="w-5 h-5" />
                      <span>{safeNumber(post.comments)}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500">
                      <Icons.ArrowRight className="w-5 h-5" />
                      <span>{safeNumber(post.shares)}</span>
                    </button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* ✅ SEÇÃO DE TOKENS */}
            <TabsContent value="tokens" className="mt-6">
              <div className="space-y-6">
                {/* Token Principal */}
                <Card className="p-6 bg-gradient-to-r from-[#FFB300]/10 to-[#8B0000]/10 border border-[#FFB300]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#1C1C1C]">Meu Token Pessoal</h3>
                    <Badge className="bg-[#FFB300] text-[#1C1C1C]">
                      {safeString(mockUserProfile.tokenId, 'N/A')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-600">Valor Atual</div>
                      <div className="text-2xl font-bold text-[#8B0000]">
                        {safeCurrency(mockUserProfile.stats.tokenValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Ganhos Totais</div>
                      <div className="text-2xl font-bold text-green-600">
                        {safeCurrency(mockUserProfile.stats.totalEarnings)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Variação (30d)</div>
                      <div className="text-2xl font-bold text-green-600">+15.3%</div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Button className="bg-[#8B0000] hover:bg-[#8B0000]/90 text-white">
                      Vender Token
                    </Button>
                    <Button variant="outline" className="border-[#8B0000] text-[#8B0000]">
                      Histórico
                    </Button>
                  </div>
                </Card>

                {/* Benefícios da Tokenização */}
                <Card className="p-6 border border-[#8B0000]/20">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Benefícios da Tokenização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <Icons.Check className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">Identidade verificada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <Icons.Check className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">Ativo comercializável</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <Icons.Check className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">Votação DAO</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <Icons.Check className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">Recompensas exclusivas</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* ✅ ESTATÍSTICAS DETALHADAS */}
            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border border-[#8B0000]/20">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Atividade Recente</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posts este mês</span>
                      <span className="font-semibold text-[#1C1C1C]">{safeNumber(12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Novos seguidores</span>
                      <span className="font-semibold text-[#1C1C1C]">+{safeNumber(284)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engajamento médio</span>
                      <span className="font-semibold text-[#1C1C1C]">8.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reputação</span>
                      <span className="font-semibold text-green-600">
                        {safeNumber(mockUserProfile.stats.reputation)}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-[#8B0000]/20">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Performance do Token</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variação 7d</span>
                      <span className="font-semibold text-green-600">+5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variação 30d</span>
                      <span className="font-semibold text-green-600">+15.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume negociado</span>
                      <span className="font-semibold text-[#1C1C1C]">
                        {safeCurrency(12450)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Holders</span>
                      <span className="font-semibold text-[#1C1C1C]">{safeNumber(89)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}