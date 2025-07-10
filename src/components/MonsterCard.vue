<script setup>
import { computed } from 'vue';

const props = defineProps({
  monster: Object,
})

// 解析掉落物名稱的函式
const parseDropName = (fullName) => {
  if (typeof fullName !== 'string') return '';
  const match = fullName.match(/^(.*?)\s*\(/);
  return match ? match[1].trim() : fullName;
}

// 解析掉落物機率的函式
const parseDropRate = (fullName) => {
  if (typeof fullName !== 'string') return '';
  const rateMatch = fullName.match(/([\d.]+%)/);
  return rateMatch ? rateMatch[1] : '';
}

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
        <img :src="drop.icon_url" :alt="parseDropName(drop.name)" class="drop-icon">
        <span class="drop-name">{{ parseDropName(drop.name) }}</span>
        <span class="drop-rate">{{ parseDropRate(drop.name) }}</span>
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
  /* 【修改】移除固定寬度，讓網格系統決定寬度 */
  /* width: 220px; */
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  
  /* 【關鍵修改】使用 Flexbox 佈局來控制內部元素的高度 */
  display: flex;
  flex-direction: column;
  height: 100%; /* 確保卡片填滿 Grid Cell 的高度 */
}

.card-top {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-bottom: 8px;
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

// 掉落物列表
.drops-list, .drops-list-placeholder {
  border-top: 1px solid #e0dace;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  /* 【關鍵修改】讓此區塊擴展以填滿父容器的剩餘空間 */
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