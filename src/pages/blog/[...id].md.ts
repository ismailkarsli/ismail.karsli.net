import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getPosts } from "../../posts";

const sources = import.meta.glob<string>("/src/content/blog/**/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

export const getStaticPaths = (async () => {
	const posts = await getPosts();
	return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props: { post } }) => {
	const source = sources[`/${post.filePath}`];
	if (source === undefined) {
		throw new Error(`Couldn't find the source file of blog post "${post.id}" (${post.filePath})`);
	}

	return new Response(source, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
};
