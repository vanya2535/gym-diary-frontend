import type { NutritionGoals } from '../types/nutrition.ts'
import { apiRequest } from './api.ts'

export function getNutritionGoals(): Promise<NutritionGoals> {
  return apiRequest<NutritionGoals>('/profile/nutrition-goals')
}

export function updateNutritionGoals(goals: NutritionGoals): Promise<NutritionGoals> {
  return apiRequest<NutritionGoals>('/profile/nutrition-goals', {
    method: 'PUT',
    body: goals,
  })
}
