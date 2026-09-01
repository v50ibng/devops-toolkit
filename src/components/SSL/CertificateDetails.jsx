import { useState } from 'react'
import FileUpload from '../common/FileUpload.jsx'
import ToolCard from '../common/ToolCard.jsx'
import { parseCertificatePem } from '../../utils/certificates.js'
import { readFileAsText } from '../../utils/files.js'

function CertificateDetails() {
  const [pem, setPem] = useState('')
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')

  async function handleFileSelect(file) {
    const text = await readFileAsText(file)
    setPem(text)
  }

  function handleParse() {
    try {
      setError('')
      setDetails(parseCertificatePem(pem))
    } catch (parseError) {
      setDetails(null)
      setError(parseError.message || 'Invalid PEM format.')
    }
  }

  const rows = details
    ? [
        ['Subject', details.subject],
        ['Issuer', details.issuer],
        ['SANs', details.sans.length ? details.sans.join(', ') : 'None'],
        ['Serial Number', details.serialNumber],
        ['Validity', `${details.validity.notBefore} → ${details.validity.notAfter}`],
        ['Signature Algorithm', details.signatureAlgorithm],
        ['Fingerprint (SHA-256)', details.fingerprint],
      ]
    : []

  return (
    <ToolCard
      title="Display Certificate Details"
      description="Paste a PEM certificate or upload a certificate file to inspect parsed certificate metadata."
    >
      <FileUpload
        accept=".pem,.crt,.cer"
        description="Upload a PEM certificate file."
        onFileSelect={handleFileSelect}
      />

      <label className="block space-y-2 text-sm">
        <span className="text-slate-300">Certificate PEM</span>
        <textarea
          value={pem}
          onChange={(event) => setPem(event.target.value)}
          className="tool-input mono-output min-h-56"
          placeholder="-----BEGIN CERTIFICATE-----"
        />
      </label>

      <button type="button" onClick={handleParse} className="tool-button">
        Parse certificate
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {rows.length ? (
        <dl className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-sm sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-400">{label}</dt>
              <dd className="mono-output mt-1 break-all text-slate-100">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </ToolCard>
  )
}

export default CertificateDetails
