import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Sentry } from './lib/sentry.js'

// Vite fires this when a preloaded page file is missing (a new version went live). Reload once, then let it fail normally.
window.addEventListener('vite:preloadError', () => {
  try { if (sessionStorage.getItem('chunk-reloaded') === '1') return; sessionStorage.setItem('chunk-reloaded', '1') } catch { return }
  // Vite still passes the error on to the page loader in App.jsx. This tells it a reload is already on the way,
  // so it waits instead of showing the error screen and reporting a false error to Sentry.
  window.__chunkReloading = true
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Sentry.ErrorBoundary fallback={<p style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Something went wrong. Please refresh the page. If it keeps happening, tell us on the Complaints page.</p>}>
          <App />
        </Sentry.ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
