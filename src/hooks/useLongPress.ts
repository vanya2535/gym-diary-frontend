import { useCallback, useRef } from 'react'

const LONG_PRESS_DELAY_MS = 500
const MOVE_THRESHOLD_PX = 10

type LongPressHandlers = {
  onPointerDown: (event: React.PointerEvent) => void
  onPointerUp: () => void
  onPointerMove: (event: React.PointerEvent) => void
  onPointerCancel: () => void
  onContextMenu: (event: React.MouseEvent) => void
}

type UseLongPressResult = {
  handlers: LongPressHandlers
  consumeSuppressClick: () => boolean
}

export function useLongPress(onLongPress: () => void): UseLongPressResult {
  const timeoutRef = useRef<number | null>(null)
  const startPointRef = useRef<{ x: number; y: number } | null>(null)
  const suppressClickRef = useRef(false)

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    startPointRef.current = null
  }, [])

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return
      }

      startPointRef.current = { x: event.clientX, y: event.clientY }
      timeoutRef.current = window.setTimeout(() => {
        suppressClickRef.current = true
        onLongPress()
        clear()
      }, LONG_PRESS_DELAY_MS)
    },
    [onLongPress, clear],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const start = startPointRef.current

      if (!start) {
        return
      }

      const dx = Math.abs(event.clientX - start.x)
      const dy = Math.abs(event.clientY - start.y)

      if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
        clear()
      }
    },
    [clear],
  )

  const onPointerUp = useCallback(() => {
    clear()
  }, [clear])

  const consumeSuppressClick = useCallback(() => {
    if (!suppressClickRef.current) {
      return false
    }

    suppressClickRef.current = false
    return true
  }, [])

  return {
    handlers: {
      onPointerDown,
      onPointerUp,
      onPointerMove,
      onPointerCancel: onPointerUp,
      onContextMenu: (event) => event.preventDefault(),
    },
    consumeSuppressClick,
  }
}
