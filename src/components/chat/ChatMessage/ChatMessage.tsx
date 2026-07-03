import type { DiaryEntry } from '../../../types/diary-entry.ts'
import { useLongPress } from '../../../hooks/useLongPress.ts'
import { formatMessageDate } from '../../../utils/formatDate.ts'
import styles from './ChatMessage.module.scss'

type ChatMessageProps = {
  entry: DiaryEntry
  isSelected: boolean
  isSelectionMode: boolean
  isEditing: boolean
  onToggleSelect: (id: string) => void
  onEdit: (entry: DiaryEntry) => void
}

export function ChatMessage({
  entry,
  isSelected,
  isSelectionMode,
  isEditing,
  onToggleSelect,
  onEdit,
}: ChatMessageProps) {
  const longPressHandlers = useLongPress(() => onToggleSelect(entry.id))

  function handleClick() {
    if (longPressHandlers.consumeSuppressClick()) {
      return
    }

    if (isSelectionMode) {
      onToggleSelect(entry.id)
      return
    }

    onEdit(entry)
  }

  const rootClass = isSelected
    ? styles.rootSelected
    : isEditing
      ? styles.rootEditing
      : isSelectionMode
        ? styles.rootSelectable
        : styles.root

  return (
    <article
      id={`message-${entry.id}`}
      className={rootClass}
      aria-selected={isSelected || isEditing}
      onClick={handleClick}
      {...longPressHandlers.handlers}
    >
      <p className={styles.content}>{entry.content}</p>
      <time className={styles.date} dateTime={entry.createdAt}>
        {formatMessageDate(entry.createdAt)}
      </time>
    </article>
  )
}
