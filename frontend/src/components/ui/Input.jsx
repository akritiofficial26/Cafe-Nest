import React from 'react'

/**
 * Form field for the Contact, Checkout and Review forms (Phases 4-6).
 * No input existed in the app before this, so styling is built from the
 * existing palette only — no new colours or fonts are introduced. The global
 * focus-visible ring in index.css supplies the accent outline.
 *
 * Pass `as="textarea"` for multi-line fields.
 */
const fieldClass =
  'w-full rounded-2xl border border-coffee/20 bg-cream-card px-4 py-3 text-sm text-espresso placeholder:text-espresso-light/50 transition-colors focus:border-mocha-green'

export default function Input({
  as: Component = 'input',
  id,
  label,
  error,
  className = '',
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-espresso-light/70"
        >
          {label}
        </label>
      )}
      <Component
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass} ${error ? 'border-coffee-dark' : ''}`.trim()}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-coffee-dark">
          {error}
        </p>
      )}
    </div>
  )
}
