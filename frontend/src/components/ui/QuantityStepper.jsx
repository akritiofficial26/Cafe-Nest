import React from 'react'

/**
 * The -/+ pill. Previously duplicated verbatim in ProductCard and Cart.
 * `className` takes the layout extras each call site needs (e.g. grid
 * self-alignment on the cart row).
 */
export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  label,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-3 bg-cream-deep rounded-full px-1 py-1 ${className}`.trim()}>
      <button
        type="button"
        onClick={onDecrement}
        aria-label={`Decrease ${label} quantity`}
        className="h-7 w-7 flex items-center justify-center rounded-full bg-coffee text-cream hover:bg-coffee-dark transition-colors"
      >
        –
      </button>
      <span className="text-sm font-semibold text-espresso w-4 text-center">{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${label} quantity`}
        className="h-7 w-7 flex items-center justify-center rounded-full bg-coffee text-cream hover:bg-coffee-dark transition-colors"
      >
        +
      </button>
    </div>
  )
}
