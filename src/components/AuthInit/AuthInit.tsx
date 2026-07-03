import { useEffect } from 'react'
import { useAuthStore } from '../../hooks/authStore.ts'

export function AuthInit() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  return null
}
