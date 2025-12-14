<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Weighing } from '../../composables/useWeightService'
import { useWeightService } from '../../composables/useWeightService'
import AppDialog from '../AppDialog.vue'
import WeighForm from '../forms/WeighForm.vue'

const { getWeighings, clearWeighings, saveWeighing, deleteWeighing } = useWeightService()
const { getSettings } = useSettingsService()

const weighings = ref<Weighing[]>([])
const editingWeighing = ref<Weighing | null>(null)
const dialogOpen = ref(false)
const isAddMode = ref(false)
const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(weighings.value.length / itemsPerPage))

const paginatedWeighings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return weighings.value.slice(start, end)
})

function load() {
  // load and sort by date desc
  weighings.value = getWeighings().slice().sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return db - da
  })
  currentPage.value = 1
}

onMounted(() => load())

function onClear() {
  if (typeof window !== 'undefined' && window.confirm('Effacer toutes les pesées ?')) {
    clearWeighings()
    load()
  }
}

function onDelete(id: string) {
  if (typeof window !== 'undefined' && window.confirm('Supprimer cette pesée ?')) {
    deleteWeighing(id)
    load()
  }
}

function openEditDialog(weighing: Weighing) {
  editingWeighing.value = { ...weighing }
  isAddMode.value = false
  dialogOpen.value = true
}

function openAddDialog() {
  const height = getSettings().defaultHeightCm
  if (height) {
    editingWeighing.value = {
      id: '',
      date: new Date().toISOString().slice(0, 10),
      height_cm: height,
      weight_kg: null,
      fat_percent: null,
      muscle_kg: null,
      water_percent: null,
      createdAt: new Date().toISOString(),
    }
  } else
    editingWeighing.value = null

  isAddMode.value = true
  dialogOpen.value = true
}

function closeDialog() {
  editingWeighing.value = null
  isAddMode.value = false
  dialogOpen.value = false
}
</script>

<template>
  <div class="overflow-x-auto">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold">Historique des pesées</h3>
      <div class="flex gap-2">
        <button type="button" class="btn btn-sm" @click="load">Rafraîchir</button>
        <button type="button" class="btn btn-sm btn-success" @click="openAddDialog">Ajouter</button>
        <!--<button type="button" class="btn btn-sm btn-warning" @click="onClear">Effacer</button>-->
      </div>
    </div>

    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table class="table w-full">
      <thead class="bg-primary text-primary-content">
        <tr>
          <th class="text-base font-bold">Date</th>
          <th class="text-base font-bold">Taille (cm)</th>
          <th class="text-base font-bold">Poids (kg)</th>
          <th class="text-base font-bold">Masse grasse (%)</th>
          <th class="text-base font-bold">Masse musculaire (kg)</th>
          <th class="text-base font-bold">Pourcentage d'eau (%)</th>
          <th class="text-base font-bold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in paginatedWeighings" :key="w.id">
          <td>{{ w.date }}</td>
          <td>{{ w.height_cm ?? '-' }}</td>
          <td>{{ w.weight_kg ?? '-' }}</td>
          <td>{{ w.fat_percent ?? '-' }}</td>
          <td>{{ w.muscle_kg ?? '-' }}</td>
          <td>{{ w.water_percent ?? '-' }}</td>
          <td class="flex gap-2">
            <button class="btn btn-xs btn-primary" @click="openEditDialog(w)">Éditer</button>
            <button class="btn btn-xs btn-error" @click="onDelete(w.id)">Supprimer</button>
          </td>
        </tr>
        <tr v-if="weighings.length === 0">
          <td colspan="7" class="text-center">Aucune pesée enregistrée</td>
        </tr>
      </tbody>
    </table>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center mt-4">
      <div class="join">
        <button class="join-item btn" @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
        <span class="join-item btn btn-active">{{ currentPage }} / {{ totalPages }}</span>
        <button class="join-item btn" @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
      </div>
    </div>
    

    <AppDialog
      v-model="dialogOpen"
      :title="isAddMode ? 'Ajouter une pesée' : 'Modifier la pesée'"
      :cancelText="'Fermer'"
      @cancel="closeDialog"
    >
      <WeighForm
        v-if="dialogOpen"
        :saveWeighing="(data) => {
          if (isAddMode) {
            saveWeighing(data);
            load();
          } else if (editingWeighing?.id) {
            const { updateWeighing } = useWeightService();
            updateWeighing(editingWeighing.id, { ...data });
            load();
          }
          closeDialog();
        }"
        :date="editingWeighing?.date"
        :height_cm="editingWeighing?.height_cm"
        :weight_kg="editingWeighing?.weight_kg"
        :fat_percent="editingWeighing?.fat_percent"
        :muscle_kg="editingWeighing?.muscle_kg"
        :water_percent="editingWeighing?.water_percent"
      />
    </AppDialog>
  </div>
</template>
