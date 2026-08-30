import { useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import CodeBlock from '../common/CodeBlock.jsx'
import FileUpload from '../common/FileUpload.jsx'
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
        <span className="text-slate-300 light:text-slate-700">Certificate PEM</span>
        <textarea
          value={pem}
          onChange={(event) => setPem(event.target.value)}
          className="tool-input mono-output min-h-56"
          placeholder="-----BEGIN CERTIFICATE-----"
        />
      </label>

      <button type="button" onClick={handleParse} className="tool-button">
        Display details
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {details ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 light:border-slate-200">
            <table className="min-w-full divide-y divide-slate-800/80 text-left text-sm light:divide-slate-200">
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 light:divide-slate-200 light:bg-white">
                {rows.map(([label, value]) => (
                  <tr key={label}>
                    <th className="w-48 px-4 py-3 font-medium text-slate-400 light:text-slate-500">
                      {label}
                    </th>
                    <td className="px-4 py-3 break-words text-slate-100 light:text-slate-900">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock title="Raw PEM" value={details.pem} />
        </>
      ) : null}
    </ToolCard>
  )
}

export default CertificateDetails
