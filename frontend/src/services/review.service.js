import testimonials from './testimonials.service'

/**
 * Reviews — localStorage shim.
 *
 * Stands in for `GET /api/v1/reviews` and `POST /api/v1/reviews` until the
 * backend exists. The UI only ever calls getReviews/createReview, so the
 * migration is replacing these two bodies with fetch calls.
 *
 * Shape follows the `reviews` table in Architecture §4. `productId` is always
 * null for now — the form is shop-level — but the field is present so
 * per-product reviews can be added later without touching stored records.
 */
const REVIEWS_KEY = 'cafenest_reviews'
const REVIEW_LIMIT = 50

/**
 * The three original testimonials, kept as seed content so the page is never
 * empty. Ratings are assigned here because the source testimonials predate
 * star ratings; they carry no createdAt, which keeps them below real
 * submissions in the sort order.
 */
const SEED_RATINGS = [5, 5, 4]

const SEED_REVIEWS = testimonials.map((item, index) => {
  const [name, role] = item.title.split(',')
  return {
    id: `seed-${index + 1}`,
    productId: null,
    name: name.trim(),
    role: role ? role.trim() : null,
    rating: SEED_RATINGS[index] ?? 5,
    comment: item.text,
    createdAt: null,
    seeded: true,
  }
})

function readSubmitted() {
  try {
    const raw = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((r) => r && r.comment) : []
  } catch {
    return []
  }
}

/** Newest submissions first, seed content last. */
export function getReviews() {
  return [...readSubmitted(), ...SEED_REVIEWS]
}

export function createReview({ name, rating, comment }) {
  const review = {
    id: `r-${Math.random().toString(36).slice(2, 10)}`,
    productId: null,
    name: name.trim(),
    role: null,
    rating,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
    seeded: false,
  }

  try {
    const next = [review, ...readSubmitted()].slice(0, REVIEW_LIMIT)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — the review object is still returned so the page
       can show it for this session */
  }

  return review
}

/** Average across everything shown, for the page summary. */
export function getAverageRating(reviews = getReviews()) {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((total, r) => total + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
