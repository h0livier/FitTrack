export type Weighing = {
  id: string
  date: string
  height_cm: number | null
  weight_kg: number | null
  fat_percent: number | null
  muscle_kg: number | null
  water_percent: number | null
  createdAt: string
}

const STORAGE_KEY = 'fittrack:weighings'

import { useGenericStorage } from '../services/genericStorage'

export function useWeightService() {
  const storage = useGenericStorage<Weighing>(STORAGE_KEY, 'id')

  function getWeighings(): Weighing[] {
    return storage.list()
  }

  function saveWeighing(payload: Omit<Weighing, 'id'|'createdAt'>): Weighing {
    const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : String(Date.now())

    const item: Weighing = {
      id,
      ...payload,
      createdAt: new Date().toISOString(),
    }

    return storage.add(item)
  }

  function clearWeighings(): void {
    storage.clear()
  }

  function updateWeighing(id: string, patch: Partial<Weighing>): Weighing | null {
    return storage.update(id, patch)
  }

  function deleteWeighing(id: string): boolean {
    return storage.remove(id)
  }

  return {
    getWeighings,
    saveWeighing,
    clearWeighings,
    updateWeighing,
    deleteWeighing,
  }
}

export default useWeightService
