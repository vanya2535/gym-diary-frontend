import { NavLink } from 'react-router-dom'
import { ConfirmDeleteModal } from '../ConfirmDeleteModal/index.ts'
import { NAV_ITEMS } from '../../constants/navigation.ts'
import { useAuthStore } from '../../hooks/authStore.ts'
import { useDiarySelectionStore } from '../../hooks/diarySelectionStore.ts'
import styles from './AppNav.module.scss'

function BackIcon() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg
      className={styles.actionIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

export function AppNav() {
  const logout = useAuthStore((state) => state.logout)
  const selectedCount = useDiarySelectionStore((state) => state.selectedIds.length)
  const openConfirm = useDiarySelectionStore((state) => state.openConfirm)
  const clearSelection = useDiarySelectionStore((state) => state.clearSelection)
  const copySelected = useDiarySelectionStore((state) => state.copySelected)
  const isSelectionActive = selectedCount > 0

  return (
    <header className={styles.root}>
      {isSelectionActive ? (
        <button
          className={styles.back}
          type="button"
          aria-label="Clear selection"
          onClick={clearSelection}
        >
          <BackIcon />
        </button>
      ) : null}

      {!isSelectionActive ? (
        <nav className={styles.links} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      {isSelectionActive ? (
        <div className={styles.selectionActions}>
          <button
            className={styles.copy}
            type="button"
            aria-label={`Copy ${selectedCount} messages`}
            onClick={() => void copySelected()}
          >
            <CopyIcon />
          </button>
          <button
            className={styles.delete}
            type="button"
            aria-label={`Delete ${selectedCount} messages`}
            onClick={openConfirm}
          >
            <DeleteIcon />
          </button>
        </div>
      ) : (
        <button className={styles.logout} type="button" aria-label="Sign out" onClick={logout}>
          <LogoutIcon />
        </button>
      )}

      <ConfirmDeleteModal />
    </header>
  )
}
