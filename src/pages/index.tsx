import Head from "next/head";
import { useEffect, useState } from "react";
import { Nunito } from "@next/font/google";
import AgeCounter from "@/components/AgeCounter";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "600"],
});

const SOCIALS = [
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

export default function Home() {
	const [bgColor, setBgColor] = useState<string | undefined>();

	useEffect(() => {
		document.querySelector("#main")?.classList.remove("is-preload");
	}, []);
	return (
		<>
			<Head>
				<title>İsmail Karslı</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#000000" />
				<meta name="description" content="İsmail Karslı kişisel web sitesi." />
				<meta name="og:type" content="website" />
				<meta name="og:title" content="İsmail Karslı" />
				<meta
					name="og:description"
					content="İsmail Karslı kişisel web sitesi."
				/>
				<meta name="og:site_name" content="İsmail Karslı" />
				<meta name="og:url" content="https://ismail.karsli.net" />
				<meta name="og:locale" content="tr_TR" />
				<meta name="og:locale:alternate" content="en_US" />
			</Head>
			<div
				id="main"
				className={"is-preload " + nunito.className}
				style={{ backgroundColor: bgColor }}
			>
				<div id="overlay" />
				<header id="header">
					<h1>İsmail Karslı</h1>
					<div className="subheading">
						<span>Web Developer</span>•
						<span>
							<AgeCounter /> yo
						</span>
					</div>

					<nav>
						<ul>
							{SOCIALS.map((social) => (
								<li
									key={social.name}
									onMouseEnter={() => setBgColor(social.color)}
									onMouseLeave={() => setBgColor(undefined)}
								>
									<a href={social.link} title={social.name} target="_blank">
										<img src={social.icon} />
										<span className="label">{social.name}</span>
									</a>
								</li>
							))}
						</ul>
					</nav>
				</header>
			</div>
		</>
	);
}