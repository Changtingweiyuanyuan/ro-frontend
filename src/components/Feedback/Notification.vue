<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import {ElNotification} from 'element-plus'

interface Props {
	isShown: boolean
	modalClass?: string
	title?: string
	message: string
	//type?: 'primary' | 'success' | 'warning' | 'info' | 'error'
	isCloseBtnShown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	modalClass: '',
	title: undefined,
	//type: undefined,
	isCloseBtnShown: true,
})

const emit = defineEmits(['update:isShown'])

const localIsShown = ref(props.isShown)

watch(
	() => props.isShown,
	val => {
		const app = document.getElementById('app')
		const appRightOffset = window.innerWidth / 2 - (app?.clientWidth || 0) / 2

		if (val) {
			ElNotification({
				title: props.title,
				message: props.message,
				position: 'top-right',
				//type: props.type,
				showClose: props.isCloseBtnShown,
				customClass: 'ro-notification',
				offset: 40,
				duration: 0,
				dangerouslyUseHTMLString: true,
			})

			requestAnimationFrame(() => {
				const notification = document.querySelector('.el-notification.ro-notification') as HTMLElement

				if (notification && appRightOffset) {
					notification.style.right = `${appRightOffset}px`
				}
			})

			emit('update:isShown', false)
		}
	},
	{immediate: true}
)

defineOptions({
	name: 'Notification',
})
</script>

<template>
	<div class="ro-notification"></div>
	<slot name="button" />
</template>

<style lang="scss">
.ro-notification.el-notification {
	background-color: #606753;
	border-radius: 4px;
	padding: 12px 8px;
	border: 1px solid #b2a99f;
	z-index: 2 !important;

	.el-notification__title {
		margin-right: 20px;
		font-size: 14px;
		color: #e6e6e6;
	}

	.el-notification__content {
		background: #f9e7d0;
		color: #000;
		border-radius: 4px;
		padding: 12px 8px;
		box-shadow: inset -2px -2px 0 rgba(0, 0, 0, 0.25);

		p {
			font-size: 13px;
		}
	}

	.el-notification__closeBtn {
		&:hover {
			color: #e6e6e6;
		}
	}
}
</style>
