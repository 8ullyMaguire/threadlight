import { n as innerWidth } from "../../../chunks/window.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/settings/+page.ts
function load() {
	if ((innerWidth.current ?? 0) > 768) redirect(302, "/settings/app");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map