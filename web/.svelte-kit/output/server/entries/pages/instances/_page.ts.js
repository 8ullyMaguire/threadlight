import { redirect } from "@sveltejs/kit";
//#region src/routes/instances/+page.ts
function load() {
	redirect(302, "/instances/linked");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map