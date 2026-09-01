import { Dt as SvelteURL, t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/signup/[instance]/+page.ts
async function load({ params, fetch }) {
	const site = await client({
		instanceURL: params.instance,
		func: fetch
	}).getSite();
	return {
		...site,
		instance: new SvelteURL(site.site_view.site.actor_id).hostname
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map