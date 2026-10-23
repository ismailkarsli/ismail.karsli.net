import { getCollection } from "astro:content";

// Drafts show up in `pnpm dev` but are left out of `pnpm build`.
export async function getPosts() {
	const posts = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(date);
}
