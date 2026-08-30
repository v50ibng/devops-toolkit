import { useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import FileUpload from '../common/FileUpload.jsx'
import CodeBlock from '../common/CodeBlock.jsx'
import { orderCertificateChain, parseCertificateChain } from '../../utils/certificates.js'
import { readFileAsText } from '../../utils/files.js'

function CertificateChain() {
  const [pemChain, setPemChain] = useState('')
  const [certificates, setCertificates] = useState([])
  const [expanded, setExpanded] = useState('')
  const [error, setError] = useState('')

  async function handleFileSelect(file) {
    const text = await readFileAsText(file)
    setPemChain(text)
  }

  function handleBuildChain() {
    try {
      setError('')
      setCertificates(orderCertificateChain(parseCertificateChain(pemChain)))
    } catch (chainError) {
      setCertificates([])
      setError(chainError.message || 'Invalid PEM chain.')
    }
  }

  return (
    <ToolCard
      title="Show Certificate Chain"
      description="Paste an entire PEM chain and visualize the linked root, intermediate, and leaf certificates."
    >
      <FileUpload
        accept=".pem,.crt,.cer"
        description="Upload a PEM chain file with one or more certificates."
        onFileSelect={handleFileSelect}
      />

      <label className="block space-y-2 text-sm">
        <span className="text-slate-300 light:text-slate-700">PEM chain</span>
        <textarea
          value={pemChain}
          onChange={(event) => setPemChain(event.target.value)}
          className="tool-input mono-output min-h-56"
          placeholder="-----BEGIN CERTIFICATE-----"
        />
      </label>

      <button type="button" onClick={handleBuildChain} className="tool-button">
        Visualize chain
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {certificates.length ? (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
            {certificates.map((certificate, index) => (
              <div key={`${certificate.subject}-${index}`} className="space-y-4">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((current) =>
                      current === certificate.subject ? '' : certificate.subject,
                    )
                  }
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left shadow transition hover:-translate-y-1 hover:border-blue-400 light:border-slate-200 light:bg-white"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {index === 0
                      ? 'Root'
                      : index === certificates.length - 1
                        ? 'Leaf'
                        : 'Intermediate'}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-100 light:text-slate-900">
                    {certificate.commonName}
                  </h3>
                  <p className="mt-3 text-sm text-slate-400 light:text-slate-600">
                    Issuer: {certificate.issuer}
                  </p>
                  <p className="mt-2 text-sm text-slate-400 light:text-slate-600">
                    Valid: {certificate.validity.notBefore} → {certificate.validity.notAfter}
                  </p>
                </button>

                {index < certificates.length - 1 ? (
                  <div className="flex justify-center text-3xl text-blue-300">↓</div>
                ) : null}
              </div>
            ))}
          </div>

          {certificates.map((certificate) =>
            expanded === certificate.subject ? (
              <CodeBlock key={certificate.subject} title={certificate.commonName} value={certificate.pem} />
            ) : null,
          )}
        </div>
      ) : null}
    </ToolCard>
  )
}

export default CertificateChain
