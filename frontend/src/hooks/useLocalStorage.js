import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'roadmap_app_state_v1'

/**
 * Persists the roadmap (and everything tied to it) in localStorage
 * so progress survives a refresh or closed tab. No backend, no accounts —
 * this is the entire persistence layer by design.
 */
export function useLocalStorage() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (state === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    } catch {
      // localStorage can fail in private browsing or when full —
      // the app still works in-memory for the session either way.
    }
  }, [state])

  const clear = useCallback(() => setState(null), [])

  return [state, setState, clear]
}
