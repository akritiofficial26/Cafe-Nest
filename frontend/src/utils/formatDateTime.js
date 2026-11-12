/**
 * Date and time formatting for the admin panel.
 *
 * Kept out of the components for the same reason as `bill.js`: the order
 * queue, the history table and the detail page all show timestamps, and three
 * hand-rolled formatters would drift apart.
 *
 * Everything renders in the viewer's own locale and timezone — a café runs on
 * the clock on its wall, not on UTC.
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * How long ago, in the shortest phrase that is still accurate. The live queue
 * leans on this: "18 min" on a ticket is the number a barista actually acts
 * on, where a wall-clock time would have to be subtracted in their head.
 *
 * `now` is a parameter rather than read from the clock so a caller can pass
 * the ticking value from `useNow()` and have every row agree.
 */
export function formatRelativeTime(iso, now = Date.now()) {
  if (!iso) return '—'

  const elapsed = now - new Date(iso).getTime()
  // A clock skew between tabs can put a fresh order slightly in the future.
  if (elapsed < MINUTE) return 'just now'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min ago`
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR)
    return `${hours} hr${hours > 1 ? 's' : ''} ago`
  }

  const days = Math.floor(elapsed / DAY)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return formatDateLabel(iso)
}

/** Minutes elapsed, for deciding when a ticket has been waiting too long. */
export function minutesSince(iso, now = Date.now()) {
  if (!iso) return 0
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / MINUTE))
}

/** "4:32 pm" — for a ticket where the wall-clock time is what is wanted. */
export function formatClockTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** "2 Sep" this year, "2 Sep 2025" otherwise — the year only when it matters. */
export function formatDateLabel(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  const sameYear = date.getFullYear() === new Date().getFullYear()

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/** Date and time together, for the detail page and the audit trail. */
export function formatDateTimeFull(iso) {
  if (!iso) return '—'
  return `${formatDateLabel(iso)}, ${formatClockTime(iso)}`
}

/** `<input type="date">` value for a timestamp, in local time. */
export function toDateInputValue(iso) {
  const date = iso ? new Date(iso) : new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
