import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../hooks/authStore.ts'
import { useLastDiaryPage } from '../../hooks/useLastDiaryPage.ts'
import { RouteLoading } from '../RouteLoading/index.ts'

export function GuestRoute() {
  const { lastDiaryPageRoute } = useLastDiaryPage()
  const status = useAuthStore((state) => state.status)

  if (status === 'idle' || status === 'loading') {
    return <RouteLoading />
  }

  if (status === 'authenticated') {
    return <Navigate to={lastDiaryPageRoute} replace />
  }

  return <Outlet />
}
