import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useOrderStats } from '../../hooks/useOrders'
import logoImg from '../../assets/updated logo.png'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', end: true, icon: 'dashboard' },
  { label: 'Orders', to: '/admin/orders', badge: 'new', icon: 'orders' },
  { label: 'Past orders', to: '/admin/orders/history', icon: 'history' },
]

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

const ICON_PATHS = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  orders: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h4',
  history: 'M12 7v5l3 2M20 12a8 8 0 1 1-2.34-5.66',
  home: 'M3 10.5L12 3l9 7.5M5.5 9.5V21h13V9.5M9.5 21v-6h5v6',
}

/**
 * Every icon sits in the same fixed-size slot, and the slot keeps the same
 * left offset in both sidebar widths — so expanding the sidebar slides the
 * labels in without the icon column moving under them.
 */
function NavIcon({ name }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={ICON_PATHS[name]}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const stats = useOrderStats()
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const isSidebarCollapsed = sidebarCollapsed && !sidebarHovered

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

  function renderNavList(compact = isSidebarCollapsed) {
    return (
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            title={compact ? item.label : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-2 text-left text-sm font-semibold transition-colors ${
                isActive ? 'bg-mocha-green text-cream' : 'text-cream/65 hover:bg-white/5 hover:text-cream'
              }`
            }
          >
            <NavIcon name={item.icon} />
            <span className={compact ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{item.label}</span>
            {/* Only shown when there is something waiting — a permanent "0"
                badge trains the eye to ignore the spot it appears in. The
                collapsed form is a dot on the icon's corner, positioned
                against this link rather than the page. */}
            {item.badge === 'new' &&
              stats.newCount > 0 &&
              (compact ? (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sand"
                />
              ) : (
                <span className="mr-1.5 min-w-5 rounded-full bg-sand px-1.5 py-0.5 text-center text-[0.65rem] font-bold text-espresso">
                  {stats.newCount}
                </span>
              ))}
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <div className="min-h-screen bg-cream lg:flex lg:items-start">
      {/* Sidebar — pinned to the viewport, so scrolling the dashboard scrolls
          only the dashboard and the nav stays reachable from anywhere on a
          long page. */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`sticky top-0 hidden h-screen shrink-0 flex-col justify-between overflow-y-auto bg-espresso px-3 py-6 text-cream transition-[width] duration-300 lg:flex ${
          isSidebarCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        <div>
          <Link to="/" className="mb-8 flex items-center gap-3 px-2" title="CafeNest">
            <img
              src={logoImg}
              alt="CafeNest logo"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <span
              className={`font-body text-base font-extrabold tracking-tight ${
                isSidebarCollapsed ? 'sr-only' : 'truncate'
              }`}
            >
              CafeNest
            </span>
          </Link>

          {renderNavList()}
        </div>

        <Link
          to="/"
          title="View the cafe site"
          className="mt-8 flex items-center gap-3 rounded-xl border border-white/15 px-2 text-cream/65 transition-colors hover:bg-white/5 hover:text-cream"
        >
          <NavIcon name="home" />
          <span
            className={`text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${
              isSidebarCollapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'
            }`}
          >
            View the cafe site
          </span>
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-coffee/15 bg-cream/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="text-espresso lg:hidden"
                aria-label="Toggle admin menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Labelled from the state the sidebar is actually in — hovering
                  it open and reading "Expand sidebar" would be a lie. */}
              <button
                type="button"
                className="hidden text-espresso lg:block"
                aria-label={isSidebarCollapsed ? 'Expand admin sidebar' : 'Collapse admin sidebar'}
                aria-expanded={!isSidebarCollapsed}
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path
                    d={isSidebarCollapsed ? 'M14 8l4 4-4 4' : 'M10 8l-4 4 4 4'}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="min-w-0">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-mocha-green">
                  Admin
                </p>
                <h1 className="truncate font-display text-lg leading-tight text-espresso">
                  {titleFor(location.pathname)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[0.8rem] font-semibold leading-tight text-espresso">{user?.name}</p>
                <p className="text-[0.7rem] text-espresso-light/60">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Log out"
                title="Log out"
                className="rounded-full border border-coffee/40 p-2 text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="border-t border-coffee/15 bg-espresso px-4 py-3 lg:hidden">
              {renderNavList(false)}
            </div>
          )}
        </header>

        <main className="px-5 py-7 sm:px-7 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
