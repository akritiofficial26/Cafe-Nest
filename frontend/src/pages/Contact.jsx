import React, { useState } from 'react'
import { createMessage } from '../services/contact.service'
import { CAFE_INFO } from '../services/cafe.service'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ScrollReveal from '../components/animations/ScrollReveal'

/**
 * Client-side only. Rules §1 still requires the backend to validate and
 * sanitise everything when this becomes a real endpoint.
 */
function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Tell us who you are.'

  if (!email.trim()) errors.email = 'We need an email to reply to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'That does not look like an email address.'
  }

  if (!message.trim()) errors.message = 'Let us know what you need.'
  else if (message.trim().length < 10) errors.message = 'A little more detail would help.'

  return errors
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setSent(false)
  }

  function submit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    createMessage(form)
    setForm({ name: '', email: '', message: '' })
    setSent(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <ScrollReveal>
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-mocha-green mb-3">Get in touch</p>
          <h1 className="font-display text-4xl sm:text-5xl text-espresso leading-tight mb-4">
            Come by, or just say hello.
          </h1>
          <p className="text-espresso-light/85 text-base leading-relaxed">
            Questions about the menu, a large order, or a quiet corner for an afternoon of work —
            send a note and we will get back to you.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <form
          onSubmit={submit}
          noValidate
          className="rounded-[2rem] border border-coffee/10 bg-cream-card p-6 sm:p-8 shadow-sm"
        >
          <h2 className="font-display text-2xl text-espresso mb-6">Send a message</h2>

          <div className="space-y-5">
            <Input
              id="contact-name"
              label="Your name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
              placeholder="Who are we speaking with?"
              autoComplete="name"
            />

            <Input
              id="contact-email"
              type="email"
              label="Email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              id="contact-message"
              as="textarea"
              rows={5}
              label="Message"
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              error={errors.message}
              placeholder="How can we help?"
            />
          </div>

          <Button type="submit" variant="green" size="block" className="mt-6">
            Send message
          </Button>

          {sent && (
            <p
              role="status"
              className="mt-4 rounded-2xl border border-mocha-green/20 bg-mocha-green/8 px-4 py-3 text-sm text-mocha-green"
            >
              Thanks — your message is with us. We usually reply within a day.
            </p>
          )}
        </form>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream-card to-cream-deep p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mocha-green font-semibold mb-3">
              Visit us
            </p>
            <p className="text-sm text-espresso-light/85 leading-7">
              {CAFE_INFO.address.line1}
              <br />
              {CAFE_INFO.address.line2}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream-card to-cream-deep p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mocha-green font-semibold mb-3">
              Hours
            </p>
            <p className="text-sm text-espresso-light/85 leading-7">
              {CAFE_INFO.hours.map((slot, index) => (
                <React.Fragment key={slot.days}>
                  {slot.days}: {slot.time}
                  {index < CAFE_INFO.hours.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-coffee/10 bg-gradient-to-br from-cream-card via-cream-card to-cream-deep p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mocha-green font-semibold mb-3">
              Say hello
            </p>
            <div className="space-y-2 text-sm text-espresso-light/85">
              <a
                href={`mailto:${CAFE_INFO.email}`}
                className="block hover:text-coffee-dark transition-colors"
              >
                {CAFE_INFO.email}
              </a>
              <a href={CAFE_INFO.phoneHref} className="block hover:text-coffee-dark transition-colors">
                {CAFE_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
