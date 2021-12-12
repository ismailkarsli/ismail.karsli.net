<template>
	<div class="flex flex-col items-center mt-32">
		<div class="title flex flex-col items-center">
			<h1 class="text-6xl tracking-tighter">İsmail Karslı</h1>
			<div class="font-light">Full Stack Web Developer</div>
		</div>
		<div>
			<a v-for="link in socialLinks" :key="link.name" :href="link.to" target="_blank" :title="link.title">
				<FaIcon :icon="link.icon" class="mx-2 text-xl hover:text-gray-500" />
			</a>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			socialLinks: [
				{
					to: "mailto:ismail@karsli.net",
					title: "ismail@karsli.net",
					icon: ["fas", "at"],
				},
				{
					to: "https://www.linkedin.com/in/ismailkarsli/",
					title: "linkedin.com/in/ismailkarsli",
					icon: ["fab", "linkedin-in"],
				},
				{
					to: "https://github.com/ismailkarsli",
					title: "github.com/ismailkarsli",
					icon: ["fab", "github"],
				},
				{
					to: "https://gitlab.com/ismailkarsli",
					title: "gitlab.com/ismailkarsli",
					icon: ["fab", "gitlab"],
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped>
.title {
	position: relative;
	padding-bottom: 1em;
	margin-bottom: 1em;

	&:after {
		content: " ";
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 50%;
		transform: translateX(-50%);
		height: 1px;
		background-color: #dedede;
	}
}
</style>
