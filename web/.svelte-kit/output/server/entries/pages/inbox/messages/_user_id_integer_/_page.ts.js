import { pt as ReactiveState, t as client } from "../../../../../chunks/client.svelte.js";
//#region src/routes/inbox/messages/[user_id=integer]/+page.ts
async function load({ fetch, params }) {
	const creator = Number(params.user_id);
	const LIMIT = 50;
	const userPromise = client({ func: fetch }).getPersonDetails({
		person_id: creator,
		limit: 1
	});
	const messagePromise = client({ func: fetch }).getPrivateMessages({
		creator_id: Number(params.user_id),
		limit: LIMIT,
		page: 1
	});
	const [message, user] = await Promise.all([messagePromise, userPromise]);
	return {
		message: new ReactiveState(message),
		creator: new ReactiveState(user),
		limit: LIMIT
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map