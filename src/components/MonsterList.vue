<script setup>
import { provide, ref } from 'vue';
import MonsterCard from './MonsterCard.vue'
import releasedMonsters from '../data/released_monsters.json';

defineProps({
  monsters: Array,
})

const baseUrl = import.meta.env.BASE_URL;
const itemsDatabase = ref(null);
const isLoadingItems = ref(false);

const ensureItemsDatabase = async () => {
    if (itemsDatabase.value || isLoadingItems.value) return;
    
    isLoadingItems.value = true;
    try {
        const response = await fetch(`${baseUrl}data/items_database.json`);
        itemsDatabase.value = await response.json();
    } catch (e) {
        console.error("Failed to load items database:", e);
    } finally {
        isLoadingItems.value = false;
    }
}

provide('itemsDatabase', itemsDatabase);
provide('ensureItemsDatabase', ensureItemsDatabase);
provide('releasedMonsters', releasedMonsters);
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
  /* 確保容器佔滿整個可用寬度 */
  width: 100%;
  margin-top: 24px;
}
.monster-grid {
  display: flex;
  flex-wrap: wrap;
  /* 讓卡片在容器內水平置中 */
  justify-content: center; 
  gap: 16px;
}
.no-results {
  color: #B2A99F;
  text-align: center;
  font-size: 1.2rem;
  padding: 40px;
}
</style>