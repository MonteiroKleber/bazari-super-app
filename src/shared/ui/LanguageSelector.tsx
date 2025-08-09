import React, { useState } from 'react'
import { useLanguageContext } from '@app/i18n/LanguageProvider'
import { useTranslation } from '@app/i18n/useTranslation'
import { Language } from '@app/i18n/i18n'

interface LanguageSelectorProps {
  onLanguageSelect?: (language: Language) => void
  showModal?: boolean
  onClose?: () => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
  showModal = false,
  onClose
}) => {
  const { currentLanguage, changeLanguage, availableLanguages, setLanguageSelected } = useLanguageContext()
  const { t } = useTranslation('language')
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language)
    setLanguageSelected(true)
    
    if (onLanguageSelect) {
      onLanguageSelect(language)
    }
    
    setIsOpen(false)
    
    if (onClose) {
      onClose()
    }
  }

  const handleDeviceLanguage = () => {
    const deviceLang = navigator.language?.startsWith('pt') ? 'pt' as Language :
                      navigator.language?.startsWith('es') ? 'es' as Language : 'en' as Language
    handleLanguageChange(deviceLang)
  }

  // Versão dropdown compacta
  if (!showModal) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <span className="text-lg">
            {currentLanguage === 'pt' ? '🇧🇷' : currentLanguage === 'en' ? '🇺🇸' : '🇪🇸'}
          </span>
          <span className="text-sm font-medium">
            {availableLanguages.find(lang => lang.code === currentLanguage)?.nativeName}
          </span>
          <svg className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                  currentLanguage === language.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                <span className="text-lg">
                  {language.code === 'pt' ? '🇧🇷' : language.code === 'en' ? '🇺🇸' : '🇪🇸'}
                </span>
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{language.name}</div>
                </div>
                {currentLanguage === language.code && (
                  <svg className="w-5 h-5 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Versão modal completa
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('selector', 'title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('selector', 'chooseLanguage')}
          </p>
        </div>

        {/* Opção do idioma do dispositivo */}
        <button
          onClick={handleDeviceLanguage}
          className="w-full p-4 mb-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold">{t('selector', 'deviceLanguage')}</div>
              <div className="text-sm opacity-90">{t('selector', 'autoDetected')}</div>
            </div>
          </div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Lista de idiomas */}
        <div className="space-y-2">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                currentLanguage === language.code
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {language.code === 'pt' ? '🇧🇷' : language.code === 'en' ? '🇺🇸' : '🇪🇸'}
                </span>
                <div>
                  <div className="font-semibold">{language.nativeName}</div>
                  <div className="text-sm opacity-70">{language.name}</div>
                </div>
              </div>
              {currentLanguage === language.code && (
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
