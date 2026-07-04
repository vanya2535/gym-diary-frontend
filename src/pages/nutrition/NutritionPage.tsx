import { useEffect, useMemo, useState } from 'react'
import { ChatDiaryPage } from '../../components/chat/ChatDiaryPage/index.ts'
import { getNutritionGoals } from '../../services/nutrition-goals.ts'
import { nutritionService } from '../../services/nutrition-entry.ts'
import type { NutritionGoals } from '../../types/nutrition.ts'
import {
  hasConfiguredNutritionGoals,
  shouldShowNutritionDayTypeSelector,
} from '../../types/nutrition.ts'

export function NutritionPage() {
  const [goals, setGoals] = useState<NutritionGoals | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadGoals() {
      try {
        const nextGoals = await getNutritionGoals()

        if (!cancelled) {
          setGoals(nextGoals)
        }
      } catch {
        if (!cancelled) {
          setGoals(null)
        }
      }
    }

    void loadGoals()

    return () => {
      cancelled = true
    }
  }, [])

  const nutritionComposer = useMemo(() => {
    if (!goals || !hasConfiguredNutritionGoals(goals)) {
      return undefined
    }

    return {
      goals,
      showDayTypeSelector: shouldShowNutritionDayTypeSelector(goals),
      singleGoalAutoApply: goals.singleGoal,
    }
  }, [goals])

  return <ChatDiaryPage service={nutritionService} nutrition={nutritionComposer} />
}
