import { redirect } from "@sveltejs/kit";
//#region src/routes/admin/+page.ts
var load = () => {
	redirect(302, "/admin/config");
};
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map