import { s as resolve } from "../../../../chunks/navigation.js";
import { y as instance } from "../../../../chunks/client.svelte.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/comment/[instance]/+page.ts
function load({ params }) {
	redirect(302, resolve("/comment/[instance]/[id]", {
		instance: encodeURIComponent(instance.data.toLowerCase()),
		id: params.instance
	}));
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map