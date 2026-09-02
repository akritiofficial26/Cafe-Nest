import { useCallback, useEffect, useState } from 'react'
import {
  getActiveOrders,
  getOrderById,
  getOrderStats,
  getOrders,
  getPastOrders,
  subscribeOrders,
} from '../services/order.service'

/**
 * Live views over the order store.
 *
 * Every hook here reads through `order.service` and re-reads whenever the
 * store changes — including a change made in another tab, which is what puts
 * a customer's brand-new order into an already-open admin queue without a
 * refresh (see `subscribeOrders`).
 *
 * `useSyncExternalStore` would be the idiomatic choice, but the service
 * returns a freshly built array on every read, so its snapshot comparison
 * would never settle. A subscription writing into state is both correct and
 * simpler here.
 */
function useOrderSelector(read) {
  const [value, setValue] = useState(read)

  useEffect(() => {
    // Re-read on mount: an order could have been placed between the first
    // render and this effect running.
    setValue(read())
    return subscribeOrders(() => setValue(read()))
    // `read` is a module-level service function, stable across renders.
  }, [read])

  return value
}

/** Live queue — anything not yet completed or cancelled, longest wait first. */
export function useActiveOrders() {
  return useOrderSelector(getActiveOrders)
}

/** Finished orders — completed and cancelled, newest first. */
export function usePastOrders() {
  return useOrderSelector(getPastOrders)
}

export function useAllOrders() {
  return useOrderSelector(getOrders)
}

export function useOrderStats() {
  return useOrderSelector(getOrderStats)
}

/** A single order, kept current so status changes show without a re-navigation. */
export function useOrder(id) {
  const read = useCallback(() => (id ? getOrderById(id) : undefined), [id])
  return useOrderSelector(read)
}

/**
 * A clock that ticks, so relative timestamps ("18 min ago") age on screen
 * instead of freezing at whatever they said when the page loaded.
 *
 * Half a minute is the useful floor: the strings are minute-resolution, so a
 * faster interval would re-render for nothing.
 */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
