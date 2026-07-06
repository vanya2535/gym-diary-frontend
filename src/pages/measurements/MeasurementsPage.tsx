import { useEffect } from 'react'
import { ChatDiaryPage } from '../../components/chat/ChatDiaryPage/index.ts'
import { ROUTES } from '../../constants/routes.ts'
import { useLastDiaryPage } from '../../hooks/useLastDiaryPage.ts'
import { measurementsService } from '../../services/diary-entry.ts'

export function MeasurementsPage() {
  const { setLastDiaryPageRoute } = useLastDiaryPage()

  useEffect(() => {
    setLastDiaryPageRoute(ROUTES.measurements)
  }, [setLastDiaryPageRoute])

  return <ChatDiaryPage service={measurementsService} />
}
