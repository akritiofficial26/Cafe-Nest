import React from 'react'
import { Link } from 'react-router-dom'
import products from '../data/products'
import ProductCard from '../components/ProductCard'

function CoffeeIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[31rem]">
      <div className="absolute inset-0 rounded-full bg-sand/20 blur-3xl" />
      <div className="absolute left-8 top-12 h-3 w-3 rounded-full bg-sand/80" />
      <div className="absolute right-10 top-10 h-2.5 w-2.5 rounded-full bg-coffee/70" />
      <div className="absolute left-2 top-28 h-2 w-2 rounded-full bg-coffee-light/70" />
      <img
        src="/coffee-hero-section.png"
        alt="Coffee hero section illustration"
        className="relative z-10 w-full drop-shadow-[0_20px_45px_rgba(58,42,32,0.16)]"
      />
    </div>
  )
}

const testimonials = [
  {
    title: 'Maya, regular guest',
    text: 'The cup comes out smooth, balanced, and exactly the kind of coffee I want before work.',
  },
  {
    title: 'Aman, weekend visitor',
    text: 'The room feels calm and considered. It makes the whole coffee break feel slower in a good way.',
  },
  {
    title: 'Sara, first-time guest',
    text: 'The menu is easy to read and the presentation feels polished without losing the café warmth.',
  },
]

const galleryItems = ['Morning pour', 'Latte art', 'Beans ready', 'Quiet table']

export default function Home() {
  const featured = products.slice(0, 3)

  return (
    <div>
      <section id="home" className="max-w-7xl mx-auto px-2 sm:px-3 pt-14 sm:pt-20 pb-14 lg:pb-18 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div className="animate-rise max-w-2xl">
          <p className="font-display italic text-2xl sm:text-3xl text-sand mb-4">Best Coffee</p>
          <h1 className="font-body font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-espresso max-w-xl mb-5">
            Make your day great with our special coffee!
          </h1>
          <p className="text-espresso-light/90 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
            Welcome to our coffee paradise, where every bean tells a story and every cup sparks joy.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full bg-sand text-espresso text-sm font-semibold hover:bg-coffee-light transition-colors"
            >
              Order Now
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-full border border-coffee/40 text-espresso text-sm font-semibold hover:bg-coffee hover:text-cream hover:border-coffee transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <CoffeeIllustration />
        </div>
      </section>

      <div className="twig-divider max-w-7xl mx-auto px-4 sm:px-6" />

      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl text-espresso">Menu favorites</h2>
          <Link to="/shop" className="text-sm font-semibold text-mocha-green hover:underline">
            View full menu →
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="testimonials" className="bg-cream-deep/60 py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-espresso">Testimonials</h2>
            <span className="text-sm font-semibold text-mocha-green">What guests are saying</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.title} className="rounded-3xl border border-coffee/10 bg-cream-card p-6 shadow-sm">
                <p className="text-espresso-light/90 leading-relaxed mb-6">“{item.text}”</p>
                <h3 className="font-display text-lg text-espresso">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl text-espresso">Gallery</h2>
          <span className="text-sm font-semibold text-mocha-green">A closer look</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {galleryItems.map((item, index) => (
            <div
              key={item}
              className="relative min-h-56 overflow-hidden rounded-[2rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream to-cream-deep shadow-sm"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,168,118,0.25),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(122,82,56,0.16),_transparent_38%)]" />
              <div className="absolute left-5 top-5 h-12 w-12 rounded-full bg-sand/25 border border-sand/40" />
              <div className="absolute right-4 bottom-4 h-20 w-20 rounded-full bg-coffee/10 border border-coffee/15" />
              <div className="relative z-10 flex h-full flex-col justify-end p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-mocha-green mb-2">0{index + 1}</p>
                <h3 className="font-display text-2xl text-espresso">{item}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
