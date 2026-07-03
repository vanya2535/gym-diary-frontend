import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout/index.ts'
import { AuthInit } from '../components/AuthInit/index.ts'
import { GuestRoute } from '../components/GuestRoute/index.ts'
import { ProtectedRoute } from '../components/ProtectedRoute/index.ts'
import { ROUTES } from '../constants/routes.ts'
import { AuthPage } from '../pages/auth/AuthPage.tsx'
import { MeasurementsPage } from '../pages/measurements/MeasurementsPage.tsx'
import { NutritionPage } from '../pages/nutrition/NutritionPage.tsx'
import { WorkoutsPage } from '../pages/workouts/WorkoutsPage.tsx'

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthInit />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<Navigate to={ROUTES.workouts} replace />} />
            <Route path={ROUTES.workouts} element={<WorkoutsPage />} />
            <Route path={ROUTES.nutrition} element={<NutritionPage />} />
            <Route path={ROUTES.measurements} element={<MeasurementsPage />} />
          </Route>
        </Route>

        <Route element={<GuestRoute />}>
          <Route path={ROUTES.auth} element={<AuthPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.workouts} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
