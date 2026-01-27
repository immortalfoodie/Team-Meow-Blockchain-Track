import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../api/api'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />
  if (allowedRoles && (!role || !allowedRoles.includes(role))) return <Navigate to={redirectTo} replace />

  return <Outlet />
}
