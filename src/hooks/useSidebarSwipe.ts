import { useEffect } from 'react'

const EDGE_ZONE_PX = 28
const SWIPE_THRESHOLD_PX = 56
const SWIPE_MAX_VERTICAL_PX = 48

type UseSidebarSwipeOptions = {
  enabled: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export function useSidebarSwipe({ enabled, isOpen, onOpen, onClose }: UseSidebarSwipeOptions) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    let startX = 0
    let startY = 0
    let tracking = false

    function resetTracking() {
      tracking = false
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        return
      }

      const touch = event.touches[0]
      startX = touch.clientX
      startY = touch.clientY

      if (isOpen) {
        tracking = true
        return
      }

      tracking = startX <= EDGE_ZONE_PX
    }

    function handleTouchMove(event: TouchEvent) {
      if (!tracking || event.touches.length !== 1) {
        return
      }

      const touch = event.touches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY

      if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL_PX) {
        resetTracking()
        return
      }

      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return
      }

      const openingFromEdge = !isOpen && startX <= EDGE_ZONE_PX && deltaX > 0
      const closingSidebar = isOpen && deltaX < 0

      if (openingFromEdge || closingSidebar) {
        event.preventDefault()
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      if (!tracking) {
        return
      }

      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY

      resetTracking()

      if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL_PX) {
        return
      }

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return
      }

      if (!isOpen && deltaX > 0 && startX <= EDGE_ZONE_PX) {
        onOpen()
        return
      }

      if (isOpen && deltaX < 0) {
        onClose()
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [enabled, isOpen, onOpen, onClose])
}
