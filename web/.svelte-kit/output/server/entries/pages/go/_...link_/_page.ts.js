import { redirect } from "@sveltejs/kit";
//#region src/routes/go/[...link]/+page.ts
async function load({ params }) {
	redirect(302, `/go?localize=${params.link}`);
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map