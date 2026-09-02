import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useOrderStats } from '../../hooks/useOrders'
import logoImg from '../../assets/updated logo.png'

/**
 * The admin shell: sidebar, topbar, and an outlet for whichever admin page is
 * open. Renders outside the site Navbar/Footer (see App.jsx) so it reads as
 * its own surface rather than another café page.
 *
 * Sections that are still placeholders stay in the nav as disabled items
 * marked "soon" — a labelled empty slot, not a broken feature.
 */
const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Orders', to: '/admin/orders', badge: 'new' },
  { label: 'Past orders', to: '/admin/orders/history' },
  { label: 'Menu' },
  { label: 'Customers' },
  { label: 'Reviews' },
  { label: 'Settings' },
]

/**
 * What the topbar calls the current page. Ordered longest-prefix first so
 * /admin/orders/history is not claimed by /admin/orders.
 */
const TITLES = [
  ['/admin/orders/history', 'Past orders'],
  ['/admin/orders/', 'Order details'],
  ['/admin/orders', 'Live orders'],
  ['/admin', 'Dashboard'],
]

function titleFor(pathname) {
  const match = TITLES.find(([prefix]) => pathname.startsWith(prefix))
  return match ? match[1] : 'Dashboard'
}

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const stats = useOrderStats()
  const [menuOpen, setMenuOpen] = useState(false)

  // A nav panel left open over the page it just navigated to hides the result
  // of the tap that opened it.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function handleSignOut() {
    signOut()
    // Same reason as the Navbar: the cart belongs to the account, not the
    // browser, so it must not survive into the next person's session.
    clearCart()
    navigate('/login', { replace: true })
  }

  const navList = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) =>
        item.to ? (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-[0.04em] transition-colors ${
                isActive ? 'bg-mocha-green text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
              }`
            }
          >
            {item.label}
            {/* Only shown when there is something waiting — a permanent "0"
                badge trains the eye to ignore the spot it appears in. */}
            {item.badge === 'new' && stats.newCount > 0 && (
              <span className="min-w-5 rounded-full bg-sand px-1.5 py-0.5 text-center text-[0.65rem] font-bold text-espresso">
                {stats.newCount}
              </span>
            )}
          </NavLink>
        ) : (
          <button
            key={item.label}
            type="button"
            disabled
            className="cursor-not-allowed rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-[0.04em] text-cream/40 transition-colors hover:bg-white/5"
          >
            {item.label}
            <span className="ml-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-cream/25">
              soon
            </span>
          </button>
        )
      )}
    </nav>
  )

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-espresso px-5 py-7 text-cream lg:flex">
        <div>
          <Link to="/" className="mb-9 flex items-center gap-1">
            <img src={logoImg} alt="CafeNest logo" className="h-12 w-12 rounded-full object-cover" />
            <div className="-ml-1 leading-tight">
              <span className="block font-body text-lg font-extrabold tracking-tight">CafeNest</span>
              <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-sand">Admin</span>
            </div>
          </Link>

          {navList}
        </div>

        <Link
          to="/"
          className="mt-8 rounded-2xl border border-white/15 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-cream/70 transition-colors hover:bg-white/5 hover:text-cream"
        >
          View the café site
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-coffee/15 bg-cream/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="text-espresso lg:hidden"
                aria-label="Toggle admin menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="min-w-0">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-mocha-green">
                  Admin
                </p>
                <h1 className="truncate font-display text-2xl text-espresso">
                  {titleFor(location.pathname)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-espresso">{user?.name}</p>
                <p className="text-xs text-espresso-light/60">{user?.email}</p>
              </div>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-mocha-green text-sm font-bold text-cream"
              >
                {user?.name?.[0] ?? 'A'}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-coffee/40 px-4 py-2 text-sm font-semibold text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
              >
                Log out
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="border-t border-coffee/15 bg-espresso px-5 py-4 lg:hidden">{navList}</div>
          )}
        </header>

        <main className="px-5 py-10 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
