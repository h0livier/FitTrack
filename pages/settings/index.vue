<template>
  <div class="min-h-screen bg-base-100 text-base-content p-6">
    <FitHeader />

    <h2 class="text-xl font-bold mb-2 mt-5">Paramètres</h2>
    <!-- Section Export CSV -->
    <div class="card bg-base-200 mb-6">
      <div class="card-body">
        <h2 class="card-title text-xl">
          Exporter les données
        </h2>
        <p class="text-base-content/75 mb-4">
          Téléchargez vos données de poids au format CSV pour les sauvegarder ou les analyser ailleurs.
        </p>
        <div class="card-actions justify-start">
          <button 
            class="btn btn-primary"
            @click="exportWeighingData"
            :disabled="isExporting"
          >
            <span v-if="isExporting" class="loading loading-spinner loading-sm"></span>
            {{ isExporting ? 'Export en cours...' : 'Exporter en CSV' }}
          </button>
        </div>
        <div v-if="exportMessage" class="alert alert-info mt-4">
          {{ exportMessage }}
        </div>
      </div>
    </div>

    <!-- Section Import CSV -->
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title text-xl">
          Importer les données
        </h2>
        <p class="text-base-content/75 mb-4">
          Importez vos données de poids à partir d'un fichier CSV. Colonnes requises: date. <br />Colonnes optionnelles: height_cm, weight_kg, fat_percent, muscle_kg, water_percent.
        </p>
        <div class="space-y-4">
          <div class="form-control">
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              class="file-input file-input-bordered file-input-primary"
              @change="handleFileSelect"
            />
            <label class="label" v-if="selectedFile">
              <span class="label-text-alt">{{ selectedFile.name }}</span>
            </label>
          </div>

          <div v-if="csvPreview.length > 0" class="alert alert-info">
            <div>
              <p class="font-semibold mb-2">Aperçu ({{ csvPreview.length }} ligne(s) détectée(s)):</p>
              <div class="overflow-x-auto text-sm">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Taille (cm)</th>
                      <th>Poids (kg)</th>
                      <th>Gras (%)</th>
                      <th>Muscle (kg)</th>
                      <th>Eau (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in csvPreview.slice(0, 5)" :key="index">
                      <td>{{ row.date }}</td>
                      <td>{{ row.height_cm || '-' }}</td>
                      <td>{{ row.weight_kg || '-' }}</td>
                      <td>{{ row.fat_percent || '-' }}</td>
                      <td>{{ row.muscle_kg || '-' }}</td>
                      <td>{{ row.water_percent || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="csvPreview.length > 5" class="text-base-content/60 mt-2">
                  ... et {{ csvPreview.length - 5 }} ligne(s) de plus
                </p>
              </div>
            </div>
          </div>

          <div class="card-actions justify-start gap-2">
            <button
              class="btn btn-primary"
              @click="importWeighingData"
              :disabled="!selectedFile || isImporting || csvPreview.length === 0"
            >
              <span v-if="isImporting" class="loading loading-spinner loading-sm"></span>
              {{ isImporting ? 'Import en cours...' : 'Importer' }}
            </button>
            <button
              v-if="selectedFile"
              class="btn btn-ghost"
              @click="resetImport"
            >
              Annuler
            </button>
          </div>

          <div v-if="importMessage" :class="['alert', importSuccess ? 'alert-success' : 'alert-error']">
            {{ importMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeightService } from '~/composables/useWeightService'

const { getWeighings, saveWeighing } = useWeightService()

const isExporting = ref(false)
const isImporting = ref(false)
const exportMessage = ref('')
const importMessage = ref('')
const importSuccess = ref(false)
const selectedFile = ref<File | null>(null)
const csvPreview = ref<Array<{
  date: string
  height_cm?: string | number
  weight_kg?: string | number
  fat_percent?: string | number
  muscle_kg?: string | number
  water_percent?: string | number
}>>([])

// Export CSV
async function exportWeighingData() {
  try {
    isExporting.value = true
    exportMessage.value = ''

    const weighings = await getWeighings()

    if (weighings.length === 0) {
      exportMessage.value = 'Aucune donnée à exporter.'
      return
    }

    // Prepare CSV content
    const headers = ['Date', 'Taille (cm)', 'Poids (kg)', 'Gras (%)', 'Muscle (kg)', 'Eau (%)']
    const rows = weighings.map(w => [
      new Date(w.date).toLocaleDateString('fr-FR'),
      w.height_cm?.toString() || '',
      w.weight_kg?.toString() || '',
      w.fat_percent?.toString() || '',
      w.muscle_kg?.toString() || '',
      w.water_percent?.toString() || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(cell).replace(/"/g, '""')
        return escaped.includes(',') ? `"${escaped}"` : escaped
      }).join(','))
    ].join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `fittrack-weighings-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    exportMessage.value = `✓ ${weighings.length} enregistrement(s) exporté(s) avec succès.`
  } catch (error) {
    exportMessage.value = '✗ Erreur lors de l\'export.'
    console.error(error)
  } finally {
    isExporting.value = false
  }
}

// Handle file selection
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  selectedFile.value = file
  csvPreview.value = []
  importMessage.value = ''

  // Parse CSV
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())

      if (lines.length < 2) {
        importMessage.value = '✗ Le fichier CSV doit contenir au moins une ligne de données.'
        importSuccess.value = false
        return
      }

      // Skip header and parse rows
      const dataRows = lines.slice(1).map(line => {
        const [date, height_cm, weight_kg, fat_percent, muscle_kg, water_percent] = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
        return { date, height_cm, weight_kg, fat_percent, muscle_kg, water_percent }
      })

      csvPreview.value = dataRows
    } catch (error) {
      importMessage.value = '✗ Erreur lors de la lecture du fichier CSV.'
      importSuccess.value = false
      console.error(error)
    }
  }

  reader.readAsText(file)
}

// Import CSV
async function importWeighingData() {
  try {
    isImporting.value = true
    importMessage.value = ''

    let successCount = 0
    let errorCount = 0

    for (const row of csvPreview.value) {
      try {
        const dateObj = new Date(row.date.split('/').reverse().join('-'));
        //debugger
        if (isNaN(dateObj.getDate())) {
          errorCount++
          continue
        }

        // Parse optional numeric values
        const height_cm = row.height_cm ? parseFloat(String(row.height_cm)) : null
        const weight_kg = row.weight_kg ? parseFloat(String(row.weight_kg)) : null
        const fat_percent = row.fat_percent ? parseFloat(String(row.fat_percent)) : null
        const muscle_kg = row.muscle_kg ? parseFloat(String(row.muscle_kg)) : null
        const water_percent = row.water_percent ? parseFloat(String(row.water_percent)) : null

        // Validate at least one measurement is provided
        if (!weight_kg && !height_cm && !fat_percent && !muscle_kg && !water_percent) {
          errorCount++
          continue
        }

        await saveWeighing({
          date: dateObj.toISOString().split('T')[0],
          height_cm: height_cm === null || isNaN(height_cm) ? null : height_cm,
          weight_kg: weight_kg === null || isNaN(weight_kg) ? null : weight_kg,
          fat_percent: fat_percent === null || isNaN(fat_percent) ? null : fat_percent,
          muscle_kg: muscle_kg === null || isNaN(muscle_kg) ? null : muscle_kg,
          water_percent: water_percent === null || isNaN(water_percent) ? null : water_percent
        })
        successCount++
      } catch (err) {
        errorCount++
      }
    }

    importSuccess.value = errorCount === 0
    importMessage.value = `✓ ${successCount} enregistrement(s) importé(s).${errorCount > 0 ? ` ✗ ${errorCount} erreur(s).` : ''}`

    if (importSuccess.value) {
      resetImport()
    }
  } catch (error) {
    importSuccess.value = false
    importMessage.value = '✗ Erreur lors de l\'import.'
    console.error(error)
  } finally {
    isImporting.value = false
  }
}

// Reset import
function resetImport() {
  selectedFile.value = null
  csvPreview.value = []
  const input = document.getElementById('csv-file') as HTMLInputElement
  if (input) input.value = ''
}
</script>
