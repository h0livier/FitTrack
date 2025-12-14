<script setup lang="ts">
import { ref, computed } from 'vue'
import FitHeader from '~/components/FitHeader.vue'
import StatsPanel from '~/components/StatsPanel.vue'

const { initSettings } = useSettingsService()

initSettings()

const recentWorkouts = ref([
  { id: 1, name: 'Morning Run', duration: '35m', kcal: 320, date: '2025-11-22' },
  { id: 2, name: 'HIIT', duration: '20m', kcal: 220, date: '2025-11-21' },
  { id: 3, name: 'Yoga', duration: '45m', kcal: 150, date: '2025-11-20' },
])

const weeklyGoal = ref({ target: 7, completed: 5 })

const activities = ref([
  'Started Fittrack',
  'Reached 100 workouts',
  'New personal best: 5k run',
])

const completionPercent = computed(() => Math.round((weeklyGoal.value.completed / weeklyGoal.value.target) * 100))
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content p-6">
    <FitHeader />

    <main class="mt-6">

      <h2 class="text-xl font-bold mb-2">Statistiques</h2>
      <section class="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        <StatsPanel />
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <table-weighings-table />
      </section>
    </main>
  </div>
</template>

<style scoped>
.text-muted { color: var(--color-base-content, rgba(0,0,0,0.6)); opacity: 0.8 }
.radial-progress { --value: 0; width: 3.5rem; height: 3.5rem }
</style>