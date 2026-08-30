import { useToast } from './useToast.jsx'

function CopyButton({ label = 'Copy', value }) {
  const toast = useToast()

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      toast.show('Copied to clipboard.')
    } catch {
      toast.show('Copy failed. Your browser blocked clipboard access.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="tool-button-secondary"
      disabled={!value}
    >
      {label}
    </button>
  )
}

export default CopyButton
