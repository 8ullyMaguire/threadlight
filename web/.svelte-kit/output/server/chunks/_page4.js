import { t as client, tr as publishedToDate } from "./client.svelte.js";
//#region src/routes/modlog/+page.ts
var fullUserName = (user) => `${user.name}@${new URL(user.actor_id).hostname}`;
var timestamp = (when) => publishedToDate(when).getTime();
var _toModLog = (item) => {
	if ("mod_ban_from_community" in item) {
		const expires = item.mod_ban_from_community.expires ? `until ${new Date(item.mod_ban_from_community.expires).toLocaleString()}` : "permanently";
		return {
			id: item.mod_ban_from_community.id,
			moderator: item.moderator,
			moderatee: item.banned_person,
			community: item.community,
			actionName: item.mod_ban_from_community.banned ? "banCommunity" : "unbanCommunity",
			reason: `${item.mod_ban_from_community.reason ?? ""} (banned ${expires})`,
			timestamp: timestamp(item.mod_ban_from_community.when_)
		};
	} else if ("mod_remove_comment" in item) return {
		id: item.mod_remove_comment.id,
		actionName: item.mod_remove_comment.removed ? "commentRemoval" : "commentRestore",
		community: item.community,
		content: item.comment.content,
		timestamp: timestamp(item.mod_remove_comment.when_),
		moderatee: item.commenter,
		moderator: item.moderator,
		reason: item.mod_remove_comment.reason,
		link: `/comment/${item.comment.id}`
	};
	else if ("mod_remove_post" in item) return {
		id: item.mod_remove_post.id,
		actionName: item.mod_remove_post.removed ? "postRemoval" : "postRestore",
		community: item.community,
		content: item.post.name,
		timestamp: timestamp(item.mod_remove_post.when_),
		moderator: item.moderator,
		reason: item.mod_remove_post.reason,
		link: `/post/${item.post.id}`
	};
	else if ("mod_add_community" in item) return {
		id: item.mod_add_community.id,
		actionName: item.mod_add_community.removed ? "modRemove" : "modAdd",
		community: item.community,
		timestamp: timestamp(item.mod_add_community.when_),
		moderator: item.moderator,
		moderatee: item.modded_person
	};
	else if ("mod_feature_post" in item) return {
		id: item.mod_feature_post.id,
		actionName: item.mod_feature_post.featured ? "postFeature" : "postUnfeature",
		timestamp: timestamp(item.mod_feature_post.when_),
		community: item.community,
		link: `/post/${item.post.id}`,
		moderator: item.moderator,
		content: item.post.name
	};
	else if ("mod_lock_post" in item) return {
		id: item.mod_lock_post.id,
		actionName: item.mod_lock_post.locked ? "postLock" : "postUnlock",
		timestamp: timestamp(item.mod_lock_post.when_),
		community: item.community,
		link: `/post/${item.post.id}`,
		moderator: item.moderator,
		content: item.post.name
	};
	else if ("mod_transfer_community" in item) return {
		id: item.mod_transfer_community.id,
		actionName: "Unknown",
		timestamp: timestamp(item.mod_transfer_community.when_),
		moderator: item.moderator,
		moderatee: item.modded_person,
		community: item.community
	};
	else if ("admin_purge_post" in item) return {
		id: item.admin_purge_post.id,
		actionName: "purge",
		timestamp: timestamp(item.admin_purge_post.when_),
		moderator: item.admin,
		community: item.community,
		content: "Purged a post",
		reason: item.admin_purge_post.reason
	};
	else if ("admin_purge_comment" in item) return {
		id: item.admin_purge_comment.id,
		actionName: "purge",
		timestamp: timestamp(item.admin_purge_comment.when_),
		moderator: item.admin,
		content: "Purged a comment",
		reason: item.admin_purge_comment.reason
	};
	else if ("admin_purge_community" in item) return {
		id: item.admin_purge_community.id,
		actionName: "purge",
		timestamp: timestamp(item.admin_purge_community.when_),
		moderator: item.admin,
		content: "Purged a community",
		reason: item.admin_purge_community.reason
	};
	else if ("admin_purge_person" in item) return {
		id: item.admin_purge_person.id,
		actionName: "purge",
		timestamp: timestamp(item.admin_purge_person.when_),
		moderator: item.admin,
		content: "Purged a user",
		reason: item.admin_purge_person.reason
	};
	else if ("mod_ban" in item) {
		const expires = item.mod_ban.expires ? `until ${new Date(item.mod_ban.expires).toLocaleString()}` : "permanently";
		return {
			id: item.mod_ban.id,
			actionName: item.mod_ban.banned ? "ban" : "unban",
			timestamp: timestamp(item.mod_ban.when_),
			moderator: item.moderator,
			moderatee: item.banned_person,
			reason: item.mod_ban.reason + " " + (item.mod_ban.banned === true ? `(banned ${expires})` : ""),
			link: `/u/${fullUserName(item.banned_person)}`
		};
	} else if ("mod_add" in item) return {
		id: item.mod_add.id,
		actionName: item.mod_add.removed ? "adminRemove" : "adminAdd",
		timestamp: timestamp(item.mod_add.when_),
		moderator: item.moderator,
		moderatee: item.modded_person
	};
	return {
		actionName: "Unknown",
		timestamp: 0
	};
};
async function load({ url, fetch }) {
	const community = Number(url.searchParams.get("community")) || void 0;
	const user = Number(url.searchParams.get("user")) || void 0;
	const modId = Number(url.searchParams.get("mod_id")) || void 0;
	const postId = Number(url.searchParams.get("post")) || void 0;
	const commentId = Number(url.searchParams.get("comment")) || void 0;
	const page = Number(url.searchParams.get("page")) || 1;
	const type = url.searchParams.get("type") || "All";
	const apiClient = client({ func: fetch });
	const [results, controversyData] = await Promise.all([apiClient.getModlog({
		community_id: community,
		limit: 20,
		type_: type,
		page,
		mod_person_id: modId,
		other_person_id: user,
		post_id: postId,
		comment_id: commentId
	}), apiClient.getControversialDecisions({
		limit: 20,
		offset: (page - 1) * 20
	}).catch(() => null)]);
	const moderationActions = [
		...results.banned_from_community,
		...results.removed_comments,
		...results.removed_posts,
		...results.added_to_community,
		...results.transferred_to_community,
		...results.featured_posts,
		...results.locked_posts,
		...results.admin_purged_comments,
		...results.admin_purged_communities,
		...results.admin_purged_posts,
		...results.admin_purged_persons,
		...results.hidden_communities,
		...results.banned,
		...results.added
	].map(_toModLog).sort((a, b) => b.timestamp - a.timestamp);
	const decisionsById = {};
	if (controversyData) for (const decision of controversyData.decisions) decisionsById[decision.action_id] = decision;
	return {
		page,
		type,
		modlog: moderationActions,
		decisionsById,
		filters: {
			user: user ? moderationActions[0]?.moderatee?.name : void 0,
			community: community ? moderationActions[0]?.community?.title : void 0,
			moderator: modId ? moderationActions[0]?.moderator?.name : void 0
		},
		params: {
			user,
			community,
			moderator: modId,
			post: postId,
			comment: commentId,
			hasMore: moderationActions.length >= 20
		}
	};
}
//#endregion
export { load as n, _toModLog as t };

//# sourceMappingURL=_page4.js.map