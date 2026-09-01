import { pt as ReactiveState, t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/admin/applications/+page.ts
async function load({ fetch, url }) {
	const page = Number(url.searchParams.get("page")) || 1;
	const type = url.searchParams.get("type") || "unread";
	return {
		page,
		applications: new ReactiveState((await client({ func: fetch }).listRegistrationApplications({
			page,
			limit: 40,
			unread_only: type == "unread"
		})).registration_applications),
		type: new ReactiveState(type)
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map