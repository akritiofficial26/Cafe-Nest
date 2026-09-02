import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FINISHED_STATUSES, ORDER_STATUS, STATUS_LABELS } from '../../services/order.service'
import { usePastOrders } from '../../hooks/useOrders'
import { FULFILMENT } from '../../utils/bill'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatClockTime, formatDateLabel } from '../../utils/formatDateTime'
import StatusBadge from '../../components/admin/StatusBadge'
import FulfilmentTag from '../../components/admin/FulfilmentTag'
import EmptyState from '../../components/admin/EmptyState'

/**
 * Past orders — every order that has finished, completed or cancelled.
 *
 * Newest first, the opposite of the live queue: history is read from the most
 * recent thing backwards, where a queue is worked from the oldest forwards.
 *
 * The search box matches on everything an admin would have to hand when
 * looking an order up — the reference a customer reads out, their name or
 * phone number, or the drink they are asking about.
 */
const ALL = 'all'

function matchesQuery(order, query) {
  if (!query) return true
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  const haystack = [
    order.id,
    order.customer.name,
    order.customer.phone,
    // Digits only as well, so "9812345671" finds "98123 45671".
    order.customer.phone?.replace(/\D/g, ''),
    order.placedBy?.email,
    ...order.items.map((item) => item.name),
  ]

  return haystack.filter(Boolean).some((field) => String(field).toLowerCase().includes(needle))
}

export default function AdminOrderHistory() {
  const orders = usePastOrders()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(ALL)

  const visible = useMemo(
    () =>
      orders.filter(
        (order) => (status === ALL || order.status === status) && matchesQuery(order, query)
      ),
    [orders, status, query]
  )

  // Totals describe what is on screen, not the whole archive — a figure that
  // ignored the active filter would contradict the rows under it.
  const summary = useMemo(() => {
    const paid = visible.filter((order) => order.status !== ORDER_STATUS.cancelled)
    const revenue = paid.reduce((total, order) => total + order.bill.total, 0)
    return {
      revenue,
      paidCount: paid.length,
      average: paid.length > 0 ? Math.round(revenue / paid.length) : 0,
    }
  }, [visible])

  const isFiltered = status !== ALL || query.trim() !== ''
  const tabs = [{ value: ALL, label: 'All' }].concat(
    FINISHED_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }))
  )

  return (
    <>
      <div className="mb-7">
        <h2 className="mb-2 font-display text-3xl text-espresso sm:text-4xl">Past orders</h2>
        <p className="max-w-xl leading-relaxed text-espresso-light/75">
          Everything that has been served or cancelled. Orders move here from the live queue as soon
          as they finish.
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No finished orders yet"
          message="Once an order is completed or cancelled in the live queue it is archived here with its full bill."
        >
          <Link
            to="/admin/orders"
            className="rounded-full bg-mocha-green px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-mocha-green-dark"
          >
            Go to the live queue
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-coffee/10 bg-cream-card px-5 py-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
                Orders shown
              </p>
              <p className="font-display text-2xl text-espresso">{visible.length}</p>
            </div>
            <div className="rounded-2xl border border-coffee/10 bg-cream-card px-5 py-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
                Revenue
              </p>
              <p className="font-display text-2xl text-espresso">{formatCurrency(summary.revenue)}</p>
            </div>
            <div className="rounded-2xl border border-coffee/10 bg-cream-card px-5 py-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
                Average order
              </p>
              <p className="font-display text-2xl text-espresso">{formatCurrency(summary.average)}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <label htmlFor="order-search" className="sr-only">
                Search past orders
              </label>
              <input
                id="order-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Reference, name, phone or item"
                className="w-full rounded-full border border-coffee/20 bg-cream-card px-4 py-2.5 text-sm text-espresso transition-colors placeholder:text-espresso-light/50 focus:border-mocha-green"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={status === tab.value}
                  onClick={() => setStatus(tab.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    status === tab.value
                      ? 'border-mocha-green bg-mocha-green text-cream'
                      : 'border-coffee/25 text-espresso hover:border-coffee'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon="search"
              title="No orders match"
              message="Nothing in the archive matches that search and filter together. Try a shorter reference, or clear the filter."
            >
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setStatus(ALL)
                }}
                className="rounded-full border border-coffee/30 px-5 py-2.5 text-sm font-semibold text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
              >
                Clear the filters
              </button>
            </EmptyState>
          ) : (
            <>
              {/* Desktop: a table, because these rows are meant to be scanned
                  down a column. */}
              <div className="hidden overflow-x-auto rounded-[1.75rem] border border-coffee/10 bg-cream-card shadow-sm lg:block">
                <table className="w-full min-w-[52rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-coffee/10 text-[0.62rem] uppercase tracking-[0.16em] text-espresso-light/55">
                      <th scope="col" className="px-6 py-4 font-semibold">Reference</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Placed</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Customer</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Items</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                      <th scope="col" className="px-6 py-4 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-coffee/10">
                    {visible.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-mocha-green/5">
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="font-display text-base text-espresso transition-colors hover:text-mocha-green"
                          >
                            {order.id}
                          </Link>
                          {order.seeded && (
                            <span className="ml-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-espresso-light/45">
                              demo
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-espresso-light/75">
                          {formatDateLabel(order.createdAt)}
                          <span className="text-espresso-light/45">
                            {' '}
                            · {formatClockTime(order.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="block text-espresso">{order.customer.name}</span>
                          <span className="block text-xs text-espresso-light/60">
                            {order.customer.fulfilment === FULFILMENT.delivery ? 'Delivery' : 'Pickup'}
                          </span>
                        </td>
                        <td className="max-w-xs px-6 py-4 text-espresso-light/75">
                          <span className="line-clamp-2">
                            {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge order={order} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-espresso">
                          {formatCurrency(order.bill.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: the same rows as cards. A table this wide would scroll
                  sideways on a phone and the total would be off screen. */}
              <ul className="grid gap-4 lg:hidden">
                {visible.map((order) => (
                  <li key={order.id}>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="block rounded-[1.5rem] border border-coffee/10 bg-cream-card p-5 shadow-sm transition-colors hover:border-mocha-green/40"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg text-espresso">{order.id}</p>
                          <p className="text-xs text-espresso-light/60">
                            {formatDateLabel(order.createdAt)} · {formatClockTime(order.createdAt)}
                          </p>
                        </div>
                        <StatusBadge order={order} />
                      </div>
                      <p className="mb-2 text-sm text-espresso-light/80">
                        {order.customer.name} · {order.customer.phone}
                      </p>
                      <p className="mb-4 text-sm text-espresso-light/70">
                        {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                      </p>
                      <div className="flex items-center justify-between gap-3 border-t border-coffee/10 pt-3">
                        <FulfilmentTag fulfilment={order.customer.fulfilment} />
                        <span className="font-display text-xl text-espresso">
                          {formatCurrency(order.bill.total)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {isFiltered && visible.length > 0 && (
            <p className="mt-4 text-sm text-espresso-light/60">
              Showing {visible.length} of {orders.length} past orders.
            </p>
          )}
        </>
      )}
    </>
  )
}
