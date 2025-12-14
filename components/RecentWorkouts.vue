<script setup lang="ts">
const props = defineProps<{
  workouts: Array<{ id: number; name: string; duration: string; kcal: number; date: string }>
}>()
</script>

<template>
  <div class="card bg-base-200 rounded-lg shadow p-4">
    <h4 class="text-lg font-semibold mb-2">Recent Workouts</h4>
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Workout</th>
            <th>Duration</th>
            <th>Calories</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in props.workouts" :key="w.id">
            <th>{{ w.id }}</th>
            <td>{{ w.name }}</td>
            <td>{{ w.duration }}</td>
            <td>{{ w.kcal }}</td>
            <td>{{ w.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
