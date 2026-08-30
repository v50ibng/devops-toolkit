import { useMemo, useState } from 'react'
import { ToastContext } from './useToast.jsx'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(
    () => ({
      show(message) {
        const id = crypto.randomUUID()
        setToasts((current) => [...current, { id, message }])
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }, 2400)
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-xs flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rounded-2xl border border-emerald-400/30 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-slate-950/30 light:border-emerald-200 light:bg-white light:text-slate-900"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
