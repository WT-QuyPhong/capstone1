import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react'

type Tone = 'success' | 'error' | 'info'
const ToastContext = createContext<{ notify: (message: string, tone?: Tone) => void }>({
  notify: () => undefined,
})
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: string; message: string; tone: Tone }[]>([])
  const notify = useCallback((message: string, tone: Tone = 'success') => {
    const id = crypto.randomUUID()
    setToasts((previous) => [...previous.slice(-3), { id, message, tone }])
    window.setTimeout(() => setToasts((previous) => previous.filter((t) => t.id !== id)), 5000)
  }, [])
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            className={`toast toast-${t.tone}`}
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
          >
            {t.tone === 'success' ? (
              <CheckCircle2 size={19} />
            ) : t.tone === 'error' ? (
              <AlertCircle size={19} />
            ) : (
              <Info size={19} />
            )}
            <span>{t.message}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setToasts((p) => p.filter((item) => item.id !== t.id))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
export const useToast = () => useContext(ToastContext)
