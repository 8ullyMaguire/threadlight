import { o as profile, t as client } from "../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/profile/+layout.ts
var ssr = false;
async function load({ fetch }) {
	if (!profile.current.jwt) error(401);
	const my_user = profile.current?.user ?? (await client({
		auth: profile.current?.jwt,
		func: fetch
	}).getSite()).my_user;
	return {
		my_user,
		community_blocks: my_user?.community_blocks,
		person_blocks: my_user?.person_blocks,
		follows: my_user?.follows,
		moderates: my_user?.moderates
	};
}
//#endregion
export { load, ssr };

//# sourceMappingURL=_layout.ts.js.map