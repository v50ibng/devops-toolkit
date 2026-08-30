function TopBar({ mobileOpen, onToggleMobileMenu, theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/80 px-4 py-4 backdrop-blur light:border-slate-200 light:bg-white/90 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="tool-button-secondary lg:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
          <div>
            <p className="text-lg font-semibold text-slate-100 light:text-slate-900">
              🔧 DevOps Toolkit
            </p>
            <p className="text-xs text-slate-400 light:text-slate-600">
              Browser-only certificate and JWT utilities
            </p>
          </div>
        </div>
        <button type="button" onClick={onToggleTheme} className="tool-button-secondary">
          {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>
    </header>
  )
}

export default TopBar
