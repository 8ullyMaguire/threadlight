import { G as getItemPublished, pt as ReactiveState, t as client } from "../../../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/profile/voted/[type]/+page.ts
async function load({ url, params }) {
	if (params.type.toLowerCase() != "up" && params.type.toLowerCase() != "down") error(404);
	const page = Number(url.searchParams.get("page")) || 1;
	const upvoted = params.type == "up";
	const data = await Promise.all([client().getPosts({
		liked_only: upvoted,
		disliked_only: !upvoted,
		page,
		sort: "New",
		type_: "All",
		limit: 20
	}), client().getComments({
		liked_only: upvoted,
		disliked_only: !upvoted,
		page,
		sort: "New",
		type_: "All",
		limit: 20
	})]);
	return {
		items: [...data[0].posts, ...data[1].comments].sort((a, b) => Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a))),
		upvoted,
		filters: new ReactiveState({ page })
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map