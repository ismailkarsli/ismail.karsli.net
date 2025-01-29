import Head from "next/head";
import { Nunito } from "next/font/google";
import AgeCounter from "@/components/AgeCounter";
import { t } from "@/locales";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "600"],
});

const SOCIALS = [
	{
		name: "Mail",
		icon: "//api.iconify.design/fa-solid/at.svg?color=white",
		link: "mailto:ismail@karsli.net",
	},
	{
		name: "Linkedin",
		icon: "//api.iconify.design/fa-brands/linkedin.svg?color=white",
		link: "https://www.linkedin.com/in/ismailkarsli/",
	},
	{
		name: "Github",
		icon: "//api.iconify.design/fa-brands/github.svg?color=white",
		link: "https://github.com/ismailkarsli",
	},
	{
		name: "Discord",
		icon: "//api.iconify.design/fa-brands/discord.svg?color=white",
		link: "https://discord.com/users/192420948480098304",
	},
];

export default function Home() {
	return (
		<>
			<Head>
				<title>İsmail Karslı</title>
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
				<meta name="og:locale" content="en_US" />
				<meta name="og:locale:alternate" content="tr_TR" />
			</Head>
			<div id="main" className={nunito.className}>
				<div id="overlay" />
				<header id="header">
					<h1>İsmail Karslı</h1>
					<h2 className="subheading">
						<span>{t("Software Developer")}</span>
						<span>•</span>
						<span>
							<AgeCounter /> {t("yo")}
						</span>
					</h2>

					<nav>
						<ul>
							{SOCIALS.map((social) => (
								<li key={social.name}>
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
