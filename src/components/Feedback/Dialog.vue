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
	positionAbsoluteTop: undefined,
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
			background: #6c5543;
			min-height: 280px;
			border-radius: 4px;
			padding: 12px 8px;
			filter: drop-shadow(2px 2px 0px black) drop-shadow(-1px -1px 0px black);

			.el-dialog__header {
				text-align: start;
				color: #b2a99f;
				font-size: 16px;
				font-weight: bold;

				&.no-header {
					display: none;
				}

				.el-dialog__headerbtn {
					.el-dialog__close {
						color: #b2a99f;
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
