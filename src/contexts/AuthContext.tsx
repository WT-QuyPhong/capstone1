import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DemoSession } from '../types'
import { parseDemoSession } from '../auth/roles'

const key = 'contentcraft-demo-session'
interface AuthValue {
  session: DemoSession | null
  signIn: (session: DemoSession, remember: boolean) => void
  signOut: () => void
}
const AuthContext = createContext<AuthValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(() => {
    try {
      return parseDemoSession(localStorage.getItem(key) || sessionStorage.getItem(key))
    } catch {
      /* An unavailable browser store does not prevent the demo. */
    }
    return null
  })
  const signIn = (value: DemoSession, remember: boolean) => {
    setSession(value)
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
      ;(remember ? localStorage : sessionStorage).setItem(key, JSON.stringify(value))
    } catch {
      /* Session stays in memory. */
    }
  }
  const signOut = () => {
    setSession(null)
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    } catch {
      /* Session already cleared in memory. */
    }
  }
  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider missing')
  return value
}
