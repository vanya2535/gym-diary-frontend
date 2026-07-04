import type { DiaryEntry } from '../types/diary-entry.ts'
import { formatMessageDate } from './formatDate.ts'

export function formatMessagesForCopy(entries: DiaryEntry[]): string {
  const sorted = [...entries].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  )

  if (sorted.length === 1) {
    return sorted[0]!.content
  }

  return sorted
    .map((entry) => {
      const dateLabel = formatMessageDate(entry.createdAt)
      return `--- ${dateLabel} ---\n${entry.content}`
    })
    .join('\n\n')
}
