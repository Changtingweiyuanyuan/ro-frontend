<script setup lang="ts">
import {ref, watch, computed} from 'vue'

interface Props {
	isShown: boolean
	modalClass?: string
	title?: string
	size?: 'sm' | 'md' | 'lg'
	positionAbsoluteTop?: string
	isCloseBtnShown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	modalClass: '',
	title: undefined,
	size: 'md',
	positionAbsoluteTop: '100px',
	isCloseBtnShown: true,
})

const emit = defineEmits(['update:isShown'])

const localIsShown = ref(props.isShown)

watch(
	() => props.isShown,
	val => {
		localIsShown.value = val
	}
)

watch(localIsShown, val => {
	emit('update:isShown', val)
})

const dialogWidth = computed(() => {
	switch (props.size) {
		case 'sm':
			return '220px'
		case 'md':
			return '280px'
		case 'lg':
			return '340px'
		default:
			return '280px'
	}
})

const shouldShowHeader = computed(() => {
	return !!props.title || props.isCloseBtnShown
})

defineOptions({
	name: 'Dialog',
})
</script>

<template>
	<el-dialog
		v-model="localIsShown"
		:top="positionAbsoluteTop"
		:modal-class="`ro-dialog ${modalClass}`"
		:header-class="!shouldShowHeader ? 'no-header' : ''"
		:title="title"
		:width="dialogWidth"
		:modal="true"
		:show-header="false"
		:show-close="isCloseBtnShown"
		:close-on-click-modal="true">
		<template #header>
			{{ title }}
		</template>
		<slot name="content" />
		<slot name="footer" />
	</el-dialog>
</template>

<style lang="scss">
.ro-dialog {
	&.el-overlay {
		background-color: rgb(0 0 0 / 25%);
	}
	.el-overlay-dialog {
		cursor: auto;

		.el-dialog {
			background-color: #606753;
			border: 1px solid #b2a99f;
			min-height: 280px;
			border-radius: 4px;
			padding: 12px 8px;

			.el-dialog__header {
				text-align: start;
				color: #f9e7d0;
				font-size: 16px;
				font-weight: bold;

				&.no-header {
					display: none;
				}

				.el-dialog__headerbtn {
					.el-dialog__close {
						color: #f9e7d0;

						&:hover {
							color: #fbe12b;
						}
					}
				}
			}
		}
	}
}
</style>
