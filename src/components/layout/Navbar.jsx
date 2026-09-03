import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import logoImg from '../../assets/updated logo.png'

const links = [
  { type: 'route', to: '/', label: 'Home' },
  { type: 'route', to: '/about', label: 'About' },
  { type: 'route', to: '/shop', label: 'Menu' },
  { type: 'route', to: '/taste-match', label: 'Taste Match', highlight: true },
  { type: 'route', to: '/feedback', label: 'Feedback' },
  { type: 'anchor', href: '/#contact', label: 'Contact' },
]

const linkClass = 'px-3 py-2 rounded-full text-sm font-semibold tracking-[0.12em] transition-colors duration-200 hover:bg-mocha-green hover:text-cream'

export default function Navbar() {
  const { totalCount, clearCart } = useCart()
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  function handleSignOut() {
    closeMenu()
    signOut()
    clearCart()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-coffee/15">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-2 sm:px-3 h-20">
        <Link to="/" className="flex items-center gap-0 shrink-0" onClick={closeMenu}>
          <img src={logoImg} alt="Coffee logo" className="h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover" />
          <span className="font-body text-xl sm:text-[1.55rem] font-extrabold text-espresso tracking-tight leading-none -ml-2 sm:-ml-3">
            CafeNest
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((link) =>
            link.type === 'route' ? (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive
                      ? 'text-mocha-green'
                      : link.highlight
                        ? 'text-coffee-dark font-bold'
                        : 'text-espresso-light'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <a key={link.label} href={link.href} className={`${linkClass} text-espresso-light`}>
                {link.label}
              </a>
            )
          )}

          {user && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                  isActive
                    ? 'bg-mocha-green text-cream border-mocha-green'
                    : 'border-coffee/40 text-espresso hover:bg-coffee hover:text-cream hover:border-coffee'
                }`
              }
            >
              <span className="text-sm font-semibold tracking-[0.12em]">Cart</span>
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-sand text-espresso text-xs font-bold">
                  {totalCount}
                </span>
              )}
            </NavLink>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold tracking-[0.12em] text-mocha-green hover:text-mocha-green-dark transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Log out"
                title="Log out"
                className="text-espresso-light transition-colors hover:text-coffee-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-5 py-2 rounded-full bg-mocha-green text-cream text-sm font-semibold tracking-[0.12em] hover:bg-mocha-green-dark transition-colors"
            >
              Log in
            </NavLink>
          )}
        </div>

        <button
          className="lg:hidden text-espresso"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-coffee/15 bg-cream px-5 pb-5 flex flex-col gap-1">
          {links.map((link) =>
            link.type === 'route' ? (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `py-3 text-base border-b border-coffee/10 ${isActive ? 'text-mocha-green font-semibold' : 'text-espresso'}`
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="py-3 text-base border-b border-coffee/10 text-espresso"
              >
                {link.label}
              </a>
            )
          )}

          {user && (
            <NavLink
              to="/cart"
              onClick={closeMenu}
              className={({ isActive }) =>
                `py-3 text-base border-b border-coffee/10 flex items-center gap-2 ${
                  isActive ? 'text-mocha-green font-semibold' : 'text-espresso'
                }`
              }
            >
              <span>Cart</span>
              {totalCount > 0 && (
                <span className="h-5 w-5 flex items-center justify-center rounded-full bg-sand text-espresso text-xs font-bold">
                  {totalCount}
                </span>
              )}
            </NavLink>
          )}

          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="py-3 text-base border-b border-coffee/10 text-mocha-green font-semibold"
                >
                  Admin dashboard
                </Link>
              )}
              <div className="pt-4 flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-espresso">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-espresso-light/60">
                    {user.email}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Log out"
                  title="Log out"
                  className="shrink-0 rounded-full border border-coffee/40 p-2 text-espresso transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className="mt-4 rounded-full bg-mocha-green px-5 py-3 text-center text-base font-semibold text-cream hover:bg-mocha-green-dark transition-colors"
            >
              Log in
            </NavLink>
          )}
        </div>
      )}
    </header>
  )
}
