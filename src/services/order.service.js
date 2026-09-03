import { getSession } from './auth.service'
import { FULFILMENT } from '../utils/bill'

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
/**
 * Legacy flag. The panel used to write ten demo orders on first load; it no
 * longer does, so this key only survives to identify a browser that still has
 * those records sitting in storage — see `purgeLegacySeeds`.
 */
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

/**
 * Drops the demo orders an earlier build seeded into this browser.
 *
 * Removing the seeder stops new browsers getting demo data, but does nothing
 * for one that was already seeded — those ten records would sit in the queue
 * forever. Runs once: the flag is cleared as part of the purge, so after the
 * first read this is a single `getItem` returning null.
 */
function purgeLegacySeeds() {
  try {
    if (!localStorage.getItem(SEEDED_KEY)) return

    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    if (Array.isArray(stored)) {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(stored.filter((order) => !order?.seeded))
      )
    }

    localStorage.removeItem(SEEDED_KEY)
  } catch {
    /* storage unavailable — nothing was seeded there either */
  }
}

function readOrders() {
  purgeLegacySeeds()
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.map(normalizeOrder).filter(Boolean).sort(byNewest)
  } catch {
    return []
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
