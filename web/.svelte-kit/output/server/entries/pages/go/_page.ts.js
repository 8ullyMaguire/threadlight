import { n as photonify } from "../../../chunks/plugins.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/go/+page.ts
async function load({ url }) {
	const link = url.searchParams.get("localize");
	if (link) {
		const localized = photonify(link);
		if (localized) redirect(302, localized);
		else redirect(302, link);
	}
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map