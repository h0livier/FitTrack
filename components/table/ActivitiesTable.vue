<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Activity } from '../../composables/useActivityService'
import { useActivityService } from '../../composables/useActivityService'
import AppDialog from '../AppDialog.vue'
import ActivityForm from '../forms/ActivityForm.vue'

const { getActivities, clearActivities, saveActivity, updateActivity, deleteActivity } = useActivityService()

const activities = ref<Activity[]>([])
const editing = ref<Activity | null>(null)
const dialogOpen = ref(false)
const isAddMode = ref(false)

function load() {
  activities.value = getActivities().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

onMounted(() => load())

function openAdd() {
  editing.value = null
  isAddMode.value = true
  dialogOpen.value = true
}

function openEdit(item: Activity) {
  editing.value = { ...item }
  isAddMode.value = false
  dialogOpen.value = true
}

function closeDialog() {
  editing.value = null
  isAddMode.value = false
  dialogOpen.value = false
}

function onDelete(id: string) {
  if (typeof window !== 'undefined' && window.confirm('Supprimer cette activité ?')) {
    deleteActivity(id)
    load()
  }
}

</script>

<template>
  <div class="overflow-x-auto">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold">Historique des activités</h3>
      <div class="flex gap-2">
        <button type="button" class="btn btn-sm" @click="load">Rafraîchir</button>
        <button type="button" class="btn btn-sm btn-success" @click="openAdd">Ajouter</button>
      </div>
    </div>

    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>Pas</th>
          <th>Calories</th>
          <th>Créé</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in activities" :key="a.id">
          <td>{{ a.steps }}</td>
          <td>{{ a.calories }}</td>
          <td>{{ new Date(a.createdAt).toLocaleString() }}</td>
          <td class="flex gap-2">
            <button class="btn btn-xs btn-primary" @click="openEdit(a)">Éditer</button>
            <button class="btn btn-xs btn-error" @click="onDelete(a.id)">Supprimer</button>
          </td>
        </tr>
        <tr v-if="activities.length === 0">
          <td colspan="4" class="text-center">Aucune activité enregistrée</td>
        </tr>
      </tbody>
    </table>

    <AppDialog v-model="dialogOpen" :title="isAddMode ? 'Ajouter une activité' : 'Modifier l\'activité'" :cancelText="'Fermer'" @cancel="closeDialog">
      <ActivityForm
        v-if="dialogOpen"
        :saveActivity="(data) => {
          if (isAddMode) {
            saveActivity(data)
            load()
          } else if (editing?.id) {
            updateActivity(editing.id, { ...data })
            load()
          }
          closeDialog()
        }"
        :steps="editing?.steps"
        :calories="editing?.calories"
      />
    </AppDialog>
  </div>
</template>
