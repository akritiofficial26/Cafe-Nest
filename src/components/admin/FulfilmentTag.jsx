import React from 'react'
import { FULFILMENT } from '../../utils/bill'

/**
 * Delivery or pickup, as a small labelled tag. It is the first thing a barista
 * checks after the drink itself, so it gets an icon as well as a word — the
 * two read apart at a glance in a long queue.
 */
export default function FulfilmentTag({ fulfilment }) {
  const isDelivery = fulfilment === FULFILMENT.delivery

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-espresso/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-espresso-light/80">
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isDelivery ? (
          <>
            <path d="M3 7h11v9H3z" />
            <path d="M14 10h4l3 3v3h-7" />
            <circle cx="7" cy="18.5" r="1.6" />
            <circle cx="17" cy="18.5" r="1.6" />
          </>
        ) : (
          <>
            <path d="M4 8h13v4a6.5 6.5 0 0 1-13 0z" />
            <path d="M17 9h1.8a2.2 2.2 0 0 1 0 4.4H17" />
            <path d="M3 20h15" />
          </>
        )}
      </svg>
      {isDelivery ? 'Delivery' : 'Pickup'}
    </span>
  )
}
