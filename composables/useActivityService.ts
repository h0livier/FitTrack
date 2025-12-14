export type Activity = {
  id: string
  steps: number
  calories: number
  createdAt: string
}

const STORAGE_KEY = 'fittrack:activities'

import { useGenericStorage } from '../services/genericStorage'

export function useActivityService() {
  const storage = useGenericStorage<Activity>(STORAGE_KEY, 'id')

  function getActivities(): Activity[] {
    return storage.list()
  }

  function saveActivity(payload: Omit<Activity, 'id'|'createdAt'>): Activity {
    const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : String(Date.now())

    const item: Activity = {
      id,
      ...payload,
      createdAt: new Date().toISOString(),
    }

    return storage.add(item)
  }

  function clearActivities(): void {
    storage.clear()
  }

  function updateActivity(id: string, patch: Partial<Activity>): Activity | null {
    return storage.update(id, patch)
  }

  function deleteActivity(id: string): boolean {
    return storage.remove(id)
  }

  return {
    getActivities,
    saveActivity,
    clearActivities,
    updateActivity,
    deleteActivity,
  }
}

export default useActivityService
