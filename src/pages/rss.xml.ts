import type { APIRoute } from "astro";
import { getPosts } from "../posts";

export const GET: APIRoute = async ({ site }) => {
	const posts = await getPosts();
	const baseUrl = site ? site.href.replace(/\/$/, "") : "https://ismail.karsli.net";

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>İsmail Karslı</title>
    <description>Articles and technical writing on software development by İsmail Karslı</description>
    <link>${baseUrl}/</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
    ${posts
			.map(
				(post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${baseUrl}/blog/${post.id}/</link>
      <guid>${baseUrl}/blog/${post.id}/</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      ${post.data.description ? `<description><![CDATA[${post.data.description}]]></description>` : ""}
    </item>`,
			)
			.join("")}
  </channel>
</rss>`;

	return new Response(xml.trim(), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
