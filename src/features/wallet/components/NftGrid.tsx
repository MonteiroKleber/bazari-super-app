// src/features/wallet/components/NftGrid.tsx

import { FC } from 'react'
import { Button, Badge } from '@shared/ui'
import { Icons } from '@shared/ui'
import { useWallet } from '../hooks/useWallet'
import type { NftItem } from '../hooks/useWallet'

interface NftCardProps {
  nft: NftItem
  onClick?: () => void
}

const NftCard: FC<NftCardProps> = ({ nft, onClick }) => {
  const getRarityColor = (rarity: string | number): string => {
    if (typeof rarity === 'string') {
      switch (rarity.toLowerCase()) {
        case 'legendary': return 'bg-gradient-to-br from-yellow-400 to-orange-500'
        case 'epic': return 'bg-gradient-to-br from-purple-400 to-purple-600'
        case 'rare': return 'bg-gradient-to-br from-blue-400 to-blue-600'
        case 'common': return 'bg-gradient-to-br from-gray-400 to-gray-600'
        default: return 'bg-gradient-to-br from-gray-400 to-gray-600'
      }
    }
    return 'bg-gradient-to-br from-gray-400 to-gray-600'
  }

  const getRarityBadgeVariant = (rarity: string | number): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    if (typeof rarity === 'string') {
      switch (rarity.toLowerCase()) {
        case 'legendary': return 'warning'
        case 'epic': return 'secondary'
        case 'rare': return 'primary'
        case 'common': return 'default'
        default: return 'default'
      }
    }
    return 'default'
  }

  return (
    <div 
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* NFT Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {nft.image ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div className={`w-full h-full flex items-center justify-center ${
          nft.image ? 'hidden' : ''
        }`}>
          <Icons.Image className="h-12 w-12 text-gray-400" />
        </div>

        {/* Rarity Badge */}
        {nft.attributes?.rarity && (
          <div className="absolute top-2 left-2">
            <Badge 
              variant={getRarityBadgeVariant(nft.attributes.rarity)}
              className="text-xs font-medium"
            >
              {nft.attributes.rarity}
            </Badge>
          </div>
        )}

        {/* Level Badge */}
        {nft.attributes?.level && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="text-xs bg-black/70 text-white">
              Lv. {nft.attributes.level}
            </Badge>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        
        {/* Hover actions */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-white/90 backdrop-blur-sm text-gray-900 border-white/50 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              console.log('🔮 NFT detail page em breve:', nft.id)
            }}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-3">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {nft.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {nft.collection}
          </p>
        </div>

        {/* Attributes */}
        {nft.attributes && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(nft.attributes).slice(0, 2).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const NftGrid: FC = () => {
  const { 
    nfts, 
    isLoadingNfts, 
    hasMoreNfts, 
    loadMoreNfts,
    nftSearchQuery,
    activeAccount 
  } = useWallet()

  const handleNftClick = (nft: NftItem) => {
    // Future: Navigate to NFT detail page or modal
    console.log('🔮 NFT detail page em breve:', nft.id)
  }

  if (!activeAccount) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Icons.Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-medium mb-1">Selecione uma conta</p>
        <p className="text-sm">para ver os NFTs</p>
      </div>
    )
  }

  if (isLoadingNfts && nfts.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Icons.Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-medium mb-1">
          {nftSearchQuery ? 'Nenhum NFT encontrado' : 'Nenhum NFT disponível'}
        </p>
        <p className="text-sm">
          {nftSearchQuery 
            ? 'Tente uma busca diferente'
            : 'Os NFTs aparecerão aqui quando disponíveis'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* NFT Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <NftCard
            key={nft.id}
            nft={nft}
            onClick={() => handleNftClick(nft)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreNfts && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 hover:border-yellow-500 px-8"
            onClick={loadMoreNfts}
            disabled={isLoadingNfts}
          >
            {isLoadingNfts ? (
              <>
                <Icons.Loader className="h-4 w-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              'Carregar mais'
            )}
          </Button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {isLoadingNfts && nfts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`loading-${i}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}