import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import logoImg from '../assets/updated logo.png'

/**
 * Dummy admin dashboard — a placeholder shell only.
 *
 * Deliberately has NO functionality: no data reads, no mutations, no wiring to
 * the services layer. It exists so the admin role has somewhere to land after
 * login while the real panel is designed. Every nav item and card below is a
 * labelled empty slot, not a broken feature.
 *
 * Renders outside the site Navbar/Footer (see App.jsx) so it reads as its own
 * surface rather than another café page.
 */
const NAV_ITEMS = [
  { label: 'Dashboard', current: true },
  { label: 'Orders' },
  { label: 'Menu' },
  { label: 'Customers' },
  { label: 'Reviews' },
  { label: 'Settings' },
]

const PLACEHOLDER_CARDS = [
  { title: 'Orders', hint: 'Live order queue will live here.' },
  { title: 'Revenue', hint: 'Daily and weekly takings.' },
  { title: 'Menu items', hint: 'Availability and pricing.' },
  { title: 'Reviews', hint: 'Latest customer feedback.' },
]

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSignOut() {
    signOut()
    // Same reason as the Navbar: the cart belongs to the account, not the
    // browser, so it must not survive into the next person's session.
    clearCart()
    navigate('/login', { replace: true })
  }

  const navList = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          type="button"
          disabled
          aria-current={item.current ? 'page' : undefined}
          className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-[0.04em] transition-colors ${
            item.current
              ? 'bg-mocha-green text-cream'
              : 'text-cream/55 cursor-not-allowed hover:bg-white/5'
          }`}
        >
          {item.label}
          {!item.current && (
            <span className="ml-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-cream/30">
              soon
            </span>
          )}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-espresso px-5 py-7 text-cream">
        <div>
          <Link to="/" className="mb-9 flex items-center gap-1">
            <img src={logoImg} alt="CafeNest logo" className="h-12 w-12 rounded-full object-cover" />
            <div className="-ml-1 leading-tight">
              <span className="block font-body text-lg font-extrabold tracking-tight">CafeNest</span>
              <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-sand">
                Admin
              </span>
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

      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-coffee/15 bg-cream/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="lg:hidden text-espresso"
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
                <h1 className="truncate font-display text-2xl text-espresso">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
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
            <div className="lg:hidden border-t border-coffee/15 bg-espresso px-5 py-4">{navList}</div>
          )}
        </header>

        <main className="px-5 sm:px-8 py-10">
          <div className="mb-9">
            <h2 className="font-display text-3xl sm:text-4xl text-espresso mb-2">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Admin'}.
            </h2>
            <p className="text-espresso-light/75 max-w-xl leading-relaxed">
              This is a placeholder shell. Nothing here is wired up yet — the panels below mark
              where each section will go.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-9">
            {PLACEHOLDER_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-coffee/10 bg-cream-card p-6 shadow-sm"
              >
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-mocha-green mb-3">
                  {card.title}
                </p>
                <p className="font-display text-4xl text-espresso/25 mb-3">—</p>
                <p className="text-xs text-espresso-light/60 leading-relaxed">{card.hint}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-dashed border-coffee/25 bg-cream-card/60 px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-mocha-green/12 text-mocha-green">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-espresso mb-2">Coming soon</h3>
            <p className="mx-auto max-w-md text-sm text-espresso-light/70 leading-relaxed">
              Order management, menu editing and customer insight all land here once the admin
              features are built.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
