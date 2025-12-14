<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  weeklyProgress: number
  weeklyGoal: { target: number; completed: number }
}>()

const completionPercent = computed(() => {
  const t = props.weeklyGoal?.target || 1
  const c = props.weeklyGoal?.completed || 0
  return Math.round((c / t) * 100)
})
</script>

<template>
  <div class="card col-span-2 bg-base-200 rounded-lg shadow p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold">Weekly Summary</h3>
      <div class="text-sm text-muted">Progress: {{ props.weeklyProgress }}%</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <div class="h-40 bg-base-100 rounded-lg flex items-center justify-center text-sm text-muted">Chart placeholder</div>
      </div>
      <div class="space-y-3">
        <div class="p-3 bg-base-100 rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-muted">Weekly Goal</div>
              <div class="font-medium">{{ props.weeklyGoal.target }} sessions</div>
            </div>
            <div class="radial-progress bg-primary text-primary-content" :style="`--value:${completionPercent}`">{{ completionPercent }}%</div>
          </div>
        </div>

        <div class="p-3 bg-base-100 rounded-lg">
          <div class="text-sm text-muted">Streak</div>
          <div class="font-medium">12 days</div>
        </div>
      </div>
    </div>
  </div>
</template>
