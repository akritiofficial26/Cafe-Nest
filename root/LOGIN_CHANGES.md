# Login — Hardcoded Data Removal (2026-11-23)

The goal was to remove everything in the login flow that the backend should own (credentials, user list, password checking) without changing any other behaviour or UI. The backend APIs will be added later.

---

## Files changed

| File | Change |
|---|---|
| `frontend/src/services/auth.service.js` | Removed hardcoded users and demo accounts; `login()` is now an async stub |
| `frontend/src/pages/Login.jsx` | Removed the "Demo accounts" block; submit now awaits `signIn` |
| `frontend/src/context/AuthContext.jsx` | `signIn` is now `async` |

Not changed: `App.jsx`, `RequireAuth.jsx`, `Navbar.jsx`, `ProductCard.jsx`, `AdminLayout.jsx`, `AdminOverview.jsx`, `order.service.js`. They keep using `ROLES`, `getSession`, and `useAuth()` exactly as before.

---

## What was removed

### `frontend/src/services/auth.service.js`
1. **`USERS` array**: the two hardcoded accounts with plaintext passwords:
   - `admin@cafenest.com` / `admin123` (role `admin`, id `u1`, "Cafe Admin")
   - `user@cafenest.com` / `user123` (role `user`, id `u2`, "Aarav Sharma")
2. **`DEMO_ACCOUNTS` export**: the list of emails and passwords shown on the login screen.
3. **In-browser password check** inside `login()`: matching the email against `USERS` and comparing the password in plaintext.
4. The old header comment describing the sessionStorage shim and the plaintext-password warning.

### `frontend/src/pages/Login.jsx`
1. `DEMO_ACCOUNTS` from the import (now only `ROLES` is imported).
2. `useDemo(account)` function, which filled the form with a demo account.
3. The whole **"Demo accounts"** section below the form: the divider label, the two clickable account chips showing email and password, and the "Tap one to fill the form, then sign in." hint.

## What was kept (unchanged)
- Login form UI: heading, email and password fields, Show/Hide password toggle, error banner, "Sign in" button, "Back to home" link.
- Client-side validation (`validate`): empty-email, email-format, and empty-password checks. These are UX checks, not security.
- Redirect logic (`landingFor`): admins go to `/admin`, users go back to where they came from or to `/shop`.
- `ROLES` constant (`admin`, `user`). This is not a credential; route guards need it to match the role the backend returns.
- `getSession()` / `logout()` and the `cafenest_session` sessionStorage key. These cache only the **non-secret** user profile `{ id, name, email, role }`.
- `toSessionUser()` helper.

## What was added
- **`saveSession(user)`** helper in `auth.service.js`, ready to be called after a successful backend login.
- **`login()` is now `async`** and currently always resolves to
  `{ error: 'Sign-in is not available yet. Please try again later.' }`. The message shows in the form's error banner. **Until the backend is wired, nobody can sign in**, so all protected pages and `/admin` are unreachable.
- `AuthContext.signIn` is now `async` (`await loginRequest(...)`), and `Login.jsx`'s `handleSubmit` is now `async` (`await signIn(...)`). When the API is added, only `auth.service.js` needs to change.
- A documented backend contract and `TODO(backend)` comments in `auth.service.js`.

---

## Wiring the backend later (httpOnly cookie)

Planned contract:

```
POST /api/v1/auth/login    body: { email, password }
  200 → { user: { id, name, email, role } }  + Set-Cookie (httpOnly, Secure, SameSite)
  401 → { error: "That email and password do not match an account." }

POST /api/v1/auth/logout
  200 → clears the cookie
```

Suggested `login()` body:

```js
export async function login({ email, password }) {
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',            // store / send the httpOnly cookie
      body: JSON.stringify({ email: email.trim(), password }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { error: data.error || 'That email and password do not match an account.' }
    const user = toSessionUser(data.user)
    saveSession(user)
    return { user }
  } catch {
    return { error: 'Could not reach the server. Please try again.' }
  }
}
```

Notes for the backend:
- Hash passwords (bcrypt/argon2). Never store or return plaintext.
- Return one shared error for "unknown email" and "wrong password" to prevent account enumeration.
- `role` must be exactly `admin` or `user` to match `ROLES`.
- Recreate the two former demo accounts in the backend seed data if you still want them (use new passwords).
- In development, add a Vite proxy (`server.proxy['/api']` in `vite.config.js`) so cookies stay same-origin.
- `logout()` should also call `POST /api/v1/auth/logout` with `credentials: 'include'`.
- The sessionStorage profile is only a UI cache. The server must check the cookie on every protected API call, including the admin and order endpoints.

## ⚠️ Leftover outside the source code
`frontend/dist/` (the committed build output) still contains the old hardcoded credentials in its compiled JS bundle. Run `npm run build` to regenerate it, or remove `dist/` from git.
