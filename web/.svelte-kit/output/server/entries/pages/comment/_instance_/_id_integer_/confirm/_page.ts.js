import { t as goto } from "../../../../../../chunks/navigation.js";
import { o as profile } from "../../../../../../chunks/client.svelte.js";
//#region src/routes/comment/[instance]/[id=integer]/confirm/+page.ts
async function load({ params }) {
	if (profile.current.instance == params.instance) goto(`/comment/${params.instance}/${params.id}`, { replaceState: true });
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map