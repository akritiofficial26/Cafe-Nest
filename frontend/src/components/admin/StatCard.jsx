import React from 'react'
import { Link } from 'react-router-dom'

export default function StatCard({ label, value, hint, to, accent = false }) {
  const Component = to ? Link : 'div'

  return (
    <Component
      {...(to ? { to } : {})}
      className={`block rounded-2xl border p-5 shadow-sm transition-colors ${
        accent ? 'border-mocha-green/30 bg-mocha-green/10' : 'border-coffee/10 bg-cream-card'
      } ${to ? 'hover:border-mocha-green/50 hover:bg-mocha-green/5' : ''}`}
    >
      <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mocha-green">
        {label}
      </p>
      <p className="mb-1.5 font-display text-2xl leading-none text-espresso">{value}</p>
      <p className="text-[0.7rem] leading-relaxed text-espresso-light/65">{hint}</p>
    </Component>
  )
}
