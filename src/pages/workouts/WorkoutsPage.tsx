import { useEffect } from 'react'
import { ChatDiaryPage } from '../../components/chat/ChatDiaryPage/index.ts'
import { ROUTES } from '../../constants/routes.ts'
import { useLastDiaryPage } from '../../hooks/useLastDiaryPage.ts'
import { workoutsService } from '../../services/diary-entry.ts'

export function WorkoutsPage() {
  const { setLastDiaryPageRoute } = useLastDiaryPage()

  useEffect(() => {
    setLastDiaryPageRoute(ROUTES.workouts)
  }, [setLastDiaryPageRoute])

  return <ChatDiaryPage service={workoutsService} />
}
