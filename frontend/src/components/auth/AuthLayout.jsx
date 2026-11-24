import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import coffeeImg from '../../assets/gallery-1.jpg'
import logoImg from '../../assets/updated logo.png'

const ease = [0.22, 1, 0.36, 1]

/**
 * Centered card shared by the Login and Register pages: a themed photo panel
 * on one half of the card, the form on the other. `imageSide` flips the
 * layout so the two screens mirror each other.
 *
 * On small screens the photo collapses to a short banner above the form.
 */
export default function AuthLayout({ imageSide = 'left', eyebrow, quote, children }) {
  const reduceMotion = useReducedMotion()
  const imageOnLeft = imageSide === 'left'

  // Card rises in; image then slides in from its own edge; form fades up.
  const cardMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease },
      }

  const imageMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: imageOnLeft ? -30 : 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease, delay: 0.1 },
      }

  const formMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease, delay: 0.2 },
      }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        {...cardMotion}
        className={`flex w-full max-w-[60rem] flex-col overflow-hidden rounded-[2rem] border border-coffee/10 bg-cream-card shadow-xl shadow-espresso/10 md:flex-row ${
          imageOnLeft ? '' : 'md:flex-row-reverse'
        }`}
      >
        {/* Photo panel */}
        <motion.aside
          {...imageMotion}
          className="relative h-44 sm:h-56 md:h-auto md:w-1/2 overflow-hidden"
        >
          <img
            src={coffeeImg}
            alt="A steaming cup of coffee on a saucer surrounded by roasted beans"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-espresso/10" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-9">
            <Link to="/" className="flex items-center gap-1 self-start">
              <img src={logoImg} alt="" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-body text-lg font-extrabold tracking-tight text-cream">
                CafeNest
              </span>
            </Link>

            <div className="hidden md:block">
              {eyebrow && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sand">
                  {eyebrow}
                </p>
              )}
              {quote && (
                <p className="font-display text-2xl leading-snug text-cream lg:text-3xl">
                  {quote}
                </p>
              )}
            </div>
          </div>
        </motion.aside>

        {/* Form panel */}
        <div className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-10 md:w-1/2">
          <motion.div {...formMotion} className="w-full max-w-sm">
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
