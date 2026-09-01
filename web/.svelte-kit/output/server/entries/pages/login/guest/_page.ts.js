import { v as LINKED_INSTANCE_URL } from "../../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/routes/login/guest/+page.ts
function load() {
	if (LINKED_INSTANCE_URL) error(404);
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map