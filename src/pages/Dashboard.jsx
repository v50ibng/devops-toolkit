import { Link } from 'react-router-dom'
import { jwtTools, sslTools } from '../data/tools.js'

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-blue-300">Toolkit overview</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50 light:text-slate-950 sm:text-5xl">
          Developer-focused SSL and JWT utilities in one secure browser app.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-400 light:text-slate-600">
          Use the sidebar to jump into fully client-side tools for certificate inspection,
          conversion, key matching, self-signed generation, and JWT decoding or validation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/ssl/extract-ca" className="tool-button">
            Explore SSL tools
          </Link>
          <Link to="/jwt/decode" className="tool-button-secondary">
            Inspect JWT tools
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100 light:text-slate-900">
              SSL Tools
            </h2>
            <Link to="/ssl/extract-ca" className="text-sm text-blue-300 hover:text-blue-200">
              Open all
            </Link>
          </div>
          <div className="space-y-3">
            {sslTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/ssl/${tool.id}`}
                className="block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-blue-400 light:border-slate-200 light:bg-white"
              >
                <h3 className="font-medium text-slate-100 light:text-slate-900">{tool.name}</h3>
                <p className="mt-2 text-sm text-slate-400 light:text-slate-600">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100 light:text-slate-900">
              JWT Tools
            </h2>
            <Link to="/jwt/decode" className="text-sm text-blue-300 hover:text-blue-200">
              Open all
            </Link>
          </div>
          <div className="space-y-3">
            {jwtTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/jwt/${tool.id}`}
                className="block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-blue-400 light:border-slate-200 light:bg-white"
              >
                <h3 className="font-medium text-slate-100 light:text-slate-900">{tool.name}</h3>
                <p className="mt-2 text-sm text-slate-400 light:text-slate-600">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
