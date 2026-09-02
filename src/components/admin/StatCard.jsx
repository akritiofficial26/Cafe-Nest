import React from 'react'
import { Link } from 'react-router-dom'

/**
 * One figure on the dashboard. Renders as a link when `to` is given, so a
 * number the admin wants to act on takes them to the page that lists it —
 * a card showing "3 new orders" that cannot be clicked is a dead end.
 */
export default function StatCard({ label, value, hint, to, accent = false }) {
  const Component = to ? Link : 'div'

  return (
    <Component
      {...(to ? { to } : {})}
      className={`block rounded-[1.75rem] border p-6 shadow-sm transition-colors ${
        accent
          ? 'border-mocha-green/30 bg-mocha-green/10'
          : 'border-coffee/10 bg-cream-card'
      } ${to ? 'hover:border-mocha-green/50 hover:bg-mocha-green/5' : ''}`}
    >
      <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-mocha-green">
        {label}
      </p>
      <p className="mb-3 font-display text-4xl leading-none text-espresso">{value}</p>
      <p className="text-xs leading-relaxed text-espresso-light/65">{hint}</p>
    </Component>
  )
}
