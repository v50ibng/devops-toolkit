import { useState } from 'react'
import CodeBlock from '../common/CodeBlock.jsx'
import ToolCard from '../common/ToolCard.jsx'
import { API_BASE } from '../../config.js'

const POSITION_COLORS = {
  Root: 'text-emerald-300 border-emerald-500/40',
  Intermediate: 'text-amber-300 border-amber-500/40',
  Leaf: 'text-blue-300 border-blue-500/40',
}

function CertificateChain() {
  const [hostname, setHostname] = useState('')
  const [port, setPort] = useState('443')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chain, setChain] = useState([])
  const [expanded, setExpanded] = useState('')

  async function handleFetch() {
    setLoading(true)
    setError('')
    setChain([])
    setExpanded('')
    try {
      const res = await fetch(`${API_BASE}/ssl/cert-chain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: hostname.trim(), port: Number(port) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Request failed.')
      } else {
        setChain(data.chain)
      }
    } catch {
      setError('Backend is unreachable. Ensure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolCard
      title="Show Certificate Chain"
      description="Connect to a hostname and visualize the full trust chain from leaf certificate up to the Root CA."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-slate-300">Hostname</span>
          <input
            value={hostname}
            onChange={(event) => setHostname(event.target.value)}
            className="tool-input"
            placeholder="example.com"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-300">Port</span>
          <input
            value={port}
            onChange={(event) => setPort(event.target.value)}
            className="tool-input"
            placeholder="443"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleFetch}
        className="tool-button"
        disabled={loading || !hostname.trim()}
      >
        {loading ? 'Fetching…' : 'Fetch Chain'}
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {chain.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
            {chain.map((cert, index) => {
              const colorClass = POSITION_COLORS[cert.position] || 'text-slate-300 border-slate-700'
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:items-center"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) => (current === cert.details?.subject ? '' : cert.details?.subject || String(index)))
                    }
                    className={`w-full rounded-2xl border bg-slate-900/70 p-5 text-left shadow transition hover:-translate-y-1 ${colorClass}`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] opacity-70">{cert.position}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-100">
                      {cert.details?.commonName || cert.details?.subject || 'Unknown'}
                    </h3>
                    {cert.details?.issuer ? (
                      <p className="mt-3 text-sm text-slate-400">Issuer: {cert.details.issuer}</p>
                    ) : null}
                    {cert.details?.validity ? (
                      <p className="mt-2 text-sm text-slate-400">
                        Valid: {cert.details.validity.notBefore} → {cert.details.validity.notAfter}
                      </p>
                    ) : null}
                  </button>
                  {index < chain.length - 1 ? (
                    <div className="flex justify-center text-3xl text-blue-300 xl:px-2">→</div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {chain.map((cert, index) => {
            const key = cert.details?.subject || String(index)
            return expanded === key ? (
              <CodeBlock
                key={key}
                title={cert.details?.commonName || cert.position}
                value={cert.pem}
              />
            ) : null
          })}
        </div>
      ) : null}
    </ToolCard>
  )
}

export default CertificateChain
