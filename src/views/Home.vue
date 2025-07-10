<script setup>
import { ref, computed } from 'vue'
import Filter from '../components/Filter.vue'
import MonsterList from '../components/MonsterList.vue'

// 改為相對路徑匯入
import releasedMonstersData from '../data/released_monsters.json'

// 將 glob 路徑改為相對路徑
const monsterModules = import.meta.glob('../data/monsters/*.json', { eager: true });

// 篩選狀態 (保持不變)
const searchQuery = ref('')
const activeRace = ref('ALL')
const activeElement = ref('ALL')
const activeSize = ref('SMALL')

// --- 資料處理 ---

// 1. 取得所有已開放的魔物 ID
const releasedIds = Object.keys(releasedMonstersData)
    .filter(id => releasedMonstersData[id].released);

// 2. 從已匯入的模組中，根據 ID 篩選出對應的魔物資料
const allMonsters = ref(
    releasedIds.map(id => {
        // 同時修正這裡的路徑，使其與上面的 glob 路徑匹配
        return monsterModules[`../data/monsters/${id}.json`]?.default;
    }).filter(m => m) // 過濾掉可能找不到的資料
);

// --- 對應表與篩選邏輯 (保持不變) ---
const raceMap = {
    '無形': 'FORMLESS', '魚貝': 'AQUATIC', '龍族': 'DRAGON',
    '動物': 'BEAST', '天使': 'ANGEL', '惡魔': 'DEMON',
    '昆蟲': 'INSECT', '植物': 'PLANT', '不死': 'UNDEAD', '人形': 'HUMANOID'
};
const elementMap = {
    '無': 'NONE', '水': 'WATER', '地': 'EARTH', '火': 'FIRE',
    '風': 'WIND', '毒': 'POISON', '聖': 'HOLY', '暗': 'DARK',
    '念': 'GHOST', '不死': 'UNDEAD'
};
const sizeMap = {
    '小': 'SMALL', '中': 'MEDIUM', '大': 'LARGE'
};

const filteredMonsters = computed(() => {
    return allMonsters.value.filter(monster => {
        const query = searchQuery.value.toLowerCase().trim()
        const matchesQuery = !query ||
            monster.name.zh_tw.toLowerCase().includes(query) ||
            monster.id.toString().includes(query) ||
            (monster.drops && monster.drops.some(drop => drop.name.toLowerCase().includes(query)));

        const monsterRace = raceMap[monster.basic_info.race]?.toUpperCase();
        const matchesRace = activeRace.value === 'ALL' || monsterRace === activeRace.value;

        const monsterElement = elementMap[monster.basic_info.element.type]?.toUpperCase();
        const matchesElement = activeElement.value === 'ALL' || monsterElement === activeElement.value;

        const monsterSize = sizeMap[monster.basic_info.size]?.toUpperCase();
        const matchesSize = activeSize.value === 'ALL' || monsterSize === activeSize.value;
        
        return matchesQuery && matchesRace && matchesElement && matchesSize;
    })
})
</script>

<template>
  <Filter
    v-model:searchQuery="searchQuery"
    v-model:activeRace="activeRace"
    v-model:activeElement="activeElement"
    v-model:activeSize="activeSize"
  />
  <MonsterList :monsters="filteredMonsters" />
</template>

<style scoped>
/* 這裡可以留空，或像之前一樣加上讀取訊息的樣式，以備不時之需 */
</style>