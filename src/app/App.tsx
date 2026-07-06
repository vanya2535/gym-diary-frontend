import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout/index.ts'
import { AuthInit } from '../components/AuthInit/index.ts'
import { GuestRoute } from '../components/GuestRoute/index.ts'
import { ProtectedRoute } from '../components/ProtectedRoute/index.ts'
import { ROUTES } from '../constants/routes.ts'
import { useLastDiaryPage } from '../hooks/useLastDiaryPage.ts'
import { AuthPage } from '../pages/auth/AuthPage.tsx'
import { MeasurementsPage } from '../pages/measurements/MeasurementsPage.tsx'
import { NutritionPage } from '../pages/nutrition/NutritionPage.tsx'
import { ProfilePage } from '../pages/profile/ProfilePage.tsx'
import { WorkoutsPage } from '../pages/workouts/WorkoutsPage.tsx'

function LastDiaryPageRedirect() {
  const { lastDiaryPageRoute } = useLastDiaryPage()
  return <Navigate to={lastDiaryPageRoute} replace />
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthInit />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<LastDiaryPageRedirect />} />
            <Route path={ROUTES.workouts} element={<WorkoutsPage />} />
            <Route path={ROUTES.nutrition} element={<NutritionPage />} />
            <Route path={ROUTES.measurements} element={<MeasurementsPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<GuestRoute />}>
          <Route path={ROUTES.auth} element={<AuthPage />} />
        </Route>

        <Route path="*" element={<LastDiaryPageRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
