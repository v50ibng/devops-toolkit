import { Link } from 'react-router-dom'
import { jwtTools, passwordTools, sslTools } from '../data/tools.js'

function ToolList({ tools, basePath, borderHover }) {
  return (
    <div className="space-y-3">
      {tools.map((tool) => (
        <Link
          key={tool.id}
          to={`${basePath}/${tool.id}`}
          className={`block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 ${borderHover}`}
        >
          <h3 className="font-medium text-slate-100">{tool.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
        </Link>
      ))}
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-blue-300">Toolkit overview</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Developer-focused SSL, JWT, and password utilities.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-400">
          A secure toolkit for certificate inspection, JWT decoding, and password generation.
          SSL operations use a backend proxy; all other tools run entirely in your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/ssl/extract-ca" className="tool-button">
            Explore SSL tools
          </Link>
          <Link to="/jwt/decode" className="tool-button-secondary">
            Inspect JWT tools
          </Link>
          <Link to="/password" className="tool-button-secondary">
            Generate passwords
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">SSL Tools</h2>
            <Link to="/ssl/extract-ca" className="text-sm text-blue-300 hover:text-blue-200">
              Open all
            </Link>
          </div>
          <ToolList tools={sslTools} basePath="/ssl" borderHover="hover:border-blue-400" />
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">JWT Tools</h2>
            <Link to="/jwt/decode" className="text-sm text-blue-300 hover:text-blue-200">
              Open all
            </Link>
          </div>
          <ToolList tools={jwtTools} basePath="/jwt" borderHover="hover:border-emerald-400" />
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">Password Tools</h2>
            <Link to="/password" className="text-sm text-blue-300 hover:text-blue-200">
              Open
            </Link>
          </div>
          <div className="space-y-3">
            {passwordTools.map((tool) => (
              <Link
                key={tool.id}
                to="/password"
                className="block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-purple-400"
              >
                <h3 className="font-medium text-slate-100">{tool.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
