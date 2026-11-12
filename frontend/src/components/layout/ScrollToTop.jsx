import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position on route change. Needed now that cards deep in the
 * Menu grid navigate to a detail page — without this you land mid-page.
 *
 * Uses 'instant' so it doesn't inherit the smooth scroll-behavior set on <html>,
 * which would visibly animate the whole page up on every navigation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
