import React, { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerRequest } from '../services/auth.service'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'

const MIN_PASSWORD = 8

function validate({ name, email, password }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Tell us what to call you.'
  else if (name.trim().length < 2) errors.name = 'That name looks a little short.'

  if (!email.trim()) errors.email = 'We need an email for your account.'
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'That does not look like an email.'

  if (!password) errors.password = 'Choose a password.'
  else if (password.length < MIN_PASSWORD)
    errors.password = `Use at least ${MIN_PASSWORD} characters.`
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.password = 'Mix in at least one letter and one number.'

  return errors
}

export default function Register() {
  const { user } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/shop" replace />

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
    const result = await registerRequest({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    })
    setSubmitting(false)
    if (result.error) setFormError(result.error)
  }

  return (
    <AuthLayout
      imageSide="right"
      eyebrow="Join the CafeNest family"
      quote="Good coffee, good company — and a seat saved just for you."
    >
      <h1 className="mb-5 font-display text-3xl text-espresso">Create account</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="name"
          label="Full name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
          placeholder="Your name"
          autoComplete="name"
        />

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
          placeholder={`At least ${MIN_PASSWORD} characters`}
          autoComplete="new-password"
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
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-center text-xs text-espresso-light/60">
          By signing up you agree to our terms.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-light/70">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-coffee-dark hover:underline"
        >
          Sign in
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
