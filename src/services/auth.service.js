/**
 * Auth — sessionStorage shim.
 *
 * Deliberately throwaway, the same shape as `order.service` and
 * `review.service`: this stands in for `POST /api/v1/auth/login` until the
 * backend exists. Replacing the bodies of `login` / `logout` / `getSession`
 * with fetch calls (plus a real token) is the whole migration.
 *
 * sessionStorage, not localStorage, is used on purpose — the session is meant
 * to die with the tab, while the cart (localStorage) deliberately survives it.
 *
 * SECURITY: passwords are compared in plaintext in the browser. That is fine
 * for a dummy-data prototype and is NOT a security boundary — Rules §1 still
 * requires the backend to own authentication when it lands.
 */
const SESSION_KEY = 'cafenest_session'

export const ROLES = {
  admin: 'admin',
  user: 'user',
}

/**
 * The only accounts that exist. `password` is stripped before anything is
 * stored or handed to the UI, so a session never carries a credential.
 */
const USERS = [
  {
    id: 'u1',
    name: 'Cafe Admin',
    email: 'admin@cafenest.com',
    password: 'admin123',
    role: ROLES.admin,
  },
  {
    id: 'u2',
    name: 'Aarav Sharma',
    email: 'user@cafenest.com',
    password: 'user123',
    role: ROLES.user,
  },
]

/** Shown on the login screen as one-tap chips so both roles are easy to test. */
export const DEMO_ACCOUNTS = USERS.map(({ email, password, role, name }) => ({
  email,
  password,
  role,
  name,
}))

function toSessionUser({ id, name, email, role }) {
  return { id, name, email, role }
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    // Guard against hand-edited or partially-written storage.
    if (!parsed || !parsed.id || !parsed.role) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * Resolves to `{ user }` on success or `{ error }` on failure — never throws,
 * so the caller can render the message straight into the form.
 */
export function login({ email, password }) {
  const match = USERS.find(
    (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
  )

  // One shared message for both cases: a different error for "no such email"
  // would let anyone enumerate the account list.
  if (!match || match.password !== password) {
    return { error: 'That email and password do not match an account.' }
  }

  const user = toSessionUser(match)

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    /* storage unavailable — the user object is still returned so the session
       works in memory for this page load */
  }

  return { user }
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* storage unavailable — nothing to clean up */
  }
}
