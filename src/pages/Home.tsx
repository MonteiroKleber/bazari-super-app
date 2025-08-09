import React, { useState, useEffect } from 'react'
import { useTranslation } from '@app/i18n/useTranslation'
import { useLanguageContext } from '@app/i18n/LanguageProvider'
import { LanguageSelector } from '@shared/ui/LanguageSelector'

const Home = () => {
  const { t: tHome } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const { isLanguageSelected } = useLanguageContext()
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  // Mostra o modal de seleção de idioma se o usuário ainda não selecionou
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLanguageSelected) {
        setShowLanguageModal(true)
      }
    }, 1000) // Delay de 1 segundo para melhor UX

    return () => clearTimeout(timer)
  }, [isLanguageSelected])

  const handleLanguageSelect = () => {
    setShowLanguageModal(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700'>
      {/* Header */}
      <header className='relative z-10 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center'>
              <span className='text-xl font-bold text-primary-900'>B</span>
            </div>
            <h1 className='text-2xl font-bold text-white'>Bazari</h1>
          </div>
          
          {/* Menu de navegação */}
          <nav className='hidden md:flex space-x-8'>
            <a href='#features' className='text-white hover:text-secondary-300 transition-colors'>
              {tHome('features')}
            </a>
            <a href='#about' className='text-white hover:text-secondary-300 transition-colors'>
              {tHome('about')}
            </a>
            <a href='#roadmap' className='text-white hover:text-secondary-300 transition-colors'>
              {tHome('roadmap')}
            </a>
          </nav>

          {/* Botões de ação + Seletor de idioma */}
          <div className='flex items-center space-x-4'>
            {/* Seletor de idioma compacto */}
            <LanguageSelector />
            
            <button
              type='button'
              className='hidden sm:block px-6 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-primary-900 transition-all duration-200'
            >
              {tHome('login')}
            </button>
            <button
              type='button'
              className='px-6 py-2 bg-secondary-500 text-primary-900 rounded-lg hover:bg-secondary-400 transition-colors duration-200 font-medium'
            >
              {tHome('getStarted')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='relative z-10 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-5xl md:text-7xl font-bold text-white mb-6'>
            {tHome('title')}
            <span className='block text-secondary-400'>{tHome('subtitle')}</span>
          </h2>
          
          <p className='text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto'>
            {tHome('description')}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
            <button
              type='button'
              className='w-full sm:w-auto px-8 py-4 bg-secondary-500 text-primary-900 rounded-xl hover:bg-secondary-400 transition-colors duration-200 font-semibold text-lg'
            >
              {tHome('createAccount')}
            </button>
            <button
              type='button'
              className='w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-900 transition-all duration-200 font-semibold text-lg'
            >
              {tHome('exploreDemo')}
            </button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>100%</div>
              <div className='text-white'>{tHome('stats', 'decentralized')}</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>0%</div>
              <div className='text-white'>{tHome('stats', 'platformFees')}</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>∞</div>
              <div className='text-white'>{tHome('stats', 'possibilities')}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Background decorativo */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl' />
      </div>

      {/* Modal de seleção de idioma */}
      {showLanguageModal && (
        <LanguageSelector 
          showModal={true} 
          onLanguageSelect={handleLanguageSelect}
          onClose={() => setShowLanguageModal(false)}
        />
      )}
    </div>
  )
}

export default Home
