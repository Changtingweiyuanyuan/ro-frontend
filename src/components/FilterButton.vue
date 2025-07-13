<script setup>
import Filter from '../components/Filter.vue'

defineProps({
  text: {
    type: String,
    required: false,
  },
	imgPath: {
		type: String,
		required: false,
	},
	imgAlt: {
		type: String,
		required: false,
	},
	isActive: {
		type: Boolean,
    required: true,
	},
	tooltipText: {
    type: String,
    required: false,
	}
})
</script>

<template>
  <div 
		class="filter-button"
		:class="{'active': isActive}"
	>
		<div class="content">
			<template v-if="text">
				{{ text }}
			</template>
			<template v-else>
				<img :src="imgPath" :alt="imgAlt" />
			</template>
		</div>
		
		<div v-if="tooltipText" class="tooltip">
			{{ tooltipText }}
		</div>
	</div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Slackey&display=swap');

.filter-button {
	min-width: 80px;
	height: 48px;
	max-height: 48px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #B2A99F;
	background: #6C5543;
	font-size: 16px;
	font-weight: bold;
	border-radius: 4px;
	z-index: 0;
	cursor: pointer;
	user-select: none;

	&:hover {
		z-index: 1;

		& .tooltip {
		opacity: 1;
	}
	}

	&.active {
		color: #FBE12B;
		background: #FAD2A8;
	}

	.content {
		height: 36px;
		line-height: 36px;
		font-family: "Slackey";
		outline: none;
		filter: drop-shadow(2px 2px 0px black) drop-shadow(-1px -1px 0px black);

		& > img {
			height: 36px;

			outline: none;
		}
	}

	.tooltip {
		position: absolute;
		top: -12px;
    left: calc(100% - 12px);
    background-color: #bfae9e;
    color: #000;
    font-size: 12px;
		font-weight: bold;
    padding: 4px 6px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    z-index: 1;
    pointer-events: none;

    &::after {
		content: "";
    position: absolute;
    top: calc(100% - 6px);
    left: 2px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 12px solid #bfae9e;
    transform: rotate(40deg);
    }
	}
}
</style>
