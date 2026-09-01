import { At as settings, t as client } from "../../../../chunks/client.svelte.js";
import { t as CommunityCard } from "../../../../chunks/CommunityCard.js";
import { t as feed } from "../../../../chunks/feed.svelte.js";
//#region src/routes/c/[name]/+page.ts
async function load({ params, fetch, url, route }) {
	const cursor = url.searchParams.get("cursor");
	const sort = url.searchParams.get("sort") || settings.defaultSort.sort;
	const feedData = await feed(route.id, async (p) => {
		const postPromise = client({ func: fetch }).getPosts(p);
		return {
			community: await client({ func: fetch }).getCommunity({ name: p.community_name }),
			posts: (await postPromise).posts,
			next_page: (await postPromise).next_page,
			params: {
				...p,
				page_cursor: (await postPromise).next_page
			},
			client: {}
		};
	}).load({
		community_name: params.name,
		sort,
		limit: 20,
		page_cursor: cursor
	});
	return {
		...feedData,
		slots: { sidebar: {
			component: CommunityCard,
			props: {
				community_view: feedData?.community?.community_view,
				moderators: feedData?.community?.moderators
			}
		} }
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map