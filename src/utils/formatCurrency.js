/**
 * Formats a rupee amount for display.
 *
 * Deliberately plain concatenation rather than Intl.NumberFormat: grouping
 * would render 1180 as "1,180" and change every existing price on screen.
 * Swap in Intl here if grouped totals are ever wanted.
 */
export function formatCurrency(value) {
  return `₹${value}`
}

export default formatCurrency
