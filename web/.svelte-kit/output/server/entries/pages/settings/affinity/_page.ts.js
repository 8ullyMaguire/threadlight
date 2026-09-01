import { t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/settings/affinity/+page.ts
async function load() {
	return { affinities: await client().getAffinities() };
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map