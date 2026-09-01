import { v as LINKED_INSTANCE_URL } from "../../../chunks/client.svelte.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/signup/+page.ts
var load = () => {
	if (LINKED_INSTANCE_URL) redirect(302, `/signup/${LINKED_INSTANCE_URL}`);
};
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map