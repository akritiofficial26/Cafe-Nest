/**
 * Contact messages — localStorage shim.
 *
 * Stands in for `POST /api/v1/contact` until the backend exists. Kept as a
 * service so the Contact page never touches storage directly and the swap is
 * one function body.
 */
const MESSAGES_KEY = 'cafenest_messages'
const MESSAGE_LIMIT = 20

function readMessages() {
  try {
    const raw = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export function createMessage({ name, email, message }) {
  const record = {
    id: `m-${Math.random().toString(36).slice(2, 10)}`,
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  }

  try {
    const next = [record, ...readMessages()].slice(0, MESSAGE_LIMIT)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — the record is still returned so the page can
       confirm to the customer for this session */
  }

  return record
}

export function getMessages() {
  return readMessages()
}
