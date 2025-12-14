export function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch (e) {
    // keep error simple and non-throwing to avoid breaking UI
    // caller can handle a null return value
    // eslint-disable-next-line no-console
    console.error('Failed to parse JSON from localStorage', e)
    return null
  }
}

export function getArrayFromStorage<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  const parsed = safeParse<T[]>(raw)
  return parsed ?? []
}

export function setItemToStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to set item to localStorage', e)
  }
}

export function removeItemFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to remove item from localStorage', e)
  }
}
