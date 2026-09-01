import "./exports.js";
import { m as writable } from "./validate.js";
import { t as client } from "./client.svelte.js";
//#region src/lib/feature/moderation/moderation.ts
var modals = writable({
	reporting: {
		open: false,
		item: void 0
	},
	removing: {
		open: false,
		item: void 0,
		purge: false
	},
	banning: {
		open: false,
		banned: false,
		user: void 0,
		community: void 0
	},
	votes: {
		open: false,
		item: void 0
	}
});
function report(item) {
	modals.update((m) => ({
		...m,
		reporting: {
			open: true,
			item
		}
	}));
}
function remove(item, purge = false) {
	modals.update((m) => ({
		...m,
		removing: {
			open: true,
			item,
			purge
		}
	}));
}
function ban(banned, item, community) {
	modals.update((m) => ({
		...m,
		banning: {
			open: true,
			user: item,
			banned,
			community
		}
	}));
}
async function feature(featured, item, jwt) {
	return await client({ auth: jwt }).distinguishComment({
		comment_id: item.id,
		distinguished: featured
	});
}
async function viewVotes(item) {
	modals.update((m) => ({
		...m,
		votes: {
			open: true,
			item
		}
	}));
}
var removalTemplate = (input, content) => {
	if (content.postTitle) input = input.replaceAll("{{post}}", content.postTitle);
	if (content.communityLink) input = input.replaceAll("{{community}}", content.communityLink);
	if (content.username) input = input.replaceAll("{{username}}", content.username);
	if (content.reason) input = input.replaceAll("{{reason}}", content.reason);
	return input;
};
//#endregion
export { remove as a, removalTemplate as i, feature as n, report as o, modals as r, viewVotes as s, ban as t };

//# sourceMappingURL=moderation.js.map