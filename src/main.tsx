import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './lib/i18n'
import './index.css'

// /admin is a private lead dashboard, loaded as its own chunk so the public
// site never ships its code (and the admin never loads the hero sequence).
const AdminApp = lazy(() => import('./admin/AdminApp'))
const isAdmin = /^\/admin\/?$/.test(window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="min-h-[100svh] bg-ink" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    )}
  </React.StrictMode>,
)
