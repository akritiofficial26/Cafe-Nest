import products from './product.service'

/**
 * Taste Match — rule-based scoring, v1.
 *
 * Per Architecture §6 this file is the seam: routes, UI and the shape of
 * `recommendProducts()` stay fixed, so replacing the internals with a trained
 * model (or a POST to /api/v1/recommendation) touches nothing else.
 *
 * Per Rules §5 this is deliberately NOT called "AI" anywhere in the UI — it is
 * weighted attribute matching, and "Taste Match" is the honest framing.
 */

/** The questionnaire. Numeric answers ride the same 1-5 scale as product attributes. */
export const QUESTIONS = [
  {
    id: 'strength',
    prompt: 'How strong do you like it?',
    help: 'How much the coffee itself comes forward.',
    matchReason: 'Strength is spot on',
    options: [
      { value: 1, label: 'Gentle', description: 'Soft and easy-going' },
      { value: 3, label: 'Balanced', description: 'Present but not loud' },
      { value: 5, label: 'Bold', description: 'Full, deep, unmistakable' },
    ],
  },
  {
    id: 'milk',
    prompt: 'How do you take your milk?',
    help: 'We can go without entirely.',
    matchReason: 'Made the way you take milk',
    options: [
      { value: 'dairy', label: 'Dairy', description: 'Steamed whole milk' },
      { value: 'oat', label: 'Oat', description: 'Plant-based and creamy' },
      { value: 'none', label: 'None', description: 'Black, no milk at all' },
    ],
  },
  {
    id: 'sweetness',
    prompt: 'How sweet should it be?',
    help: 'Everything can be adjusted at the counter too.',
    matchReason: 'Sweetness matches',
    options: [
      { value: 1, label: 'Barely', description: 'Let the beans speak' },
      { value: 3, label: 'A little', description: 'Just a hint of sweet' },
      { value: 5, label: 'Sweet', description: 'Dessert-leaning' },
    ],
  },
  {
    id: 'caffeine',
    prompt: "What's your caffeine tolerance?",
    help: 'Useful if this is a late-afternoon cup.',
    matchReason: 'Caffeine level suits you',
    options: [
      { value: 1, label: 'Low', description: 'Keep me calm' },
      { value: 3, label: 'Medium', description: 'A normal lift' },
      { value: 5, label: 'High', description: 'Bring the whole shot' },
    ],
  },
  {
    id: 'temperature',
    prompt: 'Hot or cold?',
    help: 'The last one, promise.',
    matchReason: 'Served just how you wanted',
    options: [
      { value: 'hot', label: 'Hot', description: 'Steamed and warming' },
      { value: 'cold', label: 'Cold', description: 'Iced and refreshing' },
    ],
  },
]

/**
 * Relative importance of each answer. Temperature leads because a hot drink is
 * simply wrong for someone who asked for iced, however well it scores elsewhere.
 */
const WEIGHTS = { temperature: 1.4, strength: 1.2, caffeine: 1.1, sweetness: 1.0, milk: 0.9 }

const SCALE_SPAN = 4 // 1-5 inclusive
const STRONG_MATCH = 0.85 // dimension score above which we surface it as a reason

/** Closeness on a 1-5 scale, normalised to 0-1. */
function scaleScore(answer, attribute) {
  return 1 - Math.abs(answer - attribute) / SCALE_SPAN
}

/**
 * Milk is not a simple scale. Asking for no milk is close to a hard constraint,
 * while dairy-vs-oat is something a café swaps on request — so it scores as a
 * near-miss rather than a failure.
 */
function milkScore(answer, attribute) {
  if (answer === attribute) return 1
  if (answer === 'none') return 0.1
  if (attribute === 'none') return 0.4
  return 0.6
}

function dimensionScore(id, answer, attributes) {
  if (answer === undefined || answer === null) return null
  if (id === 'temperature') return answer === attributes.temperature ? 1 : 0
  if (id === 'milk') return milkScore(answer, attributes.milk)
  return scaleScore(answer, attributes[id])
}

/** Weighted match for one product, plus the dimensions worth showing the user. */
export function scoreProduct(answers, product) {
  let weighted = 0
  let totalWeight = 0
  const reasons = []

  for (const question of QUESTIONS) {
    const score = dimensionScore(question.id, answers[question.id], product.attributes)
    if (score === null) continue

    weighted += score * WEIGHTS[question.id]
    totalWeight += WEIGHTS[question.id]
    if (score >= STRONG_MATCH) reasons.push(question.matchReason)
  }

  return {
    score: totalWeight === 0 ? 0 : weighted / totalWeight,
    reasons,
  }
}

/**
 * Top matches, best first. Only products carrying `attributes` are considered —
 * bakes have no taste profile, so scoring a croissant on caffeine is meaningless.
 * Ties break toward the better-loved drink.
 */
export function recommendProducts(answers, catalogue = products, limit = 3) {
  return catalogue
    .filter((p) => p.attributes)
    .map((product) => ({ product, ...scoreProduct(answers, product) }))
    .sort((a, b) => b.score - a.score || b.product.loved - a.product.loved)
    .slice(0, limit)
    .map((match) => ({ ...match, matchPercent: Math.round(match.score * 100) }))
}

/**
 * Rules §5: log answers and what was recommended, so there is real data to
 * train on later. Throwaway localStorage shim — this becomes a POST to the
 * recommendation endpoint, which writes the `recommendation_responses` table.
 */
const LOG_KEY = 'cafenest_taste_match_log'
const LOG_LIMIT = 20

export function logTasteMatch(answers, results) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOG_KEY) || '[]')
    const entry = {
      answers,
      recommendedProductIds: results.map((r) => r.product.id),
      createdAt: new Date().toISOString(),
    }
    const next = [entry, ...(Array.isArray(existing) ? existing : [])].slice(0, LOG_LIMIT)
    localStorage.setItem(LOG_KEY, JSON.stringify(next))
  } catch {
    /* logging is best-effort — never block a recommendation on it */
  }
}
