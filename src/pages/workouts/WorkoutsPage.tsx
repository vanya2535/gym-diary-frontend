import { ChatDiaryPage } from '../../components/chat/ChatDiaryPage/index.ts'
import { workoutsService } from '../../services/diary-entry.ts'

export function WorkoutsPage() {
  return <ChatDiaryPage service={workoutsService} />
}
