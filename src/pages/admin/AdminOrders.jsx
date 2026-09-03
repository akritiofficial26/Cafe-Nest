import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ACTIVE_STATUSES, STATUS_LABELS } from '../../services/order.service'
import { useActiveOrders, useNow } from '../../hooks/useOrders'
import { formatCurrency } from '../../utils/formatCurrency'
import OrderCard from '../../components/admin/OrderCard'
import EmptyState from '../../components/admin/EmptyState'

/**
 * The live order queue.
 *
 * Oldest first, on purpose: the order that has been waiting longest is the one
 * that needs serving next, so the top of the page is always the right place to
 * start. That is the opposite of the history page, which is newest-first.
 *
 * The list is subscribed to the order store, so an order placed in another tab
 * (or by a customer on this browser) appears here without a refresh, and an
 * order this page completes drops out of it immediately.
 */
const ALL = 'all'

export default function AdminOrders() {
  const orders = useActiveOrders()
  const now = useNow()
  const [filter, setFilter] = useState(ALL)

  const counts = ACTIVE_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: orders.filter((o) => o.status === status).length }),
    {}
  )

  const visible = filter === ALL ? orders : orders.filter((order) => order.status === filter)
  const queueValue = orders.reduce((total, order) => total + order.bill.total, 0)

  const tabs = [{ value: ALL, label: 'All', count: orders.length }].concat(
    ACTIVE_STATUSES.map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
      count: counts[status],
    }))
  )

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="mb-1.5 font-display text-2xl text-espresso sm:text-3xl">Live orders</h2>
          <p className="max-w-xl text-sm leading-relaxed text-espresso-light/75">
            Longest wait first. New orders arrive here on their own — no refresh needed.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="rounded-2xl border border-coffee/10 bg-cream-card px-4 py-2.5 text-right">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
              In the queue
            </p>
            <p className="font-display text-xl text-espresso">{formatCurrency(queueValue)}</p>
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter orders by status">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            aria-pressed={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors ${
              filter === tab.value
                ? 'border-mocha-green bg-mocha-green text-cream'
                : 'border-coffee/25 text-espresso hover:border-coffee'
            }`}
          >
            {tab.label}
            <span className={filter === tab.value ? 'text-cream/70' : 'text-espresso-light/50'}>
              {' '}
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="The queue is clear"
          message="Nothing is waiting to be made. The moment a customer places an order it appears here — try it from the café site in another tab."
        >
          <Link
            to="/admin/orders/history"
            className="rounded-full border border-coffee/30 px-5 py-2 text-[0.8rem] font-semibold text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
          >
            See past orders
          </Link>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState
          icon="search"
          title={`Nothing is ${STATUS_LABELS[filter].toLowerCase()}`}
          message="There are orders in the queue, just none at this stage right now."
        >
          <button
            type="button"
            onClick={() => setFilter(ALL)}
            className="rounded-full border border-coffee/30 px-5 py-2 text-[0.8rem] font-semibold text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
          >
            Show all {orders.length}
          </button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} now={now} />
          ))}
        </div>
      )}
    </>
  )
}
