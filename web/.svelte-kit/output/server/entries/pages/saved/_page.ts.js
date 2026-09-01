import { o as profile, t as client } from "../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/saved/+page.ts
function getSavedItemPublished(item) {
	if ("comment" in item) return item.comment.published;
	else return item.post.published;
}
async function load({ url, fetch }) {
	if (!profile.current.jwt) throw error(401);
	const user = profile.current.user ?? (await client({ func: fetch }).getSite()).my_user;
	if (!user) throw error(401);
	const page = Number(url.searchParams.get("page")) || 1;
	const type = url.searchParams.get("type") || "all";
	const { posts, comments } = await client({ func: fetch }).getPersonDetails({
		saved_only: true,
		limit: 20,
		page,
		person_id: user?.local_user_view.person.id
	});
	return {
		page,
		data: [...type == "posts" || type == "all" ? posts : [], ...type == "comments" || type == "all" ? comments : []].sort((a, b) => Date.parse(getSavedItemPublished(b)) - Date.parse(getSavedItemPublished(a))),
		type
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map