<script setup>
import { computed } from 'vue';

const props = defineProps({
  monster: Object,
})

// 格式化掉落率，使其符合 xx.xx% 的格式
const formatRate = (rate) => {
  if (typeof rate !== 'number') return 'N/A';
  // 根據掉落率決定小數位數，讓整數%看起來更乾淨
  if (rate % 1 === 0) {
    return `${rate}%`;
  }
  return `${rate.toFixed(2)}%`;
}

// 【新增】格式化需要特殊顯示的數值，例如防禦力
// 根據圖片，如果只有一個值，後面補上 '-'
const formatStatValue = (value) => {
    if (typeof value === 'number' && !String(value).includes('-')) {
        return `${value}-`;
    }
    return value;
}

// 【新增】處理攻擊力範圍的計算屬性
const attackRange = computed(() => {
    const atk = props.monster.stats.attack;
    if (atk.min === atk.max) {
        return atk.min;
    }
    return `${atk.min} - ${atk.max}`;
});

// 地圖複製功能 (保留，但暫時沒有觸發點)
const copyMapCode = async (code) => {
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    alert(`地圖代碼已複製: ${code}`);
  } catch (err) {
    console.error('複製失敗: ', err);
  }
}
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
        <img :src="drop.icon_url" :alt="drop.name" class="drop-icon">
        <span class="drop-name">{{ drop.name }}</span>
        <span class="drop-rate">{{ formatRate(drop.rate) }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
// 主卡片樣式
.monster-card-new {
  background-color: #f4f1eb;
  border: 1px solid #dcd8d0;
  border-radius: 8px;
  padding: 12px; // 調整內邊距
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #594a41;
  width: 220px; // 調整寬度以符合圖二風格
  margin: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  display: flex; // 使用 flexbox 進行內部排版
  flex-direction: column;
}

// 頂部區塊: 屬性
.card-top {
  display: flex;
  justify-content: flex-end; // 移除地圖圖示後，讓屬性靠右
  align-items: flex-start;
  margin-bottom: 8px; // 調整下方間距
}

.attributes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px; // 微調字體大小
  font-weight: 500;
  color: #d66853;
  line-height: 1.4;
}

// 魔物核心區塊: 圖片 & 名稱
.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px; // 調整下方間距
}

.monster-image-large {
  width: 56px; // 調整圖片大小
  height: 56px;
  object-fit: contain;
  margin-bottom: 8px; // 調整下方間距
}

.monster-name-primary {
  font-size: 20px; // 調整字體大小
  font-weight: bold;
  color: #3d2d1b;
  margin-bottom: 2px;
}

.monster-name-secondary {
  font-size: 14px; // 調整字體大小
  color: #8c7f76;
}

// 能力值列表
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 8px; // 調整行間距
  margin-bottom: 12px; // 調整下方間距
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px; // 調整字體大小
}

.stat-label {
  color: #8c7f76;
}

.stat-value {
  font-weight: 600;
  color: #3d2d1b;
}

// 掉落物列表
.drops-list {
  border-top: 1px solid #e0dace; // 將分隔線移到此處
  padding-top: 12px; // 在線的上方增加間距
  display: flex;
  flex-direction: column;
  gap: 10px; // 調整行間距
}

.drop-item-row {
  display: flex;
  align-items: center;
  gap: 10px; // 調整元件間距
}

.drop-icon {
  width: 24px; // 調整圖示大小
  height: 24px;
  background-color: rgba(0,0,0,0.05);
  border-radius: 4px;
  flex-shrink: 0;
}

.drop-name {
  flex-grow: 1;
  font-size: 14px; // 調整字體大小
  font-weight: 500;
}

.drop-rate {
  font-size: 14px; // 調整字體大小
  font-weight: 600;
  color: #3d2d1b;
}
</style>