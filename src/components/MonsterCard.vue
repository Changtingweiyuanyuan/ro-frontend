<script setup>
import { computed, ref, inject } from 'vue';

const props = defineProps({
  monster: Object, 
})

const baseUrl = import.meta.env.BASE_URL;

const expandedItemId = ref(null);
const itemsDatabase = inject('itemsDatabase'); 
const ensureItemsDatabase = inject('ensureItemsDatabase'); 
//const releasedMonsters = inject('releasedMonsters');

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
	if (typeof drop.rate === 'string' && drop.rate !== '') {
		return drop.rate;
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
        <img :src="`${baseUrl}images/ui/map.png`" class="map-icon" />
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
        <span>{{ monster.basic_info.element.type }}屬性{{ monster.basic_info.element.level }}</span>
        <span>{{ monster.basic_info.size }}型</span>
      </div>
    </div>
    
    <div class="identity">
      <img :src="`${baseUrl}${monster.image_url}`" :alt="`RO 怪物「${monster.name.zh_tw}」的圖片與掉落資訊 (種族:${monster.basic_info.race})`" class="monster-image-large">
      <div class="monster-name-primary">{{ monster.name.zh_tw }}</div>
      <div class="monster-id">ID: {{ monster.id }}</div>
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
          <img :src="`${baseUrl}${drop.icon_url}`" :alt="`RO 怪物「${monster.name.zh_tw}」掉落物品「${getDropName(drop)}」的圖片`" class="drop-icon">
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
                  <span v-if="drop.slot && drop.slot !== '--'">規格: {{ drop.slot }}</span>
                </div>
                
                <div class="effects-section" v-if="itemsDatabase[drop.item_id].description.official && itemsDatabase[drop.item_id].description.official.trim() !== '- 沒有 -'">
                    <div v-for="(line, index) in officialDescriptionLines" :key="index" class="effect-item">
                        {{ line }}。
                    </div>
                </div>
                <div class="effects-section" v-else-if="formattedEffects.length > 0">
                    <div v-for="effect in formattedEffects" :key="effect" class="effect-item">{{ effect }}</div>
                </div>

                <!-- <div class="dropped-by-section" v-if="itemsDatabase[drop.item_id].dropped_by.length > 1">
                    <div class="monster-drop-title">其他掉落來源</div>
                    <div class="monster-drop-list">
                        <template v-for="mob in itemsDatabase[drop.item_id].dropped_by" :key="mob.monster_id">
                            <div v-if="mob.monster_id != monster.id && releasedMonsters && releasedMonsters[mob.monster_id]?.released" class="monster-drop-item">
                                <span>{{ mob.name }}</span>
                                <span class="rate">{{ mob.rate }}%</span>
                            </div>
                        </template>
                    </div>
                </div> -->
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
  width: 260px;
  background-color: #F9E7D0;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 2px 2px 1px #000;
  display: flex;
  flex-direction: column;
  color: #594a41;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 6px 16px rgba(178, 26, 26, 0.08);
    border-color: #c8bfae;
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
	align-items: flex-start;
  margin-bottom: 8px;
}

.map-icon-container {
  position: relative;
	color: #8c7f76;
  cursor: help;

	&:hover {
    color: #3d2d1b;

		.spawn-tooltip {
			visibility: visible;
			opacity: 1;
			transform: translate(0, -12px);
		}
		.spawn-tooltip-empty {
			visibility: visible;
			opacity: 1;
		}
	}

  .map-icon {
    width: 32px;
    height: 32px;
		filter: drop-shadow(2px 2px 0px #000);

		&:hover + .location-icon {
			opacity: 1;
			transform: translate(-23.5px, -12px);
		}
  }
  .location-icon {
    position: absolute;
    width: 20px;
    height: 20px;
    opacity: 0;
    transform: translate(-23.5px, -23px);
		transition: opacity 0.2s ease, transform 0.2s ease;
  }

	.spawn-tooltip {
		visibility: hidden;
		opacity: 0;
		position: absolute;
		background-color: #363636;
		color: #fff;
		border: 1.5px solid #B5A093;
		padding: 8px 12px;
		border-radius: 4px;
		z-index: 2;
		width: max-content;
		max-width: 200px;
		top: calc(100% - 32px);
		left: calc(100% + 8px);
		transform: translate(0, -80px);
		pointer-events: none;
		transition: opacity 0.2s ease, transform 0.2s ease;

		@media (min-width: 576px) {
			max-width: 250px;
		}

		&-empty {
			visibility: hidden;
			opacity: 0;
			position: absolute;
			top: 0;
			left: calc(100% + 8px);
			font-size: 12px;
			font-weight: 500;
			color: #B62B14;
			word-break: keep-all;
			transition: opacity 0.2s ease;
		}
	}

	.tooltip-item {
		font-size: 13px;
		text-align: left;
	}
}

.attributes {
  display: flex;
  gap: 8px;
  
  span {
		background-color: #dcd6b8;
		font-size: 12px;
		font-weight: 500;
		line-height: 18px;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.monster-image-large {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 4px;
}

.monster-name-primary {
  font-size: 20px;
  font-weight: bold;
  color: #2A1F18;
}

.monster-id {
  font-size: 12px;
  color: #a0938a;
  margin-top: 2px;
  margin-bottom: 2px;
}


.monster-name-secondary {
  font-size: 14px;
  color: #8c7f76;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 4px;
  border-bottom: 1.5px solid #dcd6b8;
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.stat-label {
  color: #8c7f76;
}

.stat-value {
  font-weight: 600;
  color: #3d2d1b;
}

.drops-list, .drops-list-placeholder {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
}


.drop-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 2px;
	border: 1px solid transparent;
	user-select: none;
  transition: background-color 0.2s;

  &.clickable {
    cursor: pointer;

		&:has(+ .item-details-panel) {
			background-color: #dcd6b8;
			border: 1px solid #5e6908;

			&:hover {
				background-color: #dcd6b8;
			}
		}

    &:hover {
      background-color: #fa902020;
    }
  }
}

.drop-icon {
  width: 24px;
  height: 24px;
}

.drop-name {
  flex-grow: 1;
  font-size: 14px;
	font-weight: 500;
}

.drop-rate {
  font-size: 14px;
  color: #3d2d1b;
  font-weight: 600;
  min-width: 50px;
  text-align: right;
}

.item-details-panel {
  padding: 12px;
  background-color: #dcd6b850;
  border-top: 1px solid #5e6908;
  color: #5c5248;
  font-size: 0.9rem;
  margin: 4px -4px 0 -4px;
  border-radius: 0 0 4px 4px;
}

.details-content {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.details-basic-info {
  display: flex;
  justify-content: space-between;
  color: #8a7e72;
  font-size: 12px;
}

.effects-section {
  border-top: 1px dashed #c8bfae;
  padding-top: 12px;
}

.effect-item {
  color: #246993;
  font-weight: 500;
	font-size: 14px;
  line-height: 18px;
}

.dropped-by-section {
  border-top: 1px dashed #c8bfae;
  padding-top: 12px;
	font-size: 14px;
}

.monster-drop-title {
  margin-bottom: 4px;
  font-weight: bold;
  color: #6d635a;
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