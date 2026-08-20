import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

/**
 * Catch-all route. Before this, any unknown URL rendered an empty <main> —
 * Rules §2: never a blank white screen.
 */
export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
      <p className="font-display text-6xl text-sand mb-6">404</p>
      <h1 className="font-display text-3xl sm:text-4xl text-espresso mb-4">
        This page went cold.
      </h1>
      <p className="text-espresso-light/80 leading-relaxed max-w-md mx-auto mb-8">
        We couldn't find what you were looking for. It may have moved, or the link might have a
        typo in it.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button as={Link} to="/" variant="sand" size="md">
          Back to home
        </Button>
        <Button as={Link} to="/shop" variant="outline" size="md">
          See the menu
        </Button>
      </div>
    </div>
  )
}
