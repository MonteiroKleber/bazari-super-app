import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@app/App'
import '@shared/styles/globals.css'

// ✅ POLYFILLS PARA WEB3
if (typeof global === 'undefined') {
  ;(window as any).global = window
}

// ✅ SERVICE WORKER REGISTRATION
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js').catch((error) => {
    console.warn('Service Worker registration failed:', error)
  })
}

// ✅ RENDERIZAÇÃO SEM STRICT MODE (temporário para debug)
// StrictMode pode causar double-rendering que expõe problemas de suspensão
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)

// ✅ DEBUG HELPER PARA DESENVOLVIMENTO
if (import.meta.env.DEV) {
  console.log('🔥 Bazari Super App iniciado em modo desenvolvimento')
  
  // Log de erros não capturados
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Promise rejeitada não capturada:', event.reason)
  })
  
  window.addEventListener('error', (event) => {
    console.error('🚨 Erro JavaScript não capturado:', event.error)
  })
}
