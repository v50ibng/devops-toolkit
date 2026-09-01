import { useCallback, useState } from 'react'
import ToolCard from '../common/ToolCard.jsx'
import { useToast } from '../common/useToast.jsx'

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
}

function PasswordGenerator() {
  const toast = useToast()
  const [length, setLength] = useState(20)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [result, setResult] = useState(null)

  const handleGenerate = useCallback(() => {
    const pool = Object.entries(CHARSETS)
      .filter(([key]) => options[key])
      .map(([, chars]) => chars)
      .join('')
    if (!pool) return
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    const password = Array.from(array, (value) => pool[value % pool.length]).join('')
    setResult({ password, poolSize: pool.length, length })
  }, [length, options])

  async function handleCopy() {
    if (!result?.password) return
    try {
      await navigator.clipboard.writeText(result.password)
      toast.show('Password copied to clipboard.')
    } catch {
      toast.show('Copy failed. Your browser blocked clipboard access.')
    }
  }

  function toggleOption(key) {
    setOptions((current) => ({ ...current, [key]: !current[key] }))
  }

  const activeCount = Object.values(options).filter(Boolean).length

  return (
    <ToolCard
      title="Password Generator"
      description="Generate a cryptographically secure random password in your browser. Nothing is sent to any server."
    >
      {/* Length control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300">Password length</label>
          <span className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1 text-sm font-mono text-slate-100">
            {length}
          </span>
        </div>
        <input
          type="range"
          min="8"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      {/* Character set options */}
      <div className="space-y-2">
        <p className="text-sm text-slate-300">Character sets</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.keys(CHARSETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleOption(key)}
              className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${
                options[key]
                  ? 'border-blue-500/60 bg-blue-500/15 text-blue-200'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        {activeCount === 0 ? (
          <p className="text-xs text-amber-400">Select at least one character set.</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="tool-button"
        disabled={activeCount === 0}
      >
        Generate password
      </button>

      {result ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3">
            <p className="mono-output flex-1 break-all text-slate-100 text-base">{result.password}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="tool-button-secondary shrink-0"
            >
              Copy
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>{result.length} characters</span>
            <span>
              Entropy ≈ {Math.floor(result.length * Math.log2(result.poolSize))} bits
            </span>
          </div>
        </div>
      ) : null}
    </ToolCard>
  )
}

export default PasswordGenerator
