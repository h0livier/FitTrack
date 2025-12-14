<script setup lang="ts">
useHead({
  title: 'FitTrack',
  meta: [
    { name: 'description', content: "Simple Web App permettant le suivi du poids." }
  ],
  link: [
    { rel: 'manifest', href: '/manifest.json' }
  ],
})
</script>
<template>
  <NuxtPage />
</template>
