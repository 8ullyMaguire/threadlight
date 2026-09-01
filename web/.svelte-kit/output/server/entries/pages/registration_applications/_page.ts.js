import { redirect } from "@sveltejs/kit";
//#region src/routes/registration_applications/+page.ts
function load() {
	redirect(302, "/admin/applications");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map