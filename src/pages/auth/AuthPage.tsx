import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react'
import { Button, Input, Modal } from '../../components/ui'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import './auth.css'

export function makeAuthSchema(register: boolean) {
  return z
    .object({
      fullName: z.string().optional(),
      email: z.email('Enter a valid email address.'),
      password: z.string().min(8, 'Use at least 8 characters.'),
      confirmPassword: z.string().optional(),
      terms: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (register && (!data.fullName || data.fullName.trim().length < 2))
        ctx.addIssue({
          code: 'custom',
          path: ['fullName'],
          message: 'Enter your full name (at least 2 characters).',
        })
      if (register && data.password !== data.confirmPassword)
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'Passwords do not match.',
        })
      if (register && !data.terms)
        ctx.addIssue({
          code: 'custom',
          path: ['terms'],
          message: 'Please agree to the terms to continue.',
        })
    })
}
type AuthFields = z.infer<ReturnType<typeof makeAuthSchema>>
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285f4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.3 2.9-7.4Z"
      />
      <path
        fill="#34a853"
        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0 0 12 22Z"
      />
      <path fill="#fbbc05" d="M6.4 14a6 6 0 0 1 0-4V7.4H3a10 10 0 0 0 0 9.2L6.4 14Z" />
      <path
        fill="#ea4335"
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9 5.4L6.4 10c.8-2.3 3-4.1 5.6-4.1Z"
      />
    </svg>
  )
}

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register'
  const [visible, setVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [remember, setRemember] = useState(true)
  const [panel, setPanel] = useState<'google' | 'reset' | 'terms' | 'privacy' | 'feedback' | null>(
    null,
  )
  const [feedback, setFeedback] = useState('')
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { signIn } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFields>({
    resolver: zodResolver(makeAuthSchema(isRegister)),
    defaultValues: { email: params.get('email') || '', terms: false },
  })
  const submit = async (values: AuthFields) => {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    signIn(
      { name: values.fullName?.trim() || values.email.split('@')[0], email: values.email },
      remember,
    )
    notify(
      isRegister
        ? 'Demo workspace created. No real account was registered.'
        : 'Welcome to your demo workspace.',
    )
    navigate('/dashboard')
  }
  return (
    <main id="main-content" className={`auth-page ${isRegister ? 'auth-register' : ''}`}>
      <aside className="auth-brand-panel">
        <div className="auth-logo-line">
          <Link to="/" className="auth-brand">
            <span>
              <Mail size={21} />
            </span>
            ContentCraft
            <i />
          </Link>
          <span className="auth-version">
            <i /> v2.4 Ready
          </span>
        </div>
        <div className="auth-floating auth-design">
          <span className="figma-symbol">F</span>
          <div>
            <strong>Design System</strong>
            <small>Synced</small>
          </div>
          <i />
        </div>
        <div className="auth-brand-copy">
          <span className="auth-eyebrow">
            <BadgeCheck size={16} /> ARCHITECTURAL CONTENT OS
          </span>
          <h1>
            Create better
            <br />
            marketing with
            <br />
            reusable brand
            <br />
            context.
          </h1>
          <p>
            Manage brand knowledge, products, audiences, AI drafts, images, history, and analytics
            in one reviewable workflow.
          </p>
          <div className="auth-stats">
            <div>
              <strong>100%</strong>
              <small>Brand Consistency</small>
            </div>
            <div>
              <strong>14×</strong>
              <small>Faster Rollout</small>
            </div>
            <div>
              <strong>Local</strong>
              <small>Browser workspace</small>
            </div>
          </div>
        </div>
        <div className="auth-floating auth-wiki">
          <span className="tile-circle">N</span>
          <div>
            <strong>Brand Wiki</strong>
            <small>2,410 Docs</small>
          </div>
        </div>
        <div className="auth-floating auth-drafting">
          <span className="tile-circle mint">
            <Sparkles size={19} />
          </span>
          <div>
            <strong>AI Drafting</strong>
            <small>Context-aware demo</small>
          </div>
        </div>
        <div className="auth-floating auth-review">
          <span className="tile-circle lavender">
            <MessageSquare size={18} />
          </span>
          <div>
            <strong>Slack Review</strong>
            <small>Illustrative integration</small>
          </div>
        </div>
        <div className="auth-brand-footer">
          <span>
            <LockKeyhole size={17} /> Your demo credentials are never saved.
          </span>
          <span>© ContentCraft</span>
        </div>
      </aside>
      <section className="auth-form-panel">
        <div className="auth-help">
          Need assistance?{' '}
          <Link to="/resources">
            Help Center <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="auth-card">
          <div className="auth-card-icon">
            {isRegister ? <UserPlus size={23} /> : <KeyRound size={23} />}
          </div>
          <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Start your ContentCraft workspace'
              : 'Sign in to continue to your workspace'}
          </p>
          <button className="auth-google" type="button" onClick={() => setPanel('google')}>
            <GoogleIcon /> Continue with Google
          </button>
          <div className="auth-divider">
            <span>OR CONTINUE WITH</span>
          </div>
          <form onSubmit={handleSubmit(submit)} noValidate>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="fullName">FULL NAME</label>
                <div className="auth-input-wrap">
                  <Input
                    id="fullName"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby="fullName-error"
                    {...register('fullName')}
                  />
                  <User size={18} />
                </div>
                {errors.fullName && (
                  <span id="fullName-error" className="field-error" role="alert">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="email">EMAIL</label>
              <div className="auth-input-wrap">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  {...register('email')}
                />
                <Mail size={18} />
              </div>
              {errors.email && (
                <span id="email-error" className="field-error" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">PASSWORD</label>
                {!isRegister && (
                  <button type="button" className="text-link" onClick={() => setPanel('reset')}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrap">
                <Input
                  id="password"
                  type={visible ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder="••••••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  {...register('password')}
                />
                <button
                  type="button"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="field-error" role="alert">
                  {errors.password.message}
                </span>
              )}
            </div>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                <div className="auth-input-wrap">
                  <Input
                    id="confirmPassword"
                    type={confirmVisible ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby="confirm-error"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    aria-label={
                      confirmVisible ? 'Hide password confirmation' : 'Show password confirmation'
                    }
                    onClick={() => setConfirmVisible(!confirmVisible)}
                  >
                    {confirmVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span id="confirm-error" className="field-error" role="alert">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            )}
            {isRegister ? (
              <>
                <div className="auth-check">
                  <input id="terms" type="checkbox" {...register('terms')} />
                  <label htmlFor="terms">
                    By signing up, you agree to our{' '}
                    <button type="button" className="text-link" onClick={() => setPanel('terms')}>
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-link" onClick={() => setPanel('privacy')}>
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>
                {errors.terms && (
                  <p className="field-error" role="alert">
                    {errors.terms.message}
                  </p>
                )}
              </>
            ) : (
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{' '}
                Keep me signed in on this device
              </label>
            )}
            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Opening demo…' : isRegister ? 'Create account' : 'Sign in'}
              <ArrowRight size={18} />
            </Button>
          </form>
          <p className="auth-mode-link">
            {isRegister ? 'Already have an account?' : 'New to ContentCraft?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Sign in' : 'Create account'}
            </Link>
          </p>
          <div className="auth-demo-note">
            <ShieldCheck size={13} /> Demo authentication · No passwords stored or sent
          </div>
        </div>
        <p className="auth-bottom">ContentCraft frontend demonstration · Privacy & Terms apply</p>
      </section>
      <button className="feedback-tab" onClick={() => setPanel('feedback')}>
        <MessageSquare size={15} /> FEEDBACK
      </button>
      <Modal
        open={panel !== null}
        title={
          panel === 'google'
            ? 'Google sign-in'
            : panel === 'reset'
              ? 'Password recovery'
              : panel === 'feedback'
                ? 'Share feedback'
                : panel === 'terms'
                  ? 'Demo terms of use'
                  : 'Demo privacy information'
        }
        onClose={() => setPanel(null)}
      >
        {panel === 'google' ? (
          <>
            <p className="muted">
              Google OAuth is not connected. You can explore the frontend with a clearly identified
              demo session.
            </p>
            <Button
              onClick={() => {
                signIn({ name: 'Demo Creator', email: 'creator@contentcraft.demo' }, false)
                navigate('/dashboard')
                notify('Entered demo mode. No Google authentication occurred.', 'info')
              }}
            >
              Explore demo workspace <ArrowRight size={16} />
            </Button>
          </>
        ) : panel === 'reset' ? (
          <p className="muted">
            No real account exists in this frontend demo. Password recovery emails require a
            connected authentication backend. Use any valid email and a password of at least 8
            characters to enter demo mode.
          </p>
        ) : panel === 'feedback' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              try {
                localStorage.setItem('contentcraft-feedback', feedback)
                notify('Feedback saved on this device. It has not been sent to a server.')
                setFeedback('')
                setPanel(null)
              } catch {
                notify('Unable to save feedback in this browser.', 'error')
              }
            }}
          >
            <label className="cc-field">
              <span className="cc-label">Your feedback</span>
              <textarea
                required
                minLength={5}
                maxLength={2000}
                className="cc-input"
                rows={5}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What could make your workflow better?"
              />
            </label>
            <div className="modal-actions">
              <Button type="submit">Save demo feedback</Button>
            </div>
          </form>
        ) : (
          <p className="muted">
            This is a university frontend demonstration. Workspace records are stored only in your
            browser. Passwords are never saved, sent, or verified. No payments, AI provider
            requests, or social media connections are made. Production legal policies and identity
            controls must be supplied with the backend.
          </p>
        )}
      </Modal>
    </main>
  )
}
