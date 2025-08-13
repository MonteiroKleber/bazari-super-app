import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Business } from '@entities/business'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface BusinessCardProps {
  business: Business
  onFollow?: (businessId: string) => void
  isFollowing?: boolean
}

export const BusinessCard: FC<BusinessCardProps> = ({
  business,
  onFollow,
  isFollowing = false
}) => {
  const getVerificationBadge = () => {
    switch (business.verificationLevel) {
      case 'premium':
        return <Badge variant="primary">Premium</Badge>
      case 'verified':
        return <Badge variant="success">Verificado</Badge>
      case 'basic':
        return <Badge variant="secondary">Básico</Badge>
      default:
        return null
    }
  }

  return (
    <Card hover className="group">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-lg overflow-hidden">
        {business.bannerUrl ? (
          <img
            src={business.bannerUrl}
            alt={`Banner ${business.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500" />
        )}
        
        {/* Badges no Banner */}
        <div className="absolute top-2 right-2 space-y-1">
          {business.isFeatured && (
            <Badge variant="warning" size="sm">
              Destaque
            </Badge>
          )}
          {business.isTokenized && (
            <Badge variant="primary" size="sm">
              <Icons.Star className="w-3 h-3 mr-1" />
              NFT
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Logo e Informações Básicas */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-16 h-16 -mt-8 bg-white rounded-lg border-2 border-white shadow-md overflow-hidden flex-shrink-0">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`Logo ${business.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Icons.Building className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Link to={`/marketplace/business/${business.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-primary-600 truncate">
                  {business.name}
                </h3>
              </Link>
              {getVerificationBadge()}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {business.description}
            </p>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-center space-x-1 mb-3">
          <Icons.MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {business.address.city}, {business.address.state}
          </span>
        </div>

        {/* Categoria */}
        <div className="mb-3">
          <Badge variant="secondary" size="sm">
            {business.category.icon} {business.category.name}
          </Badge>
        </div>

        {/* Rating e Estatísticas */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icons.Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(business.rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {business.rating.toFixed(1)} ({business.reviewCount})
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span>{business.followers} seguidores</span>
          </div>
        </div>

        {/* Tags */}
        {business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {business.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
            {business.tags.length > 3 && (
              <Badge variant="outline" size="sm">
                +{business.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex space-x-2">
          <Link to={`/marketplace/business/${business.slug ?? business.id}`} className="flex-1">
            <Button size="sm" className="w-full">
              Ver Loja
            </Button>
          </Link>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onFollow?.(business.id)}
          >
            <Icons.Heart className={`w-4 h-4 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
