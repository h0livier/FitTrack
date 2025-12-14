<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: boolean
  title?: string
  confirmText?: string
  cancelText?: string
  triggerText?: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])


import { watch } from 'vue'
const open = ref(props.modelValue ?? false)

// Synchronise open avec modelValue
watch(() => props.modelValue, (val) => {
  open.value = !!val
})

// Émet la nouvelle valeur quand open change
watch(open, (val) => {
  emit('update:modelValue', val)
})

function onConfirm() {
  emit('confirm')
  open.value = false
}

function onCancel() {
  emit('cancel')
  open.value = false
}

function toggleOpen() {
  open.value = !open.value
}
</script>

<template>
  <div>
    
    <button v-if="props.triggerText" type="button" class="btn" @click="toggleOpen">{{ props.triggerText }}</button>
    

    <div v-if="open" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ props.title ?? 'Dialog' }}</h3>

        <div class="py-4">
          <slot />
        </div>

        <div class="modal-action">
          <button type="button" class="btn" @click="onCancel">{{ props.cancelText ?? 'Cancel' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal { z-index: 40 }
</style>
