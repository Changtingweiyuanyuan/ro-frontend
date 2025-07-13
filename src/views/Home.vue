<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Filter from '../components/Filter.vue'
import MonsterList from '../components/MonsterList.vue'

import allMonstersData from '../data/monsters_display_index.json'

const searchQuery = ref('')
const activeRace = ref('ALL')
const activeElement = ref('ALL')
const activeSize = ref('ALL')

const filteredMonsters = ref([]);
const monstersToShow = ref([]);
const itemsPerLoad = 20;

// 提取出一個共用的函式來清理物品名稱，避免邏輯不一致
const getCleanDropName = (name) => {
  if (typeof name !== 'string') return '';
  return name.replace(/\s*\(\s*[\d.]+%?\s*\)\s*$/, '').replace(/\s+[\d.]+%?\s*$/, '').trim().toLowerCase();
};

const filterAndReset = () => {
    const query = searchQuery.value.toLowerCase().trim();
    
    filteredMonsters.value = allMonstersData.filter(monster => {
        // 【關鍵修改】在搜尋掉落物時，使用清理過的名稱進行比對
        const matchesQuery = !query ||
            monster.name.zh_tw.toLowerCase().includes(query) ||
            monster.id.toString().includes(query) ||
            monster.spawns.some(spawn => spawn.description.includes(query)) ||
            (monster.drops && monster.drops.some(drop => getCleanDropName(drop.name).includes(query)));
        
        const raceMap = { '無形': 'FORMLESS', '魚貝': 'AQUATIC', '龍': 'DRAGON', '動物': 'BEAST', '天使': 'ANGEL', '惡魔': 'DEMON', '昆蟲': 'INSECT', '植物': 'PLANT', '不死': 'UNDEAD', '人形': 'HUMANOID' };
        const elementMap = { '無': 'NONE', '水': 'WATER', '地': 'EARTH', '火': 'FIRE', '風': 'WIND', '毒': 'POISON', '聖': 'HOLY', '暗': 'DARK', '念': 'GHOST', '不死': 'UNDEAD' };
        const sizeMap = { '小': 'SMALL', '中': 'MEDIUM', '大': 'LARGE' };

        const monsterRace = raceMap[monster.basic_info.race] || 'UNKNOWN';
        const matchesRace = activeRace.value === 'ALL' || monsterRace === activeRace.value;
        
        const monsterElement = elementMap[monster.basic_info.element.type] || 'UNKNOWN';
        const matchesElement = activeElement.value === 'ALL' || monsterElement === activeElement.value;

        const monsterSize = sizeMap[monster.basic_info.size] || 'UNKNOWN';
        const matchesSize = activeSize.value === 'ALL' || monsterSize === activeSize.value;
        
        return matchesQuery && matchesRace && matchesElement && matchesSize;
    });

    monstersToShow.value = [];
    loadMoreMonsters();
}

const loadMoreMonsters = () => {
    if (monstersToShow.value.length >= filteredMonsters.value.length) return;
    const currentLength = monstersToShow.value.length;
    const nextMonsters = filteredMonsters.value.slice(currentLength, currentLength + itemsPerLoad);
    monstersToShow.value.push(...nextMonsters);
}

watch([searchQuery, activeRace, activeElement, activeSize], filterAndReset, { immediate: true });

const handleScroll = () => {
    const buffer = 500;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - buffer) {
        loadMoreMonsters();
    }
}

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <Filter
    v-model:searchQuery="searchQuery"
    v-model:activeRace="activeRace"
    v-model:activeElement="activeElement"
    v-model:activeSize="activeSize"
  />
  <MonsterList :monsters="monstersToShow" />
</template>