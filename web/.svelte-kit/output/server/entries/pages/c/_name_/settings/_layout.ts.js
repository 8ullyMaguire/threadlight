import { pt as ReactiveState, t as client } from "../../../../../chunks/client.svelte.js";
import { t as CommunityCard } from "../../../../../chunks/CommunityCard.js";
//#region src/routes/c/[name]/settings/+layout.ts
async function load({ fetch, params }) {
	const community = await client({ func: fetch }).getCommunity({ name: params.name });
	return {
		community: new ReactiveState(community),
		slots: { sidebar: {
			component: CommunityCard,
			props: {
				community_view: community.community_view,
				moderators: community.moderators
			}
		} }
	};
}
//#endregion
export { load };

//# sourceMappingURL=_layout.ts.js.map