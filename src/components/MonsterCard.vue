<script setup>
import { computed } from 'vue';

const props = defineProps({
  monster: Object,
})

// 【最終修正】重寫為智慧型判斷函式，處理多種資料格式
const getDropName = (drop) => {
  if (typeof drop.name !== 'string') return 'N/A';

  // 如果 rate 欄位是有效的數字，代表 name 欄位是乾淨的，直接回傳
  if (typeof drop.rate === 'number' && drop.rate > 0) {
    return drop.name;
  }

  // 如果 rate 欄位無效，則從 name 字串中移除百分比部分
  // 這個正則表達式能同時處理 " (5%)" 和 " 5%" 兩種情況
  return drop.name
    .replace(/\s*\(\s*[\d.]+%?\s*\)\s*$/, '') 
    .replace(/\s+[\d.]+%?\s*$/, '')
    .trim();
};

// 【最終修正】重寫為智慧型判斷函式，處理多種資料格式
const getDropRate = (drop) => {
  // 優先使用 rate 欄位
  if (typeof drop.rate === 'number' && drop.rate > 0) {
    // 格式化數字為百分比字串
    if (drop.rate % 1 === 0) {
      return `${drop.rate}%`;
    }
    // toFixed(2) 會處理小數，例如 0.14 -> "0.14"
    // parseFloat + toFixed 可避免不必要的 .00，例如 5.0 -> 5
    const formattedRate = parseFloat(drop.rate.toFixed(2));
    return `${formattedRate}%`;
  }

  // rate 欄位無效時，備用方案：解析 name 字串
  if (typeof drop.name === 'string') {
    // 嘗試匹配無括號格式，例如 " 5%"
    let match = drop.name.match(/([\d.]+%)\s*$/);
    if (match) return match[1];

    // 嘗試匹配有括號格式，例如 " (5%)"
    match = drop.name.match(/\(\s*([\d.]+%)\s*\)/);
    if (match) return match[1];
  }

  return ''; // 所有方法都找不到，則回傳空字串
};


// 格式化需要特殊顯示的數值
const formatStatValue = (value) => {
    if (typeof value === 'number' && !String(value).includes('-')) {
        return `${value}-`;
    }
    return value;
}

// 處理攻擊力範圍的計算屬性
const attackRange = computed(() => {
    const atk = props.monster.stats.attack;
    if (atk.min === atk.max) {
        return atk.min;
    }
    return `${atk.min} - ${atk.max}`;
});
</script>

<template>
  <div class="monster-card-new">
    <div class="card-top">
      <div class="map-icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>

        <div class="spawn-tooltip" v-if="monster.spawns && monster.spawns.length > 0">
          <div v-for="spawn in monster.spawns" :key="spawn.map_name + spawn.description" class="tooltip-item">
            {{ spawn.description.replace('-', '').trim() }} ({{ spawn.map_name }}) {{ spawn.spawn_info || '' }}
          </div>
        </div>
      </div>

      <div class="attributes">
        <span>{{ monster.basic_info.race }}</span>
        <span>{{ monster.basic_info.element.type }}屬性</span>
        <span>{{ monster.basic_info.size }}型</span>
      </div>
    </div>

    <div class="identity">
      <img :src="monster.image_url" :alt="monster.name.zh_tw" class="monster-image-large">
      <div class="monster-name-primary">{{ monster.name.zh_tw }}</div>
      <div class="monster-name-secondary">{{ monster.name.en }}</div>
    </div>

    <div class="stats-list">
        <div class="stat-row">
            <span class="stat-label">等級</span>
            <span class="stat-value">{{ monster.basic_info.level }}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">血量</span>
            <span class="stat-value">{{ monster.stats.hp }}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">攻擊力</span>
            <span class="stat-value">{{ attackRange }}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">物理防禦</span>
            <span class="stat-value">{{ formatStatValue(monster.stats.defense) }}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">魔法防禦</span>
            <span class="stat-value">{{ formatStatValue(monster.stats.magic_defense) }}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">100%命中</span>
            <span class="stat-value">{{ monster.stats.hit_100_percent }}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">95%迴避</span>
            <span class="stat-value">{{ monster.stats.flee_95_percent }}</span>
        </div>
    </div>

    <div class="drops-list" v-if="monster.drops && monster.drops.length > 0">
        <div v-for="drop in monster.drops" :key="drop.item_id" class="drop-item-row">
            <img :src="drop.icon_url" :alt="getDropName(drop)" class="drop-icon">
            <span class="drop-name">{{ getDropName(drop) }}</span>
            <span class="drop-rate">{{ getDropRate(drop) }}</span>
        </div>
    </div>
    <div class="drops-list-placeholder" v-else></div>

  </div>
</template>

<style scoped lang="scss">
// 主卡片樣式
.monster-card-new {
  background-color: #f4f1eb;
  border: 1px solid #dcd8d0;
  border-radius: 8px;
  padding: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #594a41;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

// 頂部區塊
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.map-icon-container {
  position: relative;
  color: #8c7f76;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px;
  margin: -4px;

  &:hover {
    color: #3d2d1b;
    .spawn-tooltip {
      visibility: visible;
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
}

.spawn-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  background-color: #3d2d1b;
  color: #f4f1eb;
  padding: 8px 12px;
  border-radius: 6px;
  z-index: 10;
  width: max-content;
  max-width: 250px;
  
  bottom: 110%; 
  left: 50%;
  transform: translate(-50%, 10px);
  
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #3d2d1b transparent transparent transparent;
  }
}

.tooltip-item {
  font-size: 13px;
  text-align: left;
}

.attributes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  font-weight: 500;
  color: #d66853;
  line-height: 1.4;
}

.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.monster-image-large {
  width: 56px;
  height: 56px;
  object-fit: contain;
  margin-bottom: 8px;
}

.monster-name-primary {
  font-size: 20px;
  font-weight: bold;
  color: #3d2d1b;
  margin-bottom: 2px;
}

.monster-name-secondary {
  font-size: 14px;
  color: #8c7f76;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.stat-label {
  color: #8c7f76;
}

.stat-value {
  font-weight: 600;
  color: #3d2d1b;
}

.drops-list, .drops-list-placeholder {
  border-top: 1px solid #e0dace;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1; 
}

.drop-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drop-icon {
  width: 24px;
  height: 24px;
  background-color: rgba(0,0,0,0.05);
  border-radius: 4px;
  flex-shrink: 0;
}

.drop-name {
  flex-grow: 1;
  font-size: 14px;
  font-weight: 500;
}

.drop-rate {
  font-size: 14px;
  font-weight: 600;
  color: #3d2d1b;
}
</style>