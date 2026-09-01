import { error } from "@sveltejs/kit";
//#region src/routes/error/+page.ts
function load() {
	error(500, "You asked for it.");
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map