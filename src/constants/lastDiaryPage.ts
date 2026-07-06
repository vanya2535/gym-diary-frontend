import { ROUTES } from './routes.ts'

export const LAST_DIARY_PAGE_STORAGE_KEY = 'gym-diary:last-diary-page'

export const DIARY_PAGE_ROUTES = [ROUTES.workouts, ROUTES.nutrition, ROUTES.measurements] as const

export type DiaryPageRoute = (typeof DIARY_PAGE_ROUTES)[number]
