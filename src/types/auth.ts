export type AuthUser = {
  id: string
  nickname: string
}

export type AuthCredentials = {
  nickname: string
  password: string
}

export type AuthResult = {
  token: string
  user: AuthUser
}

export type MeResponse = {
  user: AuthUser
}

export type ApiErrorBody = {
  error: string
  code?: string
}
