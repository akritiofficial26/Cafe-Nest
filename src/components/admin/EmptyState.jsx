import React from 'react'

/**
 * Dashed panel for "there is genuinely nothing here", reused by the queue and
 * the history table.
 *
 * It exists so an empty page always says which kind of empty it is — an idle
 * queue and a filter that matched nothing look identical otherwise, and the
 * second one needs the admin to clear the filter.
 */
export default function EmptyState({ title, message, icon = 'cup', children }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-coffee/25 bg-cream-card/60 px-6 py-16 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-mocha-green/10 text-mocha-green">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon === 'search' ? (
            <>
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </>
          ) : (
            <>
              <path d="M4 8h13v4a6.5 6.5 0 0 1-13 0z" />
              <path d="M17 9h1.8a2.2 2.2 0 0 1 0 4.4H17" />
              <path d="M3 20h15" />
            </>
          )}
        </svg>
      </div>
      <h3 className="mb-2 font-display text-2xl text-espresso">{title}</h3>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-espresso-light/70">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
