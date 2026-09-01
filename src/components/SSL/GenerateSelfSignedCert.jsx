import { useState } from 'react'
import CodeBlock from '../common/CodeBlock.jsx'
import ToolCard from '../common/ToolCard.jsx'
import { useToast } from '../common/useToast.jsx'
import { generateSelfSignedCertificate } from '../../utils/certificates.js'
import { downloadTextFile } from '../../utils/files.js'

function GenerateSelfSignedCert() {
  const toast = useToast()
  const [form, setForm] = useState({
    commonName: 'localhost',
    sans: 'localhost,127.0.0.1',
    validityDays: '365',
    keySize: '2048',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  async function handleGenerate() {
    try {
      setGenerating(true)
      setError('')
      await Promise.resolve()
      setResult(
        generateSelfSignedCertificate({
          commonName: form.commonName,
          sans: form.sans.split(','),
          validityDays: form.validityDays,
          keySize: form.keySize,
        }),
      )
    } catch (generationError) {
      setResult(null)
      setError(generationError.message || 'Unable to generate the self-signed certificate.')
    } finally {
      setGenerating(false)
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <ToolCard
      title="Generate Self-Signed Cert"
      description="Generate a self-signed RSA certificate and private key in the browser with configurable SANs and validity."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-slate-300">Common Name</span>
          <input
            value={form.commonName}
            onChange={(event) => updateField('commonName', event.target.value)}
            className="tool-input"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-300">SANs (comma-separated)</span>
          <input
            value={form.sans}
            onChange={(event) => updateField('sans', event.target.value)}
            className="tool-input"
            placeholder="localhost,127.0.0.1"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-300">Validity (days)</span>
          <input
            type="number"
            min="1"
            value={form.validityDays}
            onChange={(event) => updateField('validityDays', event.target.value)}
            className="tool-input"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-300">Key size</span>
          <select
            value={form.keySize}
            onChange={(event) => updateField('keySize', event.target.value)}
            className="tool-input"
          >
            <option value="2048">2048 bits</option>
            <option value="4096">4096 bits</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="tool-button"
        disabled={generating || !form.commonName.trim()}
      >
        {generating ? 'Generating…' : 'Generate certificate'}
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {result ? (
        <div className="space-y-5">
          <dl className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-400">Subject</dt>
              <dd className="mt-1 text-slate-100">{result.details.subject}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Fingerprint</dt>
              <dd className="mono-output mt-1 break-all text-slate-100">
                {result.details.fingerprint}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400">SANs</dt>
              <dd className="mt-1 text-slate-100">{result.details.sans.join(', ')}</dd>
            </div>
          </dl>

          <CodeBlock
            title="Generated certificate"
            value={result.certificatePem}
            actions={
              <button
                type="button"
                className="tool-button-secondary"
                onClick={() => {
                  downloadTextFile('self-signed-cert.pem', result.certificatePem)
                  toast.show('Certificate downloaded.')
                }}
              >
                Download
              </button>
            }
          />
          <CodeBlock
            title="Generated private key"
            value={result.privateKeyPem}
            actions={
              <button
                type="button"
                className="tool-button-secondary"
                onClick={() => {
                  downloadTextFile('self-signed-key.pem', result.privateKeyPem)
                  toast.show('Private key downloaded.')
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

export default GenerateSelfSignedCert
