import { useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CertificateChain from '../components/SSL/CertificateChain.jsx'
import CertificateDetails from '../components/SSL/CertificateDetails.jsx'
import ExtractCAFromHost from '../components/SSL/ExtractCAFromHost.jsx'
import GenerateSelfSignedCert from '../components/SSL/GenerateSelfSignedCert.jsx'
import PemDerConverter from '../components/SSL/PemDerConverter.jsx'
import VerifyCertKeyMatch from '../components/SSL/VerifyCertKeyMatch.jsx'
import { sslTools } from '../data/tools.js'

const sslComponents = {
  'extract-ca': ExtractCAFromHost,
  'certificate-details': CertificateDetails,
  'certificate-chain': CertificateChain,
  'verify-cert-key': VerifyCertKeyMatch,
  'pem-der-converter': PemDerConverter,
  'generate-self-signed': GenerateSelfSignedCert,
}

function SSLTools() {
  const { toolId = 'extract-ca' } = useParams()

  const ActiveTool = useMemo(
    () => sslComponents[toolId] || ExtractCAFromHost,
    [toolId],
  )

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">SSL Tools</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-50 light:text-slate-950">
          Certificate parsing, conversion, and generation
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400 light:text-slate-600">
          Every tool here runs locally in your browser using JavaScript crypto libraries.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {sslTools.map((tool) => (
            <NavLink
              key={tool.id}
              to={`/ssl/${tool.id}`}
              className={({ isActive }) =>
                isActive ? 'tool-button' : 'tool-button-secondary'
              }
            >
              {tool.name}
            </NavLink>
          ))}
        </div>
      </section>
      <ActiveTool />
    </div>
  )
}

export default SSLTools
