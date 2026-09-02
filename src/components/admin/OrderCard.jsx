import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  NEXT_STATUS_ACTION,
  ORDER_STATUS,
  advanceOrder,
  cancelOrder,
} from '../../services/order.service'
import { FULFILMENT } from '../../utils/bill'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatClockTime, formatRelativeTime, minutesSince } from '../../utils/formatDateTime'
import StatusBadge from './StatusBadge'
import FulfilmentTag from './FulfilmentTag'

/**
 * A ticket in the live queue.
 *
 * The card carries everything needed to act without opening the order: what
 * was ordered, where it goes, how long it has been waiting, and the one button
 * that moves it forward. The detail page is for the rest.
 *
 * No local copy of the order is kept — the mutations go straight to
 * `order.service`, which notifies every subscriber, so the list this card sits
 * in re-reads and this card is re-rendered (or dropped, once it is finished)
 * from the stored truth rather than from state held here.
 */

/** Past this, a ticket has been waiting long enough to want attention. */
const LATE_AFTER_MINUTES = {
  [ORDER_STATUS.pending]: 8,
  [ORDER_STATUS.preparing]: 20,
  [ORDER_STATUS.ready]: 15,
}

export default function OrderCard({ order, now }) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const waited = minutesSince(order.createdAt, now)
  const isLate = waited >= (LATE_AFTER_MINUTES[order.status] ?? Infinity)
  const nextAction = NEXT_STATUS_ACTION[order.status]
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <article
      className={`rounded-[1.75rem] border bg-cream-card p-5 shadow-sm transition-colors sm:p-6 ${
        isLate ? 'border-sand' : 'border-coffee/10'
      }`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Link
              to={`/admin/orders/${order.id}`}
              className="font-display text-xl text-espresso transition-colors hover:text-mocha-green"
            >
              {order.id}
            </Link>
            <StatusBadge order={order} />
            {order.seeded && (
              <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-espresso-light/60">
                demo
              </span>
            )}
          </div>
          <p className="text-sm text-espresso-light/75">
            {order.customer.name} · {order.customer.phone}
          </p>
        </div>

        <div className="text-right">
          <p className="font-display text-2xl leading-none text-espresso">
            {formatCurrency(order.bill.total)}
          </p>
          <p className={`mt-1.5 text-xs ${isLate ? 'font-semibold text-coffee-dark' : 'text-espresso-light/60'}`}>
            {formatRelativeTime(order.createdAt, now)}
            <span className="text-espresso-light/40"> · {formatClockTime(order.createdAt)}</span>
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FulfilmentTag fulfilment={order.customer.fulfilment} />
        <span className="text-xs text-espresso-light/60">
          {itemCount} item{itemCount > 1 ? 's' : ''}
        </span>
      </div>

      <ul className="mb-5 space-y-1.5 border-t border-coffee/10 pt-4 text-sm text-espresso-light/85">
        {order.items.map((item, index) => (
          <li key={`${item.productId}-${item.size ?? 'one'}-${index}`} className="flex justify-between gap-4">
            <span className="min-w-0">
              <span className="font-semibold text-espresso">{item.quantity}×</span> {item.name}
              {item.size && <span className="text-espresso-light/55"> · {item.size}</span>}
            </span>
            <span className="shrink-0 text-espresso-light/70">
              {formatCurrency(item.priceAtPurchase * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {order.customer.fulfilment === FULFILMENT.delivery && order.customer.address && (
        <p className="mb-5 rounded-2xl bg-cream px-4 py-3 text-xs leading-relaxed text-espresso-light/75">
          <span className="font-semibold uppercase tracking-[0.14em] text-espresso-light/55">
            Deliver to
          </span>
          <br />
          {order.customer.address}
        </p>
      )}

      {confirmingCancel ? (
        <div className="rounded-2xl border border-coffee-dark/25 bg-cream px-4 py-3">
          <p className="mb-3 text-sm text-espresso">
            Cancel {order.id}? This moves it to past orders and cannot be undone.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => cancelOrder(order.id)}
              className="rounded-full bg-coffee-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-espresso"
            >
              Yes, cancel it
            </button>
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              className="rounded-full border border-coffee/30 px-4 py-2 text-sm font-semibold text-espresso transition-colors hover:border-coffee"
            >
              Keep the order
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {nextAction && (
            <button
              type="button"
              onClick={() => advanceOrder(order.id)}
              className="rounded-full bg-mocha-green px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-mocha-green-dark"
            >
              {nextAction}
            </button>
          )}
          <Link
            to={`/admin/orders/${order.id}`}
            className="rounded-full border border-coffee/30 px-5 py-2.5 text-sm font-semibold text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
          >
            Details
          </Link>
          <button
            type="button"
            onClick={() => setConfirmingCancel(true)}
            className="ml-auto rounded-full px-4 py-2.5 text-sm font-semibold text-espresso-light/60 transition-colors hover:text-coffee-dark"
          >
            Cancel
          </button>
        </div>
      )}
    </article>
  )
}
