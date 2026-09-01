import { G as getItemPublished, t as client } from "../../../../chunks/client.svelte.js";
import { t as feed } from "../../../../chunks/feed.svelte.js";
//#region src/routes/profile/user/+page.ts
async function load({ url, fetch, parent, route }) {
	const page = Number(url.searchParams.get("page")) || 1;
	const type = url.searchParams.get("type") || "all";
	const sort = url.searchParams.get("sort") || "New";
	const myUser = await parent();
	const feedData = await feed(route.id, (params) => client({ func: fetch }).getPersonDetails({
		limit: params.limit,
		page: params.page,
		person_id: myUser?.my_user?.local_user_view.person.id,
		sort: params.sort
	})).load({
		limit: 20,
		page,
		person_id: myUser.my_user?.local_user_view.person.id,
		sort
	});
	const items = [...type == "all" || type == "posts" ? feedData.posts : [], ...type == "all" || type == "comments" ? feedData.comments : []];
	if (sort == "TopAll") items.sort((a, b) => b.counts.upvotes - b.counts.downvotes - (a.counts.upvotes - a.counts.downvotes));
	else if (sort == "New") items.sort((a, b) => Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a)));
	return {
		type,
		page,
		sort,
		limit: 20,
		user: {
			submissions: items,
			moderates: feedData.moderates,
			person_view: feedData.person_view
		}
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map