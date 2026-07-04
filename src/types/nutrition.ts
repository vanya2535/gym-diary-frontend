export type BjuTotals = {
  protein: number
  fat: number
  carbs: number
}

export type NutritionDayType = 'workout' | 'rest'

export type NutritionGoals = {
  singleGoal: boolean
  workout: BjuTotals | null
  rest: BjuTotals | null
}

export type NutritionEntry = {
  id: string
  content: string
  authorId: string
  createdAt: string
  dayType: NutritionDayType | null
}

export type CreateNutritionEntryInput = {
  content: string
  dayType?: NutritionDayType | null
  applyProfileGoal?: boolean
}

export type UpdateNutritionEntryInput = CreateNutritionEntryInput

export function hasConfiguredNutritionGoals(goals: NutritionGoals): boolean {
  if (goals.singleGoal) {
    return goals.workout !== null
  }

  return goals.workout !== null || goals.rest !== null
}

export function shouldShowNutritionDayTypeSelector(goals: NutritionGoals): boolean {
  return !goals.singleGoal && goals.workout !== null && goals.rest !== null
}
