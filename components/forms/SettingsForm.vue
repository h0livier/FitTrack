<script setup lang="ts">
import type { Settings } from '../../composables/useSettingsService'

const props = defineProps<{
  saveSettings: (data: Settings) => void
  trackHydration?: boolean
  defaultHeightCm?: number | null
}>()

const settingsModel = reactive({
  trackHydration: props.trackHydration ?? true,
  defaultHeightCm: props.defaultHeightCm ?? null as number | null,
})

function onSubmit() {
  props.saveSettings({
    trackHydration: settingsModel.trackHydration,
    defaultHeightCm: settingsModel.defaultHeightCm,
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Suivre l'hydratation</span>
        <input v-model="settingsModel.trackHydration" type="checkbox" class="checkbox checkbox-primary" />
      </label>
    </div>

    <div class="form-control">
      <legend class="fieldset-legend">Taille par défaut (cm)</legend>
      <input v-model="settingsModel.defaultHeightCm" type="number" step="0.1" class="input input-bordered" placeholder="ex: 175" />
    </div>

    <div class="form-control">
      <button type="submit" class="btn btn-primary">Enregistrer les paramètres</button>
    </div>
  </form>
</template>