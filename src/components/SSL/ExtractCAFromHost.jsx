import { useState } from 'react'
import CodeBlock from '../common/CodeBlock.jsx'
import ToolCard from '../common/ToolCard.jsx'
import { useToast } from '../common/useToast.jsx'
import { API_BASE } from '../../config.js'
import { downloadTextFile } from '../../utils/files.js'

function ExtractCAFromHost() {
  const toast = useToast()
  const [hostname, setHostname] = useState('')
  const [port, setPort] = useState('443')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [certs, setCerts] = useState([])

  async function handleExtract() {
    setLoading(true)
    setError('')
    setCerts([])
    try {
      const res = await fetch(`${API_BASE}/ssl/extract-ca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: hostname.trim(), port: Number(port) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Request failed.')
      } else {
        setCerts(data.certs)
      }
    } catch {
      setError('Backend is unreachable. Ensure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolCard
      title="Extract CA from Host"
      description="Connect to a hostname and extract the Certificate Authority certificate(s) from the TLS chain."
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
        onClick={handleExtract}
        className="tool-button"
        disabled={loading || !hostname.trim()}
      >
        {loading ? 'Fetching…' : 'Extract CA'}
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {certs.length > 0 ? (
        <div className="space-y-5">
          {certs.map((cert, index) => (
            <div key={index} className="space-y-4">
              {cert.details ? (
                <dl className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-400">Subject</dt>
                    <dd className="mt-1 break-words text-slate-100">{cert.details.subject}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Issuer</dt>
                    <dd className="mt-1 break-words text-slate-100">{cert.details.issuer}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Validity</dt>
                    <dd className="mt-1 text-slate-100">
                      {cert.details.validity?.notBefore} → {cert.details.validity?.notAfter}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Fingerprint (SHA-256)</dt>
                    <dd className="mono-output mt-1 break-all text-slate-100">
                      {cert.details.fingerprint}
                    </dd>
                  </div>
                </dl>
              ) : null}
              <CodeBlock
                title={`CA Certificate ${index + 1}`}
                value={cert.pem}
                actions={
                  <button
                    type="button"
                    className="tool-button-secondary"
                    onClick={() => {
                      downloadTextFile(`ca-certificate-${index + 1}.pem`, cert.pem)
                      toast.show('CA certificate downloaded.')
                    }}
                  >
                    Download
                  </button>
                }
              />
            </div>
          ))}
        </div>
      ) : null}
    </ToolCard>
  )
}

export default ExtractCAFromHost
