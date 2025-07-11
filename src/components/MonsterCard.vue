<script setup>
import { computed, ref, inject } from 'vue';

const props = defineProps({
  monster: Object, 
})

const baseUrl = import.meta.env.BASE_URL;

const expandedItemId = ref(null);
const itemsDatabase = inject('itemsDatabase'); 
const ensureItemsDatabase = inject('ensureItemsDatabase'); 
const releasedMonsters = inject('releasedMonsters');

const toggleItemDetails = async (drop) => {
  const itemId = drop.item_id;
  if (ensureItemsDatabase) {
      await ensureItemsDatabase();
  }
  expandedItemId.value = (expandedItemId.value === itemId) ? null : itemId;
};

// 狀態與能力值的中文對照表
const STAT_MAP = {
  Str: 'STR', Agi: 'AGI', Vit: 'VIT', Int: 'INT', Dex: 'DEX', Luk: 'LUK',
  bStr: 'STR', bAgi: 'AGI', bVit: 'VIT', bInt: 'INT', bDex: 'DEX', bLuk: 'LUK',
  Atk: 'ATK', Matk: 'MATK', Def: 'DEF', Mdef: 'MDEF', Hit: 'HIT', Flee: 'FLEE',
  bAtk: 'ATK', bMatk: 'MATK', bDef: 'DEF', bMdef: 'MDEF', bHit: 'HIT', bFlee: 'FLEE',
  Cri: 'CRI', bCri: 'CRI', Flee2: '完全迴避', bFlee2: '完全迴避',
  BaseAtk: '基礎ATK', bBaseAtk: '基礎ATK', AtkRate: 'ATK',
  DefRate: 'DEF', MdefRate: 'MDEF',
  Hp: 'MaxHP', Sp: 'MaxSP', bMaxHP: 'MaxHP', bMaxSP: 'MaxSP',
  MaxHPRate: 'MaxHP', MaxSPRate: 'MaxSP',
  Speed: '移動速度', Aspd: '攻擊速度', AspdRate: '攻擊速度',
  bHitRate: '命中率', bFleeRate: '迴避率',
  CritRate: 'CRI',
};

const RACE_MAP = {
  RC_Formless: '無形', RC_Undead: '不死', RC_Brute: '動物', RC_Plant: '植物', RC_Insect: '昆蟲',
  RC_Fish: '魚貝', RC_Demon: '惡魔', RC_DemiHuman: '人形', RC_Angel: '天使', RC_Dragon: '龍族'
};

const ELEMENT_MAP = {
  Ele_Neutral: '無', Ele_Water: '水', Ele_Earth: '地', Ele_Fire: '火', Ele_Wind: '風',
  Ele_Poison: '毒', Ele_Holy: '聖', Ele_Dark: '暗', Ele_Ghost: '念', Ele_Undead: '不死'
};

// 效果解析函式 (作為備用方案)
const formattedEffects = computed(() => {
  if (!expandedItemId.value || !itemsDatabase.value) return [];
  const item = itemsDatabase.value[expandedItemId.value];
  if (!item || !item.script) return [];

  const effects = [];
  const script = item.script;
  
  // 1. 解析 bonus bStat, value;
  const bonusRegex = /bonus\s+b(\w+),(-?\d+);/g;
  let match;
  while ((match = bonusRegex.exec(script)) !== null) {
    const statKey = `b${match[1]}`;
    const statName = STAT_MAP[statKey] || match[1];
    const value = parseInt(match[2], 10);
    effects.push(`${statName} ${value >= 0 ? '+' : ''}${value}`);
  }

  // 2. 解析 bonus2, bonus4 等
  const bonus2Regex = /bonus2?\s+b(\w+),"?([^,"]+)"?,?(\d+)?;?/g;
  while ((match = bonus2Regex.exec(script)) !== null) {
    const effectKey = match[1];
    const effectVal = match[2];
    
    if (effectKey === 'AddRace') {
      const race = RACE_MAP[effectVal] || effectVal;
      effects.push(`對「${race}」系魔物增加 ${match[3]}% 的物理傷害`);
    } else if (effectKey === 'AddEle') {
      const element = ELEMENT_MAP[effectVal] || effectVal;
      effects.push(`對「${element}」屬性魔物增加 ${match[3]}% 的物理傷害`);
    } else if (effectKey === 'MagicAddRace') {
       const race = RACE_MAP[effectVal] || effectVal;
      effects.push(`對「${race}」系魔物增加 ${match[3]}% 的魔法傷害`);
    } else if (effectKey === 'SubRace') {
      const race = RACE_MAP[effectVal] || effectVal;
      effects.push(`受到「${race}」系魔物的傷害減少 ${match[3]}%`);
    } else {
        const statName = STAT_MAP[effectKey] || effectKey;
        effects.push(`${statName} +${effectVal}`);
    }
  }
  
  // 移除重複的效果
  return [...new Set(effects)];
});

// 清理名稱中的機率文字
const getDropName = (drop) => {
  if (typeof drop.name !== 'string') return 'N/A';
  return drop.name.replace(/\s*\(\s*[\d.]+%?\s*\)\s*$/, '').replace(/\s+[\d.]+%?\s*$/, '').trim();
};

// 格式化掉落率
const getDropRate = (drop) => {
  if (typeof drop.rate === 'number' && drop.rate > 0) {
    return drop.rate % 1 === 0 ? `${drop.rate}%` : `${parseFloat(drop.rate.toFixed(2))}%`;
  }
  if (typeof drop.name === 'string') {
    let match = drop.name.match(/([\d.]+%)\s*$/) || drop.name.match(/\(\s*([\d.]+%)\s*\)/);
    if (match) return match[1];
  }
  return '';
};

const formatStatValue = (value) => {
    return (typeof value === 'number' && !String(value).includes('-')) ? `${value}-` : value;
}

const attackRange = computed(() => {
    if (!props.monster.stats || !props.monster.stats.attack) return 'N/A';
    const atk = props.monster.stats.attack;
    return atk.min === atk.max ? atk.min : `${atk.min}-${atk.max}`;
});

// 將描述文字按句號分割，用於顯示
const officialDescriptionLines = computed(() => {
    if (!expandedItemId.value || !itemsDatabase.value) return [];
    const item = itemsDatabase.value[expandedItemId.value];
    if (!item || !item.description || !item.description.official) return [];
    
    return item.description.official.split('。').map(line => line.trim()).filter(line => line.length > 0);
});

</script>

<template>
  <div class="monster-card-new">
    <div class="card-top">
      <div class="map-icon-container">
        <img :src="`${baseUrl}images/ui/map1.png`" class="map-icon" />
        <img :src="`${baseUrl}images/ui/location.png`" class="location-icon" />
        <div class="spawn-tooltip" v-if="monster.spawns && monster.spawns.length > 0">
          <div v-for="spawn in monster.spawns" :key="spawn.map_name + spawn.description" class="tooltip-item">
            {{ spawn.description.replace('-', '').trim() }} ({{ spawn.map_name }}) {{ spawn.spawn_info || '' }}
          </div>
        </div>
        <div v-else class="spawn-tooltip-empty">暫無出沒資料</div>
      </div>
      <div class="attributes">
        <span>{{ monster.basic_info.race }}</span>
        <span>{{ monster.basic_info.element.type }}屬性</span>
        <span>{{ monster.basic_info.size }}型</span>
      </div>
    </div>
    
    <div class="identity">
      <img :src="`${baseUrl}${monster.image_url}`" :alt="monster.name.zh_tw" class="monster-image-large">
      <div class="monster-name-primary">{{ monster.name.zh_tw }}</div>
      <div class="monster-name-secondary">{{ monster.name.en }}</div>
    </div>

    <div class="stats-list">
        <div class="stat-row"><span class="stat-label">等級</span><span class="stat-value">{{ monster.basic_info.level }}</span></div>
        <div class="stat-row"><span class="stat-label">血量</span><span class="stat-value">{{ monster.stats.hp }}</span></div>
        <div class="stat-row"><span class="stat-label">攻擊力</span><span class="stat-value">{{ attackRange }}</span></div>
        <div class="stat-row"><span class="stat-label">物理防禦</span><span class="stat-value">{{ monster.stats.defense }}</span></div>
        <div class="stat-row"><span class="stat-label">魔法防禦</span><span class="stat-value">{{ monster.stats.magic_defense }}</span></div>
        <div class="stat-row"><span class="stat-label">100%命中</span><span class="stat-value">{{ monster.stats.hit_100_percent }}</span></div>
        <div class="stat-row"><span class="stat-label">95%迴避</span><span class="stat-value">{{ monster.stats.flee_95_percent }}</span></div>
    </div>
    
    <div class="drops-list" v-if="monster.drops && monster.drops.length > 0">
      <template v-for="drop in monster.drops" :key="`${monster.id}-${drop.item_id}`">
        <div class="drop-item-row clickable" @click="toggleItemDetails(drop)">
          <img :src="`${baseUrl}${drop.icon_url}`" :alt="getDropName(drop)" class="drop-icon">
          <span class="drop-name">{{ getDropName(drop) }}</span>
          <span class="drop-rate">{{ getDropRate(drop) }}</span>
        </div>

        <Transition name="expand">
          <div class="item-details-panel" v-if="expandedItemId === drop.item_id">
              <div v-if="!itemsDatabase" class="details-loading">正在載入物品資料庫...</div>
              
              <div v-else-if="itemsDatabase[drop.item_id]" class="details-content">
                <div class="details-basic-info">
                  <span>類型: {{ itemsDatabase[drop.item_id].category }}</span>
                  <span v-if="itemsDatabase[drop.item_id].attributes.weight">重量: {{ itemsDatabase[drop.item_id].attributes.weight }}</span>
                </div>
                
                <div class="effects-section" v-if="itemsDatabase[drop.item_id].description.official && itemsDatabase[drop.item_id].description.official.trim() !== '- 沒有 -'">
                    <div v-for="(line, index) in officialDescriptionLines" :key="index" class="effect-item">
                        {{ line }}。
                    </div>
                </div>
                <div class="effects-section" v-else-if="formattedEffects.length > 0">
                    <div v-for="effect in formattedEffects" :key="effect" class="effect-item">{{ effect }}</div>
                </div>

                <div class="dropped-by-section" v-if="itemsDatabase[drop.item_id].dropped_by.length > 1">
                    <h5>其他掉落來源</h5>
                    <div class="monster-drop-list">
                        <template v-for="mob in itemsDatabase[drop.item_id].dropped_by" :key="mob.monster_id">
                            <div v-if="mob.monster_id != monster.id && releasedMonsters && releasedMonsters[mob.monster_id]?.released" class="monster-drop-item">
                                <span>{{ mob.name }}</span>
                                <span class="rate">{{ mob.rate }}%</span>
                            </div>
                        </template>
                    </div>
                </div>
              </div>
              
              <div v-else class="details-error">找不到 ID:{{ drop.item_id }} 的物品資料。</div>
          </div>
        </Transition>
      </template>
    </div>
    <div class="drops-list-placeholder" v-else></div>
  </div>
</template>

<style scoped lang="scss">
.monster-card-new {
  width: 280px;
  background-color: #F7F2EB;
  border-radius: 8px;
  border: 1px solid #DCD3C9;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  color: #6D635A;
  transition: all 0.2s ease-in-out;
  font-family: 'Noto Sans TC', sans-serif;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: #c8bfae;
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.map-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: help;

  .map-icon {
    width: 24px;
    height: 24px;
  }
  .location-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  .spawn-tooltip, .spawn-tooltip-empty {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4a423a;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 10;
    transition: opacity 0.2s, visibility 0.2s;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: #4a423a transparent transparent transparent;
    }
  }
  
  &:hover .spawn-tooltip, &:hover .spawn-tooltip-empty {
    visibility: visible;
    opacity: 1;
  }
}

.attributes {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  
  span {
    background-color: #e8e3dc;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.monster-image-large {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 8px;
}

.monster-name-primary {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a423a;
}

.monster-name-secondary {
  font-size: 0.9rem;
  color: #B2A99F;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
  border-top: 1px solid #e8e3dc;
  border-bottom: 1px solid #e8e3dc;
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.stat-label {
  color: #8a7e72;
}

.stat-value {
  font-weight: 500;
  color: #5c5248;
}

.drops-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.drops-list-placeholder {
  min-height: 100px; 
  flex-grow: 1;
}


.drop-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &.clickable {
    cursor: pointer;
    &:hover {
      background-color: #e8e3dc;
    }
  }
}

.drop-icon {
  width: 24px;
  height: 24px;
}

.drop-name {
  flex-grow: 1;
  font-size: 0.9rem;
}

.drop-rate {
  font-size: 0.9rem;
  color: #8a7e72;
  font-weight: 500;
  min-width: 50px;
  text-align: right;
}

.item-details-panel {
  padding: 12px 16px;
  background-color: #e8e3dc;
  border-top: 1px solid #dcd3c9;
  color: #5c5248;
  font-size: 0.9rem;
  margin: 4px -4px -4px -4px;
  border-radius: 0 0 4px 4px;
}

.details-basic-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #8a7e72;
  font-size: 0.85rem;
}

.effects-section {
  border-top: 1px dashed #c8bfae;
  padding-top: 10px;
}

.effect-item {
  color: #3b6b8b;
  margin-bottom: 6px;
  font-weight: 500;
  line-height: 1.5;
}

.dropped-by-section {
  border-top: 1px dashed #c8bfae;
  padding-top: 10px;
  margin-top: 12px;
}

.dropped-by-section h5 {
  margin: 0 0 8px 0;
  font-weight: bold;
  color: #6d635a;
}

.monster-drop-list {
  font-size: 0.9rem;
}

.monster-drop-item {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.monster-drop-item .rate {
  color: #8a7e72;
}

.details-loading, .details-error {
  text-align: center;
  padding: 16px;
  color: #8a7e72;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}
</style>