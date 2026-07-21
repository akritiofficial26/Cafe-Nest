import React, { useMemo, useState } from 'react'
import products from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    []
  )
  const [active, setActive] = useState('All')

  const filtered =
    active === 'All' ? products : products.filter((p) => p.category === active)

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 py-16">
      <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Menu</p>
      <h1 className="font-display text-4xl text-espresso mb-3">Everything on the counter.</h1>
      <p className="text-espresso-light/85 max-w-xl mb-10">
        Adjust quantities right on the card — your cart updates as you go.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              active === cat
                ? 'bg-mocha-green text-cream border-mocha-green'
                : 'border-coffee/30 text-espresso hover:border-coffee'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
