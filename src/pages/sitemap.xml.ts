import type { APIRoute } from "astro";
import { getPosts } from "../posts";

export const GET: APIRoute = async ({ site }) => {
	const posts = await getPosts();
	const baseUrl = site ? site.href.replace(/\/$/, "") : "https://ismail.karsli.net";

	const latestPostDate = posts[0]?.data.date
		? posts[0].data.date.toISOString().split("T")[0]
		: new Date().toISOString().split("T")[0];

	const pages = [
		{
			url: `${baseUrl}/`,
			lastmod: latestPostDate,
			changefreq: "weekly",
			priority: "1.0",
		},
		{
			url: `${baseUrl}/about/`,
			lastmod: latestPostDate,
			changefreq: "monthly",
			priority: "0.8",
		},
		{
			url: `${baseUrl}/blog/`,
			lastmod: latestPostDate,
			changefreq: "weekly",
			priority: "0.8",
		},
		...posts.map((post) => ({
			url: `${baseUrl}/blog/${post.id}/`,
			lastmod: post.data.date.toISOString().split("T")[0],
			changefreq: "monthly",
			priority: "0.7",
		})),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
