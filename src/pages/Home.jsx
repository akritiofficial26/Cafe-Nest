import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import products from '../services/product.service'
import ProductCard from '../components/ui/ProductCard'
import { getReviews } from '../services/review.service'
import ReviewCard from '../components/ui/ReviewCard'
import heroImg from '../assets/coffee-hero-section.png'
import aboutImage from '../assets/about-image.jpg'
import gallery1 from '../assets/gallery-1.jpg'
import gallery3 from '../assets/gallery-3.jpg'
import gallery6 from '../assets/gallery-6.jpg'
import hotBeverages from '../assets/hot-beverages.png'
import coldBeverages from '../assets/cold-beverages.png'
import ScrollReveal from '../components/animations/ScrollReveal'
import { StaggerGrid, StaggerItem } from '../components/animations/StaggerGrid'

function CoffeeIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[31rem]">
      <div className="absolute inset-0 rounded-full bg-sand/20 blur-3xl" />
      <div className="absolute left-8 top-12 h-3 w-3 rounded-full bg-sand/80" />
      <div className="absolute right-10 top-10 h-2.5 w-2.5 rounded-full bg-coffee/70" />
      <div className="absolute left-2 top-28 h-2 w-2 rounded-full bg-coffee-light/70" />
      <img
        src={heroImg}
        alt="Coffee hero section illustration"
        className="relative z-10 w-full drop-shadow-[0_20px_45px_rgba(58,42,32,0.16)]"
      />
    </div>
  )
}

const galleryItems = [
  {
    title: 'Morning pour',
    text: 'The first cup of the day, served in warm light.',
    image: heroImg,
  },
  {
    title: 'Latte art close-up',
    text: 'A hand-finished cup with a smooth, silky top.',
    image: gallery1,
  },
  {
    title: 'Room to breathe',
    text: 'Soft corners and calm textures for slow conversations.',
    image: aboutImage,
  },
  {
    title: 'Fresh brew line-up',
    text: 'Hot drinks waiting behind the counter before the rush.',
    image: hotBeverages,
  },
  {
    title: 'Chilled pause',
    text: 'Cold drinks for the slower part of the afternoon.',
    image: coldBeverages,
  },
  {
    title: 'Shared table moments',
    text: 'Coffee, notes, and a table that stays open a while.',
    image: gallery3,
  },
  {
    title: 'Warm pastry corner',
    text: 'A quiet bite and one more cup before heading out.',
    image: gallery6,
  },
]

export default function Home() {
  const featured = products.slice(0, 4)
  const reviews = getReviews().slice(0, 3)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div>
      <section id="home" className="max-w-7xl mx-auto px-2 sm:px-3 pt-14 sm:pt-20 pb-14 lg:pb-18 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
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
              to="/contact"
              className="px-6 py-3 rounded-full border border-coffee/40 text-espresso text-sm font-semibold hover:bg-coffee hover:text-cream hover:border-coffee transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex justify-center lg:justify-end"
        >
          <CoffeeIllustration />
        </motion.div>
      </section>

      <div className="twig-divider max-w-7xl mx-auto px-4 sm:px-6" />

      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-espresso">Menu favorites</h2>
            <Link to="/shop" className="text-sm font-semibold text-mocha-green hover:underline">
              View full menu →
            </Link>
          </div>
        </ScrollReveal>

        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section id="feedback" className="bg-cream-deep/60 py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-display text-2xl sm:text-3xl text-espresso">Feedback</h2>
              <Link to="/feedback" className="text-sm font-semibold text-mocha-green hover:underline">
                View all feedback →
              </Link>
            </div>
          </ScrollReveal>
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <StaggerItem key={review.id}>
                <ReviewCard review={review} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

    </div>
  )
}