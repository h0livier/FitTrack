<script setup lang="ts">
const props = defineProps<{
  saveActivity: (data: { steps: number; calories: number }) => void
  steps?: number
  calories?: number
}>()

function resetModel() {
  activity.steps = props.steps ?? 0
  activity.calories = props.calories ?? 0
}

const activity = reactive({
  steps: props.steps ?? 0,
  calories: props.calories ?? 0,
})

function onSubmit() {
  props.saveActivity({ steps: Number(activity.steps), calories: Number(activity.calories) })
  resetModel()
}
</script>

<template>
  <form class="space-y-2" @submit.prevent="onSubmit">
    <div class="form-control">
      <legend class="fieldset-legend">Pas (steps)</legend>
      <input v-model.number="activity.steps" type="number" class="input input-bordered" min="0" />
    </div>

    <div class="form-control">
      <legend class="fieldset-legend">Calories</legend>
      <input v-model.number="activity.calories" type="number" class="input input-bordered" min="0" />
    </div>

    <div class="form-control">
      <button type="submit" class="btn btn-primary">Enregistrer</button>
    </div>
  </form>
</template>
