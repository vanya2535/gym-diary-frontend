import { useDiarySelectionStore } from '../../hooks/diarySelectionStore.ts'
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
          Delete messages?
        </h2>
        <p className={styles.message}>
          {count === 1
            ? 'This message will be permanently deleted.'
            : `${count} messages will be permanently deleted.`}
        </p>

        {deleteError ? <p className={styles.error}>{deleteError}</p> : null}

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            type="button"
            disabled={isDeleting}
            onClick={closeConfirm}
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            type="button"
            disabled={isDeleting}
            onClick={() => void executeDelete()}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
