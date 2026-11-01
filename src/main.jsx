import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Sentry } from './lib/sentry.js'

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
