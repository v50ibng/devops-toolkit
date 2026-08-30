import { useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import CodeBlock from '../common/CodeBlock.jsx'
import FileUpload from '../common/FileUpload.jsx'
import { useToast } from '../common/useToast.jsx'
import { extractCaCertificate } from '../../utils/certificates.js'
import { downloadTextFile, readFileAsText } from '../../utils/files.js'

function ExtractCAFromHost() {
  const toast = useToast()
  const [hostname, setHostname] = useState('')
  const [port, setPort] = useState('443')
  const [pemChain, setPemChain] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function handleFileSelect(file) {
    const text = await readFileAsText(file)
    setPemChain(text)
  }

  function handleExtract() {
    try {
      setError('')
      setResult(extractCaCertificate(pemChain))
    } catch (extractError) {
      setResult(null)
      setError(extractError.message || 'Invalid PEM chain.')
    }
  }

  return (
    <ToolCard
      title="Extract CA from Host"
      description="Browsers cannot directly open arbitrary TLS sockets, so this tool accepts a pasted or uploaded PEM chain and extracts the highest CA certificate from it."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-slate-300 light:text-slate-700">Hostname</span>
          <input
            value={hostname}
            onChange={(event) => setHostname(event.target.value)}
            className="tool-input"
            placeholder="example.com"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-300 light:text-slate-700">Port</span>
          <input
            value={port}
            onChange={(event) => setPort(event.target.value)}
            className="tool-input"
            placeholder="443"
          />
        </label>
      </div>

      <FileUpload
        accept=".pem,.crt,.cer"
        description="Upload a PEM chain file or paste the full chain below."
        onFileSelect={handleFileSelect}
      />

      <label className="block space-y-2 text-sm">
        <span className="text-slate-300 light:text-slate-700">PEM certificate chain</span>
        <textarea
          value={pemChain}
          onChange={(event) => setPemChain(event.target.value)}
          className="tool-input mono-output min-h-56"
          placeholder="-----BEGIN CERTIFICATE-----"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleExtract} className="tool-button">
          Extract CA
        </button>
        <p className="text-xs text-slate-500">
          Host input is for context only in this browser-only workflow.
          {hostname || port ? ` Requested target: ${hostname || 'host'}:${port || '443'}` : ''}
        </p>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {result ? (
        <div className="space-y-5">
          <dl className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-sm light:border-slate-200 light:bg-white sm:grid-cols-2">
            <div>
              <dt className="text-slate-400 light:text-slate-500">Subject</dt>
              <dd className="mt-1 break-words text-slate-100 light:text-slate-900">{result.subject}</dd>
            </div>
            <div>
              <dt className="text-slate-400 light:text-slate-500">Issuer</dt>
              <dd className="mt-1 break-words text-slate-100 light:text-slate-900">{result.issuer}</dd>
            </div>
            <div>
              <dt className="text-slate-400 light:text-slate-500">Validity</dt>
              <dd className="mt-1 text-slate-100 light:text-slate-900">
                {result.validity.notBefore} → {result.validity.notAfter}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 light:text-slate-500">Fingerprint (SHA-256)</dt>
              <dd className="mono-output mt-1 break-all text-slate-100 light:text-slate-900">
                {result.fingerprint}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400 light:text-slate-500">SANs</dt>
              <dd className="mt-1 text-slate-100 light:text-slate-900">
                {result.sans.length ? result.sans.join(', ') : 'None'}
              </dd>
            </div>
          </dl>

          <CodeBlock
            title="Extracted CA certificate"
            value={result.pem}
            actions={
              <button
                type="button"
                className="tool-button-secondary"
                onClick={() => {
                  downloadTextFile('certificate-authority.pem', result.pem)
                  toast.show('CA certificate downloaded.')
                }}
              >
                Download
              </button>
            }
          />
        </div>
      ) : null}
    </ToolCard>
  )
}

export default ExtractCAFromHost
