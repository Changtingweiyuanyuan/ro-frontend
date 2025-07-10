<script setup>
defineProps({
  monster: Object,
})

// 格式化掉落率，使其符合 xx.xx% 的格式
const formatRate = (rate) => {
    if (typeof rate !== 'number') return 'N/A';
    return `${rate.toFixed(2)}%`;
}
</script>

<template>
  <div class="monster-card">
    <div class="card-header">
        <div class="header-left">
            <div class="name-line">
                <span class="monster-name">{{ monster.name.zh_tw }}</span>
                <div class="spawn-tooltip-container">
                    <!-- <img src="/images/ui/icon_map.png" alt="地圖圖示" class="map-icon"> -->
                    <div class="spawn-tooltip">
                        <div class="tooltip-header">出沒地圖 (點擊可複製)</div>
                        <div v-if="monster.spawn_locations && monster.spawn_locations.length">
                            <div v-for="loc in monster.spawn_locations" :key="loc.map_name" class="location-item">
                                <p>地圖: {{ loc.map_name }}</p>
                                <p>數量: {{ loc.quantity }}</p>
                                <p>重生: {{ loc.respawn_time }}</p>
                            </div>
                        </div>
                        <div v-else class="location-item">
                            <p>地圖: 斐揚樹林(pay_fild08)</p>
                            <p>數量: 非常多</p>
                            <p>重生: 極快</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="basic-info">
                <span>等級 {{ monster.basic_info.level }}</span>
                <span>種族: {{ monster.basic_info.race }}</span>
                <span>屬性: {{ monster.basic_info.element.type }}{{ monster.basic_info.element.level }}</span>
                <span>體型: {{ monster.basic_info.size }}</span>
            </div>
        </div>
        <img :src="monster.image_url" :alt="monster.name.zh_tw" class="monster-image">
    </div>

    <div class="stats-grid">
        <div><span>血量</span><span>{{ monster.stats.hp }}</span></div>
        <div><span>攻擊力</span><span>{{ monster.stats.attack.min }} - {{ monster.stats.attack.max }}</span></div>
        <div><span>物理防禦</span><span>{{ monster.stats.defense }}</span></div>
        <div><span>魔法防禦</span><span>{{ monster.stats.magic_defense }}</span></div>
        <div><span>100%命中</span><span>{{ monster.stats.hit_100_percent }}</span></div>
        <div><span>95%迴避</span><span>{{ monster.stats.flee_95_percent }}</span></div>
    </div>
    
    <div v-if="monster.drops && monster.drops.length > 0" class="drops-section">
        <div class="title">掉落物</div>
        <div class="drops-grid">
            <div v-for="drop in monster.drops" :key="drop.item_id" class="drop-item">
                <img :src="drop.icon_url" :alt="drop.name" :title="`${drop.name} (${formatRate(drop.rate)})`" class="drop-icon">
                <span class="drop-rate">{{ formatRate(drop.rate) }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monster-card {
  background-color: #E7DBCB;
  border: 1.5px solid #5A4736;
  border-radius: 5px;
  padding: 10px;
  color: #3D2D1B;
  font-size: 14px;
  box-shadow: 2px 2px 0px 0px #5A4736;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  .header-left {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
  }
  
  .monster-image {
    width: 56px;
    height: 56px;
    border: 1.5px solid #5A4736;
    background-color: #C3B9AA;
    flex-shrink: 0;
  }
}

.name-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;

  .monster-name {
    font-weight: bold;
    font-size: 18px;
    color: #000;
  }
}

.basic-info {
  font-size: 12px;
  color: #6a5a4a;
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 16px;

    div {
        display: flex;
        justify-content: space-between;
        
        span:first-child {
            color: #6a5a4a;
        }
        span:last-child {
            font-weight: bold;
        }
    }
}

.drops-section {
    border-top: 1.5px solid #C8BFAE;
    padding-top: 10px;

    .title {
        font-weight: bold;
        margin-bottom: 8px;
    }
    .drops-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
        gap: 12px 8px;

        .drop-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            
            .drop-icon {
                width: 24px;
                height: 24px;
                margin-bottom: 2px;
            }

            .drop-rate {
                color: #5A4736;
            }
        }
    }
}

// 提示框樣式
.spawn-tooltip-container {
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-left: 8px;

    .map-icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }

    .spawn-tooltip {
        visibility: hidden;
        width: 240px;
        background-color: rgba(40, 40, 40, 0.95);
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 8px 12px;
        position: absolute;
        z-index: 10;
        bottom: 135%;
        left: 50%;
        margin-left: -120px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 13px;
        line-height: 1.5;
        border: 1px solid #fff;

        &::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #fff transparent transparent transparent;
        }

        .tooltip-header {
            font-weight: bold;
            color: #ffdf5e;
            margin-bottom: 5px;
            border-bottom: 1px solid #777;
            padding-bottom: 5px;
        }
        
        .location-item:not(:last-child) {
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 1px dashed #555;
        }
    }

    &:hover .spawn-tooltip {
        visibility: visible;
        opacity: 1;
    }
}
</style>