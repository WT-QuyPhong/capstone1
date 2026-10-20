import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { Inbox, Info, Search, Sparkles, X } from 'lucide-react'

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}) {
  return <button type={type} className={`cc-button cc-button-${variant} ${className}`} {...props} />
}
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return <input ref={ref} className={`cc-input ${className}`} {...props} />
  },
)
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', ...props }, ref) {
    return <select ref={ref} className={`cc-input cc-select ${className}`} {...props} />
  },
)
export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  const generatedId = useId()
  const control = isValidElement<{
    id?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }>(children)
    ? children
    : null
  const id = control?.props.id || generatedId
  return (
    <div className={`cc-field ${error ? 'has-error' : ''}`}>
      <label className="cc-label" htmlFor={id}>
        {label}
      </label>
      {control
        ? cloneElement(control, {
            id,
            ...(error ? { 'aria-describedby': `${id}-error`, 'aria-invalid': true } : {}),
          })
        : children}
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
export function Badge({
  children,
  tone = 'green',
}: {
  children: ReactNode
  tone?: 'green' | 'gray' | 'amber' | 'red' | 'blue'
}) {
  return <span className={`cc-badge cc-badge-${tone}`}>{children}</span>
}
export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    if (!open) return
    const dialog = ref.current
    const previous = document.activeElement
    if (dialog && !dialog.open) dialog.showModal()
    return () => {
      dialog?.close()
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open])
  if (!open) return null
  return (
    <dialog
      ref={ref}
      className="cc-modal"
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section className="cc-modal-inner">
        <header>
          <h2 id={id}>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </header>
        <div className="cc-modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </dialog>
  )
}
export function PageHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  )
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <Inbox size={32} strokeWidth={1.4} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}
export function LoadingState({ label = 'Loading workspace…' }: { label?: string }) {
  return (
    <div className="empty-state" role="status">
      <span className="cc-spinner" />
      <p>{label}</p>
    </div>
  )
}
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="cc-search">
      <Search size={17} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder.replace(/\.{3}|…/g, '')}
      />
    </div>
  )
}
export function DemoNotice({
  text = 'Demo workspace — data is stored in this browser. AI and external services are simulated.',
}: {
  text?: string
}) {
  return (
    <div className="demo-notice">
      <Info size={14} />
      <span>{text}</span>
    </div>
  )
}
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark">
      <span className="brand-symbol">
        <Sparkles size={22} fill="currentColor" />
      </span>
      {!compact && (
        <span>
          <strong>ContentCraft</strong>
          <small>AI Marketing Workspace</small>
        </span>
      )}
    </span>
  )
}
