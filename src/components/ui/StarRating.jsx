import React from 'react'

/**
 * Star rating, read-only by default. Pass `onChange` to make it an input
 * (used by the review form in Phase 5). Filled stars use the existing `sand`
 * accent; empty stars use a muted coffee tone. No new palette entries.
 */
function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95L12 2.6z"
        opacity={filled ? 1 : 0.25}
      />
    </svg>
  )
}

export default function StarRating({ value = 0, onChange, max = 5, size = 'h-4 w-4', label }) {
  const interactive = typeof onChange === 'function'
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  if (!interactive) {
    return (
      <div className={`flex items-center gap-1 text-sand`} role="img" aria-label={`${value} out of ${max} stars`}>
        {stars.map((star) => (
          <span key={star} className={size}>
            <Star filled={star <= value} />
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={label || 'Rating'}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          className={`${size} text-sand transition-transform hover:scale-110`}
        >
          <Star filled={star <= value} />
        </button>
      ))}
    </div>
  )
}
