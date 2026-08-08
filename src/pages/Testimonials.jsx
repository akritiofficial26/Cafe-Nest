import React from 'react'
import { Link } from 'react-router-dom'
import testimonials from '../services/testimonials.service'

export default function Feedback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-3xl mb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-mocha-green mb-3">Guest stories</p>
        <h1 className="font-display text-4xl sm:text-5xl text-espresso leading-tight mb-4">
          What people say about CafeNest.
        </h1>
        <p className="text-espresso-light/85 text-base leading-relaxed">
          A small collection of notes from guests who visit for the coffee, stay for the atmosphere, and come back for both.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.title}
            className="relative overflow-hidden rounded-[2rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream to-cream-deep p-6 shadow-sm"
          >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-mocha-green/8" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sand via-mocha-green to-coffee" />
            <div className="relative mb-5 flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mocha-green text-cream shadow-sm">
                <span className="font-display text-2xl leading-none">“</span>
              </div>
              <span className="rounded-full border border-mocha-green/15 bg-mocha-green/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mocha-green">
                Guest review
              </span>
            </div>
            <p className="relative text-espresso-light/90 leading-relaxed mb-8 text-[0.98rem]">
              {item.text}
            </p>
            <div>
              <h2 className="font-display text-lg text-espresso leading-tight">{item.title}</h2>
              <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/60">CafeNest visitor</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to="/"
          className="px-6 py-3 rounded-full border border-coffee/30 text-espresso text-sm font-semibold hover:bg-coffee hover:text-cream hover:border-coffee transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}