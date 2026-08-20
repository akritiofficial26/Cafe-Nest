import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderById } from '../services/order.service'
import { FULFILMENT } from '../utils/bill'
import Button from '../components/ui/Button'
import { formatCurrency } from '../utils/formatCurrency'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const order = getOrderById(orderId)

  // Reachable by typing a URL, or after clearing site data. Never a blank screen.
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">We can't find that order.</h1>
        <p className="text-espresso-light/80 mb-8">
          The reference may be mistyped, or the order was placed on another device.
        </p>
        <Button as={Link} to="/shop" variant="green" size="lg" className="inline-block">
          Back to the menu
        </Button>
      </div>
    )
  }

  const isDelivery = order.customer.fulfilment === FULFILMENT.delivery
  const placedAt = new Date(order.createdAt).toLocaleString()

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <div className="rounded-[2rem] border border-coffee/10 bg-cream-card shadow-sm overflow-hidden">
        <div className="border-b border-coffee/10 bg-gradient-to-r from-cream-card via-cream to-cream-deep px-6 py-8 sm:px-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-mocha-green text-cream">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-mocha-green font-semibold mb-3">
            Order confirmed
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-espresso mb-3">
            Thanks, {order.customer.name.split(' ')[0]}.
          </h1>
          <p className="text-espresso-light/85 leading-relaxed max-w-md mx-auto">
            {isDelivery
              ? 'We are packing it now and it will be on its way shortly.'
              : 'We will have it ready on the counter for you shortly.'}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">Reference</p>
            <p className="font-display text-xl text-espresso">{order.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">Placed</p>
            <p className="text-sm text-espresso-light/85 leading-relaxed">{placedAt}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">Method</p>
            <p className="text-sm text-espresso-light/85 leading-relaxed">
              {isDelivery ? 'Delivery' : 'Pickup in store'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">Phone</p>
            <p className="text-sm text-espresso-light/85 leading-relaxed">{order.customer.phone}</p>
          </div>
          {isDelivery && order.customer.address && (
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">
                Delivering to
              </p>
              <p className="text-sm text-espresso-light/85 leading-relaxed whitespace-pre-line">
                {order.customer.address}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-coffee/10 bg-cream-deep/45 px-6 py-6 sm:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-mocha-green font-semibold mb-4">
            What you ordered
          </p>

          <ul className="space-y-3 text-sm text-espresso-light/85 mb-5">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size || 'one'}`} className="flex justify-between gap-4">
                <span className="min-w-0">
                  {item.quantity} × {item.name}
                  {item.size && <span className="text-espresso-light/60"> · {item.size}</span>}
                </span>
                <span className="shrink-0">
                  {formatCurrency(item.priceAtPurchase * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-coffee/15 pt-4 text-sm text-espresso-light/85">
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

          <div className="flex justify-between font-display text-xl text-espresso border-t border-coffee/15 pt-4 mt-5">
            <span>Paid at counter</span>
            <span>{formatCurrency(order.bill.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button as={Link} to="/shop" variant="sand" size="md">
          Order something else
        </Button>
        <Button as={Link} to="/feedback" variant="outline" size="md">
          Leave feedback
        </Button>
      </div>
    </div>
  )
}
