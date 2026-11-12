import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Button from '../components/ui/Button'
import QuantityStepper from '../components/ui/QuantityStepper'
import { formatCurrency } from '../utils/formatCurrency'
import { calculateBill } from '../utils/bill'

export default function Cart() {
  const { items, increment, decrement, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Your cart is empty.</h1>
        <p className="text-espresso-light/80 mb-8">
          Nothing here yet — go pick something warm from the menu.
        </p>
        <Button as={Link} to="/shop" variant="green" size="lg" className="inline-block">
          Browse the menu
        </Button>
      </div>
    )
  }

  // Defaults to delivery so these figures match what they always were; the
  // customer can switch to pickup at checkout, which drops the delivery fee.
  const bill = calculateBill(totalPrice)

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Your cart</p>
      <h1 className="font-display text-4xl text-espresso mb-10">Ready when you are.</h1>

      <div className="overflow-hidden rounded-[2rem] border border-coffee/10 bg-cream-card shadow-[0_18px_50px_rgba(58,42,32,0.08)]">
        <div className="border-b border-coffee/10 bg-gradient-to-r from-cream-card via-cream to-cream-deep px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-mocha-green font-semibold mb-2">Cart details</p>
              <h2 className="font-display text-2xl text-espresso">All products in one place</h2>
            </div>
            <div className="rounded-full border border-mocha-green/15 bg-mocha-green/8 px-4 py-2 text-sm font-semibold text-mocha-green">
              {items.length} item{items.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="divide-y divide-coffee/10">
        {items.map((item) => (
          <div
            key={item.key}
            className="grid gap-5 p-6 sm:p-7 lg:grid-cols-[auto_1fr_auto_auto_auto] lg:items-center"
          >
            <div className="h-20 w-20 rounded-2xl bg-cream-deep flex items-center justify-center shrink-0 shadow-inner">
              <svg viewBox="0 0 64 64" className="w-10 h-10 text-coffee" fill="none">
                <path
                  d="M14 24h30v18a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V24Z"
                  stroke="currentColor"
                  strokeWidth="2.4"
                />
                <path d="M44 28h5a6 6 0 0 1 0 12h-5" stroke="currentColor" strokeWidth="2.4" />
              </svg>
            </div>

            <div className="min-w-0 lg:pr-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-display text-xl text-espresso">{item.name}</h3>
                <span className="rounded-full bg-mocha-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mocha-green">
                  {item.category}
                </span>
                {item.size && (
                  <span className="rounded-full bg-sand/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-coffee-dark">
                    {item.size}
                  </span>
                )}
              </div>
              <p className="text-sm text-espresso-light/80 leading-relaxed mb-3 max-w-xl">
                {item.description}
              </p>
              <p className="text-sm text-espresso-light/70">Unit price: {formatCurrency(item.price)}</p>
            </div>

            <QuantityStepper
              quantity={item.quantity}
              label={item.name}
              onIncrement={() => increment(item.key)}
              onDecrement={() => decrement(item.key)}
              className="shrink-0 justify-self-start lg:justify-self-center"
            />

            <div className="text-left lg:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">Line total</p>
              <span className="font-display text-xl text-coffee-dark shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.key)}
              aria-label={`Remove ${item.name} from cart`}
              className="justify-self-start lg:justify-self-end text-espresso-light/50 hover:text-coffee-dark transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
        </div>

        <div className="border-t border-coffee/10 bg-cream-deep/45 px-6 py-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
            <div className="rounded-[1.75rem] border border-coffee/10 bg-cream-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-mocha-green font-semibold mb-2">Bill summary</p>
                  <h3 className="font-display text-2xl text-espresso">Checkout details</h3>
                </div>
                <span className="rounded-full bg-sand/20 px-3 py-1 text-xs font-semibold text-coffee-dark">
                  Pay at checkout
                </span>
              </div>

              <div className="space-y-3 text-sm text-espresso-light/85">
                <div className="flex justify-between gap-4">
                  <span>Subtotal</span>
                  <span>{formatCurrency(bill.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Delivery fee</span>
                  <span>{formatCurrency(bill.deliveryFee)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Service fee</span>
                  <span>{formatCurrency(bill.serviceFee)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Tax</span>
                  <span>{formatCurrency(bill.tax)}</span>
                </div>
              </div>

              <div className="flex justify-between font-display text-xl text-espresso border-t border-coffee/15 pt-4 mt-5 mb-6">
                <span>Total</span>
                <span>{formatCurrency(bill.total)}</span>
              </div>

              <Button as={Link} to="/checkout" variant="green" size="block" className="block text-center">
                Checkout
              </Button>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  )
}
