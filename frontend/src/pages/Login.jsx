import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../services/auth.service'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'

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
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from

  if (user) return <Navigate to={landingFor(user, from)} replace />

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const result = await signIn({ email: form.email, password: form.password })
    setSubmitting(false)
    if (result.error) {
      setFormError(result.error)
      return
    }

    navigate(landingFor(result.user, from), { replace: true })
  }

  return (
    <AuthLayout
      imageSide="left"
      eyebrow="Freshly brewed, every day"
      quote="Your favourite cup is waiting. Pull up a chair."
    >
      <div className="mb-6">
        <h1 className="font-display text-3xl text-espresso">Welcome back</h1>
        <p className="mt-2 text-sm text-espresso-light/70">
          Sign in to your CafeNest account to order, track and review.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

        <PasswordInput
          id="password"
          label="Password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
        />

        {formError && (
          <p
            role="alert"
            className="rounded-2xl border border-coffee-dark/30 bg-coffee/10 px-4 py-3 text-sm text-coffee-dark"
          >
            {formError}
          </p>
        )}

        <Button type="submit" variant="green" size="block" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-light/70">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-coffee-dark hover:underline"
        >
          Create one
        </Link>
      </p>

      <p className="mt-3 text-center text-sm">
        <Link to="/" className="text-espresso-light/60 hover:text-coffee-dark transition-colors">
          ← Back to home
        </Link>
      </p>
    </AuthLayout>
  )
}
