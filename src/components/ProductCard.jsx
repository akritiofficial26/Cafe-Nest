import React from 'react'
import { useCart } from '../context/CartContext'

function CupIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M14 24h30v18a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V24Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path d="M44 28h5a6 6 0 0 1 0 12h-5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M22 24c0-3 2-4 2-7s-2-4-2-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M30 24c0-3 2-4 2-7s-2-4-2-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export default function ProductCard({ product }) {
  const { items, addItem, increment, decrement } = useCart()
  const inCart = items.find((i) => i.id === product.id)
  const quantity = inCart ? inCart.quantity : 0

  return (
    <div className="bg-cream-card rounded-3xl border border-coffee/10 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
      <div className="relative rounded-2xl bg-cream-deep aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden">
        <CupIcon className="w-20 h-20 text-coffee" />
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-cream/90 rounded-full px-2.5 py-1 text-xs text-espresso">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-mocha-green">
            <path d="M12 21s-6.7-4.3-9.3-8.2C.9 9.7 1.8 6 5 4.7c2.1-.9 4.3-.1 5.6 1.6l1.4 1.8 1.4-1.8C14.7 4.6 16.9 3.8 19 4.7c3.2 1.3 4.1 5 2.3 8.1C18.7 16.7 12 21 12 21z" />
          </svg>
          {product.loved}
        </span>
        <span className="absolute top-3 right-3 bg-mocha-green text-cream text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <h3 className="font-display text-lg text-espresso mb-1">{product.name}</h3>
      <p className="text-sm text-espresso-light/80 flex-1 mb-4">{product.description}</p>

      <div className="flex items-center justify-between">
        <span className="font-display text-lg text-coffee-dark">₹{product.price}</span>

        {quantity === 0 ? (
          <button
            onClick={() => addItem(product)}
            className="px-4 py-2 rounded-full bg-mocha-green text-cream text-sm font-semibold hover:bg-mocha-green-dark transition-colors"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-cream-deep rounded-full px-1 py-1">
            <button
              onClick={() => decrement(product.id)}
              aria-label={`Decrease ${product.name} quantity`}
              className="h-7 w-7 flex items-center justify-center rounded-full bg-coffee text-cream hover:bg-coffee-dark transition-colors"
            >
              –
            </button>
            <span className="text-sm font-semibold text-espresso w-4 text-center">{quantity}</span>
            <button
              onClick={() => increment(product.id)}
              aria-label={`Increase ${product.name} quantity`}
              className="h-7 w-7 flex items-center justify-center rounded-full bg-coffee text-cream hover:bg-coffee-dark transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
