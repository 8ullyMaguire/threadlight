import { At as settings, t as client } from "../../../../chunks/client.svelte.js";
import { t as feed } from "../../../../chunks/feed.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/topic/[id]/+page.ts
async function load({ url, fetch, route, params }) {
	const piefed = client({ func: fetch });
	if (!piefed.getTopics) error(404, "unsupported");
	const sort = url.searchParams.get("sort") || settings.defaultSort.sort;
	const cursor = url.searchParams.get("cursor");
	return await feed(route.id, async (p) => {
		const piefedTopicData = piefed.getTopics({ include_communities: true }).then((i) => i.topics.find((j) => j.id == p.topic_id));
		const posts = await piefed.getPosts(p);
		return {
			...posts,
			topic: piefedTopicData,
			params: {
				...p,
				page_cursor: posts.next_page
			},
			client: {}
		};
	}).load({
		page_cursor: cursor,
		sort,
		type_: "All",
		limit: 20,
		show_hidden: settings.posts.showHidden,
		topic_id: Number(params.id)
	});
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map