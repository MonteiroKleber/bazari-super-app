// src/features/social/components/PostCard.tsx

import React, { useState } from 'react'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Textarea } from '@shared/ui/Textarea'
import { Post } from '../types/social.types'
import { socialService } from '../services/socialService'

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string, comment: string) => void
  onShare?: (postId: string) => void
  currentUserId?: string
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  currentUserId = 'current_user'
}) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)

  const handleLike = () => {
    onLike?.(post.id)
  }

  const handleComment = async () => {
    if (!newComment.trim()) return
    
    setIsCommenting(true)
    try {
      onComment?.(post.id, newComment)
      setNewComment('')
      setShowComments(true)
    } finally {
      setIsCommenting(false)
    }
  }

  const handleShare = () => {
    onShare?.(post.id)
    // Simular feedback visual
    const button = document.querySelector(`[data-share-id="${post.id}"]`)
    if (button) {
      button.classList.add('animate-pulse')
      setTimeout(() => button.classList.remove('animate-pulse'), 1000)
    }
  }

  const timeAgo = socialService.formatTimeAgo(post.createdAt)

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
      {/* Header do Post */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0">
          <img
            src={post.avatarUrl || '/icons/avatar-default.svg'}
            alt={`Avatar de ${post.authorName}`}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-dark-900">{post.authorName}</h3>
            {post.authorId === currentUserId && (
              <Badge variant="primary" size="sm">Você</Badge>
            )}
          </div>
          <p className="text-sm text-dark-600">{timeAgo}</p>
        </div>
      </div>

      {/* Conteúdo do Post */}
      <div className="mb-4">
        <p className="text-dark-800 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Mídia (se houver) */}
        {post.media && (
          <div className="mt-4 rounded-lg overflow-hidden">
            {post.media.type === 'image' ? (
              <img
                src={post.media.url}
                alt="Mídia do post"
                className="w-full max-h-96 object-cover"
              />
            ) : (
              <video
                src={post.media.url}
                controls
                className="w-full max-h-96"
              />
            )}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="flex items-center justify-between text-sm text-dark-600 mb-4 py-2 border-t border-sand-200">
        <div className="flex space-x-4">
          <span>{post.stats.likes} curtidas</span>
          <span>{post.stats.comments} comentários</span>
          <span>{post.stats.shares} compartilhamentos</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between border-t border-sand-200 pt-4">
        <Button
          variant={post.isLiked ? 'primary' : 'ghost'}
          size="sm"
          onClick={handleLike}
          className="flex items-center space-x-2 flex-1 justify-center"
        >
          <span className={post.isLiked ? '❤️' : '🤍'}>
            {post.isLiked ? '❤️' : '🤍'}
          </span>
          <span>Curtir</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 flex-1 justify-center"
        >
          <span>💬</span>
          <span>Comentar</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          data-share-id={post.id}
          className="flex items-center space-x-2 flex-1 justify-center"
        >
          <span>🔄</span>
          <span>Compartilhar</span>
        </Button>
      </div>

      {/* Seção de Comentários */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-sand-200">
          {/* Formulário de novo comentário */}
          <div className="flex space-x-3 mb-4">
            <img
              src="/icons/avatar-default.svg"
              alt="Seu avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
                rows={2}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!newComment.trim() || isCommenting}
                  loading={isCommenting}
                >
                  Comentar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de comentários mockados */}
          <div className="space-y-3">
            {post.stats.comments > 0 && (
              <div className="bg-sand-50 rounded-lg p-3">
                <div className="flex space-x-2 items-start">
                  <img
                    src="/icons/avatar-default.svg"
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-dark-900">
                        Maria Santos
                      </span>
                      <span className="text-xs text-dark-600">há 2 min</span>
                    </div>
                    <p className="text-sm text-dark-800 mt-1">
                      Que legal! Parabéns pela iniciativa! 👏
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}