import { NavLink } from 'react-router-dom'
import { comingSoonTools, jwtTools, passwordTools, sslTools } from '../../data/tools.js'

function Sidebar({ collapsed, mobileOpen, onLinkClick, onToggleCollapse }) {
  const navLinkClassName = ({ isActive }) =>
    `flex items-center rounded-xl px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-blue-500/15 text-blue-200'
        : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
    }`

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          onClick={onLinkClick}
          className="fixed inset-0 z-20 bg-slate-950/60 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex max-w-[85vw] flex-col border-r border-slate-800/70 bg-slate-950/95 px-4 py-5 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-24' : 'lg:w-80'} w-80`}
      >
        <div className="mb-6 hidden items-center justify-between lg:flex">
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Navigation
              </p>
              <p className="text-xs text-slate-500">Jump between tools.</p>
            </div>
          ) : null}
          <button type="button" onClick={onToggleCollapse} className="tool-button-secondary">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="space-y-6 overflow-y-auto">
          <section>
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ${collapsed ? 'sr-only' : ''}`}
            >
              Home
            </p>
            <NavLink to="/" end className={navLinkClassName} onClick={onLinkClick}>
              {collapsed ? '🏠' : 'Dashboard'}
            </NavLink>
          </section>

          <section>
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ${collapsed ? 'sr-only' : ''}`}
            >
              SSL Tools
            </p>
            <div className="space-y-1">
              {sslTools.map((tool) => (
                <NavLink
                  key={tool.id}
                  to={`/ssl/${tool.id}`}
                  className={navLinkClassName}
                  onClick={onLinkClick}
                >
                  {collapsed ? '🔐' : tool.name}
                </NavLink>
              ))}
            </div>
          </section>

          <section>
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ${collapsed ? 'sr-only' : ''}`}
            >
              JWT Tools
            </p>
            <div className="space-y-1">
              {jwtTools.map((tool) => (
                <NavLink
                  key={tool.id}
                  to={`/jwt/${tool.id}`}
                  className={navLinkClassName}
                  onClick={onLinkClick}
                >
                  {collapsed ? '🪙' : tool.name}
                </NavLink>
              ))}
            </div>
          </section>

          <section>
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ${collapsed ? 'sr-only' : ''}`}
            >
              Password Tools
            </p>
            <div className="space-y-1">
              {passwordTools.map((tool) => (
                <NavLink
                  key={tool.id}
                  to="/password"
                  className={navLinkClassName}
                  onClick={onLinkClick}
                >
                  {collapsed ? '🔑' : tool.name}
                </NavLink>
              ))}
            </div>
          </section>

          <section>
            <p
              className={`mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ${collapsed ? 'sr-only' : ''}`}
            >
              More (Coming Soon)
            </p>
            <div className="space-y-1">
              {comingSoonTools.map((tool) => (
                <div
                  key={tool}
                  className="rounded-xl border border-dashed border-slate-800 px-3 py-2 text-sm text-slate-500"
                >
                  {collapsed ? '…' : tool}
                </div>
              ))}
            </div>
          </section>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
