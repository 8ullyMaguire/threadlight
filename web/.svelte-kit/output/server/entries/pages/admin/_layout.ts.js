import { n as getClient, o as profile, r as site } from "../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/admin/+layout.ts
async function load({ fetch }) {
	if (!profile.current.jwt) error(403);
	if (!site.data) site.data = await getClient(void 0, fetch).getSite();
	return { site: site.data };
}
//#endregion
export { load };

//# sourceMappingURL=_layout.ts.js.map