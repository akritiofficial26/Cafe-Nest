import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  NEXT_STATUS_ACTION,
  STATUS_LABELS,
  advanceOrder,
  cancelOrder,
  isActive,
} from '../../services/order.service'
import { useNow, useOrder } from '../../hooks/useOrders'
import { FULFILMENT } from '../../utils/bill'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDateTimeFull, formatRelativeTime } from '../../utils/formatDateTime'
import StatusBadge from '../../components/admin/StatusBadge'
import FulfilmentTag from '../../components/admin/FulfilmentTag'

/**
 * One order in full: every line, the whole bill, the customer's details, and
 * the audit trail of how it moved through the kitchen.
 *
 * A route rather than a modal, so a reference can be pasted into the URL bar
 * and shared — which is exactly what someone does when a customer phones up
 * about an order.
 *
 * The live queue's actions are repeated here so an admin who opened an order
 * to check the address does not have to navigate back to act on it.
 */
function Row({ label, children }) {
  return (
    <div>
      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-espresso-light/50">
        {label}
      </p>
      <p className="text-[0.8rem] leading-relaxed text-espresso">{children}</p>
    </div>
  )
}

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const order = useOrder(orderId)
  const now = useNow()
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  // Reachable by typing a URL, or after clearing site data. Never a blank screen.
  if (!order) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="mb-3 font-display text-2xl text-espresso">No order with that reference.</h2>
        <p className="mb-7 text-sm leading-relaxed text-espresso-light/75">
          <span className="font-semibold text-espresso">{orderId}</span> is not in the store. It may
          be mistyped, or placed in a different browser — orders live in this browser until the
          backend lands.
        </p>
        <Link
          to="/admin/orders"
          className="rounded-full bg-mocha-green px-5 py-2 text-[0.8rem] font-semibold text-cream transition-colors hover:bg-mocha-green-dark"
        >
          Back to the queue
        </Link>
      </div>
    )
  }

  const live = isActive(order)
  const nextAction = NEXT_STATUS_ACTION[order.status]
  const isDelivery = order.customer.fulfilment === FULFILMENT.delivery

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to={live ? '/admin/orders' : '/admin/orders/history'}
        className="mb-5 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-espresso-light/70 transition-colors hover:text-mocha-green"
      >
        <span aria-hidden="true">←</span>
        {live ? 'Back to the live queue' : 'Back to past orders'}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl text-espresso sm:text-3xl">{order.id}</h2>
            <StatusBadge order={order} />
          </div>
          <p className="text-[0.8rem] text-espresso-light/70">
            Placed {formatDateTimeFull(order.createdAt)} ·{' '}
            {formatRelativeTime(order.createdAt, now)}
          </p>
        </div>

        <div className="rounded-2xl border border-coffee/10 bg-cream-card px-4 py-2.5 text-right">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
            Total
          </p>
          <p className="font-display text-2xl text-espresso">{formatCurrency(order.bill.total)}</p>
        </div>
      </div>

      {/* Actions — only for an order that can still move. A finished order says
          so instead of showing buttons that would be rejected by the service. */}
      <div className="mb-6 rounded-2xl border border-coffee/10 bg-cream-card p-5 shadow-sm">
        {live ? (
          confirmingCancel ? (
            <>
              <p className="mb-4 text-[0.8rem] text-espresso">
                Cancel {order.id}? It moves to past orders marked cancelled, is dropped from the
                live queue, and stops counting towards revenue. This cannot be undone.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => cancelOrder(order.id)}
                  className="rounded-full bg-coffee-dark px-4 py-2 text-[0.8rem] font-semibold text-cream transition-colors hover:bg-espresso"
                >
                  Yes, cancel this order
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(false)}
                  className="rounded-full border border-coffee/30 px-4 py-2 text-[0.8rem] font-semibold text-espresso transition-colors hover:border-coffee"
                >
                  Keep the order
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
                Currently {STATUS_LABELS[order.status].toLowerCase()}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {nextAction && (
                  <button
                    type="button"
                    onClick={() => advanceOrder(order.id)}
                    className="rounded-full bg-mocha-green px-4 py-2 text-[0.8rem] font-semibold text-cream transition-colors hover:bg-mocha-green-dark"
                  >
                    {nextAction}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(true)}
                  className="rounded-full border border-coffee/30 px-4 py-2 text-[0.8rem] font-semibold text-espresso transition-colors hover:border-coffee-dark hover:text-coffee-dark"
                >
                  Cancel order
                </button>
              </div>
            </>
          )
        ) : (
          <p className="text-[0.8rem] text-espresso-light/75">
            This order is {STATUS_LABELS[order.status].toLowerCase()} and can no longer be changed.
            It is kept here as a record.
          </p>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_19rem] lg:items-start">
        {/* Items and bill */}
        <div className="rounded-2xl border border-coffee/10 bg-cream-card p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 font-display text-lg text-espresso">
            {order.items.reduce((total, item) => total + item.quantity, 0)} item
            {order.items.reduce((total, item) => total + item.quantity, 0) > 1 ? 's' : ''}
          </h3>

          <ul className="mb-5 space-y-3.5">
            {order.items.map((item, index) => (
              <li
                key={`${item.productId}-${item.size ?? 'one'}-${index}`}
                className="flex items-start justify-between gap-4 border-b border-coffee/10 pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-espresso">
                    <span className="font-semibold">{item.quantity}×</span> {item.name}
                  </p>
                  <p className="text-[0.7rem] text-espresso-light/60">
                    {item.size ? `${item.size} · ` : ''}
                    {formatCurrency(item.priceAtPurchase)} each
                  </p>
                </div>
                <span className="shrink-0 text-[0.8rem] font-semibold text-espresso">
                  {formatCurrency(item.priceAtPurchase * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 border-t border-coffee/15 pt-4 text-[0.8rem] text-espresso-light/85">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span>{formatCurrency(order.bill.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Delivery fee</span>
              <span>
                {order.bill.deliveryFee === 0 ? 'Free' : formatCurrency(order.bill.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Service fee</span>
              <span>{formatCurrency(order.bill.serviceFee)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Tax</span>
              <span>{formatCurrency(order.bill.tax)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-coffee/15 pt-4 font-display text-xl text-espresso">
            <span>Total</span>
            <span>{formatCurrency(order.bill.total)}</span>
          </div>
        </div>

        <div className="grid gap-5">
          {/* Customer */}
          <div className="rounded-2xl border border-coffee/10 bg-cream-card p-5 shadow-sm">
            <h3 className="mb-4 font-display text-lg text-espresso">Customer</h3>
            <div className="space-y-3.5">
              <Row label="Name">{order.customer.name}</Row>
              <Row label="Phone">
                {/* Tappable, because the reason an admin opens this page is
                    usually to call the customer about their order. */}
                {order.customer.phone ? (
                  <a
                    href={`tel:${order.customer.phone.replace(/\s/g, '')}`}
                    className="transition-colors hover:text-mocha-green"
                  >
                    {order.customer.phone}
                  </a>
                ) : (
                  'Not given'
                )}
              </Row>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-espresso-light/50">
                  Fulfilment
                </p>
                <FulfilmentTag fulfilment={order.customer.fulfilment} />
              </div>
              {isDelivery && <Row label="Address">{order.customer.address || 'Not given'}</Row>}
              {/* Absent on orders placed before accounts were recorded, and on
                  the demo seeds — so it is only rendered when it exists. */}
              {order.placedBy && <Row label="Account">{order.placedBy.email}</Row>}
            </div>
          </div>

          {/* Audit trail */}
          <div className="rounded-2xl border border-coffee/10 bg-cream-card p-5 shadow-sm">
            <h3 className="mb-4 font-display text-lg text-espresso">Timeline</h3>
            <ol className="space-y-3.5">
              {order.statusHistory.map((entry, index) => (
                <li key={`${entry.status}-${entry.at}`} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      index === order.statusHistory.length - 1
                        ? 'bg-mocha-green'
                        : 'bg-coffee/30'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[0.8rem] font-semibold text-espresso">
                      {STATUS_LABELS[entry.status]}
                    </p>
                    <p className="text-[0.7rem] text-espresso-light/60">{formatDateTimeFull(entry.at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
