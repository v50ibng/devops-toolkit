import { useRef, useState } from 'react'

function FileUpload({ accept, description, onFileSelect }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(fileList) {
    const file = fileList?.[0]

    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      className={`rounded-2xl border border-dashed p-5 text-sm transition ${
        dragging
          ? 'border-blue-400 bg-blue-500/10'
          : 'border-slate-700 bg-slate-900/60 light:border-slate-300 light:bg-slate-50'
      }`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-100 light:text-slate-900">
            Drag and drop a file here
          </p>
          <p className="mt-1 text-slate-400 light:text-slate-600">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="tool-button-secondary"
        >
          Choose file
        </button>
      </div>
    </div>
  )
}

export default FileUpload
