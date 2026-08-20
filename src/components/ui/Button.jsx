import React from 'react'

/**
 * The pill button used across the app. Variants and sizes below are the exact
 * utility sets that were previously copy-pasted inline, so rendering is
 * visually unchanged — this only removes the duplication.
 *
 * Pass `as={Link}` (with `to`) to render a router link with button styling.
 */
const base = 'rounded-full font-semibold transition-colors'

const variants = {
  green: 'bg-mocha-green text-cream hover:bg-mocha-green-dark',
  sand: 'bg-sand text-espresso hover:bg-coffee-light',
  outline: 'border border-coffee/40 text-espresso hover:bg-coffee hover:text-cream hover:border-coffee',
  outlineSoft: 'border border-coffee/30 text-espresso hover:bg-coffee hover:text-cream hover:border-coffee',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-6 py-3',
  block: 'w-full py-3.5',
}

export default function Button({
  as: Component = 'button',
  variant = 'green',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const props = Component === 'button' ? { type: 'button', ...rest } : rest

  return (
    <Component
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  )
}
