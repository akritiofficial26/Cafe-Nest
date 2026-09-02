import { getSession } from './auth.service'
import { calculateBill, FULFILMENT } from '../utils/bill'

/**
 * Orders — localStorage shim.
 *
 * Deliberately throwaway: this stands in for `/api/v1/orders` until the
 * backend exists. Everything the customer flow and the admin panel need goes
 * through the functions below, so replacing their bodies with fetch calls is
 * the whole migration.
 *
 * Mirrors the `orders` / `order_items` tables from Architecture §4, including
 * price_at_purchase — the price is copied onto each line so a historical order
 * stays accurate even if the menu price changes later.
 *
 * NOTE ON SCOPE: localStorage is per-browser, so the admin panel can only see
 * orders placed in the same browser. That is a property of the shim, not of
 * the panel — a real backend fixes it without touching the UI.
 */
const ORDERS_KEY = 'cafenest_orders'
const SEEDED_KEY = 'cafenest_orders_seeded'
const ORDER_LIMIT = 100

/** Fired after every write so open admin views can re-read in the same tab. */
const ORDERS_EVENT = 'cafenest:orders-changed'

/**
 * The order lifecycle. `pending` → `preparing` → `ready` → `completed`, with
 * `cancelled` reachable from any live status.
 *
 * The live admin queue is everything in ACTIVE_STATUSES; the history page is
 * everything in FINISHED_STATUSES. Those two sets are exhaustive and disjoint,
 * so no order can be missing from both pages or show up on both.
 */
export const ORDER_STATUS = {
  pending: 'pending',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
}

export const ACTIVE_STATUSES = [
  ORDER_STATUS.pending,
  ORDER_STATUS.preparing,
  ORDER_STATUS.ready,
]

export const FINISHED_STATUSES = [ORDER_STATUS.completed, ORDER_STATUS.cancelled]

/** The single forward step from each live status. Terminal statuses are absent. */
export const NEXT_STATUS = {
  [ORDER_STATUS.pending]: ORDER_STATUS.preparing,
  [ORDER_STATUS.preparing]: ORDER_STATUS.ready,
  [ORDER_STATUS.ready]: ORDER_STATUS.completed,
}

/** Verb for the button that performs NEXT_STATUS[status]. */
export const NEXT_STATUS_ACTION = {
  [ORDER_STATUS.pending]: 'Accept & start',
  [ORDER_STATUS.preparing]: 'Mark ready',
  [ORDER_STATUS.ready]: 'Complete',
}

export const STATUS_LABELS = {
  [ORDER_STATUS.pending]: 'New',
  [ORDER_STATUS.preparing]: 'Preparing',
  [ORDER_STATUS.ready]: 'Ready',
  [ORDER_STATUS.completed]: 'Completed',
  [ORDER_STATUS.cancelled]: 'Cancelled',
}

export function isActive(order) {
  return ACTIVE_STATUSES.includes(order?.status)
}

/**
 * "Ready" means two different things depending on fulfilment, and a barista
 * reading the queue needs to know which. Every other status reads the same
 * either way, so only this one branches.
 */
export function statusLabel(order) {
  if (order?.status !== ORDER_STATUS.ready) return STATUS_LABELS[order?.status] ?? 'Unknown'
  return order.customer?.fulfilment === FULFILMENT.pickup ? 'Ready for pickup' : 'Out for delivery'
}

/* ------------------------------------------------------------------ storage */

function emit() {
  try {
    window.dispatchEvent(new Event(ORDERS_EVENT))
  } catch {
    /* non-browser environment — nothing is listening anyway */
  }
}

/** Stands in for a missing bill so a total is always a number to format. */
const EMPTY_BILL = {
  subtotal: 0,
  deliveryFee: 0,
  serviceFee: 0,
  tax: 0,
  total: 0,
  fulfilment: FULFILMENT.pickup,
}

/**
 * Brings a stored record up to the current shape. Orders written before the
 * status lifecycle existed carry `status: 'confirmed'`, which is the same
 * state as a brand-new order, so they map to `pending` rather than being
 * dropped or shown as unknown.
 *
 * The defaults below matter because storage is hand-editable: one truncated
 * record should cost the admin that order's details, not the whole panel to a
 * render error.
 */
function normalizeOrder(order) {
  if (!order || !order.id) return null

  const known = Object.values(ORDER_STATUS)
  const status = known.includes(order.status) ? order.status : ORDER_STATUS.pending

  return {
    ...order,
    status,
    createdAt: order.createdAt ?? new Date(0).toISOString(),
    customer: {
      name: 'Unknown',
      phone: '',
      fulfilment: FULFILMENT.pickup,
      address: null,
      ...(order.customer ?? {}),
    },
    bill: { ...EMPTY_BILL, ...(order.bill ?? {}) },
    items: Array.isArray(order.items) ? order.items : [],
    statusHistory:
      Array.isArray(order.statusHistory) && order.statusHistory.length > 0
        ? order.statusHistory
        : [{ status, at: order.createdAt }],
  }
}

/** Newest first. The admin lists and the customer's own history all want this. */
function byNewest(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt)
}

function writeOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, ORDER_LIMIT)))
  } catch {
    /* storage full or unavailable — callers still get their return value, so
       the current page keeps working; only persistence is lost */
  }
  emit()
}

function readOrders() {
  seedOnce()
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.map(normalizeOrder).filter(Boolean).sort(byNewest)
  } catch {
    return []
  }
}

/* --------------------------------------------------------------- demo seeds */

/**
 * Demo content, in the spirit of review.service's SEED_REVIEWS: without it the
 * admin panel is an empty table on first load, which makes it impossible to
 * tell a working page from a broken one.
 *
 * Written once and then owned by the user — they are ordinary orders after
 * that, advanceable and cancellable like any other. `seeded: true` is kept
 * only so the UI can label them as demo data. Timestamps are relative to first
 * load, so the queue always looks like it belongs to the current shift.
 */
const SEED_BLUEPRINTS = [
  {
    id: 'CN-8QK2ZP',
    minutesAgo: 3,
    status: ORDER_STATUS.pending,
    customer: {
      name: 'Ishita Raman',
      phone: '98123 45671',
      fulfilment: FULFILMENT.delivery,
      address: '4B Rajpur Road, near Ekta Vihar',
    },
    lines: [
      ['p2', 'Salted Caramel Latte', 'Large', 1, 260],
      ['p7', 'Butter Croissant', null, 2, 140],
    ],
  },
  {
    id: 'CN-M4TR7C',
    minutesAgo: 11,
    status: ORDER_STATUS.pending,
    customer: {
      name: 'Devansh Bhatt',
      phone: '90876 12234',
      fulfilment: FULFILMENT.pickup,
      address: null,
    },
    lines: [['p3', 'Cold Brew Nest', 'Regular', 2, 210]],
  },
  {
    id: 'CN-VD91XB',
    minutesAgo: 22,
    status: ORDER_STATUS.preparing,
    customer: {
      name: 'Meera Kaushik',
      phone: '99110 55408',
      fulfilment: FULFILMENT.delivery,
      address: '17 Maple Lane, second floor',
    },
    lines: [
      ['p4', 'Mocha Green Matcha', 'Large', 1, 280],
      ['p6', 'Cinnamon Chai Latte', 'Small', 1, 170],
      ['p8', 'Almond Biscotti', null, 1, 110],
    ],
  },
  {
    id: 'CN-3JLW6H',
    minutesAgo: 38,
    status: ORDER_STATUS.ready,
    customer: {
      name: 'Rohan Iyer',
      phone: '87654 33120',
      fulfilment: FULFILMENT.pickup,
      address: null,
    },
    lines: [['p1', 'Classic Cappuccino', 'Regular', 1, 180]],
  },
  {
    id: 'CN-QP47DA',
    minutesAgo: 95,
    status: ORDER_STATUS.completed,
    customer: {
      name: 'Aarav Sharma',
      phone: '98765 43210',
      fulfilment: FULFILMENT.delivery,
      address: '9 Old Market Square, flat 3',
    },
    placedBy: { id: 'u2', name: 'Aarav Sharma', email: 'user@cafenest.com' },
    lines: [
      ['p5', 'Hazelnut Flat White', 'Large', 2, 240],
      ['p7', 'Butter Croissant', null, 1, 140],
    ],
  },
  {
    id: 'CN-ZT08KE',
    minutesAgo: 160,
    status: ORDER_STATUS.completed,
    customer: {
      name: 'Simran Kaur',
      phone: '70123 99845',
      fulfilment: FULFILMENT.pickup,
      address: null,
    },
    lines: [['p6', 'Cinnamon Chai Latte', 'Regular', 3, 190]],
  },
  {
    id: 'CN-LB52NR',
    minutesAgo: 300,
    status: ORDER_STATUS.cancelled,
    customer: {
      name: 'Tanvi Deshpande',
      phone: '88990 21763',
      fulfilment: FULFILMENT.delivery,
      address: '22 Chakrata Road',
    },
    lines: [['p3', 'Cold Brew Nest', 'Large', 1, 250]],
  },
  {
    id: 'CN-Y67FGS',
    minutesAgo: 1500,
    status: ORDER_STATUS.completed,
    customer: {
      name: 'Kabir Nanda',
      phone: '96541 00238',
      fulfilment: FULFILMENT.delivery,
      address: '5 Sahastradhara Road',
    },
    lines: [
      ['p1', 'Classic Cappuccino', 'Small', 2, 160],
      ['p8', 'Almond Biscotti', null, 2, 110],
    ],
  },
  {
    id: 'CN-RA13WU',
    minutesAgo: 2900,
    status: ORDER_STATUS.completed,
    customer: {
      name: 'Nikhil Verma',
      phone: '78450 66319',
      fulfilment: FULFILMENT.pickup,
      address: null,
    },
    lines: [['p2', 'Salted Caramel Latte', 'Regular', 1, 220]],
  },
  {
    id: 'CN-HE29OM',
    minutesAgo: 4400,
    status: ORDER_STATUS.completed,
    customer: {
      name: 'Priya Menon',
      phone: '93027 41158',
      fulfilment: FULFILMENT.delivery,
      address: '31 Ballupur Chowk',
    },
    lines: [
      ['p4', 'Mocha Green Matcha', 'Regular', 2, 240],
      ['p6', 'Cinnamon Chai Latte', 'Large', 1, 230],
    ],
  },
]

/** Six minutes between steps — long enough to read as a real kitchen pace. */
const SEED_STEP_MS = 6 * 60 * 1000

/**
 * Replays the lifecycle from `pending` up to `status`, so a seeded order has a
 * plausible audit trail rather than a single entry. Cancellations skip
 * straight from `pending`, which is where most real ones happen.
 */
function buildSeedHistory(status, createdAt) {
  const start = new Date(createdAt).getTime()
  const chain = [ORDER_STATUS.pending]

  if (status === ORDER_STATUS.cancelled) {
    chain.push(ORDER_STATUS.cancelled)
  } else {
    let current = ORDER_STATUS.pending
    while (current !== status && NEXT_STATUS[current]) {
      current = NEXT_STATUS[current]
      chain.push(current)
    }
  }

  return chain.map((entry, index) => ({
    status: entry,
    at: new Date(start + index * SEED_STEP_MS).toISOString(),
  }))
}

function buildSeedOrder(blueprint) {
  const items = blueprint.lines.map(([productId, name, size, quantity, priceAtPurchase]) => ({
    productId,
    name,
    size,
    quantity,
    priceAtPurchase,
  }))

  const subtotal = items.reduce((total, item) => total + item.priceAtPurchase * item.quantity, 0)
  const createdAt = new Date(Date.now() - blueprint.minutesAgo * 60 * 1000).toISOString()

  return {
    id: blueprint.id,
    status: blueprint.status,
    createdAt,
    customer: blueprint.customer,
    placedBy: blueprint.placedBy ?? null,
    bill: calculateBill(subtotal, blueprint.customer.fulfilment),
    items,
    statusHistory: buildSeedHistory(blueprint.status, createdAt),
    seeded: true,
  }
}

/**
 * Guarded by its own flag rather than by "is the order list empty", so an
 * admin who clears the queue on purpose does not get the demo orders back on
 * the next page load.
 */
function seedOnce() {
  try {
    if (localStorage.getItem(SEEDED_KEY)) return
    localStorage.setItem(SEEDED_KEY, '1')

    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    const safe = Array.isArray(existing) ? existing : []
    const seeds = SEED_BLUEPRINTS.map(buildSeedOrder)

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify([...safe, ...seeds].sort(byNewest).slice(0, ORDER_LIMIT))
    )
  } catch {
    /* storage unavailable — the panel just starts empty */
  }
}

/* ----------------------------------------------------------------- customer */

/** Short, human-readable reference a customer could read out at the counter. */
function generateOrderId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CN-${random}`
}

/**
 * `placedBy` is read from the session here rather than passed in by Checkout:
 * the account that placed an order is not something a form should be able to
 * claim, and reading it in one place keeps every caller honest.
 */
export function createOrder({ items, bill, customer }) {
  const session = getSession()
  const createdAt = new Date().toISOString()

  const order = {
    id: generateOrderId(),
    status: ORDER_STATUS.pending,
    createdAt,
    customer,
    placedBy: session ? { id: session.id, name: session.name, email: session.email } : null,
    bill,
    items: items.map((item) => ({
      productId: item.id,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    })),
    statusHistory: [{ status: ORDER_STATUS.pending, at: createdAt }],
  }

  writeOrders([order, ...readOrders()])

  return order
}

export function getOrderById(id) {
  return readOrders().find((order) => order.id === id)
}

export function getOrders() {
  return readOrders()
}

/** The live admin queue: oldest first, because the oldest order waits longest. */
export function getActiveOrders() {
  return readOrders()
    .filter((order) => ACTIVE_STATUSES.includes(order.status))
    .reverse()
}

/** The history page: finished orders only, newest first. */
export function getPastOrders() {
  return readOrders().filter((order) => FINISHED_STATUSES.includes(order.status))
}

/* -------------------------------------------------------------------- admin */

/**
 * Returns the updated order, or `null` if the id is unknown or the move is not
 * allowed. Guarding here rather than in the UI means a stale button in an open
 * tab cannot resurrect an order that someone else already completed.
 */
export function updateOrderStatus(id, status) {
  if (!Object.values(ORDER_STATUS).includes(status)) return null

  const orders = readOrders()
  const target = orders.find((order) => order.id === id)
  if (!target) return null
  if (FINISHED_STATUSES.includes(target.status)) return null
  if (target.status === status) return target

  const updated = {
    ...target,
    status,
    statusHistory: [...target.statusHistory, { status, at: new Date().toISOString() }],
  }

  writeOrders(orders.map((order) => (order.id === id ? updated : order)))

  return updated
}

/** Moves an order one step along the lifecycle. */
export function advanceOrder(id) {
  const target = getOrderById(id)
  const next = target ? NEXT_STATUS[target.status] : undefined
  return next ? updateOrderStatus(id, next) : null
}

export function cancelOrder(id) {
  return updateOrderStatus(id, ORDER_STATUS.cancelled)
}

/* -------------------------------------------------------------------- stats */

function isToday(iso) {
  const date = new Date(iso)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/**
 * Figures for the dashboard cards. Cancelled orders are excluded from every
 * revenue total — money that was never taken is not takings — but they are
 * still counted in `cancelledToday` so a bad shift is visible rather than
 * silently missing.
 */
export function getOrderStats(orders = readOrders()) {
  const paid = orders.filter((order) => order.status !== ORDER_STATUS.cancelled)
  const today = orders.filter((order) => isToday(order.createdAt))
  const paidToday = today.filter((order) => order.status !== ORDER_STATUS.cancelled)

  const revenueToday = paidToday.reduce((total, order) => total + (order.bill?.total ?? 0), 0)
  const revenueAllTime = paid.reduce((total, order) => total + (order.bill?.total ?? 0), 0)

  return {
    activeCount: orders.filter((order) => ACTIVE_STATUSES.includes(order.status)).length,
    newCount: orders.filter((order) => order.status === ORDER_STATUS.pending).length,
    ordersToday: today.length,
    cancelledToday: today.length - paidToday.length,
    completedCount: orders.filter((order) => order.status === ORDER_STATUS.completed).length,
    revenueToday,
    revenueAllTime,
    averageOrderValue: paid.length > 0 ? Math.round(revenueAllTime / paid.length) : 0,
    totalCount: orders.length,
  }
}

/**
 * Calls `listener` whenever the order list changes — in this tab (custom
 * event) or another one (storage event). The second half is what makes the
 * admin queue update while a customer checks out in a different tab.
 *
 * Returns an unsubscribe function.
 */
export function subscribeOrders(listener) {
  function handleLocal() {
    listener()
  }

  function handleStorage(event) {
    if (event.key === ORDERS_KEY) listener()
  }

  window.addEventListener(ORDERS_EVENT, handleLocal)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(ORDERS_EVENT, handleLocal)
    window.removeEventListener('storage', handleStorage)
  }
}
