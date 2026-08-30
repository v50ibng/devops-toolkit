import CopyButton from './CopyButton.jsx'

function CodeBlock({
  title,
  value,
  actions,
  tone = 'slate',
}) {
  const tones = {
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-100 light:bg-blue-50 light:text-blue-950',
    green:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-100 light:bg-emerald-50 light:text-emerald-950',
    gray: 'border-slate-700 bg-slate-950/90 text-slate-200 light:border-slate-300 light:bg-slate-50 light:text-slate-900',
    slate:
      'border-slate-700 bg-slate-950/90 text-slate-200 light:border-slate-300 light:bg-slate-50 light:text-slate-900',
  }

  return (
    <div className={`rounded-2xl border ${tones[tone]} shadow-sm transition hover:-translate-y-0.5`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-inherit px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={value} />
          {actions}
        </div>
      </div>
      <pre className="mono-output max-h-80 overflow-auto whitespace-pre-wrap break-all px-4 py-4 text-xs leading-6">
        {value || 'No output yet.'}
      </pre>
    </div>
  )
}

export default CodeBlock
