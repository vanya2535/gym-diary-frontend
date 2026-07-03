import { THEME_STORAGE_KEY, type ThemePreference } from '../constants/theme.ts'

export function getStoredThemePreference(): ThemePreference | null {
  const value = localStorage.getItem(THEME_STORAGE_KEY)

  if (value === 'light' || value === 'dark' || value === 'system') {
    return value
  }

  return null
}

export function applyThemePreference(preference: ThemePreference) {
  const root = document.documentElement

  if (preference === 'system') {
    root.removeAttribute('data-theme')
    localStorage.removeItem(THEME_STORAGE_KEY)
    return
  }

  root.dataset.theme = preference
  localStorage.setItem(THEME_STORAGE_KEY, preference)
}

export function initTheme() {
  const stored = getStoredThemePreference()

  if (stored && stored !== 'system') {
    document.documentElement.dataset.theme = stored
  }
}
