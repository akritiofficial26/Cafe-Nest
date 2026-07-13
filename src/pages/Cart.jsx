import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, increment, decrement, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Your cart is empty.</h1>
        <p className="text-espresso-light/80 mb-8">
          Nothing here yet — go pick something warm from the menu.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 rounded-full bg-mocha-green text-cream font-semibold hover:bg-mocha-green-dark transition-colors"
        >
          Browse the menu
        </Link>
      </div>
    )
  }

  const deliveryFee = 30
  const grandTotal = totalPrice + deliveryFee

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Your cart</p>
      <h1 className="font-display text-4xl text-espresso mb-10">Ready when you are.</h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-cream-card border border-coffee/10 rounded-2xl p-4"
          >
            <div className="h-16 w-16 rounded-xl bg-cream-deep flex items-center justify-center shrink-0">
              <svg viewBox="0 0 64 64" className="w-8 h-8 text-coffee" fill="none">
                <path
                  d="M14 24h30v18a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V24Z"
                  stroke="currentColor"
                  strokeWidth="2.4"
                />
                <path d="M44 28h5a6 6 0 0 1 0 12h-5" stroke="currentColor" strokeWidth="2.4" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg text-espresso truncate">{item.name}</h3>
              <p className="text-sm text-espresso-light/70">₹{item.price} each</p>
            </div>

            <div className="flex items-center gap-3 bg-cream-deep rounded-full px-1 py-1 shrink-0">
              <button
                onClick={() => decrement(item.id)}
                aria-label={`Decrease ${item.name} quantity`}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-coffee text-cream hover:bg-coffee-dark transition-colors"
              >
                –
              </button>
              <span className="text-sm font-semibold text-espresso w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => increment(item.id)}
                aria-label={`Increase ${item.name} quantity`}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-coffee text-cream hover:bg-coffee-dark transition-colors"
              >
                +
              </button>
            </div>

            <span className="font-display text-lg text-coffee-dark w-16 text-right shrink-0">
              ₹{item.price * item.quantity}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="text-espresso-light/50 hover:text-coffee-dark transition-colors shrink-0"
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

      <div className="bg-cream-deep/60 rounded-2xl p-6 max-w-md ml-auto">
        <div className="flex justify-between text-sm text-espresso-light/85 mb-2">
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm text-espresso-light/85 mb-4">
          <span>Delivery</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between font-display text-xl text-espresso border-t border-coffee/15 pt-4 mb-6">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>
        <button className="w-full py-3 rounded-full bg-mocha-green text-cream font-semibold hover:bg-mocha-green-dark transition-colors">
          Checkout
        </button>
      </div>
    </div>
  )
}
