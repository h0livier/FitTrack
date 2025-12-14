import { getArrayFromStorage, setItemToStorage, removeItemFromStorage } from '../utils/storageHelper'

export type GenericStorage<T extends Record<string, any>> = {
  list: () => T[]
  add: (item: T) => T
  update: (id: string, patch: Partial<T>) => T | null
  remove: (id: string) => boolean
  clear: () => void
}

export function useGenericStorage<T extends Record<string, any>>(key: string, idField = 'id'): GenericStorage<T> {
  function list(): T[] {
    return getArrayFromStorage<T>(key)
  }

  function add(item: T): T {
    const arr = getArrayFromStorage<T>(key)
    let id = item[idField]
    if (!id) {
      id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
        ? (crypto as any).randomUUID()
        : String(Date.now())
      // attach id to the item
      try {
        (item as any)[idField] = id
      } catch (e) {
        // ignore if cannot set
      }
    }

    arr.push(item)
    setItemToStorage(key, arr)
    return item
  }

  function update(id: string, patch: Partial<T>): T | null {
    const arr = getArrayFromStorage<T>(key)
    const idx = arr.findIndex((i: any) => i[idField] === id)
    if (idx === -1) return null
    const updated = { ...arr[idx], ...patch }
    arr[idx] = updated as T
    setItemToStorage(key, arr)
    return updated as T
  }

  function remove(id: string): boolean {
    const arr = getArrayFromStorage<T>(key)
    const idx = arr.findIndex((i: any) => i[idField] === id)
    if (idx === -1) return false
    arr.splice(idx, 1)
    setItemToStorage(key, arr)
    return true
  }

  function clear(): void {
    removeItemFromStorage(key)
  }

  return {
    list,
    add,
    update,
    remove,
    clear,
  }
}

export default useGenericStorage
