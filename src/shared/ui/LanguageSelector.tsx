import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageContext } from '@app/i18n/LanguageProvider'
import { useTranslation } from '@app/i18n/useTranslation'
import { Language } from '@app/i18n/i18n'
import { GlobeIcon, CheckIcon } from '../icons'

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
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GlobeIcon size={18} />
          <span className="text-lg">
            {currentLanguage === 'pt' ? '🇧🇷' : currentLanguage === 'en' ? '🇺🇸' : '🇪🇸'}
          </span>
          <span className="text-sm font-medium">
            {availableLanguages.find(lang => lang.code === currentLanguage)?.nativeName}
          </span>
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-48"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {availableLanguages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                    currentLanguage === language.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">
                    {language.code === 'pt' ? '🇧🇷' : language.code === 'en' ? '🇺🇸' : '🇪🇸'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{language.name}</div>
                  </div>
                  {currentLanguage === language.code && (
                    <CheckIcon size={20} className="text-primary-600" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Versão modal completa
  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <GlobeIcon size={48} className="mx-auto mb-4 text-primary-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('selector', 'title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('selector', 'chooseLanguage')}
              </p>
            </div>

            {/* Opção do idioma do dispositivo */}
            <motion.button
              onClick={handleDeviceLanguage}
              className="w-full p-4 mb-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
            </motion.button>

            {/* Lista de idiomas */}
            <div className="space-y-2">
              {availableLanguages.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                    currentLanguage === language.code
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
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
                  <AnimatePresence>
                    {currentLanguage === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckIcon size={24} className="text-primary-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
