<script setup>
import MonsterCard from './MonsterCard.vue'

defineProps({
  monsters: Array,
})
</script>

<template>
  <div class="monster-list-container">
    <div v-if="monsters && monsters.length > 0" class="monster-grid">
      <MonsterCard v-for="monster in monsters" :key="monster.id" :monster="monster" />
    </div>
    <div v-else class="no-results">
      <p>找不到符合條件的魔物。</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monster-list-container {
  margin-top: 24px;
  width: 100%;
}

.monster-grid {
  display: grid;
  /* 自動填充，每張卡片最小 320px，最大 1fr (佔滿剩餘空間) */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.no-results {
  color: #B2A99F;
  text-align: center;
  font-size: 1.2rem;
  padding: 40px;
}
</style>