// src/pages/social/SocialFeed.tsx

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { PostCard } from '@features/social/components/PostCard'
import { useSocial } from '@features/social/hooks/useSocial'
import { useTranslation } from '@app/i18n/useTranslation'

export const SocialFeed: React.FC = () => {
  const { t } = useTranslation()
  const { posts, loading, toggleLike, sharePost, commentPost } = useSocial()
  const [loadingMore, setLoadingMore] = useState(false)
  const [displayPosts, setDisplayPosts] = useState(5) // Simular paginação

  useEffect(() => {
    // Simular carregamento inicial
    if (posts.length === 0) {
      // Os posts já são carregados pelo useSocial
    }
  }, [posts])

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setDisplayPosts(prev => prev + 5)
      setLoadingMore(false)
    }, 1000)
  }

  const visiblePosts = posts.slice(0, displayPosts)
  const hasMorePosts = displayPosts < posts.length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-sand-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-sand-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-sand-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-sand-200 rounded"></div>
                  <div className="h-4 bg-sand-200 rounded w-3/4"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-8 bg-sand-200 rounded w-20"></div>
                  <div className="h-8 bg-sand-200 rounded w-24"></div>
                  <div className="h-8 bg-sand-200 rounded w-28"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header do Feed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-dark-900">
              {t('social.feed', 'Feed')}
            </h1>
            <Link to="/social/post">
              <Button className="flex items-center space-x-2">
                <span>✍️</span>
                <span>{t('social.create', 'Criar Post')}</span>
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <Card className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="text-primary-700">
                  <span className="font-semibold">{posts.length}</span> posts
                </div>
                <div className="text-primary-700">
                  <span className="font-semibold">
                    {posts.reduce((acc, post) => acc + post.stats.likes, 0)}
                  </span> curtidas
                </div>
                <div className="text-primary-700">
                  <span className="font-semibold">
                    {posts.reduce((acc, post) => acc + post.stats.comments, 0)}
                  </span> comentários
                </div>
              </div>
              <div className="text-primary-600">
                🌟 Comunidade ativa
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Posts */}
        {visiblePosts.length > 0 ? (
          <div className="space-y-6">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onComment={commentPost}
                onShare={sharePost}
              />
            ))}

            {/* Botão Carregar Mais */}
            {hasMorePosts && (
              <div className="text-center py-6">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  loading={loadingMore}
                  className="px-8"
                >
                  {loadingMore ? 'Carregando...' : 'Carregar mais posts'}
                </Button>
              </div>
            )}

            {/* Fim do Feed */}
            {!hasMorePosts && posts.length > 5 && (
              <Card className="p-6 text-center bg-sand-50">
                <div className="text-dark-600">
                  <span className="text-2xl mb-2 block">🎉</span>
                  <p>Você viu todos os posts!</p>
                  <p className="text-sm mt-1">
                    Que tal criar um novo post ou ver suas notificações?
                  </p>
                  <div className="flex justify-center space-x-3 mt-4">
                    <Link to="/social/post">
                      <Button size="sm">Criar Post</Button>
                    </Link>
                    <Link to="/social/notifications">
                      <Button variant="outline" size="sm">Ver Notificações</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* Estado Vazio */
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-xl font-semibold text-dark-900 mb-2">
              Nenhum post ainda
            </h2>
            <p className="text-dark-600 mb-6 max-w-md mx-auto">
              Seja o primeiro a compartilhar algo! Crie seu primeiro post e comece a interagir com a comunidade Bazari.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/social/post">
                <Button className="w-full sm:w-auto">
                  ✍️ Criar meu primeiro post
                </Button>
              </Link>
              <Link to="/social/timeline">
                <Button variant="outline" className="w-full sm:w-auto">
                  📊 Ver timeline
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}