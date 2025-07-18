<script setup lang="ts">
import {ref, watch, onMounted, onUnmounted} from 'vue'
import Filter from '../components/Filter.vue'
import MonsterList from '../components/MonsterList.vue'
import Notification from '../components/Feedback/Notification.vue'


const assetsUrl = import.meta.env.VITE_ASSETS_URL;
const monsterDataUrl = `${assetsUrl}/monsters_display_index.json`
const allMonsters = ref<any[]>([])
const searchQuery = ref('')
const activeRace = ref('ALL')
const raceSwitchType = ref(false)
const activeElement = ref('ALL')
const elementSwitchType = ref(false)
const activeSize = ref('ALL')

const filteredMonsters = ref<any[]>([])
const monstersToShow = ref<any[]>([])
const itemsPerLoad = 20

const getCleanDropName = (name: string): string => {
	if (typeof name !== 'string') return ''
	return name
		.replace(/\s*\(\s*[\d.]+%?\s*\)\s*$/, '')
		.replace(/\s+[\d.]+%?\s*$/, '')
		.trim()
		.toLowerCase()
}

// 計算相關性分數的輔助函式
const getRelevanceScore = (monster: any, query: string): number => {
	const name_tw = monster.name.zh_tw.toLowerCase()
	const id_str = monster.id.toString()

	if (name_tw === query) return 0 // 完全名稱匹配，最高優先
	if (name_tw.startsWith(query)) return 1 // 名稱開頭匹配，次高優先
	if (id_str === query) return 2 // ID 完全匹配

	// 其他所有情況（名稱包含、掉落物包含等）都屬於普通匹配
	return 3
}

const filterAndReset = () => {
	const query = searchQuery.value.toLowerCase().trim()

	filteredMonsters.value = allMonsters.value
		.filter((monster: any) => {
			// 篩選邏輯不變
			const matchesQuery =
				!query ||
				monster.name.zh_tw.toLowerCase().includes(query) ||
				monster.id.toString().includes(query) ||
				monster.spawns.some(
					(spawn: any) =>
						spawn.description.toLowerCase().includes(query) ||
						spawn.map_name.toLowerCase().includes(query)
				) ||
				(monster.drops &&
					monster.drops.some((drop: any) =>
						getCleanDropName(drop.name).includes(query)
					))

			const raceMap: {[key: string]: string} = {
				無形: 'FORMLESS',
				魚貝: 'AQUATIC',
				龍: 'DRAGON',
				動物: 'BEAST',
				天使: 'ANGEL',
				惡魔: 'DEMON',
				昆蟲: 'INSECT',
				植物: 'PLANT',
				不死: 'UNDEAD',
				人形: 'HUMANOID',
			}
			const elementMap: {[key: string]: string} = {
				無: 'NONE',
				水: 'WATER',
				地: 'EARTH',
				火: 'FIRE',
				風: 'WIND',
				毒: 'POISON',
				聖: 'HOLY',
				暗: 'DARK',
				念: 'GHOST',
				不死: 'UNDEAD',
			}
			const sizeMap: {[key: string]: string} = {
				小: 'SMALL',
				中: 'MEDIUM',
				大: 'LARGE',
			}

			const monsterRace = raceMap[monster.basic_info.race] || 'UNKNOWN'
			const matchesRace =
				activeRace.value === 'ALL' || monsterRace === activeRace.value

			const monsterElement =
				elementMap[monster.basic_info.element.type] || 'UNKNOWN'
			const matchesElement =
				activeElement.value === 'ALL' || monsterElement === activeElement.value

			const monsterSize = sizeMap[monster.basic_info.size] || 'UNKNOWN'
			const matchesSize =
				activeSize.value === 'ALL' || monsterSize === activeSize.value

			return matchesQuery && matchesRace && matchesElement && matchesSize
		})
		.sort((a: any, b: any) => {
			// 如果沒有搜尋詞，就只按等級排序
			if (!query) {
				return a.basic_info.level - b.basic_info.level
			}

			// 1. 先按相關性分數排序
			const scoreA = getRelevanceScore(a, query)
			const scoreB = getRelevanceScore(b, query)
			if (scoreA !== scoreB) {
				return scoreA - scoreB // 分數低的排前面
			}

			// 2. 如果相關性分數相同，再按等級排序 (次要排序)
			return a.basic_info.level - b.basic_info.level
		})

	monstersToShow.value = []
	loadMoreMonsters()
}

const loadMoreMonsters = () => {
	if (monstersToShow.value.length >= filteredMonsters.value.length) return
	const currentLength = monstersToShow.value.length
	const nextMonsters = filteredMonsters.value.slice(
		currentLength,
		currentLength + itemsPerLoad
	)
	monstersToShow.value.push(...nextMonsters)
}

watch(
	[allMonsters, searchQuery, activeRace, activeElement, activeSize],
	filterAndReset,
	{immediate: true}
)

const handleScroll = () => {
	const buffer = 500
	if (
		window.innerHeight + window.scrollY >=
		document.body.offsetHeight - buffer
	) {
		loadMoreMonsters()
	}
}

const UPDATE_READ_KEY = 'has_seen_update_v1'
const isNotificationShown = ref(localStorage.getItem(UPDATE_READ_KEY) !== 'true')
const message = `
<ul>
	<li>卡片與武器新增「<b>規格</b>」欄位</li>
	<li>右上角新增「
		<b>當前頁面偏好設定</b> ⚙️
		」，可以切換按鈕
		<u>種族</u>、
		<u>屬性</u>
		是否顯示文字</li>
	<li>怪物出現地圖的顯示方式，改為與官方資料同步</li>
</ul>
`

onMounted(async () => {
	if (isNotificationShown) {
		localStorage.setItem(UPDATE_READ_KEY, 'true')
	}

	window.addEventListener('scroll', handleScroll)

	try {
		const response = await fetch(`${monsterDataUrl}?t=${new Date().getTime()}`)
		const data = await response.json()
		allMonsters.value = data
	} catch (e) {
		console.error('無法載入魔物資料:', e)
		// 這裡可以選擇性地處理錯誤，例如設定一個錯誤狀態
	}
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
	<Filter
		v-model:searchQuery="searchQuery"
		v-model:activeRace="activeRace"
		v-model:raceSwitchType="raceSwitchType"
		v-model:activeElement="activeElement"
		v-model:elementSwitchType="elementSwitchType"
		v-model:activeSize="activeSize" />
	<MonsterList :monsters="monstersToShow" />
	<Notification
		v-model:isShown="isNotificationShown"
		title="更新內容一覽"
		position="top-right"
		:message="message" />
</template>
