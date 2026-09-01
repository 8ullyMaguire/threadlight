import { o as profile } from "../../../../chunks/client.svelte.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/create/post/+page.ts
var load = () => {
	if (!profile.current.jwt) redirect(302, "/login");
};
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map