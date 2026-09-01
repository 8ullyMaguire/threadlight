import { o as profile, t as client } from "../../../../chunks/client.svelte.js";
import { error, redirect } from "@sveltejs/kit";
//#region src/routes/activitypub/externalInteraction/+page.ts
var ssr = false;
async function load({ fetch, url }) {
	const uri = url.searchParams.get("uri");
	if (!uri) error(404);
	if (!profile.current.jwt) redirect(302, `/login?ref=${encodeURIComponent(url.toString())}`);
	return { resolved: client({ func: fetch }).resolveObject({ q: uri }) };
}
//#endregion
export { load, ssr };

//# sourceMappingURL=_page.ts.js.map