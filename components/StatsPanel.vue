<script setup lang="ts">
import { computed } from 'vue'
import { useWeightService } from '~/composables/useWeightService'

const { getWeighings } = useWeightService()

const weighings = computed(() => getWeighings())

const stats = computed(() => {
  const items = weighings.value
  if (!items || items.length === 0) {
    return {
      count: 0,
      avgWeight: 0,
      avgFat: 0,
      avgWater: 0,
      weightChange: 0,
    }
  }
  
  const weights = items.map(w => w.weight_kg ?? 0).filter(w => w > 0)
  const fats = items.map(w => w.fat_percent ?? 0).filter(f => f > 0)
  const waters = items.map(w => w.water_percent ?? 0).filter(w => w > 0)
  
  const avgWeight = weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0
  const avgFat = fats.length > 0 ? fats.reduce((a, b) => a + b, 0) / fats.length : 0
  const avgWater = waters.length > 0 ? waters.reduce((a, b) => a + b, 0) / waters.length : 0
  
  // sort by date
  const sorted = items.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const oldest = sorted[0]?.weight_kg ?? 0
  const newest = sorted[sorted.length - 1]?.weight_kg ?? 0
  const weightChange = newest - oldest
  
  return {
    count: items.length,
    avgWeight: Math.round(avgWeight * 10) / 10,
    avgFat: Math.round(avgFat * 10) / 10,
    avgWater: Math.round(avgWater * 10) / 10,
    weightChange: Math.round(weightChange * 10) / 10,
  }
})
</script>

<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow bg-base-200 rounded-lg p-4">
    <div class="stat">
      <div class="stat-title">Pesées enregistrées</div>
      <div class="stat-value">{{ stats.count }}</div>
      <div class="stat-desc">Total d'entrées</div>
    </div>

    <div class="stat">
      <div class="stat-title">Poids moyen</div>
      <div class="stat-value">{{ stats.avgWeight }}</div>
      <div class="stat-desc">kg</div>
    </div>

    <div class="stat">
      <div class="stat-title">Masse grasse moyenne</div>
      <div class="stat-value">{{ stats.avgFat }}</div>
      <div class="stat-desc">%</div>
    </div>

    <div class="stat">
      <div class="stat-title">Hydratation moyenne</div>
      <div class="stat-value">{{ stats.avgWater }}</div>
      <div class="stat-desc">%</div>
    </div>

    <div class="stat">
      <div class="stat-title">Variation poids</div>
      <div class="stat-value">{{ stats.weightChange > 0 ? '+' : '' }}{{ stats.weightChange }}</div>
      <div class="stat-desc">kg depuis le début</div>
    </div>
  </div>
</template>
