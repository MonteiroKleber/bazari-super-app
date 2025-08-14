// src/pages/social/SocialPostCreate.tsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Textarea } from '@shared/ui/Textarea'
import { Badge } from '@shared/ui/Badge'
import { useSocial } from '@features/social/hooks/useSocial'
import { useTranslation } from '@app/i18n/useTranslation'

export const SocialPostCreate: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { createPost } = useSocial()
  
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMediaUpload, setShowMediaUpload] = useState(false)

  const maxLength = 280
  const remainingChars = maxLength - content.length
  const isOverLimit = remainingChars < 0
  const isNearLimit = remainingChars <= 20 && remainingChars > 0

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      
      // Criar preview da mídia
      const reader = new FileReader()
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
    setShowMediaUpload(false)
  }

  const handleSubmit = async () => {
    if (!content.trim() || isOverLimit) return

    setIsSubmitting(true)
    
    try {
      // Simular upload de mídia se houver
      let mediaData = null
      if (mediaFile && mediaPreview) {
        // Em implementação real, faria upload para IPFS
        mediaData = {
          type: mediaFile.type.startsWith('image/') ? 'image' as const : 'video' as const,
          url: mediaPreview // Em produção seria a URL do IPFS
        }
      }

      // Criar o post
      await createPost(content, mediaData)
      
      // Redirecionar para o feed
      navigate('/social')
    } catch (error) {
      console.error('Erro ao criar post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/social')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-dark-900">
              {t('social.create', 'Criar Post')}
            </h1>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-dark-600"
            >
              ✕ Cancelar
            </Button>
          </div>
          <p className="text-dark-600 mt-2">
            Compartilhe suas ideias com a comunidade Bazari
          </p>
        </div>

        {/* Formulário de Criação */}
        <Card className="p-6">
          {/* Avatar e Campo de Texto */}
          <div className="flex space-x-3 mb-4">
            <img
              src="/icons/avatar-default.svg"
              alt="Seu avatar"
              className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-primary-100"
            />
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder={t('social.newPost', 'O que você quer publicar?')}
                rows={6}
                className={`resize-none ${
                  isOverLimit ? 'border-red-500 focus:border-red-500' : ''
                }`}
                autoFocus
              />
              
              {/* Contador de Caracteres */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  {isNearLimit && (
                    <Badge variant="warning" size="sm">
                      ⚠️ Próximo ao limite
                    </Badge>
                  )}
                  {isOverLimit && (
                    <Badge variant="danger" size="sm">
                      🚫 Limite excedido
                    </Badge>
                  )}
                </div>
                <span className={`text-sm ${
                  isOverLimit ? 'text-red-600' : 
                  isNearLimit ? 'text-yellow-600' : 'text-dark-600'
                }`}>
                  {remainingChars} caracteres restantes
                </span>
              </div>
            </div>
          </div>

          {/* Preview de Mídia */}
          {mediaPreview && (
            <div className="mb-4 relative">
              <div className="rounded-lg overflow-hidden border border-sand-200">
                {mediaFile?.type.startsWith('image/') ? (
                  <img
                    src={mediaPreview}
                    alt="Preview da imagem"
                    className="w-full max-h-64 object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full max-h-64"
                  />
                )}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={removeMedia}
                className="absolute top-2 right-2"
              >
                ✕
              </Button>
            </div>
          )}

          {/* Upload de Mídia */}
          {showMediaUpload && !mediaPreview && (
            <div className="mb-4">
              <Card className="border-2 border-dashed border-sand-300 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-dark-600 mb-4">
                    Arraste uma imagem ou vídeo aqui, ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload">
                    <Button variant="outline" className="cursor-pointer">
                      📎 Selecionar arquivo
                    </Button>
                  </label>
                </div>
              </Card>
            </div>
          )}

          {/* Ferramentas */}
          <div className="flex items-center justify-between pt-4 border-t border-sand-200">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                className="flex items-center space-x-2"
              >
                <span>📷</span>
                <span>Mídia</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                disabled
              >
                <span>📍</span>
                <span>Local</span>
                <Badge size="sm" variant="secondary">Em breve</Badge>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                disabled
              >
                <span>🏷️</span>
                <span>Tags</span>
                <Badge size="sm" variant="secondary">Em breve</Badge>
              </Button>
            </div>

            {/* Botão de Publicar */}
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isOverLimit || isSubmitting}
              loading={isSubmitting}
              className="px-6"
            >
              {t('social.publish', 'Publicar')}
            </Button>
          </div>
        </Card>

        {/* Dicas */}
        <Card className="p-4 mt-6 bg-primary-50 border-primary-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">
                Dicas para um bom post
              </h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Use hashtags para aumentar o alcance</li>
                <li>• Adicione imagens para mais engajamento</li>
                <li>• Seja autêntico e genuíno</li>
                <li>• Interaja com outros usuários</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}