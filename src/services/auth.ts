import type { AuthCredentials, AuthResult, MeResponse } from '../types/auth.ts'
import { apiRequest } from './api.ts'

export function register(credentials: AuthCredentials): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/register', {
    method: 'POST',
    body: credentials,
  })
}

export function login(credentials: AuthCredentials): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function getMe(token: string): Promise<MeResponse> {
  return apiRequest<MeResponse>('/auth/me', { token })
}
