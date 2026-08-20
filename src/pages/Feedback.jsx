import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviews, createReview, getAverageRating } from '../services/review.service'
import ReviewCard from '../components/ui/ReviewCard'
import StarRating from '../components/ui/StarRating'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ScrollReveal from '../components/animations/ScrollReveal'
import { StaggerGrid, StaggerItem } from '../components/animations/StaggerGrid'

const PAGE_SIZE = 6

/**
 * PRD §4.5 gates review submission behind auth. Auth is being built separately,
 * so the form ships open for now — `submit()` below is the single place a gate
 * would wrap, and no other code needs to change when it lands.
 */
function validate({ name, rating, comment }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Let us know who to credit.'
  if (!rating) errors.rating = 'Pick a rating from one to five stars.'
  if (!comment.trim()) errors.comment = 'Tell us a little about your visit.'
  else if (comment.trim().length < 10) errors.comment = 'A few more words would help others.'
  return errors
}

export default function Feedback() {
  const [reviews, setReviews] = useState(() => getReviews())
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const average = getAverageRating(reviews)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setSubmitted(false)
  }

  function submit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const review = createReview(form)
    setReviews((prev) => [review, ...prev])
    setForm({ name: '', rating: 0, comment: '' })
    setSubmitted(true)
    // Keep the newest review in view even if the list was paginated down.
    setVisible((count) => count + 1)
  }

  const shown = reviews.slice(0, visible)
  const remaining = reviews.length - shown.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <ScrollReveal>
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-mocha-green mb-3">Guest stories</p>
          <h1 className="font-display text-4xl sm:text-5xl text-espresso leading-tight mb-4">
            What people say about CafeNest.
          </h1>
          <p className="text-espresso-light/85 text-base leading-relaxed mb-6">
            A small collection of notes from guests who visit for the coffee, stay for the atmosphere,
            and come back for both.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <StarRating value={Math.round(average)} size="h-5 w-5" />
            <p className="text-sm text-espresso-light/80">
              <span className="font-semibold text-espresso">{average}</span> out of 5 from{' '}
              {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
        <form
          onSubmit={submit}
          noValidate
          className="rounded-[2rem] border border-coffee/10 bg-cream-card p-6 shadow-sm lg:sticky lg:top-24"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-mocha-green font-semibold mb-2">
            Leave a note
          </p>
          <h2 className="font-display text-2xl text-espresso mb-6">How was your visit?</h2>

          <div className="space-y-5">
            <Input
              id="review-name"
              label="Your name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
              placeholder="First name is fine"
              autoComplete="name"
            />

            <div>
              <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-espresso-light/70">
                Your rating
              </p>
              <StarRating
                value={form.rating}
                onChange={(rating) => update('rating', rating)}
                size="h-7 w-7"
                label="Your rating"
              />
              {errors.rating && <p className="mt-2 text-xs text-coffee-dark">{errors.rating}</p>}
            </div>

            <Input
              id="review-comment"
              as="textarea"
              rows={4}
              label="Your note"
              value={form.comment}
              onChange={(e) => update('comment', e.target.value)}
              error={errors.comment}
              placeholder="What did you order, and how was it?"
            />
          </div>

          <Button type="submit" variant="green" size="block" className="mt-6">
            Post review
          </Button>

          {submitted && (
            <p
              role="status"
              className="mt-4 rounded-2xl border border-mocha-green/20 bg-mocha-green/8 px-4 py-3 text-sm text-mocha-green"
            >
              Thanks — your review is up at the top of the list.
            </p>
          )}
        </form>

        <div>
          <StaggerGrid key={reviews.length} className="grid gap-6 sm:grid-cols-2">
            {shown.map((review) => (
              <StaggerItem key={review.id}>
                <ReviewCard review={review} />
              </StaggerItem>
            ))}
          </StaggerGrid>

          {remaining > 0 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="md" onClick={() => setVisible((c) => c + PAGE_SIZE)}>
                Show {Math.min(remaining, PAGE_SIZE)} more
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Button as={Link} to="/" variant="outlineSoft" size="md">
          Back to home
        </Button>
      </div>
    </div>
  )
}
