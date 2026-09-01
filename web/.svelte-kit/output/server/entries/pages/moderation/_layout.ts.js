import { o as profile } from "../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/moderation/+layout.ts
function load() {
	if (!profile.current.jwt) error(401);
}
//#endregion
export { load };

//# sourceMappingURL=_layout.ts.js.map