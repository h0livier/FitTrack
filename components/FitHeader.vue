<script setup lang="ts">
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>
<template>
  <div class="navbar bg-base-200 rounded-lg p-4">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">FitTrack</NuxtLink>
    </div>
    <div class="flex-none gap-2">
      <NuxtLink to="/settings" class="btn btn-ghost flex items-center gap-2">
        <FontAwesomeIcon :icon="faCog" />
      </NuxtLink>
      <!--
      <NuxtLink to="/weights" class="btn btn-ghost">Weights</NuxtLink>
      <NuxtLink to="/activities" class="btn btn-ghost">Activities</NuxtLink>
      -->
    </div>
  </div>
</template>