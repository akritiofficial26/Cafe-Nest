import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

/**
 * Bumped from 'cafenest_cart' because item identity changed from `id` to a
 * size-aware `key`. A stale v1 cart would have no `key` on its items and would
 * break the steppers, so the old bucket is read once and discarded.
 */
const STORAGE_KEY = 'cafenest_cart_v2'
const LEGACY_STORAGE_KEY = 'cafenest_cart'

export const DEFAULT_SIZE = 'Regular'

/** Cart identity: 'p1-Large' for sized drinks, plain 'p7' for unsized bakes. */
export function cartKey(productId, size) {
  return size ? `${productId}-${size}` : productId
}

/** Regular price plus the chosen size's delta. */
export function resolveSizePrice(product, size) {
  if (!product.sizes || !size) return product.price
  const match = product.sizes.find((s) => s.label === size)
  return product.price + (match ? match.delta : 0)
}

function readStoredCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    // Guard against hand-edited or partially-written storage.
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.key) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      /* storage unavailable — nothing to clean up */
    }
  }, [])

  function addItem(product, size) {
    const chosenSize = product.sizes ? size || DEFAULT_SIZE : null
    const key = cartKey(product.id, chosenSize)

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          image: product.image,
          size: chosenSize,
          price: resolveSizePrice(product, chosenSize),
          quantity: 1,
        },
      ]
    })
  }

  function increment(key) {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i))
    )
  }

  function decrement(key) {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function clearCart() {
    setItems([])
  }

  /**
   * Menu cards show one stepper per product, not per size. This returns the
   * size of that product already in the cart (if any) so the card's +/- keeps
   * adjusting that line instead of silently creating a second Regular row.
   */
  function findProductItem(productId) {
    return items.find((i) => i.id === productId)
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increment,
        decrement,
        removeItem,
        clearCart,
        findProductItem,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
