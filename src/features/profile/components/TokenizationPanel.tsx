import { FC, useState } from 'react'
import { useTokenization } from '../hooks/useTokenization'
import type { User, UserTokenMetadata } from '@entities/user'
import { useProfileTranslation } from '@app/i18n/useTranslation'

interface TokenizationPanelProps {
  profile: User
  canEdit?: boolean
}

export const TokenizationPanel: FC<TokenizationPanelProps> = ({ profile, canEdit = false }) => {
  const { t } = useProfileTranslation()
  const {
    tokenizing,
    progress,
    error,
    tokenizeProfile,
    checkTokenizationEligibility,
    generateDefaultMetadata,
    reset
  } = useTokenization()

  const [showTokenizeForm, setShowTokenizeForm] = useState(false)

  const handleTokenize = async () => {
    if (!profile || profile.isTokenized) return

    try {
      const metadata = generateDefaultMetadata(profile)
      await tokenizeProfile(metadata)
      setShowTokenizeForm(false)
    } catch (error) {
      // Error já tratado no hook
    }
  }

  const eligibility = checkTokenizationEligibility({
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar,
    reputation: profile.reputation
  })

  if (profile.isTokenized) {
    return (
      <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">🪙</span>
            {t('profileTokenized')}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
              {t('tokenized')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('tokenInfo')}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">{t('tokenId')}:</span>
                <span className="ml-2 font-mono text-gray-900">{profile.tokenId}</span>
              </div>
              {profile.marketValue && (
                <div>
                  <span className="text-gray-600">{t('marketValue')}:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {profile.marketValue} BZR
                  </span>
                </div>
              )}
              {profile.tokenMetadata && (
                <div>
                  <span className="text-gray-600">{t('lastUpdated')}:</span>
                  <span className="ml-2 text-gray-900">
                    {profile.tokenMetadata.lastUpdated.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('tokenBenefits')}</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {t('tradableAsset')}
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {t('verifiedIdentity')}
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {t('marketplaceBonus')}
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {t('daoVotingPower')}
              </li>
            </ul>
          </div>
        </div>

        {canEdit && (
          <div className="mt-6 pt-4 border-t border-secondary-200">
            <div className="flex space-x-4">
              <button className="btn-secondary text-sm">
                {t('viewNFT')}
              </button>
              <button className="btn-secondary text-sm">
                {t('updateMetadata')}
              </button>
              <button className="btn-secondary text-sm">
                {t('transferToken')}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('profileNotTokenized')}</h3>
        <p className="text-gray-600">{t('profileNotTokenizedDescription')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🪙</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('tokenizeProfile')}</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {t('tokenizeProfileDescription')}
        </p>
      </div>

      {!eligibility.canTokenize ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {t('tokenizationRequirements')}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{eligibility.reason}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Benefits */}
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{t('tokenizationBenefits')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>{t('becomesTradableAsset')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>{t('verifiedIdentityBadge')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>{t('marketplaceBonuses')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>{t('enhancedDaoRights')}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          {tokenizing && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">{t('tokenizing')}</span>
                <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {progress < 30 ? t('uploadingMetadata') : 
                 progress < 80 ? t('creatingNFT') : t('finalizingTokenization')}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-error-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-error-800">{t('tokenizationError')}</h3>
                  <div className="mt-2 text-sm text-error-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={reset}
                      className="text-sm bg-error-100 text-error-800 px-3 py-1 rounded hover:bg-error-200 transition-colors"
                    >
                      {t('tryAgain')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action */}
          <div className="text-center">
            <button
              onClick={handleTokenize}
              disabled={tokenizing}
              className="btn-primary disabled:opacity-50"
            >
              {tokenizing ? t('tokenizing') : t('tokenizeMyProfile')}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              {t('tokenizationDisclaimer')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
