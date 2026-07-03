import { create } from 'zustand'

type DeleteHandler = (ids: string[]) => Promise<void>
type CopyHandler = (ids: string[]) => string

type DiarySelectionState = {
  selectedIds: string[]
  isConfirmOpen: boolean
  isDeleting: boolean
  deleteError: string | null
  deleteHandler: DeleteHandler | null
  copyHandler: CopyHandler | null
  toggleSelection: (id: string) => void
  clearSelection: () => void
  openConfirm: () => void
  closeConfirm: () => void
  setDeleteHandler: (handler: DeleteHandler | null) => void
  setCopyHandler: (handler: CopyHandler | null) => void
  executeDelete: () => Promise<void>
  copySelected: () => Promise<void>
}

export const useDiarySelectionStore = create<DiarySelectionState>((set, get) => ({
  selectedIds: [],
  isConfirmOpen: false,
  isDeleting: false,
  deleteError: null,
  deleteHandler: null,
  copyHandler: null,

  toggleSelection: (id) => {
    set((state) => {
      const isSelected = state.selectedIds.includes(id)

      return {
        selectedIds: isSelected
          ? state.selectedIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedIds, id],
      }
    })
  },

  clearSelection: () => {
    set({ selectedIds: [], deleteError: null })
  },

  openConfirm: () => {
    set({ isConfirmOpen: true, deleteError: null })
  },

  closeConfirm: () => {
    if (get().isDeleting) {
      return
    }

    set({ isConfirmOpen: false, deleteError: null })
  },

  setDeleteHandler: (handler) => {
    set({ deleteHandler: handler })
  },

  setCopyHandler: (handler) => {
    set({ copyHandler: handler })
  },

  executeDelete: async () => {
    const { selectedIds, deleteHandler } = get()

    if (!deleteHandler || selectedIds.length === 0) {
      return
    }

    set({ isDeleting: true, deleteError: null })

    try {
      await deleteHandler(selectedIds)
      set({ selectedIds: [], isConfirmOpen: false, isDeleting: false, deleteError: null })
    } catch (error) {
      set({
        isDeleting: false,
        deleteError: error instanceof Error ? error.message : 'Failed to delete messages',
      })
    }
  },

  copySelected: async () => {
    const { selectedIds, copyHandler } = get()

    if (!copyHandler || selectedIds.length === 0) {
      return
    }

    const text = copyHandler(selectedIds)

    try {
      await navigator.clipboard.writeText(text)
      get().clearSelection()
    } catch {
      // Clipboard API may be unavailable outside secure context.
    }
  },
}))
