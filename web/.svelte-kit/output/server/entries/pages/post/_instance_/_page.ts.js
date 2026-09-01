import { s as resolve } from "../../../../chunks/navigation.js";
import { o as profile } from "../../../../chunks/client.svelte.js";
import { error, redirect } from "@sveltejs/kit";
//#region src/routes/post/[instance]/+page.ts
function load({ params }) {
	if (Number(params.instance)) redirect(302, resolve(`/post/[instance]/[id=integer]`, {
		instance: encodeURIComponent(profile.current.instance.toLowerCase()),
		id: params.instance
	}));
	error(404);
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map