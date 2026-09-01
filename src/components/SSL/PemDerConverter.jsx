import { useState } from 'react'
import CodeBlock from '../common/CodeBlock.jsx'
import FileUpload from '../common/FileUpload.jsx'
import ToolCard from '../common/ToolCard.jsx'
import { useToast } from '../common/useToast.jsx'
import { convertDerToPem, convertPemToDerBase64 } from '../../utils/certificates.js'
import {
  downloadBinaryFile,
  downloadTextFile,
  readFileAsBinaryString,
  readFileAsText,
} from '../../utils/files.js'

function PemDerConverter() {
  const toast = useToast()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('pem')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleFileSelect(file) {
    if (file.name.endsWith('.der')) {
      const binary = await readFileAsBinaryString(file)
      setMode('der')
      setInput(btoa(binary))
      return
    }
    setMode('pem')
    setInput(await readFileAsText(file))
  }

  function handleConvert() {
    try {
      setError('')
      if (mode === 'pem') {
        setResult({ mode, ...convertPemToDerBase64(input) })
        return
      }
      setResult({ mode, text: convertDerToPem(input.replace(/\s+/g, '')) })
    } catch (convertError) {
      setResult(null)
      setError(convertError.message || 'Unable to convert the provided certificate.')
    }
  }

  return (
    <ToolCard
      title="PEM ↔ DER Converter"
      description="Convert certificates between PEM and DER without sending data to any server."
    >
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode('pem')}
          className={mode === 'pem' ? 'tool-button' : 'tool-button-secondary'}
        >
          PEM → DER
        </button>
        <button
          type="button"
          onClick={() => setMode('der')}
          className={mode === 'der' ? 'tool-button' : 'tool-button-secondary'}
        >
          DER → PEM
        </button>
      </div>

      <FileUpload
        accept=".pem,.crt,.cer,.der"
        description="Upload a PEM certificate or DER certificate file."
        onFileSelect={handleFileSelect}
      />

      <label className="block space-y-2 text-sm">
        <span className="text-slate-300">
          {mode === 'pem' ? 'PEM certificate' : 'DER certificate (base64 text or .der upload)'}
        </span>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="tool-input mono-output min-h-56"
          placeholder={
            mode === 'pem' ? '-----BEGIN CERTIFICATE-----' : 'MIID… (base64-encoded DER)'
          }
        />
      </label>

      <button type="button" onClick={handleConvert} className="tool-button">
        Convert
      </button>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {result ? (
        <CodeBlock
          title={result.mode === 'pem' ? 'DER output (base64)' : 'PEM output'}
          value={result.text}
          actions={
            <button
              type="button"
              className="tool-button-secondary"
              onClick={() => {
                if (result.mode === 'pem') {
                  downloadBinaryFile('converted.der', result.bytes)
                } else {
                  downloadTextFile('converted.pem', result.text)
                }
                toast.show('Converted file downloaded.')
              }}
            >
              Download
            </button>
          }
        />
      ) : null}
    </ToolCard>
  )
}

export default PemDerConverter
