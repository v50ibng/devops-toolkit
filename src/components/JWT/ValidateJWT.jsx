import { useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import FileUpload from '../common/FileUpload.jsx'
import { verifyJwt } from '../../utils/jwt.js'
import { readFileAsText } from '../../utils/files.js'

function ValidateJWT() {
  const [token, setToken] = useState('')
  const [verificationKey, setVerificationKey] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [validating, setValidating] = useState(false)

  async function handleFileSelect(file) {
    setVerificationKey(await readFileAsText(file))
  }

  async function handleValidate() {
    try {
      setValidating(true)
      setError('')
      setResult(await verifyJwt(token, verificationKey))
    } catch (validateError) {
      setResult(null)
      setError(validateError.message || 'Unable to validate the JWT.')
    } finally {
      setValidating(false)
    }
  }

  return (
    <ToolCard
      title="Validate JWT"
      description="Validate a JWT signature with an HMAC secret, PEM public key, or PEM certificate and report the token expiry state."
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

      <FileUpload
        accept=".pem,.crt,.cer,.pub,.txt"
        description="Upload a public key or certificate, or paste a secret below."
        onFileSelect={handleFileSelect}
      />

      <label className="block space-y-2 text-sm">
        <span className="text-slate-300 light:text-slate-700">
          Secret / public key / certificate
        </span>
        <textarea
          value={verificationKey}
          onChange={(event) => setVerificationKey(event.target.value)}
          className="tool-input mono-output min-h-44"
          placeholder="my-secret or -----BEGIN PUBLIC KEY-----"
        />
      </label>

      <button
        type="button"
        onClick={handleValidate}
        className="tool-button"
        disabled={validating}
      >
        {validating ? 'Validating…' : 'Validate token'}
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {result ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-200 light:bg-emerald-50 light:text-emerald-800">
            <p className="text-lg font-semibold">✅ Signature is valid</p>
            <p className="mt-2 text-sm">{result.expiry.label}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm light:border-slate-200 light:bg-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Algorithm</p>
              <p className="mt-2 text-slate-100 light:text-slate-900">{result.header.alg}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm light:border-slate-200 light:bg-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Subject</p>
              <p className="mt-2 text-slate-100 light:text-slate-900">
                {result.payload.sub || 'No sub claim'}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </ToolCard>
  )
}

export default ValidateJWT
