<script setup>
const baseUrl = import.meta.env.BASE_URL;

const reloadPage = () => {
  window.location.reload();
}
</script>

<template>
  <div class="header">
		<div class="content">
			<div class="link" @click="reloadPage">掉落物查詢</div>
			<div class="hearts">
				<img :src="`${baseUrl}images/ui/heart.png`" />
				<img :src="`${baseUrl}images/ui/heart.png`" />
				<img :src="`${baseUrl}images/ui/heart.png`" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.header {
	height: 36px;
	width: -webkit-fill-available;
	position: fixed;
	top: 0;
	left: 0;
  background: #4C3B2B;
	color: #e6e6e6;
	border-bottom: 1.5px solid #b2a99f;
	z-index: 100;
	
	.content {
		display: flex;
		margin: auto;
		padding: 0 40px;

		@media (min-width: 576px) {
			max-width: 540px;
		}
		@media (min-width: 768px) {
			max-width: 720px;
		}
		@media (min-width: 992px) {
			max-width: 960px;
		}
		@media (min-width: 1200px) {
			max-width: 1140px;
		}
		@media (min-width: 1400px) {
			max-width: 1320px;
		}

		.link {
			line-height: 36px;
			font-weight: bold;
			cursor: pointer;
		}

		.hearts {
			display: flex;
			align-items: center;
			margin-left: 12px;
			gap: 4px;

			img {
				width: 16px;
				height: 16px;
			}
		}
	}
}
</style>
