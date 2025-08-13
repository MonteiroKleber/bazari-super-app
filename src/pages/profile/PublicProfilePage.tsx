// src/pages/profile/PublicProfilePage.tsx
// ✅ Tela pública de perfil (versão estável)
// 🎨 Paleta Libervia/Bazari: #8B0000, #FFB300, #1C1C1C, #F5F1E0

import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Atenção: mantenha esses imports iguais aos do projeto
import { Button, Card, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui'
import { Icons } from '@shared/ui'

// -----------------------------------------------------
// Utils seguras (evitam "can't convert item to string")
// -----------------------------------------------------
const safeString = (v: unknown, fallback = ''): string => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  try {
    return String(v)
  } catch {
    return fallback
  }
}

const safeNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === 'number' && !isNaN(v)) return v
  if (typeof v === 'string') {
    const n = Number(v)
    return isNaN(n) ? fallback : n
  }
  return fallback
}

const safeFormatNumber = (v: unknown): string => {
  const n = safeNumber(v, 0)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

const safeCurrency = (v: unknown): string => {
  const n = safeNumber(v, 0)
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
  } catch {
    return `R$ ${n.toFixed(2)}`
  }
}

const safeDate = (v: unknown): string => {
  if (!v) return ''
  try {
    const d = v instanceof Date ? v : new Date(String(v))
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

// -----------------------------------------------------
// SafeIcon: não quebra se o ícone não existir em Icons
// -----------------------------------------------------
const SafeIcon = ({
  name,
  className
}: {
  name:
    | 'ArrowRight'
    | 'X'
    | 'Package'
    | 'Check'
    | 'Building'
    | 'Heart'
    | 'User'
    | 'TrendingUp'
  className?: string
}) => {
  const Fallback = (Icons as any)['TrendingUp'] || (() => null)
  const Comp = (Icons as any)[name] || Fallback
  return <Comp className={className} />
}

// -----------------------------------------------------
// Tipos e mocks (somente dados públicos)
// -----------------------------------------------------
interface PublicPost {
  id: string
  content: string
  images?: string[]
  createdAt: Date | string
  likes: number
  comments: number
  shares: number
  isPublic: boolean
}

interface PublicStats {
  followers: number
  following: number
  posts: number
  publicTokenValue?: number
  reputation: number
}

interface PublicToken {
  id: string
  name: string
  symbol: string
  value: number
  isPublic: boolean
  description: string
}

const mockPublicProfile = {
  id: 'user-123',
  name: 'Ana Silva',
  username: 'ana_web3',
  bio: '🌱 Desenvolvedora Web3 & Sustentabilidade | 🔗 Blockchain Evangelist | 📈 Investidora DeFi',
  avatar:
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  coverImage:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
  location: 'São Paulo, Brasil',
  website: 'https://anasilva.dev',
  isTokenized: true,
  isVerified: true,
  isFollowing: false,
  joinedAt: '2022-08-15',
  stats: {
    followers: 3240,
    following: 1180,
    posts: 89,
    publicTokenValue: 2150.75,
    reputation: 98
  } as PublicStats
}

const mockPublicPosts: PublicPost[] = [
  {
    id: '1',
    content:
      'Acabei de lançar meu novo NFT collection focado em sustentabilidade! 🌍 Cada token representa uma árvore plantada em parceria com ONGs ambientais. #Web3ForGood #Sustentabilidade',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'
    ],
    createdAt: '2024-01-18T09:15:00',
    likes: 156,
    comments: 42,
    shares: 18,
    isPublic: true
  },
  {
    id: '2',
    content:
      'Palestra sobre "Futuro das Finanças Descentralizadas" foi incrível! Obrigada a todos que compareceram no Web3 Summit. Em breve disponibilizarei os slides. 🚀',
    createdAt: '2024-01-15T16:30:00',
    likes: 89,
    comments: 23,
    shares: 11,
    isPublic: true
  },
  {
    id: '3',
    content:
      'Reflexão: A tokenização de perfis está revolucionando como construímos reputação digital. Meu token pessoal valorizou 22% este trimestre! 📈 #DeFi #PersonalBranding',
    createdAt: '2024-01-12T11:45:00',
    likes: 203,
    comments: 67,
    shares: 34,
    isPublic: true
  }
]

const mockPublicTokens: PublicToken[] = [
  {
    id: 'ana-token-1',
    name: 'Ana Silva Token',
    symbol: 'ANA',
    value: 2150.75,
    isPublic: true,
    description: 'Token pessoal representando valor profissional e reputação'
  }
]

// -----------------------------------------------------
// Componente
// -----------------------------------------------------
export const PublicProfilePage: FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState<boolean>(mockPublicProfile.isFollowing)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Simula carregamento; evita suspense em input síncrono
  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(t)
  }, [userId])

  const handleFollowToggle = () => setIsFollowing(prev => !prev)
  const handleLikePost = (postId: string) => {
    console.log('Like público no post:', postId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto mb-4" />
          <p className="text-[#1C1C1C]">Carregando perfil público...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1E0]">
      {/* HERO */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Capa */}
        <div
          className="h-64 bg-gradient-to-r from-[#8B0000] to-[#FFB300] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${safeString(mockPublicProfile.coverImage)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/60 to-transparent" />
        </div>

        {/* Info */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative -mt-20 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                {/* Avatar */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <img
                    src={safeString(mockPublicProfile.avatar, '/default-avatar.png')}
                    alt={safeString(mockPublicProfile.name, 'Avatar do usuário')}
                    className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl"
                  />
                  {mockPublicProfile.isTokenized && (
                    <div className="absolute -bottom-1 -right-1 bg-[#FFB300] rounded-full p-2 border-2 border-white">
                      <SafeIcon name="Package" className="w-4 h-4 text-[#1C1C1C]" />
                    </div>
                  )}
                </motion.div>

                {/* Dados + ações */}
                <div className="flex-1 mt-4 sm:mt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-[#1C1C1C]">
                          {safeString(mockPublicProfile.name, 'Usuário')}
                        </h1>
                        {mockPublicProfile.isVerified && (
                          <SafeIcon name="Check" className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-[#8B0000] font-medium">
                        @{safeString(mockPublicProfile.username, 'usuario')}
                      </p>
                    </div>

                    <motion.div
                      className="flex space-x-3 mt-4 sm:mt-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        onClick={handleFollowToggle}
                        className={`${
                          isFollowing
                            ? 'bg-gray-200 text-[#1C1C1C] hover:bg-gray-300'
                            : 'bg-[#8B0000] hover:bg-[#8B0000]/90 text-white'
                        }`}
                      >
                        <SafeIcon name="User" className="w-4 h-4 mr-2" />
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                      </Button>

                      {/* Botões outline sem depender de variantes internas */}
                      <Button className="border border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white bg-transparent">
                        <SafeIcon name="X" className="w-4 h-4 mr-2" />
                        Mensagem
                      </Button>

                      <Button className="border border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-[#1C1C1C] bg-transparent">
                        <SafeIcon name="ArrowRight" className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Bio */}
                  <motion.p
                    className="mt-3 text-[#1C1C1C] max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {safeString(mockPublicProfile.bio)}
                  </motion.p>

                  {/* Extras */}
                  <div className="flex flex-wrap items-center space-x-4 mt-3 text-sm text-gray-600">
                    {mockPublicProfile.location && (
                      <div className="flex items-center">
                        <SafeIcon name="Building" className="w-4 h-4 mr-1" />
                        {safeString(mockPublicProfile.location)}
                      </div>
                    )}
                    {mockPublicProfile.website && (
                      <div className="flex items-center">
                        <SafeIcon name="X" className="w-4 h-4 mr-1" />
                        <a
                          href={safeString(mockPublicProfile.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8B0000] hover:underline"
                        >
                          {safeString(mockPublicProfile.website).replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <SafeIcon name="User" className="w-4 h-4 mr-1" />
                      Desde {safeDate(mockPublicProfile.joinedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MÉTRICAS */}
      <motion.div
        className="px-4 sm:px-6 lg:px-8 -mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="text-center p-4 border border-[#8B0000]/20 hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeFormatNumber(mockPublicProfile.stats.followers)}
              </div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </Card>

            <Card className="text-center p-4 border border-[#8B0000]/20 hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeFormatNumber(mockPublicProfile.stats.following)}
              </div>
              <div className="text-sm text-gray-600">Seguindo</div>
            </Card>

            <Card className="text-center p-4 border border-[#8B0000]/20 hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeNumber(mockPublicProfile.stats.posts)}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </Card>

            <Card className="text-center p-4 border border-[#FFB300]/30 bg-[#FFB300]/10 hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-[#8B0000]">
                {safeCurrency(mockPublicProfile.stats.publicTokenValue)}
              </div>
              <div className="text-sm text-[#8B0000]">Token Público</div>
            </Card>

            <Card className="text-center p-4 border border-[#8B0000]/20 hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-[#1C1C1C]">
                {safeNumber(mockPublicProfile.stats.reputation)}%
              </div>
              <div className="text-sm text-gray-600">Reputação</div>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* CONTEÚDO – Tabs NÃO controladas (evita warnings/erros de string) */}
      <motion.div
        className="px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-[#8B0000]/20">
              <TabsTrigger
                value="posts"
                className="text-[#1C1C1C] data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
              >
                <SafeIcon name="Heart" className="w-4 h-4 mr-2" />
                Posts Públicos
              </TabsTrigger>
              <TabsTrigger
                value="tokens"
                className="text-[#1C1C1C] data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
              >
                <SafeIcon name="Package" className="w-4 h-4 mr-2" />
                Tokens
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="text-[#1C1C1C] data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
              >
                <SafeIcon name="User" className="w-4 h-4 mr-2" />
                Sobre
              </TabsTrigger>
            </TabsList>

            {/* POSTS */}
            <TabsContent value="posts" className="space-y-6 mt-6">
              {mockPublicPosts.map((post, index) => (
                <motion.div
                  key={safeString(post.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="p-6 border border-[#8B0000]/20 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3 mb-4">
                      <img
                        src={safeString(mockPublicProfile.avatar, '/default-avatar.png')}
                        alt={safeString(mockPublicProfile.name, 'Avatar')}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-[#1C1C1C]">
                            {safeString(mockPublicProfile.name, 'Usuário')}
                          </span>
                          <span className="text-[#8B0000]">
                            @{safeString(mockPublicProfile.username, 'usuario')}
                          </span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500 text-sm">{safeDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-[#1C1C1C] leading-relaxed">{safeString(post.content)}</p>
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

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-[#8B0000] transition-colors"
                        aria-label="Curtir"
                      >
                        <SafeIcon name="Heart" className="w-5 h-5" />
                        <span>{safeNumber(post.likes)}</span>
                      </button>

                      <button
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                        aria-label="Comentar"
                      >
                        <SafeIcon name="X" className="w-5 h-5" />
                        <span>{safeNumber(post.comments)}</span>
                      </button>

                      <button
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                        aria-label="Compartilhar"
                      >
                        <SafeIcon name="ArrowRight" className="w-5 h-5" />
                        <span>{safeNumber(post.shares)}</span>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* TOKENS */}
            <TabsContent value="tokens" className="mt-6">
              <div className="space-y-6">
                {mockPublicTokens.map((token, index) => (
                  <motion.div
                    key={safeString(token.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className="p-6 bg-gradient-to-r from-[#FFB300]/10 to-[#8B0000]/10 border border-[#FFB300]/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[#1C1C1C]">
                          {safeString(token.name)}
                        </h3>
                        <Badge className="bg-[#FFB300] text-[#1C1C1C]">
                          {safeString(token.symbol)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4">{safeString(token.description)}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Valor Público</div>
                          <div className="text-2xl font-bold text-[#8B0000]">
                            {safeCurrency(token.value)}
                          </div>
                        </div>

                        <Button disabled className="bg-gray-200 text-gray-500 cursor-not-allowed">
                          Visualização Pública
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* SOBRE */}
            <TabsContent value="about" className="mt-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 border border-[#8B0000]/20">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">
                    Informações Públicas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <SafeIcon name="Building" className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">{safeString(mockPublicProfile.location)}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <SafeIcon name="TrendingUp" className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <a
                        href={safeString(mockPublicProfile.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B0000] hover:underline"
                      >
                        {safeString(mockPublicProfile.website).replace(/^https?:\/\//, '')}
                      </a>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <SafeIcon name="User" className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">
                        Membro desde {safeDate(mockPublicProfile.joinedAt)}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-[#8B0000]/20">
                  <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Conquistas Públicas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <SafeIcon name="Check" className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">Perfil Verificado</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <SafeIcon name="Package" className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">Perfil Tokenizado</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#FFB300] rounded-full flex items-center justify-center">
                        <SafeIcon name="Heart" className="w-4 h-4 text-[#1C1C1C]" />
                      </div>
                      <span className="text-[#1C1C1C]">
                        {safeFormatNumber(mockPublicProfile.stats.followers)} Seguidores
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      <div className="h-16" />
    </div>
  )
}

export default PublicProfilePage
