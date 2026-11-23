import { useCallback, useEffect, useState } from 'react'
import {
  getActiveOrders,
  getOrderById,
  getOrderStats,
  getOrders,
  getPastOrders,
  subscribeOrders,
} from '../services/order.service'


function useOrderSelector(read) {
  const [value, setValue] = useState(read)

  useEffect(() => {
    
    setValue(read())
    return subscribeOrders(() => setValue(read()))
  }, [read])

  return value
}

export function useActiveOrders() {
  return useOrderSelector(getActiveOrders)
}

export function usePastOrders() {
  return useOrderSelector(getPastOrders)
}

export function useAllOrders() {
  return useOrderSelector(getOrders)
}

export function useOrderStats() {
  return useOrderSelector(getOrderStats)
}

export function useOrder(id) {
  const read = useCallback(() => (id ? getOrderById(id) : undefined), [id])
  return useOrderSelector(read)
}


export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
