import { i as ThreadlightClient, pt as ReactiveState, t as client } from "../../../chunks/client.svelte.js";
//#region src/routes/search/+page.ts
function boolVal(val) {
	return val === "true";
}
async function load({ url, fetch }) {
	const query = url.searchParams.get("q") ?? "";
	const tab = url.searchParams.get("tab") ?? "posts";
	const author = url.searchParams.get("author") ?? "";
	const community = url.searchParams.get("community") ?? "";
	const tags = url.searchParams.get("tags") ?? "";
	const dateFrom = url.searchParams.get("dateFrom") ?? "";
	const dateTo = url.searchParams.get("dateTo") ?? "";
	const mood = url.searchParams.get("mood") ?? "";
	const contentType = url.searchParams.get("contentType") ?? "";
	const isEducational = boolVal(url.searchParams.get("isEducational"));
	const isNsfw = boolVal(url.searchParams.get("isNsfw"));
	const sort = url.searchParams.get("sort") ?? "relevance";
	const page = Number(url.searchParams.get("page")) || 1;
	const filters = new ReactiveState({
		query,
		tab,
		author,
		community,
		tags,
		dateFrom,
		dateTo,
		mood,
		contentType,
		isEducational,
		isNsfw,
		sort,
		page
	});
	let results = null;
	let total = 0;
	if (query) try {
		const api = client({ func: fetch });
		if (api instanceof ThreadlightClient) {
			if (tab === "posts") {
				const resp = await api.searchPosts({
					q: query,
					...author && { author },
					...community && { community },
					...tags && { tags },
					...dateFrom && { date_from: dateFrom },
					...dateTo && { date_to: dateTo },
					...mood && { mood },
					...contentType && { content_type: contentType },
					...isEducational && { is_educational: "true" },
					...isNsfw && { is_nsfw: "true" },
					...sort && { sort },
					page,
					limit: 20
				});
				results = resp.results ?? [];
				total = resp.total ?? 0;
			} else if (tab === "users") {
				const resp = await api.searchUsers({
					q: query,
					page,
					limit: 20
				});
				results = resp.results ?? [];
				total = resp.total ?? 0;
			} else if (tab === "communities") {
				const resp = await api.searchCommunities({
					q: query,
					page,
					limit: 20
				});
				results = resp.results ?? [];
				total = resp.total ?? 0;
			}
		} else {
			const resp = await api.search({
				q: query,
				limit: 20,
				page,
				type_: {
					posts: "Posts",
					users: "Users",
					communities: "Communities"
				}[tab]
			});
			if (tab === "posts") results = resp.posts ?? [];
			else if (tab === "users") results = resp.users ?? [];
			else if (tab === "communities") results = resp.communities ?? [];
			total = results?.length ?? 0;
		}
	} catch (err) {
		console.error("Search error:", err);
		results = [];
	}
	return {
		filters,
		results: results !== null ? new ReactiveState(results) : null,
		total,
		page,
		limit: 20
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map