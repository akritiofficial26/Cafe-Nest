import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ScrollReveal from '../components/animations/ScrollReveal'
import { StaggerGrid, StaggerItem } from '../components/animations/StaggerGrid'
import coffeeHero from '../assets/coffee-hero-section.png'
import aboutImage from '../assets/about-image.jpg'
import gallery1 from '../assets/gallery-1.jpg'
import gallery3 from '../assets/gallery-3.jpg'
import gallery6 from '../assets/gallery-6.jpg'
import hotBeverages from '../assets/hot-beverages.png'
import coldBeverages from '../assets/cold-beverages.png'

const galleryShots = [
  {
    title: 'Morning ritual',
    text: 'The first pour of the day, warm light, and a quiet table by the window.',
    image: coffeeHero,
  },
  {
    title: 'Room to breathe',
    text: 'Soft corners, long shadows, and a pace that never feels rushed.',
    image: aboutImage,
  },
  {
    title: 'Latte art close-up',
    text: 'A textured finish that makes every cup feel hand-built.',
    image: gallery1,
  },
  {
    title: 'Fresh brew line-up',
    text: 'Hot drinks waiting behind the counter before the lunch rush arrives.',
    image: hotBeverages,
  },
  {
    title: 'Chilled pause',
    text: 'Cold drinks and a slower afternoon, served with ice and intention.',
    image: coldBeverages,
  },
  {
    title: 'Shared table moments',
    text: 'A place for conversation, notebooks, and one more round of coffee.',
    image: gallery3,
  },
  {
    title: 'Warm pastry corner',
    text: 'A quiet bite for the middle of the day and a second cup after it.',
    image: gallery6,
  },
]

function GalleryCard({ shot, featured = false }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-[2rem] border border-coffee/10 bg-cream-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(58,42,32,0.12)] ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
    >
      <img
        src={shot.image}
        alt={shot.title}
        className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
          featured ? 'min-h-[24rem]' : 'min-h-72'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/20 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-cream">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">CafeNest frame</p>
        <h3 className="font-display text-2xl sm:text-3xl leading-tight">{shot.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/82">{shot.text}</p>
      </figcaption>
    </figure>
  )
}

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="overflow-hidden">
      <section className="relative max-w-7xl mx-auto px-3 sm:px-4 pt-14 sm:pt-18 pb-12">
        <div className="absolute left-0 top-10 h-44 w-44 rounded-full bg-sand/20 blur-3xl" />
        <div className="absolute right-6 top-16 h-56 w-56 rounded-full bg-mocha-green/12 blur-3xl" />

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center relative">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="uppercase text-xs tracking-[0.24em] text-mocha-green font-semibold mb-4">Gallery</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-espresso mb-6">
              Moments, cups, and corners from CafeNest.
            </h1>
            <p className="text-espresso-light/90 leading-relaxed max-w-xl mb-8">
              A small collection of the room, the drinks, and the in-between details that make the cafe
              feel lived in. Everything here is meant to feel warm, tactile, and a little slow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-6 py-3 rounded-full bg-sand text-espresso text-sm font-semibold hover:bg-coffee-light transition-colors"
              >
                Explore the menu
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-full border border-coffee/40 text-espresso text-sm font-semibold hover:bg-coffee hover:text-cream hover:border-coffee transition-colors"
              >
                Our story
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="relative"
          >
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[2.5rem] bg-coffee/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-coffee/10 bg-cream-card shadow-[0_24px_60px_rgba(58,42,32,0.14)]">
              <img
                src={gallery1}
                alt="CafeNest latte art close-up"
                className="h-full w-full object-cover min-h-[24rem] sm:min-h-[30rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cream backdrop-blur-sm">
                Fresh frame
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-cream">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-sand">Captured mood</p>
                  <p className="font-display text-2xl sm:text-3xl mt-1">Quiet, warm, and hand-finished</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-sand">Collection</p>
                  <p className="text-lg font-semibold">07 images</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="twig-divider max-w-7xl mx-auto px-4 sm:px-6" />

      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-16">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-espresso">Featured shots</h2>
            <span className="text-sm font-semibold text-mocha-green">Animated grid</span>
          </div>
        </ScrollReveal>

        <StaggerGrid className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[18rem]">
          {galleryShots.map((shot, index) => (
            <StaggerItem key={shot.title}>
              <GalleryCard shot={shot} featured={index === 0} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 pb-20">
        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { label: 'Best light', value: 'Golden hour windows' },
              { label: 'Best moment', value: 'First pour of the day' },
              { label: 'Best reason', value: 'A place that invites you to stay' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[2rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream-card to-cream-deep p-6 shadow-sm"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-mocha-green mb-3">{item.label}</p>
                <p className="font-display text-2xl text-espresso leading-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}