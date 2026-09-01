import { t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/verify_email/[token]/+page.ts
async function load({ fetch, params }) {
	await client({ func: fetch }).verifyEmail({ token: params.token });
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map