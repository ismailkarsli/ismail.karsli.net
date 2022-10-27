<script setup>
import "./assets/styles/main.scss";

const bgColor = ref(null);

useHead({
	title: "İsmail Karslı",
	viewport: "width=device-width, initial-scale=1, user-scalable=no",
	charset: "utf-8",
	meta: [
		{ name: "description", content: "İsmail Karslı kişisel web sitesi." },
		{ property: "og:type", content: "website" },
		{ property: "og:title", content: "İsmail Karslı" },
		{ property: "og:description", content: "İsmail Karslı kişisel web sitesi." },
		{ property: "og:site_name", content: "İsmail Karslı" },
		{ property: "og:locale", content: "en_US" },
		{ property: "og:locale:alternate", content: "tr_TR" },
		{ property: "og:url", content: "https://ismail.karsli.com" },
	],
});

const socials = [
	{
		name: "Mail",
		icon: "//api.iconify.design/fa-solid/at.svg?color=white",
		link: "mailto:cszn@pm.me",
		color: "#c23838",
	},
	{
		name: "Linkedin",
		icon: "//api.iconify.design/fa-brands/linkedin.svg?color=white",
		color: "#0077B5",
		link: "https://www.linkedin.com/in/ismailkarsli/",
	},
	{
		name: "Github",
		icon: "//api.iconify.design/fa-brands/github.svg?color=white",
		color: "#333",
		link: "https://github.com/ismailkarsli",
	},
	{
		name: "Discord",
		icon: "//api.iconify.design/fa-brands/discord.svg?color=white",
		color: "#7289DA",
		link: "https://discord.com/users/192420948480098304",
	},
];

onMounted(() => {
	document.querySelector("#main")?.classList.remove("is-preload");
});
</script>

<template>
	<div id="main" class="is-preload" :style="{ 'background-color': bgColor }">
		<div id="overlay" />
		<header id="header">
			<h1>İsmail Karslı</h1>
			<p>Web Developer &nbsp; • &nbsp; ğ</p>

			<nav>
				<ul>
					<li v-for="social in socials" @mouseenter="bgColor = social.color" @mouseleave="bgColor = null">
						<a :href="social.link" :title="social.name" target="_blank">
							<img :src="social.icon" />
							<span class="label">{{ social.name }}</span>
						</a>
					</li>
				</ul>
			</nav>
		</header>
	</div>
</template>

<style lang="scss">
$anim: 1.5s;

#main {
	background-color: teal;
	color: #fff;
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color $anim;

	&.is-preload {
		#overlay {
			opacity: 0;
		}
		#header {
			opacity: 0;
			transform: translateY(25px);
		}
	}
	#overlay {
		content: "";
		background-repeat: repeat, no-repeat;
		background-size: auto, cover;
		height: 200%;
		left: 0;
		opacity: 1;
		position: fixed;
		top: 0;
		width: 200%;
		background-attachment: fixed, fixed;
		background-image: url(./assets/images/overlay-pattern.png), url(./assets/images/overlay.svg);
		background-position: top left, center center;
		transition: opacity $anim ease-in-out;
	}

	#header {
		text-align: center;
		opacity: 1;
		transform: translateY(0);
		width: 80%;
		transition: opacity $anim ease-in-out, transform $anim ease-in-out;

		h1 {
			font-size: 4.5em;
			font-weight: 600;
			letter-spacing: -0.035em;
			line-height: 1em;
			margin: 0;
		}

		p {
			font-size: 1.25em;
			font-weight: 300;
			margin: 0.75em 0 0.25em 0;
			opacity: 0.75;
		}

		nav {
			margin-top: 1.5em;

			ul {
				display: flex;
				justify-content: center;
				gap: 1em;
				padding: 0;
				margin: 0;
				list-style: none;
				flex-wrap: wrap;
				transition: all 0.3s ease-in-out;

				li {
					min-height: 3.5em;
					min-width: 3.5em;
					line-height: 5.885em;
					position: relative;
					top: 0;
					border: 2px solid white;
					border-radius: 100%;
					transition: all 0.3s ease-in-out;
					background: transparent;
					&:hover {
						transform: scale(1.1);
						background: rgba(255, 255, 255, 0.2);
					}

					a {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100%;
						width: 100%;

						img {
							min-height: 1.4em;
							min-width: 1.4em;
						}
						.label {
							display: none;
						}
					}
				}
			}
		}
	}
}
</style>
