import hotBeverages from '../assets/hot-beverages.png'
import coffeeHero from '../assets/coffee-hero-section.png'
import coldBeverages from '../assets/cold-beverages.png'
import gallery3 from '../assets/gallery-3.jpg'
import gallery1 from '../assets/gallery-1.jpg'
import aboutImage from '../assets/about-image.jpg'
import gallery6 from '../assets/gallery-6.jpg'
import specialCombo from '../assets/special-combo.png'

/**
 * Size ladder shared by every drink. `delta` is added to the product's base
 * price, so `price` on each product is always the Regular price.
 */
export const DRINK_SIZES = [
  { label: 'Small', delta: -20 },
  { label: 'Regular', delta: 0 },
  { label: 'Large', delta: 40 },
]

/**
 * `attributes` feeds the Taste Match scoring engine.
 *   strength / sweetness / caffeine → 1-5 scale
 *   temperature                     → 'hot' | 'cold'
 *   milk                            → 'none' | 'dairy' | 'oat'
 *
 * Bakes carry no `sizes` and no `attributes` — a croissant has no size ladder
 * and scoring one on caffeine tolerance is meaningless, so the recommendation
 * engine skips any product without attributes.
 */
const products = [
  {
    id: 'p1',
    name: 'Classic Cappuccino',
    description: 'Double espresso, steamed milk, a deep collar of foam.',
    price: 180,
    category: 'Espresso',
    loved: 412,
    image: hotBeverages,
    sizes: DRINK_SIZES,
    attributes: { strength: 4, sweetness: 1, caffeine: 4, temperature: 'hot', milk: 'dairy' },
  },
  {
    id: 'p2',
    name: 'Salted Caramel Latte',
    description: 'Silky espresso with caramel and a pinch of sea salt.',
    price: 220,
    category: 'Espresso',
    loved: 356,
    image: coffeeHero,
    sizes: DRINK_SIZES,
    attributes: { strength: 3, sweetness: 4, caffeine: 3, temperature: 'hot', milk: 'dairy' },
  },
  {
    id: 'p3',
    name: 'Cold Brew Nest',
    description: 'Slow-steeped 18 hours, served over ice, no bitterness.',
    price: 210,
    category: 'Cold',
    loved: 289,
    image: coldBeverages,
    sizes: DRINK_SIZES,
    attributes: { strength: 5, sweetness: 1, caffeine: 5, temperature: 'cold', milk: 'none' },
  },
  {
    id: 'p4',
    name: 'Mocha Green Matcha',
    description: 'Ceremonial matcha, oat milk, a whisper of vanilla.',
    price: 240,
    category: 'Cold',
    loved: 198,
    image: gallery3,
    sizes: DRINK_SIZES,
    attributes: { strength: 2, sweetness: 3, caffeine: 2, temperature: 'cold', milk: 'oat' },
  },
  {
    id: 'p5',
    name: 'Hazelnut Flat White',
    description: 'Tight microfoam over a double ristretto shot.',
    price: 200,
    category: 'Espresso',
    loved: 267,
    image: gallery1,
    sizes: DRINK_SIZES,
    attributes: { strength: 4, sweetness: 2, caffeine: 4, temperature: 'hot', milk: 'dairy' },
  },
  {
    id: 'p6',
    name: 'Cinnamon Chai Latte',
    description: 'Hand-brewed spiced chai with steamed milk.',
    price: 190,
    category: 'Tea',
    loved: 231,
    image: aboutImage,
    sizes: DRINK_SIZES,
    attributes: { strength: 3, sweetness: 4, caffeine: 2, temperature: 'hot', milk: 'dairy' },
  },
  {
    id: 'p7',
    name: 'Butter Croissant',
    description: 'Laminated 24 hours, baked fresh every morning.',
    price: 140,
    category: 'Bakes',
    loved: 175,
    image: gallery6,
  },
  {
    id: 'p8',
    name: 'Almond Biscotti',
    description: 'Twice-baked, lightly sweet, made for dunking.',
    price: 110,
    category: 'Bakes',
    loved: 142,
    image: specialCombo,
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export default products
