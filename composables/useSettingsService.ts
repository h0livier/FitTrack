export type Settings = {
  trackHydration: boolean
  defaultHeightCm: number | null
}

const STORAGE_KEY = 'fittrack:settings'

import { setItemToStorage, safeParse } from '../utils/storageHelper'

export function useSettingsService() {

  const defaultSettings: Settings = {
    trackHydration: true,
    defaultHeightCm: null,
  }

  function getSettings(): Settings {
    const raw = localStorage.getItem(STORAGE_KEY)
    return safeParse<Settings>(raw) || defaultSettings
  }

  function saveSettings(settings: Settings): void {
    setItemToStorage(STORAGE_KEY, settings)
  }

  function updateSettings(patch: Partial<Settings>): void {
    const current = getSettings()
    const updated = { ...current, ...patch }
    saveSettings(updated)
  }

  function initSettings(): void {
    if (localStorage.getItem(STORAGE_KEY) !== null)
        return;
    
    saveSettings(defaultSettings)
  }

  return {
    getSettings,
    saveSettings,
    updateSettings,
    initSettings,
  }
}

export default useSettingsService