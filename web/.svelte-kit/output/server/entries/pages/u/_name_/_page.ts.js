import { G as getItemPublished, pt as ReactiveState, t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/u/[name]/+page.ts
async function load({ params, url, fetch }) {
	const page = Number(url.searchParams.get("page")) || 1;
	const type = url.searchParams.get("type") || "all";
	const sort = url.searchParams.get("sort") || "New";
	const user = await client({ func: fetch }).getPersonDetails({
		limit: 20,
		page,
		username: params.name,
		sort
	});
	const items = [...user.posts, ...user.comments];
	if (sort == "TopAll") items.sort((a, b) => b.counts.upvotes - b.counts.downvotes - (a.counts.upvotes - a.counts.downvotes));
	else if (sort == "New") items.sort((a, b) => Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a)));
	return {
		filters: new ReactiveState({
			type,
			page,
			sort,
			limit: 20
		}),
		person_view: new ReactiveState(user.person_view),
		moderates: new ReactiveState(user.moderates),
		items: new ReactiveState(items)
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map