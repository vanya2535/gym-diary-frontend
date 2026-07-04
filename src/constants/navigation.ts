import { ROUTES } from './routes.ts'

export const NAV_ITEMS = [
  { to: ROUTES.workouts, label: 'Тренировки' },
  { to: ROUTES.nutrition, label: 'Питание' },
  { to: ROUTES.measurements, label: 'Замеры' },
] as const

export const APP_TITLE = 'Дневник'
