/**
 * Orders — localStorage shim.
 *
 * Deliberately throwaway: this stands in for `POST /api/v1/orders` until the
 * backend exists. Everything the UI needs goes through these three functions,
 * so replacing the bodies with fetch calls is the whole migration.
 *
 * Mirrors the `orders` / `order_items` tables from Architecture §4, including
 * price_at_purchase — the price is copied onto each line so a historical order
 * stays accurate even if the menu price changes later.
 */
const ORDERS_KEY = 'cafenest_orders'
const ORDER_LIMIT = 20

function readOrders() {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

/** Short, human-readable reference a customer could read out at the counter. */
function generateOrderId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CN-${random}`
}

export function createOrder({ items, bill, customer }) {
  const order = {
    id: generateOrderId(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    customer,
    bill,
    items: items.map((item) => ({
      productId: item.id,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    })),
  }

  try {
    const next = [order, ...readOrders()].slice(0, ORDER_LIMIT)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
  } catch {
    /* storage full or unavailable — the order object is still returned so the
       confirmation screen works for this session */
  }

  return order
}

export function getOrderById(id) {
  return readOrders().find((o) => o.id === id)
}

export function getOrders() {
  return readOrders()
}
