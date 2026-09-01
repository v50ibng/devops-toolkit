import PasswordGenerator from '../components/Password/PasswordGenerator.jsx'

function PasswordTools() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Password Tools</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-50">
          Browser-side password generation
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          Generate cryptographically secure passwords entirely in your browser using the Web Crypto
          API. No data is sent to any server.
        </p>
      </section>
      <PasswordGenerator />
    </div>
  )
}

export default PasswordTools
