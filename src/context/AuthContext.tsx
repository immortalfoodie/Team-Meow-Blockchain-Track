import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginApi, type LoginResponse, type UserRole } from '../api/api'

interface AuthState {
  token: string | null
  role: UserRole | null
  name?: string
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, role: null })

  useEffect(() => {
    const token = localStorage.getItem('jwt')
    const role = localStorage.getItem('role') as UserRole | null
    const name = localStorage.getItem('name') || undefined
    if (token && role) {
      setState({ token, role, name })
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Frontend-first: try backend login, but fall back to demo accounts for judging/demo use.
    const demoAccounts: Record<
      string,
      {
        password: string
        role: UserRole
        name: string
      }
    > = {
      'officer@demo.gov': { password: 'officer123', role: 'officer', name: 'Demo Officer' },
      'analyst@demo.gov': { password: 'analyst123', role: 'analyst', name: 'Demo Analyst' },
      'judge@demo.gov': { password: 'judge123', role: 'judge', name: 'Demo Judge' },
    }

    try {
      const data: LoginResponse = await loginApi(email, password)
      localStorage.setItem('jwt', data.token)
      localStorage.setItem('role', data.role)
      if (data.name) localStorage.setItem('name', data.name)
      setState({ token: data.token, role: data.role, name: data.name })
      return
    } catch (err) {
      const demo = demoAccounts[email]
      if (demo && demo.password === password) {
        const fakeToken = `demo-${demo.role}-token`
        localStorage.setItem('jwt', fakeToken)
        localStorage.setItem('role', demo.role)
        localStorage.setItem('name', demo.name)
        setState({ token: fakeToken, role: demo.role, name: demo.name })
        return
      }
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    setState({ token: null, role: null })
  }

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, isAuthenticated: Boolean(state.token) }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
