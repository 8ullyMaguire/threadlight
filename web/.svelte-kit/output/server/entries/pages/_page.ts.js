import { At as settings, Rn as ChevronDoubleUp, mt as awaitIfServer, pt as ReactiveState, t as client } from "../../chunks/client.svelte.js";
import { t as feed } from "../../chunks/feed.svelte.js";
//#region src/routes/+page.ts
async function load({ url, fetch, route }) {
	const cursor = url.searchParams.get("cursor");
	const sort = url.searchParams.get("sort") || settings.defaultSort.sort;
	const listingType = url.searchParams.get("type") || settings.defaultSort.feed;
	return {
		feed: new ReactiveState((await awaitIfServer(feed(route.id, async (params) => {
			const posts = await client({ func: fetch }).getPosts(params);
			return {
				...posts,
				params: {
					...params,
					page_cursor: posts.next_page
				},
				client: {}
			};
		}).load({
			page_cursor: cursor,
			sort,
			type_: listingType,
			limit: 20,
			show_hidden: settings.posts.showHidden
		}))).data),
		filters: new ReactiveState({
			sort,
			type_: listingType
		}),
		contextual: { actions: [{
			name: "Scroll to top",
			handle: () => window?.scrollTo({
				top: 0,
				behavior: "instant"
			}),
			icon: ChevronDoubleUp
		}] }
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map