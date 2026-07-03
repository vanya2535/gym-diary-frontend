import { ChatDiaryPage } from '../../components/chat/ChatDiaryPage/index.ts'
import { measurementsService } from '../../services/diary-entry.ts'

export function MeasurementsPage() {
  return <ChatDiaryPage service={measurementsService} />
}
