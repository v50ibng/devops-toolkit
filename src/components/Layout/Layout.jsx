import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'

function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('devops-toolkit-theme') || 'dark')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('devops-toolkit-theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition light:bg-slate-100 light:text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onLinkClick={() => setMobileOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopBar
            mobileOpen={mobileOpen}
            onToggleMobileMenu={() => setMobileOpen((current) => !current)}
            theme={theme}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          />
          <main className="flex-1 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Layout
