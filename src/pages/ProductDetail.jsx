import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import products, { getProductById } from '../services/product.service'
import { useCart, DEFAULT_SIZE, cartKey, resolveSizePrice } from '../context/CartContext'
import Button from '../components/ui/Button'
import QuantityStepper from '../components/ui/QuantityStepper'
import ProductCard from '../components/ui/ProductCard'
import ScrollReveal from '../components/animations/ScrollReveal'
import { StaggerGrid, StaggerItem } from '../components/animations/StaggerGrid'
import { formatCurrency } from '../utils/formatCurrency'

const sizePillClass = 'px-4 py-2 rounded-full text-sm font-semibold border transition-colors'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)
  const { items, addItem, increment, decrement } = useCart()

  // Bakes have no size ladder, so their selection stays null.
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? DEFAULT_SIZE : null)

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">We couldn't find that one.</h1>
        <p className="text-espresso-light/80 mb-8">
          The item may have come off the menu. Everything we're serving today is on the menu page.
        </p>
        <Button as={Link} to="/shop" variant="green" size="lg" className="inline-block">
          Back to the menu
        </Button>
      </div>
    )
  }

  const activeSize = product.sizes ? selectedSize || DEFAULT_SIZE : null
  const activePrice = resolveSizePrice(product, activeSize)
  const activeKey = cartKey(product.id, activeSize)
  const inCart = items.find((i) => i.key === activeKey)

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <div>
      <section className="max-w-7xl mx-auto px-2 sm:px-3 py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-espresso-light/70">
          <Link to="/shop" className="hover:text-coffee-dark transition-colors">
            Menu
          </Link>
          <span className="mx-2">/</span>
          <span className="text-espresso">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-coffee/10 bg-cream-card shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover aspect-[4/3]"
            />
            <span className="absolute top-4 left-4 flex items-center gap-1 bg-cream/90 rounded-full px-2.5 py-1 text-xs text-espresso">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-mocha-green">
                <path d="M12 21s-6.7-4.3-9.3-8.2C.9 9.7 1.8 6 5 4.7c2.1-.9 4.3-.1 5.6 1.6l1.4 1.8 1.4-1.8C14.7 4.6 16.9 3.8 19 4.7c3.2 1.3 4.1 5 2.3 8.1C18.7 16.7 12 21 12 21z" />
              </svg>
              {product.loved} loved this
            </span>
          </div>

          <div>
            <span className="inline-block bg-mocha-green text-cream text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="font-display text-4xl text-espresso mb-4">{product.name}</h1>
            <p className="text-espresso-light/90 leading-relaxed max-w-xl mb-8">{product.description}</p>

            {product.sizes && (
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/70 font-semibold mb-3">
                  Choose a size
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      role="radio"
                      aria-checked={activeSize === size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`${sizePillClass} ${
                        activeSize === size.label
                          ? 'bg-mocha-green text-cream border-mocha-green'
                          : 'border-coffee/30 text-espresso hover:border-coffee'
                      }`}
                    >
                      {size.label}
                      <span className="ml-2 font-normal">
                        {formatCurrency(product.price + size.delta)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 border-t border-coffee/15 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/50 mb-1">Price</p>
                <span className="font-display text-3xl text-coffee-dark">{formatCurrency(activePrice)}</span>
              </div>

              {inCart ? (
                <div className="flex items-center gap-4">
                  <QuantityStepper
                    quantity={inCart.quantity}
                    label={product.name}
                    onIncrement={() => increment(activeKey)}
                    onDecrement={() => decrement(activeKey)}
                  />
                  <div>
                    <p className="text-sm font-semibold text-mocha-green">In your cart</p>
                    <Link to="/cart" className="text-sm text-espresso-light/70 hover:text-coffee-dark transition-colors">
                      View cart →
                    </Link>
                  </div>
                </div>
              ) : (
                <Button variant="green" size="lg" onClick={() => addItem(product, activeSize)}>
                  Add to cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-2 sm:px-3 pb-16">
          <div className="twig-divider mb-14" />
          <ScrollReveal>
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-display text-2xl sm:text-3xl text-espresso">
                More from {product.category}
              </h2>
              <Link to="/shop" className="text-sm font-semibold text-mocha-green hover:underline">
                View full menu →
              </Link>
            </div>
          </ScrollReveal>
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}
    </div>
  )
}
