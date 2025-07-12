<script setup>
import FilterButton from './FilterButton.vue'

const baseUrl = import.meta.env.BASE_URL;

// 接收來自父元件的狀態
defineProps({
  searchQuery: String,
  activeRace: String,
  activeElement: String,
  activeSize: String
})

// 定義這個元件會發出的事件
const emit = defineEmits([
  'update:searchQuery',
  'update:activeRace',
  'update:activeElement',
  'update:activeSize'
])

// 處理搜尋框輸入
const handleInput = (event) => {
  emit('update:searchQuery', event.target.value)
}

// 篩選器按鈕的設定常數 (圖片路徑已根據您的專案結構修正)
const RACES = { ALL: 'ALL', ANGEL: 'ANGEL', AQUATIC: 'AQUATIC', BEAST: 'BEAST', DEMON: 'DEMON', DRAGON: 'DRAGON', FORMLESS: 'FORMLESS', HUMANOID: 'HUMANOID', INSECT: 'INSECT', PLANT: 'PLANT', UNDEAD: 'UNDEAD' };
const raceOptions = [
    { label: RACES.ALL, tooltipText: '全部' },
    { label: RACES.FORMLESS, imgPath: '/images/ui/race-formless.png', tooltipText: '無形' },
    { label: RACES.AQUATIC, imgPath: '/images/ui/race-aquatic.png', tooltipText: '魚貝' },
    { label: RACES.DRAGON, imgPath: '/images/ui/race-dragon.png', tooltipText: '龍族' },
    { label: RACES.BEAST, imgPath: '/images/ui/race-beast.png', tooltipText: '動物' },
    { label: RACES.ANGEL, imgPath: '/images/ui/race-angel.png', tooltipText: '天使' },
    { label: RACES.DEMON, imgPath: '/images/ui/race-demon.png', tooltipText: '惡魔' },
    { label: RACES.INSECT, imgPath: '/images/ui/race-insect.png', tooltipText: '昆蟲' },
    { label: RACES.PLANT, imgPath: '/images/ui/race-plant.png', tooltipText: '植物' },
    { label: RACES.UNDEAD, imgPath: '/images/ui/race-undead.png', tooltipText: '不死' },
    { label: RACES.HUMANOID, imgPath: '/images/ui/race-humanoid.png', tooltipText: '人形' },
];

const ELEMENTS = { ALL: 'ALL', NONE: 'NONE', DARK: 'DARK', EARTH: 'EARTH', FIRE: 'FIRE', GHOST: 'GHOST', HOLY: 'HOLY', POISON: 'POISON', UNDEAD: 'UNDEAD', WATER: 'WATER', WIND: 'WIND' };
const elementOptions = [
    { label: ELEMENTS.ALL, tooltipText: '全部' },
    { label: ELEMENTS.NONE, imgPath: '/images/ui/element-none.png', tooltipText: '無' },
    { label: ELEMENTS.WATER, imgPath: '/images/ui/element-water.png', tooltipText: '水' },
    { label: ELEMENTS.EARTH, imgPath: '/images/ui/element-earth.png', tooltipText: '地' },
    { label: ELEMENTS.FIRE, imgPath: '/images/ui/element-fire.png', tooltipText: '火' },
    { label: ELEMENTS.WIND, imgPath: '/images/ui/element-wind.png', tooltipText: '風' },
    { label: ELEMENTS.POISON, imgPath: '/images/ui/element-poison.png', tooltipText: '毒' },
	{ label: ELEMENTS.HOLY, imgPath: '/images/ui/element-holy.png', tooltipText: '聖' },
    { label: ELEMENTS.DARK, imgPath: '/images/ui/element-dark.png', tooltipText: '暗' },
    { label: ELEMENTS.GHOST, imgPath: '/images/ui/element-ghost.png', tooltipText: '念' },
    { label: ELEMENTS.UNDEAD, imgPath: '/images/ui/element-undead.png', tooltipText: '不死' },
];

const SIZES = { ALL: 'ALL', SMALL: 'SMALL', MEDIUM: 'MEDIUM', LARGE: 'LARGE' };
const sizeOptions = [
    { label: SIZES.ALL, tooltipText: '全部' },
    { label: SIZES.SMALL, tooltipText: '小型' },
    { label: SIZES.MEDIUM, tooltipText: '中型' },
    { label: SIZES.LARGE, tooltipText: '大型' },
];
</script>

<template>
  <div class="filter">
    <div>
      <div class="title">搜尋</div>
      <input
        type="text"
        class="search-input"
        placeholder="請輸入怪物名稱、掉落物"
        :value="searchQuery"
        @input="handleInput"
      />
    </div>
    <div>
      <div class="title">種族</div>
      <div class="btn-options">
        <FilterButton
          v-for="race in raceOptions"
          :key="race.label"
          :text="race.label === RACES.ALL ? race.label.toUpperCase() : undefined"
          :img-path="race.label !== RACES.ALL ? baseUrl + race.imgPath : undefined"
          :tooltip-text="race.label !== RACES.ALL ? race.tooltipText : undefined"
          :is-active="activeRace === race.label"
          @click="emit('update:activeRace', race.label)"
        />
      </div>
    </div>
    <div>
      <div class="title">屬性</div>
      <div class="btn-options">
        <FilterButton
          v-for="el in elementOptions"
          :key="el.label"
          :text="el.label === ELEMENTS.ALL ? el.label.toUpperCase() : undefined"
          :img-path="el.label !== ELEMENTS.ALL ? baseUrl + el.imgPath : undefined"
          :tooltip-text="el.label !== ELEMENTS.ALL ? el.tooltipText : undefined"
          :is-active="activeElement === el.label"
          @click="emit('update:activeElement', el.label)"
        />
      </div>
    </div>
    <div>
      <div class="title">體型</div>
      <div class="btn-options">
        <FilterButton
          v-for="size in sizeOptions"
          :key="size.label"
          :text="size.label.toUpperCase()"
          :tooltip-text="size.label !== SIZES.ALL ? size.tooltipText : undefined"
          :is-active="activeSize === size.label"
          @click="emit('update:activeSize', size.label)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 樣式與您提供的保持一致 */
.filter {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .title {
        color: #B2A99F;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;

				&:has(+ .btn-options) {
					margin-bottom: -8px;
				}
    }

    .search-input {
        width: 100%;
        max-width: 800px;
				margin-bottom: 4px;
        padding: 4px 8px;
        font-size: 16px;
        line-height: 24px;
        color: #fff;
        background-color: #5A4736;
        border: 1.5px solid #B2A99F;
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        filter: drop-shadow(2px 2px 0px black);

        &::placeholder {
            color: #c3b9aa;
        }
    }

    .btn-options {
        display: flex;
				padding-top: 12px;
				padding-bottom: 4px;
        gap: 12px;
				overflow: auto hidden;

			&::-webkit-scrollbar {
				width: 4px;
				height: 4px;
				padding-top: 12px;
				background: transparent;
				visibility: hidden;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 4px;
				visibility: hidden;
			}

			&:hover::-webkit-scrollbar-thumb,
			&:active::-webkit-scrollbar-thumb {
				background: #98AE2A;
				visibility: visible;
			}
    }
}
</style>