// src/features/wallet/components/AssetTabs.tsx

import { FC, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent, Input } from '@shared/ui'
import { Icons } from '@shared/ui'
import { TokenList } from './TokenList'
import { NftGrid } from './NftGrid'
import { useWallet } from '../hooks/useWallet'

type TabValue = 'tokens' | 'nfts'

export const AssetTabs: FC = () => {
  const { 
    searchTokens, 
    searchNfts,
    tokenSearchQuery,
    nftSearchQuery,
    isLoadingTokens,
    isLoadingNfts,
    tokens,
    nfts
  } = useWallet()
  
  const [activeTab, setActiveTab] = useState<TabValue>('tokens')
  const [localSearchQueries, setLocalSearchQueries] = useState({
    tokens: '',
    nfts: ''
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue)
  }

  const handleTokenSearch = (query: string) => {
    setLocalSearchQueries(prev => ({ ...prev, tokens: query }))
    searchTokens(query)
  }

  const handleNftSearch = (query: string) => {
    setLocalSearchQueries(prev => ({ ...prev, nfts: query }))
    searchNfts(query)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <TabsList className="w-full grid grid-cols-2 bg-transparent p-0">
            <TabsTrigger 
              value="tokens" 
              className="flex items-center space-x-2 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:bg-transparent"
            >
              <Icons.Coins className="h-5 w-5" />
              <span>Tokens</span>
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {tokens.length}
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="nfts"
              className="flex items-center space-x-2 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:bg-transparent"
            >
              <Icons.Image className="h-5 w-5" />
              <span>NFTs</span>
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {nfts.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tokens Tab */}
          <TabsContent value="tokens" className="mt-0">
            <div className="space-y-4">
              {/* Token Search */}
              <div className="relative">
                <Input
                  placeholder="Buscar tokens por nome ou símbolo..."
                  value={localSearchQueries.tokens}
                  onChange={(e) => handleTokenSearch(e.target.value)}
                  leftIcon={<Icons.Search className="h-4 w-4 text-gray-400" />}
                  className="w-full"
                />
                {isLoadingTokens && (
                  <div className="absolute right-3 top-3">
                    <Icons.Loader className="h-4 w-4 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Info */}
              {localSearchQueries.tokens && (
                <div className="text-sm text-gray-600">
                  {isLoadingTokens ? (
                    'Buscando tokens...'
                  ) : (
                    `${tokens.length} token${tokens.length !== 1 ? 's' : ''} encontrado${tokens.length !== 1 ? 's' : ''}`
                  )}
                </div>
              )}

              {/* Token List */}
              <TokenList />
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-0">
            <div className="space-y-4">
              {/* NFT Search */}
              <div className="relative">
                <Input
                  placeholder="Buscar NFTs por nome ou coleção..."
                  value={localSearchQueries.nfts}
                  onChange={(e) => handleNftSearch(e.target.value)}
                  leftIcon={<Icons.Search className="h-4 w-4 text-gray-400" />}
                  className="w-full"
                />
                {isLoadingNfts && (
                  <div className="absolute right-3 top-3">
                    <Icons.Loader className="h-4 w-4 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Info */}
              {localSearchQueries.nfts && (
                <div className="text-sm text-gray-600">
                  {isLoadingNfts ? (
                    'Buscando NFTs...'
                  ) : (
                    `${nfts.length} NFT${nfts.length !== 1 ? 's' : ''} encontrado${nfts.length !== 1 ? 's' : ''}`
                  )}
                </div>
              )}

              {/* NFT Grid */}
              <NftGrid />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}