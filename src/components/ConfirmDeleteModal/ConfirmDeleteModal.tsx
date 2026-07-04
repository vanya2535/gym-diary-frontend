import { useDiarySelectionStore } from '../../hooks/diarySelectionStore.ts'
import { pluralRu } from '../../utils/pluralRu.ts'
import styles from './ConfirmDeleteModal.module.scss'

export function ConfirmDeleteModal() {
  const selectedIds = useDiarySelectionStore((state) => state.selectedIds)
  const isOpen = useDiarySelectionStore((state) => state.isConfirmOpen)
  const isDeleting = useDiarySelectionStore((state) => state.isDeleting)
  const deleteError = useDiarySelectionStore((state) => state.deleteError)
  const closeConfirm = useDiarySelectionStore((state) => state.closeConfirm)
  const executeDelete = useDiarySelectionStore((state) => state.executeDelete)

  if (!isOpen) {
    return null
  }

  const count = selectedIds.length
  const deleteMessage =
    count === 1
      ? 'Это сообщение будет удалено безвозвратно.'
      : `${count} ${pluralRu(count, 'сообщение', 'сообщения', 'сообщений')} будет удалено безвозвратно.`

  return (
    <div className={styles.overlay} role="presentation" onClick={closeConfirm}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-delete-title" className={styles.title}>
          Удалить сообщения?
        </h2>
        <p className={styles.message}>{deleteMessage}</p>

        {deleteError ? <p className={styles.error}>{deleteError}</p> : null}

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            type="button"
            disabled={isDeleting}
            onClick={closeConfirm}
          >
            Отмена
          </button>
          <button
            className={styles.deleteButton}
            type="button"
            disabled={isDeleting}
            onClick={() => void executeDelete()}
          >
            {isDeleting ? 'Удаление…' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  )
}
