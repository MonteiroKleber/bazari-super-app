import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@app/App'

// Estilos globais
import '@shared/styles/globals.css'

// Registra Service Worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Service Worker registration failed
  })
}

// Configura polyfills globais necessários para Web3
if (typeof global === 'undefined') {
  ;(window as any).global = window
}

// Renderiza a aplicação
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)