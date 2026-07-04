import { type FormEvent, useEffect, useState } from 'react'
import { getNutritionGoals, updateNutritionGoals } from '../../services/nutrition-goals.ts'
import type { NutritionGoals } from '../../types/nutrition.ts'
import { formatBjuInput, parseBjuInput } from '../../utils/bjuInput.ts'
import styles from './ProfilePage.module.scss'

type BjuInputProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function BjuInput({ id, label, value, onChange }: BjuInputProps) {
  return (
    <label className={styles.bjuField} htmlFor={id}>
      <span className={styles.bjuLabel}>{label}</span>
      <input
        id={id}
        className={styles.input}
        type="text"
        inputMode="decimal"
        placeholder="165 / 60 / 135"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className={styles.bjuHint}>Б / Ж / У через « / »</span>
    </label>
  )
}

export function ProfilePage() {
  const [singleGoal, setSingleGoal] = useState(false)
  const [workoutInput, setWorkoutInput] = useState('')
  const [restInput, setRestInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadGoals() {
      setIsLoading(true)
      setError(null)

      try {
        const goals = await getNutritionGoals()

        if (!cancelled) {
          setSingleGoal(goals.singleGoal)
          setWorkoutInput(formatBjuInput(goals.workout))
          setRestInput(formatBjuInput(goals.rest))
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить профиль')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadGoals()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const workout = parseBjuInput(workoutInput)
    const rest = singleGoal ? null : parseBjuInput(restInput)

    if (singleGoal && workoutInput.trim() && workout === null) {
      setError('Цель БЖУ: формат 165 / 60 / 135')
      return
    }

    if (!singleGoal && restInput.trim() && rest === null) {
      setError('Отдых: формат 165 / 60 / 135')
      return
    }

    if (!singleGoal && workoutInput.trim() && workout === null) {
      setError('Тренировка: формат 165 / 60 / 135')
      return
    }

    if (singleGoal && workout === null) {
      setError('Заполните цель БЖУ')
      return
    }

    if (!singleGoal && workout === null && rest === null) {
      setError('Заполните хотя бы одну цель')
      return
    }

    const payload: NutritionGoals = {
      singleGoal,
      workout,
      rest,
    }

    setIsSubmitting(true)

    try {
      const saved = await updateNutritionGoals(payload)
      setSingleGoal(saved.singleGoal)
      setWorkoutInput(formatBjuInput(saved.workout))
      setRestInput(formatBjuInput(saved.rest))
      setSuccess('Сохранено')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось сохранить')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Загрузка…</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Профиль</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Цели питания</h2>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={singleGoal}
                onChange={(event) => setSingleGoal(event.target.checked)}
              />
              <span>Одна цель для всех дней</span>
            </label>

            <BjuInput
              id="workout-bju"
              label={singleGoal ? 'Цель БЖУ' : 'Тренировка'}
              value={workoutInput}
              onChange={setWorkoutInput}
            />

            {!singleGoal ? (
              <BjuInput
                id="rest-bju"
                label="Отдых"
                value={restInput}
                onChange={setRestInput}
              />
            ) : null}
          </section>

          {error ? <p className={styles.error}>{error}</p> : null}
          {success ? <p className={styles.success}>{success}</p> : null}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение…' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}
