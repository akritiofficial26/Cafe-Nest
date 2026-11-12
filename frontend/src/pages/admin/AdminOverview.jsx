import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useActiveOrders, useNow, useOrderStats } from '../../hooks/useOrders'
import products from '../../services/product.service'
import { getAverageRating, getReviews } from '../../services/review.service'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelativeTime } from '../../utils/formatDateTime'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import EmptyState from '../../components/admin/EmptyState'

/** Enough of the queue to see the shift at a glance; the rest is one click away. */
const PREVIEW_LIMIT = 5

export default function AdminOverview() {
  const { user } = useAuth()
  const stats = useOrderStats()
  const activeOrders = useActiveOrders()
  const now = useNow()

  // Menu and review counts are static for the session — products are a module
  // and reviews have no admin surface yet — so they are read once rather than
  // subscribed to.
  const reviewSummary = useMemo(() => {
    const reviews = getReviews()
    return { count: reviews.length, average: getAverageRating(reviews) }
  }, [])

  const preview = activeOrders.slice(0, PREVIEW_LIMIT)

  return (
    <>
      <div className="mb-7">
        <h2 className="mb-1.5 font-display text-2xl text-espresso sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Admin'}.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-espresso-light/75">
          {stats.newCount > 0
            ? `${stats.newCount} new order${stats.newCount > 1 ? 's' : ''} waiting to be accepted.`
            : stats.activeCount > 0
              ? `${stats.activeCount} order${stats.activeCount > 1 ? 's' : ''} in progress. Nothing new waiting.`
              : 'The queue is clear. New orders appear here the moment they are placed.'}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Orders in progress"
          value={stats.activeCount}
          hint={
            stats.newCount > 0
              ? `${stats.newCount} still to be accepted`
              : 'Nothing waiting to be accepted'
          }
          to="/admin/orders"
          accent={stats.newCount > 0}
        />
        <StatCard
          label="Revenue today"
          value={formatCurrency(stats.revenueToday)}
          hint={`${stats.ordersToday} order${stats.ordersToday === 1 ? '' : 's'} today${
            stats.cancelledToday > 0 ? ` · ${stats.cancelledToday} cancelled` : ''
          }`}
          to="/admin/orders/history"
        />
        <StatCard
          label="Menu items"
          value={products.length}
          hint="Availability and pricing editing lands here soon"
        />
        <StatCard
          label="Reviews"
          value={reviewSummary.count}
          hint={`${reviewSummary.average} average rating`}
        />
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-xl text-espresso">Live queue</h3>
            <p className="text-[0.8rem] text-espresso-light/70">
              Updates on its own as orders come in and move along.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-[0.8rem] font-semibold text-mocha-green transition-colors hover:text-mocha-green-dark"
          >
            Open the full queue →
          </Link>
        </div>

        {preview.length === 0 ? (
          <EmptyState
            title="No orders in the queue"
            message="Every order has been served. The next one a customer places will show up here without a refresh."
          />
        ) : (
          <ul className="divide-y divide-coffee/10 overflow-hidden rounded-2xl border border-coffee/10 bg-cream-card shadow-sm">
            {preview.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-mocha-green/5"
                >
                  <span className="w-24 shrink-0 font-display text-base text-espresso">{order.id}</span>
                  <StatusBadge order={order} />
                  <span className="min-w-0 flex-1 truncate text-[0.8rem] text-espresso-light/80">
                    {order.customer.name} ·{' '}
                    {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                  </span>
                  <span className="text-xs text-espresso-light/55">
                    {formatRelativeTime(order.createdAt, now)}
                  </span>
                  <span className="w-16 shrink-0 text-right text-[0.8rem] font-semibold text-espresso">
                    {formatCurrency(order.bill.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {activeOrders.length > PREVIEW_LIMIT && (
          <p className="mt-3 text-[0.8rem] text-espresso-light/60">
            Showing {PREVIEW_LIMIT} of {activeOrders.length} orders in the queue.
          </p>
        )}
      </section>
    </>
  )
}
