import hotBeverages from '../assets/hot-beverages.png'
import coffeeHero from '../assets/coffee-hero-section.png'
import coldBeverages from '../assets/cold-beverages.png'
import gallery3 from '../assets/gallery-3.jpg'
import gallery1 from '../assets/gallery-1.jpg'
import aboutImage from '../assets/about-image.jpg'
import gallery6 from '../assets/gallery-6.jpg'
import specialCombo from '../assets/special-combo.png'

const products = [
  {
    id: 'p1',
    name: 'Classic Cappuccino',
    description: 'Double espresso, steamed milk, a deep collar of foam.',
    price: 180,
    category: 'Espresso',
    loved: 412,
    image: hotBeverages,
  },
  {
    id: 'p2',
    name: 'Salted Caramel Latte',
    description: 'Silky espresso with caramel and a pinch of sea salt.',
    price: 220,
    category: 'Espresso',
    loved: 356,
    image: coffeeHero,
  },
  {
    id: 'p3',
    name: 'Cold Brew Nest',
    description: 'Slow-steeped 18 hours, served over ice, no bitterness.',
    price: 210,
    category: 'Cold',
    loved: 289,
    image: coldBeverages,
  },
  {
    id: 'p4',
    name: 'Mocha Green Matcha',
    description: 'Ceremonial matcha, oat milk, a whisper of vanilla.',
    price: 240,
    category: 'Cold',
    loved: 198,
    image: gallery3,
  },
  {
    id: 'p5',
    name: 'Hazelnut Flat White',
    description: 'Tight microfoam over a double ristretto shot.',
    price: 200,
    category: 'Espresso',
    loved: 267,
    image: gallery1,
  },
  {
    id: 'p6',
    name: 'Cinnamon Chai Latte',
    description: 'Hand-brewed spiced chai with steamed milk.',
    price: 190,
    category: 'Tea',
    loved: 231,
    image: aboutImage,
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

export default products
