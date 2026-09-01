import { redirect } from "@sveltejs/kit";
//#region src/routes/reports/+page.ts
async function load() {
	redirect(302, "/moderation");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map