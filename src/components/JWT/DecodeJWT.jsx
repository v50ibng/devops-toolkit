import { useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import CodeBlock from '../common/CodeBlock.jsx'
import { decodeJwt } from '../../utils/jwt.js'

function DecodeJWT() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState(null)
  const [error, setError] = useState('')

  function handleDecode() {
    try {
      setError('')
      setDecoded(decodeJwt(token))
    } catch (decodeError) {
      setDecoded(null)
      setError(decodeError.message || 'Unable to decode the provided JWT.')
    }
  }

  return (
    <ToolCard
      title="Decode JWT"
      description="Decode a JWT in-place to inspect its header, payload, and signature segments with expiry information."
    >
      <label className="block space-y-2 text-sm">
        <span className="text-slate-300 light:text-slate-700">JWT token</span>
        <textarea
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="tool-input mono-output min-h-44"
          placeholder="******"
        />
      </label>

      <button type="button" onClick={handleDecode} className="tool-button">
        Decode token
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {decoded ? (
        <div className="space-y-5">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              decoded.expiry.expired
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200 light:bg-amber-50 light:text-amber-800'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 light:bg-emerald-50 light:text-emerald-800'
            }`}
          >
            {decoded.expiry.label}
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <CodeBlock title="Header" value={decoded.prettyHeader} tone="blue" />
            <CodeBlock title="Payload" value={decoded.prettyPayload} tone="green" />
            <CodeBlock title="Signature" value={decoded.prettySignature} tone="gray" />
          </div>
        </div>
      ) : null}
    </ToolCard>
  )
}

export default DecodeJWT
