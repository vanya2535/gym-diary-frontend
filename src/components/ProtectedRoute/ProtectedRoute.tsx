import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.ts'
import { useAuthStore } from '../../hooks/authStore.ts'
import { RouteLoading } from '../RouteLoading/index.ts'

export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status)

  if (status === 'idle' || status === 'loading') {
    return <RouteLoading />
  }

  if (status !== 'authenticated') {
    return <Navigate to={ROUTES.auth} replace />
  }

  return <Outlet />
}
