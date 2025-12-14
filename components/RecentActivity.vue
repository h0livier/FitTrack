<script setup lang="ts">
const props = defineProps<{
  activities: string[]
}>()
</script>

<template>
  <div class="card bg-base-200 rounded-lg shadow p-4">
    <h4 class="text-lg font-semibold mb-2">Recent Activity</h4>
    <ul class="timeline">
      <li v-for="(a, idx) in props.activities" :key="idx">{{ a }}</li>
    </ul>
  </div>
</template>
