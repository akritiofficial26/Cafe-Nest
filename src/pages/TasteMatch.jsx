import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { QUESTIONS, recommendProducts, logTasteMatch } from '../services/recommendation.service'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/animations/ScrollReveal'

export default function TasteMatch() {
  const shouldReduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)

  const question = QUESTIONS[step]
  const isLastStep = step === QUESTIONS.length - 1

  function choose(value) {
    const nextAnswers = { ...answers, [question.id]: value }
    setAnswers(nextAnswers)

    if (isLastStep) {
      const matches = recommendProducts(nextAnswers)
      logTasteMatch(nextAnswers, matches)
      setResults(matches)
    } else {
      setStep(step + 1)
    }
  }

  function restart() {
    setAnswers({})
    setResults(null)
    setStep(0)
  }

  const stepVariants = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
      }

  if (results) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-16">
        <div className="max-w-2xl mb-10">
          <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Taste Match</p>
          <h1 className="font-display text-4xl text-espresso mb-4">Three cups we think you'll like.</h1>
          <p className="text-espresso-light/85 leading-relaxed">
            Scored against every drink on the menu using what you told us. Not a guess — just
            matching, so you can see exactly why each one made the list.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {results.map((match, index) => (
            <div key={match.product.id}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs uppercase tracking-[0.18em] text-espresso-light/60">
                  Match 0{index + 1}
                </span>
                <span className="rounded-full border border-mocha-green/15 bg-mocha-green/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-mocha-green">
                  {match.matchPercent}% match
                </span>
              </div>

              <ProductCard product={match.product} />

              {match.reasons.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {match.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="rounded-full bg-sand/20 px-3 py-1 text-[11px] font-semibold text-coffee-dark"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="md" onClick={restart}>
            Start over
          </Button>
          <Button as={Link} to="/shop" variant="sand" size="md">
            Browse the full menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-3 py-16">
      <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Taste Match</p>
      <h1 className="font-display text-4xl text-espresso mb-4">Let's find your cup.</h1>
      <p className="text-espresso-light/85 leading-relaxed mb-10">
        Five quick questions, then three drinks matched to your answers.
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-espresso-light/60 mb-3">
          <span>
            Step {step + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round((step / QUESTIONS.length) * 100)}% done</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-cream-deep"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-label="Questionnaire progress"
        >
          <div
            className="h-full rounded-full bg-mocha-green transition-all duration-500"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-2xl sm:text-3xl text-espresso mb-2">{question.prompt}</h2>
          <p className="text-sm text-espresso-light/70 mb-6">{question.help}</p>

          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                role="radio"
                aria-checked={answers[question.id] === option.value}
                onClick={() => choose(option.value)}
                className={`rounded-[1.5rem] border p-5 text-left transition-colors ${
                  answers[question.id] === option.value
                    ? 'border-mocha-green bg-mocha-green/8'
                    : 'border-coffee/15 bg-cream-card hover:border-coffee'
                }`}
              >
                <span className="block font-display text-xl text-espresso mb-1">{option.label}</span>
                <span className="block text-sm text-espresso-light/80">{option.description}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <div className="mt-8">
          <Button variant="outline" size="md" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        </div>
      )}
    </div>
  )
}
