import { o as profile, t as client } from "./client.svelte.js";
//#region src/lib/feature/user/index.ts
async function blockUser(block, id) {
	return await client().blockPerson({
		block,
		person_id: id
	});
}
function isBlocked(me, user) {
	return me.person_blocks.find((b) => b.target.id == user);
}
function addSubscription(community, subscribe = true) {
	const index = profile.current.user?.follows.map((f) => f.community.id).indexOf(community.id);
	if (subscribe && index == -1) profile.current.user?.follows.push({
		follower: profile.current.user.follows[0]?.follower,
		community
	});
	else profile.current.user?.follows.splice(index ?? 0, 1);
}
//#endregion
export { blockUser as n, isBlocked as r, addSubscription as t };

//# sourceMappingURL=user.js.map