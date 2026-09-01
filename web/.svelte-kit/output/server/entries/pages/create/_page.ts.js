import { redirect } from "@sveltejs/kit";
//#region src/routes/create/+page.ts
function load() {
	redirect(302, "/create/post");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map