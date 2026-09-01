import { redirect } from "@sveltejs/kit";
//#region src/routes/profile/(local_user)/blocks/+page.ts
function load() {
	redirect(302, "/profile/blocks/users");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map