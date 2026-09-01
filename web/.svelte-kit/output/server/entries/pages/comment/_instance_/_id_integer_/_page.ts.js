import { s as resolve } from "../../../../../chunks/navigation.js";
import { o as profile, t as client } from "../../../../../chunks/client.svelte.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/comment/[instance]/[id=integer]/+page.ts
async function load({ params, fetch }) {
	if (profile.current.instance != params.instance) redirect(302, resolve("/comment/[instance]/[id]/confirm", params));
	const comment = await client({
		instanceURL: profile.current.instance,
		func: fetch
	}).getComment({ id: Number(params.id) });
	const threadPath = comment.comment_view.comment.path.split(".").slice(-3).join(".");
	redirect(302, resolve("/post/[instance]/[id=integer]", {
		instance: encodeURIComponent(params.instance),
		id: comment.comment_view.post.id.toString()
	}) + `?thread=${threadPath}#${comment.comment_view.comment.id}`);
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map