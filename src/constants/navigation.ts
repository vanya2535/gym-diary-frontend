import { ROUTES } from './routes.ts'

export const NAV_ITEMS = [
  { to: ROUTES.workouts, label: 'Workouts' },
  { to: ROUTES.nutrition, label: 'Nutrition' },
  { to: ROUTES.measurements, label: 'Measurements' },
] as const
