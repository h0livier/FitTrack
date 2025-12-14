<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { computed } from 'vue'
import { useWeightService } from '~/composables/useWeightService'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

const { getWeighings } = useWeightService()

const currentYear = new Date().getFullYear()

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
    const fat = weighings.value.map(w => w.fat_percent)
    const muscle = weighings.value.map(w => w.muscle_kg)

    return {
        labels,
        datasets: [
            {
                label: 'Weight (kg)',
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                data: weight,
            },
            {
                label: 'Fat (%)',
                borderColor: '#EA580C',
                backgroundColor: 'rgba(234, 88, 12, 0.2)',
                data: fat,
            },
            {
                label: 'Muscle (kg)',
                borderColor: '#16A34A',
                backgroundColor: 'rgba(22, 163, 74, 0.2)',
                data: muscle,
            },
        ],
    }
})

</script>
<template>
<Line
    class="w-3/4 lg:w-2/4"
    id="weight-bar-chart"
    :options="chartOptions"
    :data="chartData"
  />
</template>