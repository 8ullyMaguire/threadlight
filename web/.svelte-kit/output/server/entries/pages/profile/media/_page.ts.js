import { o as profile, pt as ReactiveState, t as client } from "../../../../chunks/client.svelte.js";
//#region src/routes/profile/media/+page.ts
async function load({ fetch, url }) {
	const { jwt } = profile.current;
	const page = Number(url.searchParams.get("page")) || 1;
	return { images: new ReactiveState((await client({
		func: fetch,
		auth: jwt
	}).listMedia({
		limit: 20,
		page
	})).images) };
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map