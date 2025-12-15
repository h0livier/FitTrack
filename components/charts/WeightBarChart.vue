<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { computed } from 'vue'
import { useWeightService } from '~/composables/useWeightService'
import { useSettingsService } from '~/composables/useSettingsService'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

const { getWeighings } = useWeightService()
const { getSettings } = useSettingsService()

const currentYear = new Date().getFullYear()
const settings = getSettings()

const weighings = computed(() => getWeighings()
    .filter(w => new Date(w.date).getFullYear() === currentYear)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))

const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
}

const chartData = computed(() => {
    const labels = weighings.value.map(w => w.date)
    const weight = weighings.value.map(w => w.weight_kg)

    const datasets = [
        {
            label: 'Weight (kg)',
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            data: weight,
        },
    ]

    if (settings.trackBodyComposition) {
        const fat = weighings.value.map(w => w.fat_percent)
        const muscle = weighings.value.map(w => w.muscle_kg)
        datasets.push({
            label: 'Fat (%)',
            borderColor: '#EA580C',
            backgroundColor: 'rgba(234, 88, 12, 0.2)',
            data: fat,
        })
        datasets.push({
            label: 'Muscle (kg)',
            borderColor: '#16A34A',
            backgroundColor: 'rgba(22, 163, 74, 0.2)',
            data: muscle,
        })
    }

    if (settings.trackHydration) {
        const hydration = weighings.value.map(w => w.water_percent)
        datasets.push({
            label: 'Hydration (%)',
            borderColor: '#77B5FE',
            backgroundColor: 'rgba(119, 181, 254, 0.2)',
            data: hydration,
        })
    }

    return {
        labels,
        datasets,
    }
})

const lastTwoWeighings = computed(() => {
    const sorted = weighings.value
    return sorted.length >= 2 ? [sorted[sorted.length - 2], sorted[sorted.length - 1]] : []
})

const weightDiff = computed(() => {
    if (lastTwoWeighings.value.length < 2) return null
    const [prev, curr] = lastTwoWeighings.value
    if (curr.weight_kg === null || prev.weight_kg === null) return null
    return curr.weight_kg - prev.weight_kg
})

const fatDiff = computed(() => {
    if (lastTwoWeighings.value.length < 2 || !settings.trackBodyComposition) return null
    const [prev, curr] = lastTwoWeighings.value
    if (curr.fat_percent === null || prev.fat_percent === null) return null
    return curr.fat_percent - prev.fat_percent
})

const muscleDiff = computed(() => {
    if (lastTwoWeighings.value.length < 2 || !settings.trackBodyComposition) return null
    const [prev, curr] = lastTwoWeighings.value
    if (curr.muscle_kg === null || prev.muscle_kg === null) return null
    return curr.muscle_kg - prev.muscle_kg
})

const hydrationDiff = computed(() => {
    if (lastTwoWeighings.value.length < 2 || !settings.trackHydration) return null
    const [prev, curr] = lastTwoWeighings.value
    if (curr.water_percent === null || prev.water_percent === null) return null
    return curr.water_percent - prev.water_percent
})

</script>
<template>
    <div class="flex flex-col md:flex-row justify-around items-center my-5 gap-5">
            <Line
            class="w-full md:w-3/4 lg:w-2/4 h-100vh md:h-[50vh] lg:h-[33vh]" 
            id="weight-bar-chart"   
            :options="chartOptions" 
            :data="chartData" />
        
        <div v-if="lastTwoWeighings.length >= 2" class="flex flex-col gap-2 md:gap-8">
            <h2 class="text-xl font-bold mb-2">Différence des 2 dernières pesées</h2>
            <div class="stats stats-vertical lg:stats-horizontal shadow rounded-lg">
                <div class="stat bg-base-200">
                    <div class="stat-title">Différence de poids</div>
                    <div class="stat-value"
                        :class="weightDiff !== null && weightDiff >= 0 ? 'text-error' : 'text-success'">
                        {{ weightDiff !== null ? (weightDiff >= 0 ? '+' : '') + weightDiff.toFixed(1) + ' kg' : 'N/A' }}
                    </div>
                </div>
                <div v-if="settings.trackHydration" class="stat bg-base-200">
                    <div class="stat-title">Différence d'hydratation</div>
                    <div class="stat-value"
                        :class="hydrationDiff !== null && hydrationDiff >= 0 ? 'text-success' : 'text-error'">
                        {{ hydrationDiff !== null ? (hydrationDiff >= 0 ? '+' : '') + hydrationDiff.toFixed(1) + ' %' :
                        'N/A' }}
                    </div>
                </div>
            </div>
            <div class="stats stats-vertical lg:stats-horizontal shadow" v-if="settings.trackBodyComposition">
                <div class="stat bg-base-200">
                    <div class="stat-title">Différence de masse musculaire</div>
                    <div class="stat-value"
                        :class="muscleDiff !== null && muscleDiff >= 0 ? 'text-success' : 'text-error'">
                        {{ muscleDiff !== null ? (muscleDiff >= 0 ? '+' : '') + muscleDiff.toFixed(1) + ' kg' : 'N/A' }}
                    </div>
                </div>
                <div class="stat bg-base-200">
                    <div class="stat-title">Différence de masse grasse</div>
                    <div class="stat-value" :class="fatDiff !== null && fatDiff >= 0 ? 'text-error' : 'text-success'">
                        {{ fatDiff !== null ? (fatDiff >= 0 ? '+' : '') + fatDiff.toFixed(1) + ' %' : 'N/A' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>