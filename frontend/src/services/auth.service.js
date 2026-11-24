
const SESSION_KEY = 'cafenest_session'

/** Role names returned by the backend. Used by route guards and redirects. */
export const ROLES = {
  admin: 'admin',
  user: 'user',
}

function toSessionUser({ id, name, email, role }) {
  return { id, name, email, role }
}

function saveSession(user) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    
  }
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


export async function login({ email, password }) {
  return { error: 'Sign-in is not available yet. Please try again later.' }
}


/**
 * Creates a new customer account. Placeholder until the backend exists —
 * resolves to `{ user }` or `{ error }`, matching `login`.
 */
export async function register({ name, email, password }) {
  return { error: 'Registration is not available yet. Please try again later.' }
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
  }
}
