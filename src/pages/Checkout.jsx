import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/order.service'
import { calculateBill, FULFILMENT } from '../utils/bill'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { formatCurrency } from '../utils/formatCurrency'

const togglePillClass = 'px-4 py-2 rounded-full text-sm font-semibold border transition-colors'

/**
 * Client-side only for now. Rules §1 requires the backend to validate every
 * input regardless of what happens here — these checks are a courtesy to the
 * customer, not a security boundary.
 */
function validate({ name, phone, fulfilment, address }) {
  const errors = {}
  if (!name.trim()) errors.name = 'We need a name for the order.'

  const digits = phone.replace(/\D/g, '')
  if (!digits) errors.phone = 'A phone number lets us tell you it is ready.'
  else if (digits.length < 10) errors.phone = 'That looks too short — 10 digits please.'

  if (fulfilment === FULFILMENT.delivery && !address.trim()) {
    errors.address = 'We need an address to deliver to.'
  }
  return errors
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    fulfilment: FULFILMENT.delivery,
    address: '',
  })
  const [errors, setErrors] = useState({})

  const bill = calculateBill(totalPrice, form.fulfilment)

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso mb-4">Nothing to check out yet.</h1>
        <p className="text-espresso-light/80 mb-8">
          Add something from the menu and we will get this order moving.
        </p>
        <Button as={Link} to="/shop" variant="green" size="lg" className="inline-block">
          Browse the menu
        </Button>
      </div>
    )
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear a field's error as soon as the customer starts correcting it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const order = createOrder({
      items,
      bill,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        fulfilment: form.fulfilment,
        address: form.fulfilment === FULFILMENT.delivery ? form.address.trim() : null,
      },
    })

    clearCart()
    navigate(`/order-confirmation/${order.id}`)
  }

  const isDelivery = form.fulfilment === FULFILMENT.delivery

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Checkout</p>
      <h1 className="font-display text-4xl text-espresso mb-10">Almost yours.</h1>

      <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="rounded-[2rem] border border-coffee/10 bg-cream-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-2xl text-espresso mb-6">Your details</h2>

          <div className="space-y-5">
            <Input
              id="name"
              label="Name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
              placeholder="Who is this order for?"
              autoComplete="name"
            />

            <Input
              id="phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              error={errors.phone}
              placeholder="10-digit mobile number"
              autoComplete="tel"
            />

            <div>
              <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-espresso-light/70">
                How would you like it?
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Fulfilment method">
                {[
                  { value: FULFILMENT.delivery, label: 'Deliver to me' },
                  { value: FULFILMENT.pickup, label: 'I will pick it up' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={form.fulfilment === option.value}
                    onClick={() => update('fulfilment', option.value)}
                    className={`${togglePillClass} ${
                      form.fulfilment === option.value
                        ? 'bg-mocha-green text-cream border-mocha-green'
                        : 'border-coffee/30 text-espresso hover:border-coffee'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-espresso-light/60">
                {isDelivery
                  ? `Delivery adds ${formatCurrency(bill.deliveryFee)} to your total.`
                  : 'No delivery fee on pickup orders.'}
              </p>
            </div>

            {isDelivery && (
              <Input
                id="address"
                as="textarea"
                rows={3}
                label="Delivery address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                error={errors.address}
                placeholder="Flat, street, landmark"
                autoComplete="street-address"
              />
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-coffee/10 bg-cream-card p-5 sm:p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-mocha-green font-semibold mb-2">Order summary</p>
          <h2 className="font-display text-2xl text-espresso mb-5">
            {items.length} item{items.length > 1 ? 's' : ''}
          </h2>

          <ul className="space-y-3 mb-5 text-sm text-espresso-light/85">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-4">
                <span className="min-w-0">
                  {item.quantity} × {item.name}
                  {item.size && <span className="text-espresso-light/60"> · {item.size}</span>}
                </span>
                <span className="shrink-0">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-coffee/15 pt-4 text-sm text-espresso-light/85">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Delivery fee</span>
              <span>{bill.deliveryFee === 0 ? 'Free' : formatCurrency(bill.deliveryFee)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Service fee</span>
              <span>{formatCurrency(bill.serviceFee)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Tax</span>
              <span>{formatCurrency(bill.tax)}</span>
            </div>
          </div>

          <div className="flex justify-between font-display text-xl text-espresso border-t border-coffee/15 pt-4 mt-5 mb-6">
            <span>Total</span>
            <span>{formatCurrency(bill.total)}</span>
          </div>

          <Button type="submit" variant="green" size="block">
            Place order
          </Button>

          <Link
            to="/cart"
            className="mt-4 block text-center text-sm text-espresso-light/70 hover:text-coffee-dark transition-colors"
          >
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  )
}
