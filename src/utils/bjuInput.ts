import type { BjuTotals } from '../types/nutrition.ts'

const BJU_INPUT_PATTERN = /^(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/

function parseBjuNumber(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(',', '.'))

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null
  }

  return parsed
}

function formatBjuNumber(value: number): string {
  if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 1e-9) {
    return String(Math.round(value))
  }

  return String(Number.parseFloat(value.toFixed(3)))
}

export function formatBjuInput(totals: BjuTotals | null): string {
  if (!totals) {
    return ''
  }

  return `${formatBjuNumber(totals.protein)} / ${formatBjuNumber(totals.fat)} / ${formatBjuNumber(totals.carbs)}`
}

export function parseBjuInput(value: string): BjuTotals | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const match = trimmed.match(BJU_INPUT_PATTERN)

  if (!match) {
    return null
  }

  const protein = parseBjuNumber(match[1])
  const fat = parseBjuNumber(match[2])
  const carbs = parseBjuNumber(match[3])

  if (protein === null || fat === null || carbs === null) {
    return null
  }

  return { protein, fat, carbs }
}
