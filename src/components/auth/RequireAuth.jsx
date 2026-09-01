import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Route guard. The site is login-only: every route except Home and /login
 * nests under this.
 *
 * A signed-out visitor is sent to /login with the attempted path in state, so
 * the login form returns them where they were headed. A signed-in visitor with
 * the wrong role gets the 404 route rather than a redirect: revealing "this
 * exists but isn't yours" is worse than pretending it isn't there.
 *
 * Pass no `role` to mean "any signed-in account".
 */
export default function RequireAuth({ role }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (role && user.role !== role) {
    return <Navigate to="/404" replace />
  }

  return <Outlet />
}
