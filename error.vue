<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const isPageNotFound = props.error?.statusCode == 404
const errorMessage = isPageNotFound ? "Page not found" : "An error Occured"

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex min-h-screen min-w-screen justify-center">
    <div class="flex flex-col justify-center text-center">
        <h2 class="text-4xl mb-12">Error {{ error?.statusCode }} - {{ errorMessage }}</h2>
        <div>
            <button class="btn-primary btn btn-xl" @click="handleError">Go to Index</button>    
        </div>
    </div>
  </div>
</template>