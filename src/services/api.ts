import axios, { isAxiosError } from 'axios'
import { API_URL } from '../constants/api.ts'
import { ApiRequestError } from '../types/api.ts'
import type { ApiErrorBody } from '../types/auth.ts'
import { getStoredToken } from '../utils/tokenStorage.ts'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  token?: string | null
  body?: unknown
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, body, method = 'GET' } = options

  try {
    const response = await apiClient.request<T>({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const errorBody = error.response?.data as ApiErrorBody | undefined
      throw new ApiRequestError(
        errorBody?.error ?? error.message,
        error.response?.status ?? 0,
        errorBody?.code,
      )
    }

    throw error
  }
}
