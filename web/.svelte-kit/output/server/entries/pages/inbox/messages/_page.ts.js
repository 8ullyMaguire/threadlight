import { mt as awaitIfServer, t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/inbox/messages/+page.ts
async function load({ fetch, url }) {
	const page = Number(url.searchParams.get("page") || "1");
	return {
		messages: (await awaitIfServer(client({ func: fetch }).getPrivateMessages({
			limit: 50,
			page
		}))).data,
		page
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map