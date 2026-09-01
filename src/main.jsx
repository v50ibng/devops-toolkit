import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import { ToastProvider } from './components/common/ToastProvider.jsx'
import './index.css'
import Dashboard from './pages/Dashboard.jsx'
import JWTTools from './pages/JWTTools.jsx'
import PasswordTools from './pages/PasswordTools.jsx'
import SSLTools from './pages/SSLTools.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="ssl" element={<Navigate to="/ssl/extract-ca" replace />} />
            <Route path="ssl/:toolId" element={<SSLTools />} />
            <Route path="jwt" element={<Navigate to="/jwt/decode" replace />} />
            <Route path="jwt/:toolId" element={<JWTTools />} />
            <Route path="password" element={<PasswordTools />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)
