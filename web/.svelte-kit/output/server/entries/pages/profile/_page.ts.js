import { redirect } from "@sveltejs/kit";
//#region src/routes/profile/+page.ts
function load() {
	redirect(302, "/profile/user");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map