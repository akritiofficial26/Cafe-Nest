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

function NavIcon({ name }) {
  const paths = {
    dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    orders: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h4',
    history: 'M12 7v5l3 2M20 12a8 8 0 1 1-2.34-5.66',
    menu: 'M4 7h16M4 12h16M4 17h16',
    customers: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM16 4.5a3.5 3.5 0 0 1 0 6.8',
    reviews: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L2.9 9.6l6.2-.9L12 3z',
    settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H7v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L10 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1z',
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      {NAV_ITEMS.map((item) =>
        item.to ? (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center rounded-2xl py-3 text-left text-sm font-semibold tracking-[0.04em] transition-colors ${
                compact ? 'justify-center px-2' : 'justify-between gap-2 px-4'
              } ${
                isActive ? 'bg-mocha-green text-cream' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
              }`
            }
          >
            <NavIcon name={item.icon} />
            <span className={compact ? 'sr-only' : ''}>{item.label}</span>
            {/* Only shown when there is something waiting — a permanent "0"
                badge trains the eye to ignore the spot it appears in. */}
            {item.badge === 'new' && stats.newCount > 0 && (
              <span className={`${compact ? 'absolute -right-1 -top-1 h-3 w-3 rounded-full p-0 text-[0px]' : 'min-w-5 px-1.5'} rounded-full bg-sand py-0.5 text-center text-[0.65rem] font-bold text-espresso`}>
                {stats.newCount}
              </span>
            )}
          </NavLink>
        ) : (
          <button
            key={item.label}
            type="button"
            disabled
            className={`cursor-not-allowed rounded-2xl py-3 text-left text-sm font-semibold tracking-[0.04em] text-cream/40 transition-colors hover:bg-white/5 ${
              compact ? 'px-2 text-center' : 'px-4'
            }`}
          >
            <NavIcon name={item.icon} />
            <span className={compact ? 'sr-only' : ''}>{item.label}</span>
            <span className={`${compact ? 'sr-only' : ''} ml-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-cream/25`}>
              soon
            </span>
          </button>
        )
      )}
    </nav>
    )
  }

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`hidden shrink-0 flex-col justify-between bg-espresso py-7 text-cream transition-[width,padding] duration-300 lg:flex ${
          isSidebarCollapsed ? 'w-20 px-3' : 'w-64 px-5'
        }`}
      >
        <div>
          <Link to="/" className={`mb-9 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-1'}`}>
            <img src={logoImg} alt="CafeNest logo" className="h-12 w-12 rounded-full object-cover" />
            <div className={`${isSidebarCollapsed ? 'hidden' : '-ml-1'} leading-tight`}>
              <span className="block font-body text-lg font-extrabold tracking-tight">CafeNest</span>
            </div>
          </Link>

          {renderNavList()}
        </div>

        <Link
          to="/"
          title="View the cafe site"
          className={`mt-8 rounded-2xl border border-white/15 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-cream/70 transition-colors hover:bg-white/5 hover:text-cream ${
            isSidebarCollapsed ? 'px-2' : 'px-4'
          }`}
        >
          <span className={isSidebarCollapsed ? 'sr-only' : ''}>View the cafe site</span>
          {isSidebarCollapsed && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mx-auto" aria-hidden="true">
              <path d="M3 10.5L12 3l9 7.5M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
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

              <button
                type="button"
                className="hidden text-espresso lg:block"
                aria-label={sidebarCollapsed ? 'Expand admin sidebar' : 'Collapse admin sidebar'}
                aria-expanded={!sidebarCollapsed}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d={sidebarCollapsed ? 'M14 8l4 4-4 4' : 'M10 8l-4 4 4 4'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Log out"
                title="Log out"
                className="rounded-full border border-coffee/40 p-2 text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="border-t border-coffee/15 bg-espresso px-5 py-4 lg:hidden">{renderNavList(false)}</div>
          )}
        </header>

        <main className="px-5 py-10 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
