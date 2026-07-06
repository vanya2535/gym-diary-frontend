import { useCallback } from 'react'
import {
  DIARY_PAGE_ROUTES,
  LAST_DIARY_PAGE_STORAGE_KEY,
  type DiaryPageRoute,
} from '../constants/lastDiaryPage.ts'
import { ROUTES } from '../constants/routes.ts'

function isDiaryPageRoute(path: string): path is DiaryPageRoute {
  return DIARY_PAGE_ROUTES.includes(path as DiaryPageRoute)
}

function readLastDiaryPageRoute(): DiaryPageRoute {
  const value = localStorage.getItem(LAST_DIARY_PAGE_STORAGE_KEY)

  if (value && isDiaryPageRoute(value)) {
    return value
  }

  return ROUTES.workouts
}

export function useLastDiaryPage() {
  const lastDiaryPageRoute = readLastDiaryPageRoute()

  const setLastDiaryPageRoute = useCallback((route: DiaryPageRoute) => {
    localStorage.setItem(LAST_DIARY_PAGE_STORAGE_KEY, route)
  }, [])

  return { lastDiaryPageRoute, setLastDiaryPageRoute }
}
