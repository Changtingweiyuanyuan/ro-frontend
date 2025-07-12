<script setup>
const baseUrl = import.meta.env.BASE_URL

const reloadPage = () => {
	window.location.reload()
}
</script>

<template>
	<div class="header">
		<div class="content">
			<div class="name">
				<img :src="`${baseUrl}link.gif`" />
				<div class="text">RO 樂園查詢工具</div>
			</div>
			<div
				class="link"
				@click="reloadPage">
				掉落物查詢
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
	background: #606753;
	color: #e6e6e6;
	border-bottom: 1.5px solid #b2a99f;
	z-index: 100;

	.content {
		display: flex;
		margin: auto;
		padding: 2px 40px;

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

		.name {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 24px;

			img {
				width: 24px;
				height: 24px;
			}

			.text {
				background: #0f0f0f;
				border-radius: 4px;
				font-size: 12px;
				margin-left: 4px;
				padding: 2px 8px;
			}
		}

		.link {
			line-height: 36px;
			font-weight: bold;
			cursor: pointer;
		}
	}
}
</style>
