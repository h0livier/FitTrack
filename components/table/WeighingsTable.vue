<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Weighing } from '../../composables/useWeightService'
import { useWeightService } from '../../composables/useWeightService'
import AppDialog from '../AppDialog.vue'
import WeighForm from '../forms/WeighForm.vue'

const { getWeighings, clearWeighings, saveWeighing, deleteWeighing } = useWeightService()

const weighings = ref<Weighing[]>([])
const editingWeighing = ref<Weighing | null>(null)
const dialogOpen = ref(false)
const isAddMode = ref(false)

function load() {
  // load and sort by date desc
  weighings.value = getWeighings().slice().sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return db - da
  })
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
          <th class="text-base font-bold w-1/6">Date</th>
          <th class="text-base font-bold w-1/6">Taille (cm)</th>
          <th class="text-base font-bold w-1/6">Poids (kg)</th>
          <th class="text-base font-bold w-1/6">Masse grasse (%)</th>
          <th class="text-base font-bold w-1/6">Masse musculaire (kg)</th>
          <th class="text-base font-bold w-1/6">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in weighings" :key="w.id">
          <td>{{ w.date }}</td>
          <td>{{ w.height_cm ?? '-' }}</td>
          <td>{{ w.weight_kg ?? '-' }}</td>
          <td>{{ w.fat_percent ?? '-' }}</td>
          <td>{{ w.muscle_kg ?? '-' }}</td>
          <td class="flex gap-2">
            <button class="btn btn-xs btn-primary" @click="openEditDialog(w)">Éditer</button>
            <button class="btn btn-xs btn-error" @click="onDelete(w.id)">Supprimer</button>
          </td>
        </tr>
        <tr v-if="weighings.length === 0">
          <td colspan="6" class="text-center">Aucune pesée enregistrée</td>
        </tr>
      </tbody>
    </table>
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
      />
    </AppDialog>
  </div>
</template>
