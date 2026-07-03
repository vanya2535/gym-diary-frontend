import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { DIARY_PAGE_SIZE } from '../../../constants/diary.ts'
import { useDiarySelectionStore } from '../../../hooks/diarySelectionStore.ts'
import type { createDiaryEntryService } from '../../../services/diary-entry.ts'
import type { DiaryEntry } from '../../../types/diary-entry.ts'
import { formatMessagesForCopy } from '../../../utils/formatMessagesForCopy.ts'
import { getMessageFirstLine } from '../../../utils/getMessageFirstLine.ts'
import { ChatMessage } from '../ChatMessage/index.ts'
import styles from './ChatDiaryPage.module.scss'

type DiaryService = ReturnType<typeof createDiaryEntryService>

type ChatDiaryPageProps = {
  service: DiaryService
}

function toChronological(items: DiaryEntry[]): DiaryEntry[] {
  return [...items].reverse()
}

function scrollMessagesToBottom(
  container: HTMLDivElement | null,
  behavior: ScrollBehavior = 'instant',
) {
  if (!container) {
    return
  }

  container.scrollTo({ top: container.scrollHeight, behavior })
}

function scrollToMessage(container: HTMLDivElement | null, messageId: string) {
  const element = container?.querySelector(`#message-${CSS.escape(messageId)}`)

  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function resizeTextarea(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return
  }

  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export function ChatDiaryPage({ service }: ChatDiaryPageProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [reloadNonce, setReloadNonce] = useState(0)

  const messagesRef = useRef<HTMLDivElement>(null)
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLFormElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isLoadingMoreRef = useRef(false)
  const scrollToBottomRef = useRef<ScrollBehavior | false>(false)
  const selectedIds = useDiarySelectionStore((state) => state.selectedIds)
  const toggleSelection = useDiarySelectionStore((state) => state.toggleSelection)
  const clearSelection = useDiarySelectionStore((state) => state.clearSelection)
  const setDeleteHandler = useDiarySelectionStore((state) => state.setDeleteHandler)
  const setCopyHandler = useDiarySelectionStore((state) => state.setCopyHandler)

  useEffect(() => {
    setDeleteHandler(async (ids) => {
      await service.deleteMany({ ids })
      setEntries((current) => current.filter((entry) => !ids.includes(entry.id)))
    })

    setCopyHandler((ids) => {
      const selected = entries.filter((entry) => ids.includes(entry.id))
      return formatMessagesForCopy(selected)
    })

    return () => {
      setDeleteHandler(null)
      setCopyHandler(null)
      clearSelection()
    }
  }, [service, entries, setDeleteHandler, setCopyHandler, clearSelection])

  const handleToggleSelect = useCallback(
    (id: string) => {
      if (editingEntryId) {
        setEditingEntryId(null)
        setContent('')
        setFieldError(null)
        setSubmitError(null)
      }

      toggleSelection(id)
    },
    [editingEntryId, toggleSelection],
  )

  useLayoutEffect(() => {
    if (!scrollToBottomRef.current || isInitialLoading) {
      return
    }

    const behavior = scrollToBottomRef.current
    scrollToBottomRef.current = false
    scrollMessagesToBottom(messagesRef.current, behavior)
  }, [entries, isInitialLoading])

  useLayoutEffect(() => {
    resizeTextarea(textareaRef.current)
  }, [content, editingEntryId])

  useLayoutEffect(() => {
    const composer = composerRef.current
    const root = rootRef.current

    if (!composer || !root) {
      return
    }

    const syncComposerHeight = () => {
      if (selectedIds.length > 0) {
        root.style.setProperty('--composer-height', '0px')
        return
      }

      root.style.setProperty('--composer-height', `${composer.offsetHeight}px`)
    }

    syncComposerHeight()

    const observer = new ResizeObserver(syncComposerHeight)
    observer.observe(composer)

    return () => {
      observer.disconnect()
    }
  }, [fieldError, submitError, editingEntryId, selectedIds.length])

  useEffect(() => {
    if (selectedIds.length > 0) {
      textareaRef.current?.blur()
    }
  }, [selectedIds.length])

  useEffect(() => {
    let cancelled = false

    async function loadInitialPage() {
      setIsInitialLoading(true)
      setLoadError(null)
      setLoadMoreError(null)
      setEntries([])
      setNextCursor(null)
      setEditingEntryId(null)
      setContent('')

      try {
        const page = await service.list({ limit: DIARY_PAGE_SIZE })

        if (!cancelled) {
          setEntries(toChronological(page.items))
          setNextCursor(page.nextCursor)
          scrollToBottomRef.current = 'instant'
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load entries')
        }
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false)
        }
      }
    }

    void loadInitialPage()

    return () => {
      cancelled = true
    }
  }, [service, reloadNonce])

  const loadMoreEntries = useCallback(async () => {
    if (isLoadingMoreRef.current || !nextCursor) {
      return
    }

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(null)

    const container = messagesRef.current
    const previousScrollHeight = container?.scrollHeight ?? 0
    const previousScrollTop = container?.scrollTop ?? 0

    try {
      const page = await service.list({ limit: DIARY_PAGE_SIZE, cursor: nextCursor })
      const olderEntries = toChronological(page.items)

      setEntries((current) => [...olderEntries, ...current])
      setNextCursor(page.nextCursor)

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - previousScrollHeight + previousScrollTop
        }
      })
    } catch (error) {
      setLoadMoreError(error instanceof Error ? error.message : 'Failed to load more entries')
    } finally {
      isLoadingMoreRef.current = false
      setIsLoadingMore(false)
    }
  }, [service, nextCursor])

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current
    const root = messagesRef.current

    if (!sentinel || !root || isInitialLoading || loadError || !nextCursor) {
      return
    }

    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((record) => record.isIntersecting)) {
          void loadMoreEntries()
        }
      },
      { root, rootMargin: '120px 0px' },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [isInitialLoading, loadError, nextCursor, loadMoreEntries])

  function handleRetry() {
    setReloadNonce((current) => current + 1)
  }

  function startEditing(entry: DiaryEntry) {
    setEditingEntryId(entry.id)
    setContent(entry.content)
    setFieldError(null)
    setSubmitError(null)
    textareaRef.current?.focus()
  }

  function cancelEditing() {
    setEditingEntryId(null)
    setContent('')
    setFieldError(null)
    setSubmitError(null)
    textareaRef.current?.focus()
  }

  function handleScrollToEditingMessage() {
    if (editingEntryId) {
      scrollToMessage(messagesRef.current, editingEntryId)
    }
  }

  function validateContent(value: string): string | null {
    const trimmed = value.trim()

    if (!trimmed) {
      return 'Message cannot be empty'
    }

    if (trimmed.length > 10000) {
      return 'Message must be at most 10,000 characters'
    }

    return null
  }

  async function submitMessage() {
    setSubmitError(null)

    const validationError = validateContent(content)

    if (validationError) {
      setFieldError(validationError)
      return
    }

    setFieldError(null)
    setIsSubmitting(true)

    try {
      if (editingEntryId) {
        const updated = await service.update(editingEntryId, { content: content.trim() })
        setEntries((current) =>
          current.map((entry) => (entry.id === editingEntryId ? updated : entry)),
        )
        setEditingEntryId(null)
        setContent('')
      } else {
        const entry = await service.create({ content: content.trim() })
        setEntries((current) => [...current, entry])
        scrollToBottomRef.current = 'smooth'
        setContent('')
      }

      textareaRef.current?.focus()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : editingEntryId
            ? 'Failed to update message'
            : 'Failed to send message',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await submitMessage()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submitMessage()
    }
  }

  const showEmptyState = !isInitialLoading && !loadError && entries.length === 0
  const hasMore = nextCursor !== null
  const editingEntry = entries.find((entry) => entry.id === editingEntryId) ?? null
  const isEditing = editingEntry !== null
  const isSelectionMode = selectedIds.length > 0

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={messagesRef} className={styles.messages}>
        {hasMore ? <div ref={loadMoreSentinelRef} className={styles.loadMoreSentinel} /> : null}

        {isLoadingMore ? <p className={styles.loadMoreStatus}>Loading older messages…</p> : null}

        {!isLoadingMore && loadMoreError ? (
          <div className={styles.loadMoreError}>
            <p className={styles.loadMoreErrorText}>{loadMoreError}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void loadMoreEntries()}
            >
              Retry
            </button>
          </div>
        ) : null}

        {isInitialLoading ? <p className={styles.status}>Loading…</p> : null}

        {!isInitialLoading && loadError ? (
          <div className={styles.loadError}>
            <p className={styles.loadErrorText}>{loadError}</p>
            <button className={styles.retryButton} type="button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        ) : null}

        {showEmptyState ? (
          <p className={styles.status}>No messages yet. Write the first one below.</p>
        ) : null}

        {entries.map((entry) => (
          <ChatMessage
            key={entry.id}
            entry={entry}
            isSelected={selectedIds.includes(entry.id)}
            isSelectionMode={selectedIds.length > 0}
            isEditing={entry.id === editingEntryId}
            onToggleSelect={handleToggleSelect}
            onEdit={startEditing}
          />
        ))}
      </div>

      <form
        ref={composerRef}
        className={`${styles.composer}${isSelectionMode ? ` ${styles.composerHidden}` : ''}`}
        aria-hidden={isSelectionMode}
        onSubmit={handleSubmit}
      >
        {editingEntry ? (
          <div className={styles.editBar}>
            <button
              className={styles.editLink}
              type="button"
              onClick={handleScrollToEditingMessage}
            >
              <span className={styles.editLabel}>Editing</span>
              <span className={styles.editPreview}>
                {getMessageFirstLine(editingEntry.content)}
              </span>
            </button>
            <button
              className={styles.cancelEdit}
              type="button"
              aria-label="Cancel editing"
              onClick={cancelEditing}
            >
              <svg
                className={styles.cancelEditIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : null}

        <div className={styles.inputWrap}>
          <textarea
            ref={textareaRef}
            className={fieldError ? styles.textareaInvalid : styles.textarea}
            value={content}
            placeholder="Message"
            rows={1}
            disabled={isSubmitting || isInitialLoading}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? 'chat-message-error' : undefined}
            onChange={(event) => {
              setContent(event.target.value)
              if (fieldError) {
                setFieldError(null)
              }
              resizeTextarea(event.target)
            }}
            onKeyDown={handleKeyDown}
          />

          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting || isInitialLoading}
            aria-label={
              isSubmitting
                ? isEditing
                  ? 'Saving message'
                  : 'Sending message'
                : isEditing
                  ? 'Save message'
                  : 'Send message'
            }
          >
            {isEditing ? (
              <svg
                className={styles.submitIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className={styles.submitIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>

        {fieldError ? (
          <p id="chat-message-error" className={styles.fieldError}>
            {fieldError}
          </p>
        ) : null}

        {submitError ? <p className={styles.error}>{submitError}</p> : null}
      </form>
    </div>
  )
}
