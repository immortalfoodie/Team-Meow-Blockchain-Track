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
    try {
      const data: LoginResponse = await loginApi(email, password)
      localStorage.setItem('jwt', data.token)
      localStorage.setItem('role', data.role)
      if (data.name) localStorage.setItem('name', data.name)
      setState({ token: data.token, role: data.role, name: data.name })
      return
    } catch (err) {
      console.error('Login failed:', err)
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
