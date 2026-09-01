import { o as profile } from "../../../../../../chunks/client.svelte.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/post/[instance]/[id=integer]/confirm/+page.ts
async function load({ params }) {
	if (profile.current.instance == params.instance) redirect(302, `/post/${params.instance}/${params.id}`);
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map