<script setup lang="ts">
const props = defineProps<{
  saveWeighing: (data: {
    date: string
    height_cm: number | null
    weight_kg: number | null
    fat_percent: number | null
    muscle_kg: number | null
    water_percent: number | null
  }) => void
  date?: string
  height_cm?: number | null
  weight_kg?: number | null
  fat_percent?: number | null
  muscle_kg?: number | null
  water_percent?: number | null
  trackHydration?: boolean
}>()


function resetModel() {
  weighModel.date = props.date ?? new Date().toISOString().slice(0, 10)
  weighModel.height_cm = props.height_cm ?? null
  weighModel.weight_kg = props.weight_kg ?? null
  weighModel.fat_percent = props.fat_percent ?? null
  weighModel.muscle_kg = props.muscle_kg ?? null
  weighModel.water_percent = props.water_percent ?? null
}

const weighModel = reactive({
  date: props.date ?? new Date().toISOString().slice(0, 10),
  height_cm: props.height_cm ?? null as number | null,
  weight_kg: props.weight_kg ?? null as number | null,
  fat_percent: props.fat_percent ?? null as number | null,
  muscle_kg: props.muscle_kg ?? null as number | null,
  water_percent: props.water_percent ?? null as number | null,
})

function onSubmit() {
  props.saveWeighing({
    date: weighModel.date,
    height_cm: weighModel.height_cm,
    weight_kg: weighModel.weight_kg,
    fat_percent: weighModel.fat_percent,
    muscle_kg: weighModel.muscle_kg,
    water_percent: props.trackHydration ? weighModel.water_percent : null,
  })
  resetModel()
}
</script>

<template>
  <form class="space-y-2" @submit.prevent="onSubmit">
    <div class="form-control">
        <legend class="fieldset-legend">Date de la pesée</legend>
        <input v-model="weighModel.date" type="date" class="input input-bordered" />
    </div>

    <div class="form-control">
        <legend class="fieldset-legend">Taille (cm)</legend>
        <input v-model="weighModel.height_cm" type="number" step="0.1" class="input input-bordered" placeholder="ex: 175" />
    </div>

    <div class="form-control">
        <legend class="fieldset-legend">Poids (kg)</legend>
        <input v-model="weighModel.weight_kg" type="number" step="0.1" class="input input-bordered" placeholder="ex: 70.5" />
    </div>

    <div>
        <legend class="fieldset-legend">Masse grasse (%)</legend>
        <input v-model="weighModel.fat_percent" type="number" step="0.1" class="input input-bordered grow" placeholder="ex: 18.2" />
    </div>

    <div class="form-control">
        <legend class="fieldset-legend">Masse musculaire (kg)</legend>
        <input v-model="weighModel.muscle_kg" type="number" step="0.1" class="input input-bordered" placeholder="ex: 30.0" />
    </div>

    <div v-if="props.trackHydration">
        <legend class="fieldset-legend">Pourcentage d'eau (%)</legend>
        <input v-model="weighModel.water_percent" type="number" step="0.1" class="input input-bordered grow" placeholder="ex: 60.0" />
    </div>

    <div class="form-control">
      <button type="submit" class="btn btn-primary">Enregistrer</button>
    </div>
  </form>
</template>
