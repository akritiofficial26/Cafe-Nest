import React from 'react'
import { Link } from 'react-router-dom'
import products from '../services/product.service'
import ProductCard from '../components/ui/ProductCard'
import testimonials from '../services/testimonials.service'

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

const galleryItems = ['Morning pour', 'Latte art', 'Beans ready', 'Quiet table']

export default function Home() {
  const featured = products.slice(0, 4)

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
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="feedback" className="bg-cream-deep/60 py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-espresso">Feedback</h2>
            <Link to="/feedback" className="text-sm font-semibold text-mocha-green hover:underline">
              View all feedback →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[2rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream-card to-cream-deep p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(58,42,32,0.12)]"
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-mocha-green/8" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sand via-mocha-green to-coffee" />
                <div className="relative mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mocha-green text-cream shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <span className="font-display text-2xl leading-none">“</span>
                  </div>
                  <span className="rounded-full border border-mocha-green/15 bg-mocha-green/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mocha-green">
                    Guest review
                  </span>
                </div>
                <p className="relative text-espresso-light/90 leading-relaxed mb-8 text-[0.98rem]">
                  {item.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coffee text-cream font-display text-sm shadow-sm">
                    {item.title
                      .split(',')[0]
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-espresso leading-tight">{item.title}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-espresso-light/60">CafeNest visitor</p>
                  </div>
                </div>
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
