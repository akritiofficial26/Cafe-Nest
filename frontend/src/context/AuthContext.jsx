import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  ROLES,
  getSession,
  login as loginRequest,
  logout as logoutRequest,
} from '../services/auth.service'

const AuthContext = createContext(null)

/**
 * Session state for the app. Mirrors CartContext's shape, but reads from
 * sessionStorage via auth.service rather than talking to storage directly —
 * so swapping in a real API only touches the service.
 */
export function AuthProvider({ children }) {
  // Seeded from sessionStorage so a refresh (or a direct hit on /admin) keeps
  // the session instead of bouncing the user back to the login screen.
  const [user, setUser] = useState(getSession)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ROLES.admin,

      /** Returns `{ user }` or `{ error }` — the form renders the error. */
      signIn(credentials) {
        const result = loginRequest(credentials)
        if (result.user) setUser(result.user)
        return result
      },

      signOut() {
        logoutRequest()
        setUser(null)
      },
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
