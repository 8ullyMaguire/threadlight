import { t as client } from "../../../../chunks/client.svelte.js";
import { t as feed } from "../../../../chunks/feed.svelte.js";
//#region src/routes/explore/communities/+page.ts
async function load({ fetch, parent }) {
	const { page, query, sort, type, typeInstance } = await parent();
	return {
		communities: (await feed("/explore/communities", async (params) => params.query != "" ? await client({
			func: fetch,
			instanceURL: typeInstance
		}).search({
			limit: 40,
			page: params.page,
			sort: params.sort,
			type_: "Communities",
			listing_type: params.type,
			q: params.query
		}) : await client({
			func: fetch,
			instanceURL: typeInstance
		}).listCommunities({
			limit: 40,
			page: params.page,
			sort: params.sort,
			type_: params.type,
			show_nsfw: true
		})).load({
			page,
			query,
			sort,
			type
		})).communities,
		type,
		sort,
		query,
		page
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map