/**
 * Single source of truth for order totals.
 *
 * Rules §2/§3 keep business logic out of components — the Cart page and the
 * Checkout page both read their numbers from here, so they can never drift.
 *
 * Delivery is the default so the Cart page (which has no fulfilment choice)
 * shows exactly the same figures it always has; Checkout recomputes once the
 * customer picks pickup.
 */
export const SERVICE_FEE = 20
export const DELIVERY_FEE = 30
export const TAX_RATE = 0.05

export const FULFILMENT = {
  delivery: 'delivery',
  pickup: 'pickup',
}

export function calculateBill(subtotal, fulfilment = FULFILMENT.delivery) {
  const deliveryFee = fulfilment === FULFILMENT.delivery ? DELIVERY_FEE : 0
  const tax = Math.round(subtotal * TAX_RATE)

  return {
    subtotal,
    deliveryFee,
    serviceFee: SERVICE_FEE,
    tax,
    total: subtotal + deliveryFee + SERVICE_FEE + tax,
    fulfilment,
  }
}
