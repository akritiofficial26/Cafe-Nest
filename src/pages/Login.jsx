import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_ACCOUNTS, ROLES } from '../services/auth.service'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import logoImg from '../assets/updated logo.png'

/**
 * Client-side only, like Checkout's validate(). These checks are a courtesy to
 * the visitor, not a security boundary — auth.service owns the actual match.
 */
function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'We need your email to find your account.'
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'That does not look like an email.'

  if (!password) errors.password = 'Enter your password.'
  return errors
}

/**
 * Where a role belongs once signed in. Admins always go to their dashboard —
 * a `from` of /shop is not somewhere an admin was trying to reach.
 *
 * A customer's `from` is honoured except when it points at /admin: sending
 * them back there would hand them a 404 the instant after a successful login.
 */
function landingFor(user, from) {
  if (user.role === ROLES.admin) return '/admin'
  if (!from || from.startsWith('/admin')) return '/shop'
  return from
}

/** Renders full screen, outside the site Navbar/Footer (see App.jsx). */
export default function Login() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Set by RequireAuth when it bounces someone off a gated route.
  const from = location.state?.from

  // Already signed in — no reason to show the form again.
  if (user) return <Navigate to={landingFor(user, from)} replace />

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear a field's error as soon as the visitor starts correcting it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setFormError('')
  }

  /**
   * Fills the form from a demo chip rather than signing in immediately, so the
   * credentials stay visible and editable.
   */
  function useDemo(account) {
    setForm({ email: account.email, password: account.password })
    setErrors({})
    setFormError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const result = signIn({ email: form.email, password: form.password })
    if (result.error) {
      setFormError(result.error)
      return
    }

    navigate(landingFor(result.user, from), { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Minimal header — the site Navbar is not available here, so the brand
          doubles as the way back to the public landing page. */}
      <header className="px-5 sm:px-8 py-5">
        <Link to="/" className="inline-flex items-center gap-0">
          <img
            src={logoImg}
            alt="CafeNest logo"
            className="h-14 w-14 rounded-full object-cover"
          />
          <span className="-ml-2 font-body text-xl font-extrabold tracking-tight text-espresso">
            CafeNest
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8">
        <div className="w-full max-w-5xl grid gap-12 lg:grid-cols-[1fr_26rem] lg:items-center">
          {/* Warm-up copy — keeps the page from reading as a bare form. */}
          <div className="hidden lg:block">
            <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">
              Members only
            </p>
            <h1 className="font-display text-5xl leading-tight text-espresso mb-6">
              Sign in for
              <br />
              the whole menu.
            </h1>
            <p className="text-espresso-light/80 leading-relaxed max-w-md mb-8">
              CafeNest is members-only. Sign in to browse the menu, build an order and check out —
              your cart and taste profile stay with your account.
            </p>

            <div className="twig-divider max-w-xs" />

            <ul className="mt-8 space-y-3 text-sm text-espresso-light/75">
              {[
                'The full menu and every product page',
                'Cart, checkout and order history',
                'Taste Match picks and feedback',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sand" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-coffee/10 bg-cream-card p-7 sm:p-9 shadow-sm">
            <div className="mb-7 text-center">
              <h2 className="font-display text-3xl text-espresso">Welcome back</h2>
              <p className="text-sm text-espresso-light/70 mt-2">
                Sign in to your CafeNest account.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Input
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  error={errors.password}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="[&_input]:pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  className="absolute right-4 top-[2.4rem] text-xs font-semibold uppercase tracking-[0.12em] text-espresso-light/60 hover:text-coffee-dark transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-2xl border border-coffee-dark/30 bg-coffee/10 px-4 py-3 text-sm text-coffee-dark"
                >
                  {formError}
                </p>
              )}

              <Button type="submit" variant="green" size="block">
                Sign in
              </Button>
            </form>

            {/* Demo credentials — prototype scaffolding, removed the moment
                real accounts exist. */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-coffee/15" />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-espresso-light/55">
                  Demo accounts
                </span>
                <span className="h-px flex-1 bg-coffee/15" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => useDemo(account)}
                    className="rounded-2xl border border-coffee/20 bg-cream px-4 py-3 text-left transition-colors hover:border-mocha-green hover:bg-mocha-green/5"
                  >
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-mocha-green">
                      {account.role === ROLES.admin ? 'Admin' : 'Customer'}
                    </span>
                    <span className="mt-1 block truncate text-xs text-espresso-light/75">
                      {account.email}
                    </span>
                    <span className="block text-xs text-espresso-light/55">
                      {account.password}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-espresso-light/60">
                Tap one to fill the form, then sign in.
              </p>
            </div>

            <p className="mt-7 text-center text-sm text-espresso-light/70">
              <Link to="/" className="font-semibold text-coffee-dark hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
