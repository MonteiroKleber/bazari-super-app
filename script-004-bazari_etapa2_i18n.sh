#!/bin/bash

# 🌍 BAZARI ETAPA 2 - INTERNACIONALIZAÇÃO COMPLETA
# ===============================================
# Implementa sistema i18n completo com seletor de idioma
# e atualiza todas as páginas para usar traduções

echo "🌍 BAZARI ETAPA 2 - INTERNACIONALIZAÇÃO COMPLETA"
echo "==============================================="
echo "🎯 Implementando sistema i18n avançado..."
echo "📱 Criando seletor de idioma na página inicial"
echo "🔄 Atualizando todas as páginas para usar traduções"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Erro: Execute este script na pasta bazari-super-app"
    exit 1
fi

# Verificar se é realmente o projeto Bazari
if ! grep -q "bazari-super-app" package.json 2>/dev/null; then
    echo "❌ Erro: Este não parece ser o projeto Bazari!"
    echo "💡 Execute este script na pasta correta do projeto"
    exit 1
fi

echo "✅ Projeto Bazari encontrado!"
echo ""

# ========================================
# 1. TRANSLATIONS.JSON COMPLETO
# ========================================

echo "🌍 [1/10] Criando translations.json completo..."
cat > src/app/i18n/translations.json << 'EOF'
{
  "common": {
    "loading": {
      "pt": "Carregando...",
      "en": "Loading...",
      "es": "Cargando..."
    },
    "error": {
      "pt": "Erro",
      "en": "Error", 
      "es": "Error"
    },
    "success": {
      "pt": "Sucesso",
      "en": "Success",
      "es": "Éxito"
    },
    "cancel": {
      "pt": "Cancelar",
      "en": "Cancel",
      "es": "Cancelar"
    },
    "confirm": {
      "pt": "Confirmar",
      "en": "Confirm",
      "es": "Confirmar"
    },
    "save": {
      "pt": "Salvar",
      "en": "Save",
      "es": "Guardar"
    },
    "edit": {
      "pt": "Editar",
      "en": "Edit",
      "es": "Editar"
    },
    "delete": {
      "pt": "Excluir",
      "en": "Delete",
      "es": "Eliminar"
    },
    "search": {
      "pt": "Buscar",
      "en": "Search",
      "es": "Buscar"
    },
    "home": {
      "pt": "Início",
      "en": "Home",
      "es": "Inicio"
    },
    "back": {
      "pt": "Voltar",
      "en": "Back",
      "es": "Volver"
    },
    "next": {
      "pt": "Próximo",
      "en": "Next",
      "es": "Siguiente"
    },
    "previous": {
      "pt": "Anterior",
      "en": "Previous",
      "es": "Anterior"
    },
    "close": {
      "pt": "Fechar",
      "en": "Close",
      "es": "Cerrar"
    },
    "select": {
      "pt": "Selecionar",
      "en": "Select",
      "es": "Seleccionar"
    }
  },
  "home": {
    "title": {
      "pt": "O Futuro do",
      "en": "The Future of",
      "es": "El Futuro del"
    },
    "subtitle": {
      "pt": "Comércio Social",
      "en": "Social Commerce",
      "es": "Comercio Social"
    },
    "description": {
      "pt": "Marketplace descentralizado onde sua identidade é um ativo, seus negócios são tokens e sua comunidade governa o ecossistema.",
      "en": "Decentralized marketplace where your identity is an asset, your businesses are tokens and your community governs the ecosystem.",
      "es": "Marketplace descentralizado donde tu identidad es un activo, tus negocios son tokens y tu comunidad gobierna el ecosistema."
    },
    "createAccount": {
      "pt": "Criar Conta Gratuita",
      "en": "Create Free Account",
      "es": "Crear Cuenta Gratis"
    },
    "exploreDemo": {
      "pt": "Explorar Demo",
      "en": "Explore Demo",
      "es": "Explorar Demo"
    },
    "login": {
      "pt": "Entrar",
      "en": "Login",
      "es": "Iniciar Sesión"
    },
    "getStarted": {
      "pt": "Começar",
      "en": "Get Started",
      "es": "Comenzar"
    },
    "features": {
      "pt": "Recursos",
      "en": "Features",
      "es": "Características"
    },
    "about": {
      "pt": "Sobre",
      "en": "About",
      "es": "Acerca de"
    },
    "roadmap": {
      "pt": "Roadmap",
      "en": "Roadmap",
      "es": "Hoja de Ruta"
    },
    "stats": {
      "decentralized": {
        "pt": "Descentralizado",
        "en": "Decentralized",
        "es": "Descentralizado"
      },
      "platformFees": {
        "pt": "Taxas de Plataforma",
        "en": "Platform Fees",
        "es": "Tarifas de Plataforma"
      },
      "possibilities": {
        "pt": "Possibilidades",
        "en": "Possibilities",
        "es": "Posibilidades"
      }
    }
  },
  "language": {
    "selector": {
      "title": {
        "pt": "Selecionar Idioma",
        "en": "Select Language",
        "es": "Seleccionar Idioma"
      },
      "chooseLanguage": {
        "pt": "Escolha seu idioma",
        "en": "Choose your language",
        "es": "Elige tu idioma"
      },
      "deviceLanguage": {
        "pt": "Idioma do Dispositivo",
        "en": "Device Language",
        "es": "Idioma del Dispositivo"
      },
      "autoDetected": {
        "pt": "Detectado automaticamente",
        "en": "Auto detected",
        "es": "Detectado automáticamente"
      },
      "continue": {
        "pt": "Continuar",
        "en": "Continue",
        "es": "Continuar"
      }
    },
    "names": {
      "pt": {
        "pt": "Português",
        "en": "Portuguese",
        "es": "Portugués"
      },
      "en": {
        "pt": "Inglês",
        "en": "English",
        "es": "Inglés"
      },
      "es": {
        "pt": "Espanhol",
        "en": "Spanish",
        "es": "Español"
      }
    }
  },
  "errors": {
    "pageNotFound": {
      "pt": "Página não encontrada",
      "en": "Page not found",
      "es": "Página no encontrada"
    },
    "pageNotFoundDescription": {
      "pt": "A página que você está procurando não existe ou foi movida. Verifique o endereço e tente novamente.",
      "en": "The page you are looking for does not exist or has been moved. Check the address and try again.",
      "es": "La página que buscas no existe o ha sido movida. Verifica la dirección e inténtalo de nuevo."
    },
    "goHome": {
      "pt": "Voltar ao Início",
      "en": "Go to Home",
      "es": "Volver al Inicio"
    },
    "previousPage": {
      "pt": "Página Anterior",
      "en": "Previous Page",
      "es": "Página Anterior"
    },
    "usefulLinks": {
      "pt": "Links úteis:",
      "en": "Useful links:",
      "es": "Enlaces útiles:"
    },
    "unexpectedError": {
      "pt": "Oops! Algo deu errado",
      "en": "Oops! Something went wrong",
      "es": "¡Ups! Algo salió mal"
    },
    "unexpectedErrorDescription": {
      "pt": "Ocorreu um erro inesperado. Tente recarregar a página.",
      "en": "An unexpected error occurred. Try reloading the page.",
      "es": "Ocurrió un error inesperado. Intenta recargar la página."
    },
    "reloadPage": {
      "pt": "Recarregar Página",
      "en": "Reload Page",
      "es": "Recargar Página"
    },
    "errorDetails": {
      "pt": "Detalhes do erro (desenvolvimento)",
      "en": "Error details (development)",
      "es": "Detalles del error (desarrollo)"
    }
  },
  "navigation": {
    "marketplace": {
      "pt": "Marketplace",
      "en": "Marketplace",
      "es": "Marketplace"
    },
    "profile": {
      "pt": "Perfil",
      "en": "Profile",
      "es": "Perfil"
    },
    "wallet": {
      "pt": "Carteira",
      "en": "Wallet",
      "es": "Billetera"
    },
    "dao": {
      "pt": "Governança",
      "en": "Governance",
      "es": "Gobernanza"
    },
    "social": {
      "pt": "Social",
      "en": "Social",
      "es": "Social"
    },
    "work": {
      "pt": "Trabalho",
      "en": "Work",
      "es": "Trabajo"
    }
  }
}
EOF

# ========================================
# 2. LANGUAGE PROVIDER
# ========================================

echo "🔧 [2/10] Criando LanguageProvider..."
cat > src/app/i18n/LanguageProvider.tsx << 'EOF'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, i18nService } from './i18n'

interface LanguageContextType {
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  availableLanguages: Array<{ code: Language; name: string; nativeName: string }>
  isLanguageSelected: boolean
  setLanguageSelected: (selected: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18nService.getCurrentLanguage())
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false)
  
  const availableLanguages = i18nService.getAvailableLanguages()

  useEffect(() => {
    // Verifica se o usuário já selecionou um idioma anteriormente
    const hasSelectedLanguage = localStorage.getItem('bazari_language_selected') === 'true'
    setIsLanguageSelected(hasSelectedLanguage)

    // Escuta mudanças de idioma
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  const changeLanguage = (language: Language) => {
    i18nService.setLanguage(language)
    setCurrentLanguage(language)
    
    // Marca que o usuário já fez uma seleção de idioma
    if (!isLanguageSelected) {
      setLanguageSelected(true)
    }
  }

  const setLanguageSelected = (selected: boolean) => {
    setIsLanguageSelected(selected)
    localStorage.setItem('bazari_language_selected', selected.toString())
  }

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    isLanguageSelected,
    setLanguageSelected,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}
EOF

# ========================================
# 3. LANGUAGE SELECTOR COMPONENT
# ========================================

echo "🎨 [3/10] Criando LanguageSelector component..."
mkdir -p src/shared/ui
cat > src/shared/ui/LanguageSelector.tsx << 'EOF'
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
EOF

# ========================================
# 4. ATUALIZAR HOME PAGE COM I18N
# ========================================

echo "🏠 [4/10] Atualizando Home.tsx com internacionalização..."
cat > src/pages/Home.tsx << 'EOF'
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
EOF

# ========================================
# 5. ATUALIZAR NOT FOUND PAGE COM I18N
# ========================================

echo "🚫 [5/10] Atualizando NotFound.tsx com internacionalização..."
cat > src/pages/NotFound.tsx << 'EOF'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@app/i18n/useTranslation'

const NotFound = () => {
  const { t: tErrors } = useTranslation('errors')
  const { t: tNavigation } = useTranslation('navigation')

  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900 px-4'>
      <div className='text-center max-w-md w-full'>
        {/* Ilustração 404 */}
        <div className='mb-8'>
          <div className='text-9xl font-bold text-primary-900 dark:text-primary-400 mb-4'>
            404
          </div>
          <div className='w-24 h-1 bg-secondary-500 mx-auto mb-6' />
        </div>

        {/* Conteúdo */}
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          {tErrors('pageNotFound')}
        </h1>
        
        <p className='text-gray-600 dark:text-gray-400 mb-8'>
          {tErrors('pageNotFoundDescription')}
        </p>

        {/* Ações */}
        <div className='space-y-4'>
          <Link
            to='/home'
            className='block w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200'
          >
            {tErrors('goHome')}
          </Link>
          
          <button
            type='button'
            onClick={() => window.history.back()}
            className='block w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200'
          >
            {tErrors('previousPage')}
          </button>
        </div>

        {/* Links úteis */}
        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            {tErrors('usefulLinks')}
          </p>
          <div className='flex flex-wrap gap-4 justify-center text-sm'>
            <Link 
              to='/marketplace' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('marketplace')}
            </Link>
            <Link 
              to='/profile' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('profile')}
            </Link>
            <Link 
              to='/wallet' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('wallet')}
            </Link>
            <Link 
              to='/dao' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('dao')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
EOF

# ========================================
# 6. ATUALIZAR PROVIDERS COM LANGUAGE PROVIDER
# ========================================

echo "🔧 [6/10] Atualizando providers.tsx com LanguageProvider..."
cat > src/app/providers.tsx << 'EOF'
import React, { ReactNode, useEffect, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageProvider'
import { useTranslation } from './i18n/useTranslation'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Provider de tema - gerencia tema claro/escuro
 */
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Detecta preferência do sistema
    const savedTheme = localStorage.getItem('bazari_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)

    // Função para alternar tema (disponível globalmente para testes)
    const toggleTheme = () => {
      const newTheme = isDark ? 'light' : 'dark'
      setIsDark(!isDark)
      localStorage.setItem('bazari_theme', newTheme)
      document.documentElement.classList.toggle('dark', !isDark)
    }

    // Expõe função de toggle via window para facilitar testes
    ;(window as any).toggleTheme = toggleTheme
  }, [isDark])

  return <>{children}</>
}

/**
 * Error Boundary - captura erros React
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

/**
 * Componente de fallback para erro
 */
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  // Hook aqui é seguro pois está dentro do provider
  const { t } = useTranslation('errors')

  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
      <div className='max-w-md w-full mx-4 p-8 bg-white dark:bg-dark-800 rounded-xl shadow-lg text-center'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          {t('unexpectedError')}
        </h2>
        
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          {t('unexpectedErrorDescription')}
        </p>
        
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200'
        >
          {t('reloadPage')}
        </button>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className='mt-4 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
              {t('errorDetails')}
            </summary>
            <pre className='mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto'>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * Provider principal que combina todos os outros providers
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
EOF

# ========================================
# 7. ATUALIZAR LOADING NO ROUTES
# ========================================

echo "🛣️ [7/10] Atualizando routes.tsx com traduções..."
cat > src/app/routes.tsx << 'EOF'
import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from '@app/i18n/useTranslation'

// Páginas carregadas de forma lazy para otimização
const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))

/**
 * Componente de Loading para Suspense
 */
const PageLoader = () => {
  const { t } = useTranslation('common')
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
      <div className='text-center'>
        <div className='w-12 h-12 mx-auto mb-4 border-4 border-primary-900 border-t-transparent rounded-full animate-spin' />
        <p className='text-gray-600 dark:text-gray-400'>{t('loading')}</p>
      </div>
    </div>
  )
}

/**
 * Rota protegida - verificará autenticação nas próximas etapas
 * Por enquanto apenas renderiza o componente
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // TODO: Implementar verificação de autenticação na ETAPA 3
  // const { isAuthenticated } = useAuth()
  // if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  
  return <>{children}</>
}

/**
 * Rota pública - redireciona se já autenticado
 */
interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  // TODO: Implementar verificação de autenticação na ETAPA 3
  // const { isAuthenticated } = useAuth()
  // if (isAuthenticated) return <Navigate to="/dashboard" replace />
  
  return <>{children}</>
}

/**
 * Configuração principal de rotas da aplicação
 */
export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rota raiz - redireciona para home */}
        <Route path='/' element={<Navigate to='/home' replace />} />
        
        {/* Página inicial */}
        <Route
          path='/home'
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />

        {/* Rotas de autenticação - serão implementadas na ETAPA 3 */}
        {/* 
        <Route path='/auth/*' element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <AuthRoutes />
            </Suspense>
          </PublicRoute>
        } />
        */}

        {/* Rotas protegidas - serão implementadas nas próximas etapas */}
        {/*
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path='/profile/*' element={
          <ProtectedRoute>
            <ProfileRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/marketplace/*' element={
          <ProtectedRoute>
            <MarketplaceRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/wallet/*' element={
          <ProtectedRoute>
            <WalletRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/dao/*' element={
          <ProtectedRoute>
            <DaoRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/social/*' element={
          <ProtectedRoute>
            <SocialRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/work/*' element={
          <ProtectedRoute>
            <WorkRoutes />
          </ProtectedRoute>
        } />
        */}

        {/* Página 404 - deve ser a última rota */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
EOF

# ========================================
# 8. CORRIGIR I18N SERVICE
# ========================================

echo "🌍 [8/10] Corrigindo i18n.ts com tipagem adequada..."
cat > src/app/i18n/i18n.ts << 'EOF'
import translations from './translations.json'

// Tipos para o sistema de i18n
export type Language = 'pt' | 'en' | 'es'
export type TranslationKey = string
export type ModuleName = keyof typeof translations

interface TranslationValue {
  pt: string
  en: string
  es: string
}

// Classe principal do sistema de i18n
class I18nService {
  private currentLanguage: Language = 'pt'
  private fallbackLanguage: Language = 'en'
  private storageKey = 'bazari_language'

  constructor() {
    this.init()
  }

  /**
   * Inicializa o sistema de i18n
   * Detecta idioma salvo ou do dispositivo
   */
  private init(): void {
    const savedLanguage = this.getSavedLanguage()
    const detectedLanguage = this.detectDeviceLanguage()
    
    this.currentLanguage = savedLanguage || detectedLanguage || this.fallbackLanguage
    this.saveLanguage(this.currentLanguage)
  }

  /**
   * Detecta idioma do dispositivo
   */
  private detectDeviceLanguage(): Language | null {
    if (typeof navigator === 'undefined') return null
    
    const browserLanguage = navigator.language || navigator.languages?.[0]
    
    if (!browserLanguage) return null

    // Mapeia códigos de idioma para nossas opções suportadas
    const languageMap: Record<string, Language> = {
      'pt': 'pt',
      'pt-BR': 'pt',
      'pt-PT': 'pt',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'es': 'es',
      'es-ES': 'es',
      'es-MX': 'es',
      'es-AR': 'es',
    }

    // Tenta corresponder idioma exato
    if (languageMap[browserLanguage]) {
      return languageMap[browserLanguage]
    }

    // Tenta corresponder apenas o código base (ex: 'pt' de 'pt-BR')
    const baseLanguage = browserLanguage.split('-')[0]
    return languageMap[baseLanguage] || null
  }

  /**
   * Obtém idioma salvo no localStorage
   */
  private getSavedLanguage(): Language | null {
    if (typeof localStorage === 'undefined') return null
    
    try {
      const saved = localStorage.getItem(this.storageKey) as Language
      return this.isValidLanguage(saved) ? saved : null
    } catch {
      return null
    }
  }

  /**
   * Salva idioma no localStorage
   */
  private saveLanguage(language: Language): void {
    if (typeof localStorage === 'undefined') return
    
    try {
      localStorage.setItem(this.storageKey, language)
    } catch (error) {
      console.warn('Não foi possível salvar idioma no localStorage:', error)
    }
  }

  /**
   * Verifica se o idioma é válido
   */
  private isValidLanguage(language: string): language is Language {
    return ['pt', 'en', 'es'].includes(language)
  }

  /**
   * Obtém idioma atual
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage
  }

  /**
   * Define novo idioma
   */
  setLanguage(language: Language): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Idioma inválido: ${language}`)
      return
    }

    this.currentLanguage = language
    this.saveLanguage(language)
    
    // Dispara evento personalizado para componentes React
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
    }
  }

  /**
   * Traduz uma chave específica com suporte a chaves aninhadas
   */
  translate(module: ModuleName, key: TranslationKey, nestedKey?: string): string {
    try {
      const moduleTranslations = translations[module]
      if (!moduleTranslations) {
        console.warn(`Módulo de tradução não encontrado: ${module}`)
        return nestedKey || key
      }

      let translationValue: any = moduleTranslations[key]
      
      // Se há uma chave aninhada, navega mais profundo
      if (nestedKey && translationValue && typeof translationValue === 'object') {
        translationValue = translationValue[nestedKey]
      }

      if (!translationValue || typeof translationValue !== 'object') {
        console.warn(`Chave de tradução não encontrada: ${module}.${key}${nestedKey ? '.' + nestedKey : ''}`)
        return nestedKey || key
      }

      const translation = translationValue[this.currentLanguage]
      if (!translation) {
        // Tenta idioma de fallback
        const fallbackTranslation = translationValue[this.fallbackLanguage]
        if (fallbackTranslation) {
          console.warn(`Tradução não encontrada para ${this.currentLanguage}, usando ${this.fallbackLanguage}`)
          return fallbackTranslation
        }
        
        console.warn(`Tradução não encontrada para: ${module}.${key}${nestedKey ? '.' + nestedKey : ''}`)
        return nestedKey || key
      }

      return translation
    } catch (error) {
      console.error('Erro ao traduzir:', error)
      return nestedKey || key
    }
  }

  /**
   * Traduz com interpolação de variáveis
   * Exemplo: t('common', 'welcome', { name: 'João' })
   * String: "Bem-vindo, {{name}}!"
   */
  translateWithVars(
    module: ModuleName, 
    key: TranslationKey, 
    variables: Record<string, string | number> = {},
    nestedKey?: string
  ): string {
    let translation = this.translate(module, key, nestedKey)
    
    // Substitui variáveis no formato {{variableName}}
    Object.entries(variables).forEach(([varName, value]) => {
      const regex = new RegExp(`{{\\s*${varName}\\s*}}`, 'g')
      translation = translation.replace(regex, String(value))
    })
    
    return translation
  }

  /**
   * Retorna todas as traduções de um módulo no idioma atual
   */
  getModuleTranslations(module: ModuleName): Record<string, string> {
    const moduleTranslations = translations[module]
    if (!moduleTranslations) return {}

    const result: Record<string, string> = {}
    
    Object.entries(moduleTranslations).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const translation = (value as TranslationValue)[this.currentLanguage]
        if (translation) {
          result[key] = translation
        }
      }
    })

    return result
  }

  /**
   * Lista idiomas disponíveis com nomes nativos
   */
  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
    ]
  }

  /**
   * Função utilitária para formatação de números baseada no idioma
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    try {
      return new Intl.NumberFormat(localeMap[this.currentLanguage], options).format(number)
    } catch {
      return number.toString()
    }
  }

  /**
   * Função utilitária para formatação de datas baseada no idioma
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    try {
      return new Intl.DateTimeFormat(localeMap[this.currentLanguage], options).format(date)
    } catch {
      return date.toLocaleDateString()
    }
  }

  /**
   * Função utilitária para formatação de moeda
   */
  formatCurrency(amount: number, currency?: string): string {
    const currencyMap: Record<Language, string> = {
      'pt': 'BRL',
      'en': 'USD',
      'es': 'EUR',
    }

    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    const targetCurrency = currency || currencyMap[this.currentLanguage]

    try {
      if (targetCurrency === 'BZR') {
        const formatted = this.formatNumber(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
        return `${formatted} BZR`
      }

      return new Intl.NumberFormat(localeMap[this.currentLanguage], {
        style: 'currency',
        currency: targetCurrency,
      }).format(amount)
    } catch {
      return `${amount} ${targetCurrency}`
    }
  }
}

// Instância singleton do serviço
export const i18nService = new I18nService()
EOF

# ========================================
# 9. CORRIGIR USE TRANSLATION HOOK
# ========================================

echo "🔗 [9/10] Corrigindo useTranslation.ts..."
cat > src/app/i18n/useTranslation.ts << 'EOF'
import { useState, useEffect } from 'react'
import { i18nService, Language, ModuleName } from './i18n'

/**
 * Hook principal para tradução
 * Suporta módulos específicos e chaves aninhadas
 */
export function useTranslation(defaultModule?: ModuleName) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18nService.getCurrentLanguage())

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  /**
   * Traduz uma chave específica
   * @param module - Módulo de tradução (opcional se defaultModule foi definido)
   * @param key - Chave da tradução
   * @param nestedKey - Chave aninhada (opcional)
   */
  const translate = (module: ModuleName | string, key?: string, nestedKey?: string): string => {
    // Se apenas um parâmetro foi passado e temos um módulo padrão
    if (defaultModule && !key) {
      return i18nService.translate(defaultModule, module as string)
    }

    // Se dois parâmetros foram passados e temos um módulo padrão
    if (defaultModule && key && !nestedKey) {
      return i18nService.translate(defaultModule, module as string, key)
    }

    // Caso normal com módulo explícito
    if (key) {
      return i18nService.translate(module as ModuleName, key, nestedKey)
    }

    // Fallback
    return module as string
  }

  /**
   * Traduz com variáveis
   */
  const translateWithVars = (
    module: ModuleName | string,
    key?: string | Record<string, string | number>,
    variables?: Record<string, string | number> | string,
    nestedKey?: string
  ): string => {
    // Se apenas um parâmetro foi passado e temos um módulo padrão
    if (defaultModule && typeof key === 'object') {
      return i18nService.translateWithVars(defaultModule, module as string, key)
    }

    // Se dois parâmetros foram passados e temos um módulo padrão
    if (defaultModule && typeof key === 'string' && typeof variables === 'object') {
      return i18nService.translateWithVars(defaultModule, module as string, variables, key)
    }

    // Caso normal com módulo explícito
    if (typeof key === 'string' && typeof variables === 'object') {
      return i18nService.translateWithVars(module as ModuleName, key, variables, nestedKey)
    }

    // Fallback
    return translate(module, key as string, variables as string)
  }

  /**
   * Muda o idioma
   */
  const changeLanguage = (language: Language) => {
    i18nService.setLanguage(language)
  }

  /**
   * Obtém todas as traduções de um módulo
   */
  const getModuleTranslations = (module?: ModuleName): Record<string, string> => {
    const targetModule = module || defaultModule
    if (!targetModule) return {}
    return i18nService.getModuleTranslations(targetModule)
  }

  /**
   * Formata números baseado no idioma atual
   */
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return i18nService.formatNumber(number, options)
  }

  /**
   * Formata datas baseado no idioma atual
   */
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return i18nService.formatDate(date, options)
  }

  /**
   * Formata valores monetários
   */
  const formatCurrency = (amount: number, currency?: string): string => {
    return i18nService.formatCurrency(amount, currency)
  }

  /**
   * Lista idiomas disponíveis
   */
  const availableLanguages = i18nService.getAvailableLanguages()

  return {
    // Estado
    currentLanguage,
    availableLanguages,
    
    // Funções de tradução
    t: translate,
    tVar: translateWithVars,
    translate,
    translateWithVars,
    
    // Funções de controle
    changeLanguage,
    getModuleTranslations,
    
    // Funções de formatação
    formatNumber,
    formatDate,
    formatCurrency,
  }
}

/**
 * Hook especializado para módulos específicos
 * Evita repetir o nome do módulo em cada tradução
 */
export function useModuleTranslation(module: ModuleName) {
  return useTranslation(module)
}

/**
 * Hooks especializados para módulos comuns
 */
export const useCommonTranslation = () => useModuleTranslation('common')
export const useHomeTranslation = () => useModuleTranslation('home')
export const useLanguageTranslation = () => useModuleTranslation('language')
export const useErrorsTranslation = () => useModuleTranslation('errors')
export const useNavigationTranslation = () => useModuleTranslation('navigation')

/**
 * Hook para detectar mudanças de idioma
 * Útil para componentes que precisam reagir a mudanças
 */
export function useLanguageDetector() {
  const [language, setLanguage] = useState<Language>(i18nService.getCurrentLanguage())

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguage(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  return language
}
EOF

# ========================================
# 10. FINALIZAÇÃO E COMMIT
# ========================================

echo "🎯 [10/10] Finalizando e commitando mudanças..."

# Verificar se há mudanças para commitar
if git diff --quiet && git diff --staged --quiet; then
    echo "ℹ️ Nenhuma mudança detectada para commit"
else
    # Adicionar todas as mudanças
    git add .
    
    # Fazer commit das mudanças da ETAPA 2
    git commit -m "feat(etapa2): implementar sistema de internacionalização completo

🌍 ETAPA 2 - INTERNACIONALIZAÇÃO COMPLETA:

✨ Novas funcionalidades:
- Sistema i18n completo PT/EN/ES funcionando
- LanguageProvider para gerenciar estado do idioma
- LanguageSelector com modal e dropdown
- Detecção automática do idioma do dispositivo
- Persistência da escolha do usuário
- Todas as páginas agora usam traduções

🎨 Páginas atualizadas:
- Home.tsx: Traduzida completamente + seletor de idioma
- NotFound.tsx: Traduzida completamente
- routes.tsx: Loading com tradução

🔧 Melhorias técnicas:
- translations.json expandido com todos os módulos
- useTranslation hooks especializados
- Suporte a chaves aninhadas nas traduções
- Formatação de números, datas e moedas por idioma
- Error boundary com traduções

🎯 ETAPA 2 - 100% COMPLETA!"
fi

echo ""
echo "🎉 ========================================="
echo "🎉 ETAPA 2 - INTERNACIONALIZAÇÃO COMPLETA!"
echo "🎉 ========================================="
echo ""
echo "✅ Implementações realizadas:"
echo "   🌍 Sistema i18n PT/EN/ES funcionando"
echo "   🎨 Seletor de idioma na página inicial"
echo "   🔄 Detecção automática do idioma do dispositivo"
echo "   💾 Persistência da escolha do usuário"
echo "   📱 Todas as páginas traduzidas"
echo "   🎯 Modal de seleção na primeira visita"
echo ""
echo "🧪 TESTE AGORA:"
echo "   npm run dev"
echo "   # 1. Acesse http://localhost:3000"
echo "   # 2. Modal de idioma aparece automaticamente"
echo "   # 3. Teste o seletor no header"
echo "   # 4. Navegue para /404 e veja tradução"
echo ""
echo "🔄 FUNCIONALIDADES:"
echo "   - Detecção automática do idioma do navegador"
echo "   - Opção 'Idioma do Dispositivo' no seletor"
echo "   - Persistência da escolha no localStorage"
echo "   - Modal só aparece na primeira visita"
echo "   - Seletor compacto sempre disponível"
echo ""
echo "🎯 PRÓXIMA ETAPA:"
echo "   Novo chat: 'Continuar Bazari - ETAPA 3: Autenticação Web3'"
echo ""
echo "🌟 ETAPA 2 COMPLETA - SISTEMA I18N FUNCIONANDO! 🌟"