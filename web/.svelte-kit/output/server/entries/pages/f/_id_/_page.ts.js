import { At as settings, t as client } from "../../../../chunks/client.svelte.js";
import { t as feed } from "../../../../chunks/feed.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/f/[id]/+page.ts
async function load({ url, fetch, route, params }) {
	const piefed = client({ func: fetch });
	if (!piefed.getFeeds) error(404, "unsupported");
	const sort = url.searchParams.get("sort") || settings.defaultSort.sort;
	const cursor = url.searchParams.get("cursor");
	return await feed(route.id, async (p) => {
		const piefedFeedData = piefed.getFeeds({ include_communities: true }).then((i) => i.feeds.find((j) => j.id == p.feed_id));
		const postPromise = piefed.getPosts(p);
		return {
			posts: (await postPromise).posts,
			next_page: (await postPromise).next_page,
			feed: piefedFeedData,
			params: {
				...p,
				page_cursor: (await postPromise).next_page
			},
			client: {}
		};
	}).load({
		page_cursor: cursor,
		sort,
		type_: "All",
		limit: 20,
		show_hidden: settings.posts.showHidden,
		feed_id: Number(params.id)
	});
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map