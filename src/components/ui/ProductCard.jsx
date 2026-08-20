import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Button from './Button'
import QuantityStepper from './QuantityStepper'
import { formatCurrency } from '../../utils/formatCurrency'
import defaultImage from '../../assets/hot-beverages.png'

export default function ProductCard({ product }) {
  const { addItem, increment, decrement, findProductItem } = useCart()

  // One stepper per product, not per size: if a size of this product is already
  // in the cart, +/- adjusts that line. Otherwise Add creates a Regular.
  const inCart = findProductItem(product.id)
  const quantity = inCart ? inCart.quantity : 0

  const detailPath = `/shop/${product.id}`

  return (
    <div className="bg-cream-card rounded-3xl border border-coffee/10 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
      {/* The Add button must stay outside this Link — a <button> inside an <a> is invalid markup. */}
      <Link to={detailPath} className="block">
        <div className="relative rounded-2xl bg-cream-deep aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden">
          <img
            src={product.image || defaultImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-deep/25 via-transparent to-transparent" />
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
      </Link>

      <p className="text-sm text-espresso-light/80 flex-1 mb-4">{product.description}</p>

      <div className="flex items-center justify-between">
        <span className="font-display text-lg text-coffee-dark">{formatCurrency(product.price)}</span>

        {quantity === 0 ? (
          <Button variant="green" size="sm" onClick={() => addItem(product)}>
            Add
          </Button>
        ) : (
          <QuantityStepper
            quantity={quantity}
            label={product.name}
            onIncrement={() => increment(inCart.key)}
            onDecrement={() => decrement(inCart.key)}
          />
        )}
      </div>
    </div>
  )
}
