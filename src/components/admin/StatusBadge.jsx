import React from 'react'
import { ORDER_STATUS, statusLabel } from '../../services/order.service'

/**
 * The status pill, shared by the queue, the history table and the detail page
 * so one status never reads two different ways.
 *
 * Colours come from the existing palette — no new hues. The ladder is
 * deliberately legible without colour too, since the label always spells the
 * status out: sand for waiting, green for in progress, solid green for ready,
 * muted for done, and outlined coffee for cancelled.
 */
const TONES = {
  [ORDER_STATUS.pending]: 'bg-sand/30 text-espresso border-sand',
  [ORDER_STATUS.preparing]: 'bg-mocha-green/15 text-mocha-green-dark border-mocha-green/35',
  [ORDER_STATUS.ready]: 'bg-mocha-green text-cream border-mocha-green',
  [ORDER_STATUS.completed]: 'bg-espresso/10 text-espresso-light border-espresso/15',
  [ORDER_STATUS.cancelled]: 'bg-transparent text-coffee-dark border-coffee-dark/40',
}

export default function StatusBadge({ order, className = '' }) {
  const tone = TONES[order?.status] ?? TONES[ORDER_STATUS.completed]

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${tone} ${className}`.trim()}
    >
      {order?.status === ORDER_STATUS.pending && (
        // Only new orders pulse: a badge that always animates stops meaning
        // "look at this one".
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-coffee" />
      )}
      {statusLabel(order)}
    </span>
  )
}
