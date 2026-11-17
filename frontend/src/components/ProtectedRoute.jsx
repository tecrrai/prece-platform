import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated } = useAuth()
  const { user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (user?.primeiroAcesso && location.pathname !== '/primeiro-acesso') return <Navigate to="/primeiro-acesso" replace />
  if (!user?.primeiroAcesso && location.pathname === '/primeiro-acesso') return <Navigate to="/app" replace />
  if (roles?.length && !roles.includes(user?.perfil)) return <Navigate to={user?.perfil === 'ALUNO' ? '/' : '/app'} replace />
  return children ?? <Outlet />
}
