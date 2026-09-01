import { redirect } from "@sveltejs/kit";
//#region src/routes/communities/+page.ts
function load() {
	redirect(302, "/explore/communities");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map