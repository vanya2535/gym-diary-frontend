const NICKNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/

export function validateNickname(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Nickname is required'
  }

  if (trimmed.length < 3 || trimmed.length > 32) {
    return 'Nickname must be 3–32 characters'
  }

  if (!NICKNAME_PATTERN.test(trimmed)) {
    return 'Use letters, numbers, and underscore only'
  }

  return null
}

export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Password is required'
  }

  if (value.length < 6) {
    return 'Password must be at least 6 characters'
  }

  if (value.length > 128) {
    return 'Password must be at most 128 characters'
  }

  return null
}
