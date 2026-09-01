import { pt as ReactiveState, t as client } from "../../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/explore/feeds/+page.ts
async function load({ fetch }) {
	const piefed = client({ func: fetch });
	if (!piefed.getFeeds) error(404, "unsupported");
	return { feeds: new ReactiveState((await piefed.getFeeds({ include_communities: false })).feeds) };
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map