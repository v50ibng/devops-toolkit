import { useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import DecodeJWT from '../components/JWT/DecodeJWT.jsx'
import ValidateJWT from '../components/JWT/ValidateJWT.jsx'
import { jwtTools } from '../data/tools.js'

const jwtComponents = {
  decode: DecodeJWT,
  validate: ValidateJWT,
}

function JWTTools() {
  const { toolId = 'decode' } = useParams()
  const ActiveTool = useMemo(() => jwtComponents[toolId] || DecodeJWT, [toolId])

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">JWT Tools</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-50 light:text-slate-950">
          Decode and validate JSON Web Tokens
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400 light:text-slate-600">
          Inspect token structure and verify signatures with secrets or public keys.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {jwtTools.map((tool) => (
            <NavLink
              key={tool.id}
              to={`/jwt/${tool.id}`}
              className={({ isActive }) =>
                isActive ? 'tool-button' : 'tool-button-secondary'
              }
            >
              {tool.name}
            </NavLink>
          ))}
        </div>
      </section>
      <ActiveTool />
    </div>
  )
}

export default JWTTools
