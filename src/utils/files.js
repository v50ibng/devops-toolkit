export function downloadTextFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function downloadBinaryFile(filename, bytes, type = 'application/octet-stream') {
  const blob = new Blob([bytes], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Unable to read file.'))
    reader.readAsText(file)
  })
}

export function readFileAsBinaryString(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result)
      let result = ''

      for (let index = 0; index < bytes.length; index += 0x8000) {
        const chunk = bytes.subarray(index, index + 0x8000)
        result += String.fromCharCode.apply(null, chunk)
      }

      resolve(result)
    }
    reader.onerror = () => reject(reader.error || new Error('Unable to read file.'))
    reader.readAsArrayBuffer(file)
  })
}
