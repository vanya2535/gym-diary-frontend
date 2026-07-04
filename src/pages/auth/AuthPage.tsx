import { type FormEvent, useState } from 'react'
import { APP_TITLE } from '../../constants/navigation.ts'
import { useAuthStore } from '../../hooks/authStore.ts'
import { validateNickname, validatePassword } from '../../utils/authValidation.ts'
import styles from './AuthPage.module.scss'

type AuthMode = 'login' | 'register'

type FieldErrors = {
  nickname?: string
  password?: string
}

export function AuthPage() {
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)

  const [mode, setMode] = useState<AuthMode>('login')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode)
    setFieldErrors({})
    clearError()
  }

  function handleNicknameChange(value: string) {
    setNickname(value)
    if (fieldErrors.nickname) {
      setFieldErrors((current) => ({ ...current, nickname: undefined }))
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearError()

    const nextFieldErrors: FieldErrors = {
      nickname: validateNickname(nickname) ?? undefined,
      password: validatePassword(password) ?? undefined,
    }

    setFieldErrors(nextFieldErrors)

    if (nextFieldErrors.nickname || nextFieldErrors.password) {
      return
    }

    const credentials = { nickname: nickname.trim(), password }

    try {
      if (mode === 'login') {
        await login(credentials)
      } else {
        await register(credentials)
      }
    } catch {
      // Error state is handled in the store.
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{APP_TITLE}</h1>
        <p className={styles.subtitle}>
          {mode === 'login' ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
        </p>

        <div className={styles.tabs} role="tablist" aria-label="Режим авторизации">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? styles.tabButtonActive : styles.tabButton}
            onClick={() => switchMode('login')}
          >
            Вход
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={mode === 'register' ? styles.tabButtonActive : styles.tabButton}
            onClick={() => switchMode('register')}
          >
            Регистрация
          </button>
        </div>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="nickname">
              Никнейм
            </label>
            <input
              id="nickname"
              className={fieldErrors.nickname ? styles.inputInvalid : styles.input}
              type="text"
              autoComplete="username"
              value={nickname}
              aria-invalid={fieldErrors.nickname ? true : undefined}
              aria-describedby={fieldErrors.nickname ? 'nickname-error' : 'nickname-hint'}
              onChange={(event) => handleNicknameChange(event.target.value)}
            />
            {fieldErrors.nickname ? (
              <p id="nickname-error" className={styles.fieldError}>
                {fieldErrors.nickname}
              </p>
            ) : (
              <p id="nickname-hint" className={styles.hint}>
                3–32 символа: буквы, цифры, подчёркивания
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              className={fieldErrors.password ? styles.inputInvalid : styles.input}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              onChange={(event) => handlePasswordChange(event.target.value)}
            />
            {fieldErrors.password ? (
              <p id="password-error" className={styles.fieldError}>
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>
      </div>
    </div>
  )
}
