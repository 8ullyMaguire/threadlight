import { pt as ReactiveState, t as client } from "../../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/explore/topics/+page.ts
async function load({ fetch }) {
	const piefed = client({ func: fetch });
	if (!piefed.getTopics) error(404, "unsupported");
	return { topics: new ReactiveState((await piefed.getTopics({ include_communities: false })).topics) };
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map