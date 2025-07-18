<script setup lang="ts">
import {watch, onBeforeUnmount, onMounted, onUnmounted, nextTick} from 'vue'

function updateBacktopPosition() {
	const app = document.getElementById('app')
	const backtop = document.querySelector(
		'.el-backtop.ro-backtop'
	) as HTMLElement | null

	if (app && backtop) {
		const appRightOffset = window.innerWidth / 2 - app.clientWidth / 2
		backtop.style.right = `${appRightOffset + 20}px`
	}
}

function setupBacktopPositionWatcher() {
	const observer = new MutationObserver(() => {
		nextTick(() => {
			updateBacktopPosition()
		})
	})

	observer.observe(document.body, {childList: true, subtree: true})

	window.addEventListener('resize', updateBacktopPosition)
	window.addEventListener('scroll', updateBacktopPosition)

	onBeforeUnmount(() => {
		observer.disconnect()
		window.removeEventListener('resize', updateBacktopPosition)
		window.removeEventListener('scroll', updateBacktopPosition)
	})
}

onMounted(() => {
	setupBacktopPositionWatcher()
})

defineOptions({
	name: 'Dialog',
})
</script>

<template>
	<el-backtop
		class="ro-backtop"
		:right="20"
		:bottom="20" />
</template>

<style lang="scss">
.ro-backtop.el-backtop {
	background-color: #d9c6a4aa;
	color: #000;
	border-radius: 4px;
	box-shadow: 2px 2px 0 #000, -1px -1px 0 #000;
	user-select: none;

	&:hover {
		background-color: #f9e7d0;
	}
}
</style>
