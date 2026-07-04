const NICKNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/

export function validateNickname(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Введите никнейм'
  }

  if (trimmed.length < 3 || trimmed.length > 32) {
    return 'Никнейм: от 3 до 32 символов'
  }

  if (!NICKNAME_PATTERN.test(trimmed)) {
    return 'Только буквы, цифры и подчёркивания'
  }

  return null
}

export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Введите пароль'
  }

  if (value.length < 6) {
    return 'Пароль: минимум 6 символов'
  }

  if (value.length > 128) {
    return 'Пароль: максимум 128 символов'
  }

  return null
}
