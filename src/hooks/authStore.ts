import { create } from 'zustand'
import * as authService from '../services/auth.ts'
import { ApiRequestError } from '../types/api.ts'
import type { AuthCredentials, AuthUser } from '../types/auth.ts'
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/tokenStorage.ts'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

type AuthState = {
  user: AuthUser | null
  status: AuthStatus
  isSubmitting: boolean
  error: string | null
  initialize: () => Promise<void>
  login: (credentials: AuthCredentials) => Promise<void>
  register: (credentials: AuthCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
}

async function authenticate(
  action: () => Promise<{ token: string; user: AuthUser }>,
): Promise<{ token: string; user: AuthUser }> {
  const result = await action()
  setStoredToken(result.token)
  return result
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  isSubmitting: false,
  error: null,

  initialize: async () => {
    const token = getStoredToken()

    if (!token) {
      set({ user: null, status: 'unauthenticated', error: null })
      return
    }

    set({ status: 'loading', error: null })

    try {
      const { user } = await authService.getMe(token)
      set({ user, status: 'authenticated', error: null })
    } catch (error) {
      clearStoredToken()
      set({
        user: null,
        status: 'unauthenticated',
        error: null,
      })

      if (!(error instanceof ApiRequestError) || error.status !== 401) {
        set({
          error: error instanceof Error ? error.message : 'Failed to restore session',
        })
      }
    }
  },

  login: async (credentials) => {
    set({ isSubmitting: true, error: null })

    try {
      const { user } = await authenticate(() => authService.login(credentials))
      set({ user, status: 'authenticated', isSubmitting: false, error: null })
    } catch (error) {
      set({
        user: null,
        status: 'unauthenticated',
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Login failed',
      })
      throw error
    }
  },

  register: async (credentials) => {
    set({ isSubmitting: true, error: null })

    try {
      const { user } = await authenticate(() => authService.register(credentials))
      set({ user, status: 'authenticated', isSubmitting: false, error: null })
    } catch (error) {
      set({
        user: null,
        status: 'unauthenticated',
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      })
      throw error
    }
  },

  logout: () => {
    clearStoredToken()
    set({ user: null, status: 'unauthenticated', error: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))
