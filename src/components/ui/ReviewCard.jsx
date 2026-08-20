import React from 'react'
import StarRating from './StarRating'

/**
 * One guest review. Previously this markup existed twice — once in Home's
 * feedback teaser and once on the Feedback page — so it is extracted here per
 * Rules §2 rather than copied a third time.
 *
 * Unified on the richer of the two originals (avatar + hover lift); the star
 * row is new, since reviews now carry ratings.
 */
export default function ReviewCard({ review }) {
  const initial = review.name.slice(0, 1).toUpperCase()

  return (
    <article className="group relative h-full overflow-hidden rounded-[2rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream-card to-cream-deep p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(58,42,32,0.12)]">
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-mocha-green/8" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sand via-mocha-green to-coffee" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mocha-green text-cream shadow-sm transition-transform duration-300 group-hover:scale-105">
          <span className="font-display text-2xl leading-none">&ldquo;</span>
        </div>
        <span className="rounded-full border border-mocha-green/15 bg-mocha-green/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mocha-green">
          Guest review
        </span>
      </div>

      <div className="relative mb-4">
        <StarRating value={review.rating} />
      </div>

      <p className="relative text-espresso-light/90 leading-relaxed mb-8 text-[0.98rem]">
        {review.comment}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee text-cream font-display text-sm shadow-sm">
          {initial}
        </div>
        <div>
          <h3 className="font-display text-lg text-espresso leading-tight">
            {review.name}
            {review.role && <span className="text-espresso-light/70">, {review.role}</span>}
          </h3>
          <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/60">CafeNest visitor</p>
        </div>
      </div>
    </article>
  )
}
