import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_ACCOUNTS, ROLES } from '../services/auth.service'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import logoImg from '../assets/updated logo.png'

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'We need your email to find your account.'
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'That does not look like an email.'

  if (!password) errors.password = 'Enter your password.'
  return errors
}

function landingFor(user, from) {
  if (user.role === ROLES.admin) return '/admin'
  if (!from || from.startsWith('/admin')) return '/shop'
  return from
}

export default function Login() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from

  if (user) return <Navigate to={landingFor(user, from)} replace />

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setFormError('')
  }

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


      <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-xl">
          {/* Warm-up copy — keeps the page from reading as a bare form. */}
          
          <div className="mx-auto w-full max-w-[28rem] rounded-[2rem] border border-coffee/10 bg-cream-card p-7 shadow-sm sm:p-8">
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
