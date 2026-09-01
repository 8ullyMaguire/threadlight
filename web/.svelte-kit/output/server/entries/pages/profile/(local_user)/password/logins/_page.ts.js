import { t as client } from "../../../../../../chunks/client.svelte.js";
//#region src/routes/profile/(local_user)/password/logins/+page.ts
async function load({ fetch }) {
	return { tokens: await client({ func: fetch }).listLogins() };
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map