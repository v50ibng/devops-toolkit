import { useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import FileUpload from '../common/FileUpload.jsx'
import { compareCertificateAndKey } from '../../utils/certificates.js'
import { readFileAsText } from '../../utils/files.js'

function VerifyCertKeyMatch() {
  const [certificatePem, setCertificatePem] = useState('')
  const [keyPem, setKeyPem] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleCertificateFile(file) {
    setCertificatePem(await readFileAsText(file))
  }

  async function handleKeyFile(file) {
    setKeyPem(await readFileAsText(file))
  }

  function handleVerify() {
    try {
      setError('')
      setResult(compareCertificateAndKey(certificatePem, keyPem))
    } catch (verifyError) {
      setResult(null)
      setError(
        verifyError.message || 'Unable to compare the certificate and private key.',
      )
    }
  }

  return (
    <ToolCard
      title="Verify Cert & Key Match"
      description="Compare a certificate PEM and private key PEM by deriving and hashing each public key."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <FileUpload
            accept=".pem,.crt,.cer"
            description="Upload a certificate PEM file."
            onFileSelect={handleCertificateFile}
          />
          <label className="block space-y-2 text-sm">
            <span className="text-slate-300 light:text-slate-700">Certificate PEM</span>
            <textarea
              value={certificatePem}
              onChange={(event) => setCertificatePem(event.target.value)}
              className="tool-input mono-output min-h-56"
              placeholder="-----BEGIN CERTIFICATE-----"
            />
          </label>
        </div>
        <div className="space-y-4">
          <FileUpload
            accept=".pem,.key"
            description="Upload an RSA private key PEM file."
            onFileSelect={handleKeyFile}
          />
          <label className="block space-y-2 text-sm">
            <span className="text-slate-300 light:text-slate-700">Private key PEM</span>
            <textarea
              value={keyPem}
              onChange={(event) => setKeyPem(event.target.value)}
              className="tool-input mono-output min-h-56"
              placeholder="-----BEGIN PRIVATE KEY-----"
            />
          </label>
        </div>
      </div>

      <button type="button" onClick={handleVerify} className="tool-button">
        Verify match
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {result ? (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm shadow-sm ${
            result.matches
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 light:bg-emerald-50 light:text-emerald-800'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-200 light:bg-rose-50 light:text-rose-800'
          }`}
        >
          <p className="text-lg font-semibold">
            {result.matches ? '✅ Certificate and private key match' : '❌ Certificate and private key do not match'}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Certificate fingerprint</p>
              <p className="mono-output mt-2 break-all">{result.certificateFingerprint}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Key fingerprint</p>
              <p className="mono-output mt-2 break-all">{result.keyFingerprint}</p>
            </div>
          </div>
        </div>
      ) : null}
    </ToolCard>
  )
}

export default VerifyCertKeyMatch
