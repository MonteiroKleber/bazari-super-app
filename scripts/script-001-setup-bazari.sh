#!/bin/bash

# 🔥 BAZARI SUPER APP - SCRIPT ÚNICO COMPLETO
# ==========================================
# ZERO copy/paste necessário - projeto 100% funcional!
# Cria TODOS os 25+ arquivos da ETAPA 1 automaticamente

echo "🔥 BAZARI SUPER APP - CONFIGURAÇÃO AUTOMÁTICA COMPLETA"
echo "======================================================"
echo "🚀 Criando projeto completo da ETAPA 1..."
echo "⏱️  Tempo estimado: 3-5 minutos"
echo "📦 25+ arquivos com conteúdo completo"
echo "🎯 ZERO copy/paste necessário!"
echo ""

# Detecta se já está dentro de um diretório do projeto
if [ "$(basename "$PWD")" != "bazari-super-app" ]; then
    if [ "$(ls -A . 2>/dev/null)" ]; then
        echo "📁 Criando diretório bazari-super-app..."
        mkdir -p bazari-super-app
        cd bazari-super-app
    fi
fi

echo "📂 Criando estrutura de diretórios..."
mkdir -p src/app/i18n
mkdir -p src/shared/{ui,hooks,lib,utils,styles,icons}
mkdir -p src/services/{ipfs,substrate,i18n}
mkdir -p src/entities
mkdir -p src/features/{auth,profile,marketplace,wallet,social,dao,work}
mkdir -p src/pages
mkdir -p src/test
mkdir -p public/icons
mkdir -p scripts
mkdir -p .husky

echo "📦 [1/25] Criando package.json..."
cat > package.json << 'EOF'
{
  "name": "bazari-super-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "description": "Super App Web3 Bazari - Marketplace descentralizado com rede social integrada",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "prepare": "husky install",
    "commit": "git-cz"
  },
  "dependencies": {
    "@polkadot/api": "^10.11.2",
    "@polkadot/extension-dapp": "^0.46.6",
    "@polkadot/keyring": "^12.6.2",
    "@polkadot/util": "^12.6.2",
    "@polkadot/util-crypto": "^12.6.2",
    "framer-motion": "^10.16.16",
    "ipfs-http-client": "^60.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "autoprefixer": "^10.4.16",
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",
    "eslint": "^8.55.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-prettier": "^5.0.1",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "husky": "^8.0.3",
    "jsdom": "^23.0.1",
    "lint-staged": "^15.2.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vite-plugin-pwa": "^0.17.4",
    "vitest": "^1.0.4"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
EOF

echo "🌐 [2/25] Criando index.html..."
cat > index.html << 'EOF'
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Bazari - Super App Web3 descentralizado" />
    <meta name="theme-color" content="#8B0000" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <title>Bazari - Super App Web3</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "⚡ [3/25] Criando vite.config.ts..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bazari - Super App Web3',
        short_name: 'Bazari',
        description: 'Marketplace descentralizado',
        theme_color: '#8B0000',
        background_color: '#1C1C1C',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    open: true
  }
})
EOF

echo "🎨 [4/25] Criando tailwind.config.cjs..."
cat > tailwind.config.cjs << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#8B0000',
        },
        secondary: {
          400: '#FBBF24',
          500: '#FFB300',
          600: '#D97706',
        },
        dark: {
          800: '#1F2937',
          900: '#1C1C1C',
        },
        light: {
          100: '#F5F1E0',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
EOF

echo "📝 [5/25] Criando postcss.config.cjs..."
cat > postcss.config.cjs << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "🔧 [6/25] Criando tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./src/app/*"],
      "@shared/*": ["./src/shared/*"],
      "@features/*": ["./src/features/*"],
      "@services/*": ["./src/services/*"],
      "@entities/*": ["./src/entities/*"],
      "@pages/*": ["./src/pages/*"]
    }
  },
  "include": ["src"]
}
EOF

echo "🔧 [7/25] Criando tsconfig.node.json..."
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

echo "🚀 [8/25] Criando src/main.tsx..."
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@app/App'
import '@shared/styles/globals.css'

if (typeof global === 'undefined') {
  ;(window as any).global = window
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

echo "📱 [9/25] Criando src/app/App.tsx..."
cat > src/app/App.tsx << 'EOF'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './providers'
import { AppRoutes } from './routes'

const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className='min-h-screen bg-light-100 dark:bg-dark-900 text-gray-900 dark:text-gray-100'>
          <AppRoutes />
        </div>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
EOF

echo "🔧 [10/25] Criando src/app/providers.tsx..."
cat > src/app/providers.tsx << 'EOF'
import React, { ReactNode, useEffect, useState } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('bazari_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  return <>{children}</>
}

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
    console.error('Erro capturado:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
          <div className='max-w-md w-full mx-4 p-8 bg-white dark:bg-dark-800 rounded-xl shadow-lg text-center'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              Oops! Algo deu errado
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              type='button'
              onClick={() => window.location.reload()}
              className='w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200'
            >
              Recarregar Página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  )
}
EOF

echo "🛣️ [11/25] Criando src/app/routes.tsx..."
cat > src/app/routes.tsx << 'EOF'
import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))

const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
    <div className='text-center'>
      <div className='w-12 h-12 mx-auto mb-4 border-4 border-primary-900 border-t-transparent rounded-full animate-spin' />
      <p className='text-gray-600 dark:text-gray-400'>Carregando...</p>
    </div>
  </div>
)

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
EOF

echo "🏠 [12/25] Criando src/pages/Home.tsx..."
cat > src/pages/Home.tsx << 'EOF'
const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700'>
      <header className='relative z-10 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center'>
              <span className='text-xl font-bold text-primary-900'>B</span>
            </div>
            <h1 className='text-2xl font-bold text-white'>Bazari</h1>
          </div>
          
          <nav className='hidden md:flex space-x-8'>
            <a href='#features' className='text-white hover:text-secondary-300 transition-colors'>
              Recursos
            </a>
            <a href='#about' className='text-white hover:text-secondary-300 transition-colors'>
              Sobre
            </a>
            <a href='#roadmap' className='text-white hover:text-secondary-300 transition-colors'>
              Roadmap
            </a>
          </nav>

          <div className='flex space-x-4'>
            <button className='px-6 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-primary-900 transition-all duration-200'>
              Entrar
            </button>
            <button className='px-6 py-2 bg-secondary-500 text-primary-900 rounded-lg hover:bg-secondary-400 transition-colors duration-200 font-medium'>
              Começar
            </button>
          </div>
        </div>
      </header>

      <main className='relative z-10 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-5xl md:text-7xl font-bold text-white mb-6'>
            O Futuro do
            <span className='block text-secondary-400'>Comércio Social</span>
          </h2>
          
          <p className='text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto'>
            Marketplace descentralizado onde sua identidade é um ativo, 
            seus negócios são tokens e sua comunidade governa o ecossistema.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
            <button className='w-full sm:w-auto px-8 py-4 bg-secondary-500 text-primary-900 rounded-xl hover:bg-secondary-400 transition-colors duration-200 font-semibold text-lg'>
              Criar Conta Gratuita
            </button>
            <button className='w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-900 transition-all duration-200 font-semibold text-lg'>
              Explorar Demo
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>100%</div>
              <div className='text-white'>Descentralizado</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>0%</div>
              <div className='text-white'>Taxas de Plataforma</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>∞</div>
              <div className='text-white'>Possibilidades</div>
            </div>
          </div>
        </div>
      </main>

      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl' />
      </div>
    </div>
  )
}

export default Home
EOF

echo "🚫 [13/25] Criando src/pages/NotFound.tsx..."
cat > src/pages/NotFound.tsx << 'EOF'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900 px-4'>
      <div className='text-center max-w-md w-full'>
        <div className='mb-8'>
          <div className='text-9xl font-bold text-primary-900 dark:text-primary-400 mb-4'>
            404
          </div>
          <div className='w-24 h-1 bg-secondary-500 mx-auto mb-6' />
        </div>

        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          Página não encontrada
        </h1>
        
        <p className='text-gray-600 dark:text-gray-400 mb-8'>
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className='space-y-4'>
          <Link
            to='/home'
            className='block w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200'
          >
            Voltar ao Início
          </Link>
          
          <button
            type='button'
            onClick={() => window.history.back()}
            className='block w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200'
          >
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
EOF

echo "🎨 [14/25] Criando src/shared/styles/globals.css..."
cat > src/shared/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  }

  body {
    font-family: 'Poppins', 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :focus-visible {
    outline: 2px solid theme('colors.primary.500');
    outline-offset: 2px;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3 bg-primary-900 hover:bg-primary-800 
           text-white font-medium rounded-lg transition-colors duration-200 
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-6 py-3 bg-secondary-500 hover:bg-secondary-400 
           text-primary-900 font-medium rounded-lg transition-colors duration-200;
  }

  .card-bazari {
    @apply bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700;
  }

  .input-bazari {
    @apply block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
           rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100;
  }
}

.spinner {
  @apply w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin;
}
EOF

echo "🔧 [15/25] Criando .eslintrc.json..."
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
EOF

echo "💅 [16/25] Criando .prettierrc.json..."
cat > .prettierrc.json << 'EOF'
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
EOF

echo "🚫 [17/25] Criando .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Production
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vite
.vite

# Vitest
coverage

# Bazari specific
.bazari-cache/
ipfs-data/
blockchain-data/
EOF

echo "📋 [18/25] Criando .env.example..."
cat > .env.example << 'EOF'
# Configurações de desenvolvimento
VITE_APP_NAME=Bazari
VITE_APP_VERSION=0.1.0

# IPFS Configuration
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud
VITE_IPFS_JWT_TOKEN=your_pinata_jwt_token_here

# Substrate Configuration
VITE_SUBSTRATE_RPC=ws://localhost:9944
VITE_BAZARI_CHAIN_ID=bazari-local

# Feature Flags
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_SOCIAL_FEATURES=true
VITE_ENABLE_MARKETPLACE=true
EOF

echo "📖 [19/25] Criando README.md..."
cat > README.md << 'EOF'
# 🌟 Bazari - Super App Web3

> Marketplace descentralizado com rede social integrada

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run test` - Executar testes
- `npm run lint` - Verificar código
- `npm run format` - Formatar código

## 🛠 Tecnologias

- React 18 + TypeScript
- Vite + TailwindCSS
- Polkadot.js + IPFS
- Zustand + React Router

## 📐 Arquitetura

Seguimos o padrão Feature-Sliced Design:

```
src/
├── app/        # Configuração da aplicação
├── pages/      # Páginas
├── features/   # Funcionalidades
├── shared/     # Código compartilhado
├── entities/   # Modelos de dados
└── services/   # APIs e integrações
```

---

**ETAPA 1 - Configuração Base Concluída** ✅
EOF

# Criação dos arquivos TypeScript básicos (versões simplificadas)
echo "👤 [20/25] Criando src/entities/user.ts..."
cat > src/entities/user.ts << 'EOF'
export interface User {
  id: string
  address: string
  name: string
  email?: string
  bio?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  marketValue?: number
  
  // Reputação
  reputation: number
  followersCount: number
  followingCount: number
  postsCount: number
}
EOF

echo "🏢 [21/25] Criando src/entities/business.ts..."
cat > src/entities/business.ts << 'EOF'
export interface Business {
  id: string
  ownerId: string
  name: string
  description: string
  category: string
  images: string[]
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  
  // Métricas
  rating: number
  reviewsCount: number
  salesCount: number
  
  // Status
  status: 'active' | 'inactive' | 'suspended'
  verified: boolean
  createdAt: Date
  updatedAt: Date
}
EOF

echo "💰 [22/25] Criando src/entities/wallet.ts..."
cat > src/entities/wallet.ts << 'EOF'
export interface Wallet {
  id: string
  userId: string
  address: string
  publicKey: string
  
  balances: TokenBalance[]
  
  createdAt: Date
  lastAccessAt: Date
}

export interface TokenBalance {
  tokenId: string
  symbol: string
  name: string
  balance: string
  usdValue?: number
}

export interface Transaction {
  id: string
  hash: string
  walletId: string
  type: 'send' | 'receive' | 'swap'
  status: 'pending' | 'confirmed' | 'failed'
  amount: string
  from: string
  to: string
  timestamp: Date
}
EOF

echo "🧪 [23/25] Criando vitest.config.ts..."
cat > vitest.config.ts << 'EOF'
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
})
EOF

echo "🧪 [24/25] Criando src/test/setup.ts..."
cat > src/test/setup.ts << 'EOF'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    language: 'pt-BR',
    languages: ['pt-BR', 'pt', 'en'],
  },
})

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
})

beforeEach(() => {
  vi.clearAllMocks()
})
EOF

echo "🔧 [25/25] Criando commitlint.config.js..."
cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
    ],
  },
}
EOF

echo ""
echo "📦 Instalando dependências..."
npm install

echo "🎣 Configurando Husky..."
npm run prepare

# Criar hooks do Husky
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "🔍 Executando verificações pré-commit..."
npx lint-staged
EOF

cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "📝 Verificando formato da mensagem de commit..."
npx --no -- commitlint --edit ${1}
EOF

chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# Inicializar Git
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando Git..."
    git init
    git add .
    git commit -m "feat: configuração inicial do projeto Bazari - ETAPA 1

✅ Projeto completo configurado com:
- React 18 + TypeScript + Vite
- TailwindCSS + design system
- PWA configurado
- ESLint + Prettier + Husky
- Vitest para testes
- Estrutura Feature-Sliced
- Landing page moderna
- Entidades base criadas

ETAPA 1 - 100% COMPLETA 🚀"
fi

echo ""
echo "🎉 ========================================="
echo "🎉 BAZARI SUPER APP CRIADO COM SUCESSO!"
echo "🎉 ========================================="
echo ""
echo "📊 Resumo:"
echo "   ✅ 25/25 arquivos criados"
echo "   ✅ Dependências instaladas"
echo "   ✅ Git inicializado"
echo "   ✅ Hooks configurados"
echo ""
echo "🚀 TESTE AGORA:"
echo "   npm run dev"
echo "   # Acesse: http://localhost:3000"
echo ""
echo "🔗 CONECTE COM GITHUB:"
echo "1. Crie repositório: https://github.com/new"
echo "   Nome: bazari-super-app"
echo ""
echo "2. Conecte:"
echo "   git remote add origin https://github.com/SEU_USUARIO/bazari-super-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎯 PRÓXIMA ETAPA:"
echo "   Novo chat: 'Continuar Bazari - ETAPA 2: Design System'"
echo ""
echo "🌟 ETAPA 1 COMPLETA - PROJETO PRONTO! 🌟"
