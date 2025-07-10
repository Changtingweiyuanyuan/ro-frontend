<script setup>
import { ref } from 'vue'
import FilterButton from './FilterButton.vue'



const RACES = {
	ALL: 'all',
	ANGEL: 'angel',
	AQUATIC: 'aquatic',
	BEAST: 'beast',
	DEMON: 'demon',
	DRAGON: 'dragon',
	FORMLESS: 'formless',
	HUMANOID: 'humanoid',
	INSECT: 'insect',
	PLANT: 'plant',
	UNDEAD: 'undead',
};
const raceOptions = [
  { label: RACES.ALL, tooltipText: '全部' },
  { label: RACES.FORMLESS, imgPath: `public/images/ui/race-${RACES.FORMLESS}.png`, tooltipText: '無形' },
  { label: RACES.AQUATIC, imgPath: `public/images/ui/race-${RACES.AQUATIC}.png`, tooltipText: '魚貝' },
  { label: RACES.DRAGON, imgPath: `public/images/ui/race-${RACES.DRAGON}.png`, tooltipText: '龍族' },
  { label: RACES.BEAST, imgPath: `public/images/ui/race-${RACES.BEAST}.png`, tooltipText: '動物' },
  { label: RACES.ANGEL, imgPath: `public/images/ui/race-${RACES.ANGEL}.png`, tooltipText: '天使' },
  { label: RACES.DEMON, imgPath: `public/images/ui/race-${RACES.DEMON}.png`, tooltipText: '惡魔' },
  { label: RACES.INSECT, imgPath: `public/images/ui/race-${RACES.INSECT}.png`, tooltipText: '昆蟲' },
  { label: RACES.PLANT, imgPath: `public/images/ui/race-${RACES.PLANT}.png`, tooltipText: '植物' },
  { label: RACES.UNDEAD, imgPath: `public/images/ui/race-${RACES.UNDEAD}.png`, tooltipText: '不死' },
  { label: RACES.HUMANOID, imgPath: `public/images/ui/race-${RACES.HUMANOID}.png`, tooltipText: '人形' },
];

const activeRace = ref(RACES.ALL);
const setActiveRace = (value) => {
  activeRace.value = value
}

const ELEMENTS = {
	ALL: 'all',
	NONE: 'none',
	DARK: 'dark',
	EARTH: 'earth',
	FIRE: 'fire',
	GHOST: 'ghost',
	HOLY: 'holy',
	POISON: 'poison',
	UNDEAD: 'undead',
	WATER: 'water',
	WIND: 'wind',
};
const elementOptions = [
  { label: ELEMENTS.ALL, tooltipText: '全部' },
  { label: ELEMENTS.NONE, tooltipText: '無' },
  { label: ELEMENTS.WATER, imgPath: `public/images/ui/element-${ELEMENTS.WATER}.png`, tooltipText: '水' },
  { label: ELEMENTS.EARTH, imgPath: `public/images/ui/element-${ELEMENTS.EARTH}.png`, tooltipText: '地' },
  { label: ELEMENTS.FIRE, imgPath: `public/images/ui/element-${ELEMENTS.FIRE}.png`, tooltipText: '火' },
  { label: ELEMENTS.WIND, imgPath: `public/images/ui/element-${ELEMENTS.WIND}.png`, tooltipText: '風' },
  { label: ELEMENTS.POISON, imgPath: `public/images/ui/element-${ELEMENTS.POISON}.png`, tooltipText: '毒' },
  { label: ELEMENTS.HOLY, imgPath: `public/images/ui/element-${ELEMENTS.HOLY}.png`, tooltipText: '聖' },
  { label: ELEMENTS.DARK, imgPath: `public/images/ui/element-${ELEMENTS.DARK}.png`, tooltipText: '暗' },
  { label: ELEMENTS.GHOST, imgPath: `public/images/ui/element-${ELEMENTS.GHOST}.png`, tooltipText: '念' },
  { label: ELEMENTS.UNDEAD, imgPath: `public/images/ui/element-${ELEMENTS.UNDEAD}.png`, tooltipText: '不死' },
];

const activeElement = ref(ELEMENTS.ALL);
const setActiveElement = (value) => {
  activeElement.value = value
}

const SIZES = {
	ALL: 'all',
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
};
const sizeOptions = [
  { label: SIZES.ALL, tooltipText: '全部' },
  { label: SIZES.SMALL, tooltipText: '小型' },
  { label: SIZES.MEDIUM, tooltipText: '中型' },
  { label: SIZES.LARGE, tooltipText: '大型' },
];

const activeSize = ref(SIZES.MEDIUM);
const setActiveSize = (value) => {
  activeSize.value = value
}
</script>

<template>
  <div class="filter">
		<div>
			<div class="title">搜尋</div>
			<input
				type="text"
				class="search-input"
				placeholder="請輸入怪物名稱、地圖名稱、掉落物"
			/>
		</div>
		<div>
			<div class="title">種族</div>
			<div class="btn-options">
				<FilterButton
						v-for="race in raceOptions"
						:key="race.label"
						:text="race.label === RACES.ALL ? race.label.toUpperCase() : undefined"
						:img-path="race.label !== RACES.ALL ? race.imgPath : undefined"
						:tooltip-text="race.label !== RACES.ALL ? race.tooltipText : undefined"
						:is-active="activeRace === race.label"
						@click="setActiveRace(race.label)"
					/>
			</div>
		</div>
		<div>
			<div class="title">屬性</div>
			<div class="btn-options">
				<FilterButton
						v-for="el in elementOptions"
						:key="el.label"
						:text="[ELEMENTS.ALL, ELEMENTS.NONE].includes(el.label) ? el.label.toUpperCase() : undefined"
						:img-path="![ELEMENTS.ALL, ELEMENTS.NONE].includes(el.label) ? el.imgPath : undefined"
						:tooltip-text="el.label !== ELEMENTS.ALL ? el.tooltipText : undefined"
						:is-active="activeElement === el.label"
						@click="setActiveElement(el.label)"
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
					:tooltip-text="size.label !== RACES.ALL ? size.tooltipText : undefined"
					:is-active="activeSize === size.label"
					@click="setActiveSize(size.label)"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
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
	}

	.search-input {
		width: 100%;
    max-width: 800px;
    padding: 4px 8px;
    font-size: 18px;
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
    gap: 12px;
	}
}
</style>
