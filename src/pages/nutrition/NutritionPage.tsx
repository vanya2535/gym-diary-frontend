import { ChatDiaryPage } from '../../components/chat/ChatDiaryPage/index.ts'
import { nutritionService } from '../../services/diary-entry.ts'

export function NutritionPage() {
  return <ChatDiaryPage service={nutritionService} />
}
