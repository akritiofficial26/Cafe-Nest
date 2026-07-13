import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { type: 'route', to: '/', label: 'Home' },
  { type: 'route', to: '/about', label: 'About' },
  { type: 'route', to: '/shop', label: 'Menu' },
  { type: 'anchor', href: '/#testimonials', label: 'Testimonials' },
  { type: 'anchor', href: '/#gallery', label: 'Gallery' },
  { type: 'anchor', href: '/#contact', label: 'Contact' },
]

const linkClass = 'text-sm font-semibold tracking-[0.12em] transition-colors'

export default function Navbar() {
  const { totalCount } = useCart()
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-coffee/15">
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-5 sm:px-8 h-20">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMenu}>
          <img src="/logo.png" alt="Coffee logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-body text-2xl sm:text-[1.7rem] font-extrabold text-espresso tracking-tight">
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
                  `${linkClass} ${isActive ? 'text-mocha-green' : 'text-espresso-light hover:text-coffee'}`
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <a key={link.label} href={link.href} className={`${linkClass} text-espresso-light hover:text-coffee`}>
                {link.label}
              </a>
            )
          )}

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
          <NavLink to="/cart" onClick={closeMenu} className="py-3 text-base flex items-center justify-between">
            <span>Cart</span>
            {totalCount > 0 && (
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-sand text-espresso text-xs font-bold">
                {totalCount}
              </span>
            )}
          </NavLink>
        </div>
      )}
    </header>
  )
}
