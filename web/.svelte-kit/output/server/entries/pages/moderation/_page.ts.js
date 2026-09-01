import { K as isCommentView, n as getClient, o as profile, pt as ReactiveState, q as isPostView, tr as publishedToDate } from "../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/lib/feature/moderation/report.ts
var generalizeCommentReport = (report) => ({
	creator: report.creator,
	item: {
		...report,
		subscribed: "NotSubscribed",
		saved: false,
		creator_blocked: false,
		creator: report.comment_creator,
		banned_from_community: false
	},
	reason: report.comment_report.reason,
	type: "comment",
	timestamp: publishedToDate(report.comment_report.published),
	resolved: report.comment_report.resolved,
	id: report.comment_report.id,
	resolver: report.resolver
});
var generalizePostReport = (report) => ({
	creator: report.creator,
	item: {
		...report,
		unread_comments: 0,
		saved: false,
		creator_blocked: false,
		read: false,
		subscribed: "NotSubscribed",
		creator: report.post_creator,
		banned_from_community: false
	},
	reason: report.post_report.reason,
	type: "post",
	timestamp: publishedToDate(report.post_report.published),
	resolved: report.post_report.resolved,
	id: report.post_report.id,
	resolver: report.resolver
});
var generalizePrivateMessageReport = (report) => ({
	creator: report.creator,
	item: report.private_message,
	reason: report.private_message_report.reason,
	type: "message",
	reportee: report.private_message_creator,
	timestamp: publishedToDate(report.private_message_report.published),
	resolved: report.private_message_report.resolved,
	id: report.private_message_report.id,
	resolver: report.resolver
});
//#endregion
//#region src/routes/moderation/+page.ts
async function load({ url, fetch }) {
	if (!profile.current.jwt) error(401);
	const page = Number(url.searchParams.get("page")) || 1;
	const type = url.searchParams.get("type") || "unread";
	const community = Number(url.searchParams.get("community")) || void 0;
	const client = getClient(void 0, fetch);
	const params = {
		limit: 20,
		page,
		unresolved_only: type == "unread",
		community_id: community
	};
	const [posts, comments, messages, moderationActions] = await Promise.all([
		client.listPostReports({ ...params }),
		client.listCommentReports({ ...params }),
		profile.isAdmin ? client.listPrivateMessageReports({ ...params }) : void 0,
		client.getModerationActions({
			limit: 10,
			offset: 0
		}).catch(() => null)
	]);
	const grouped = [
		...posts.post_reports.map(generalizePostReport),
		...comments.comment_reports.map(generalizeCommentReport),
		...(messages?.private_message_reports ?? []).map(generalizePrivateMessageReport)
	].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).reduce((groups, item) => {
		const key = isPostView(item.item) ? `post-${item.item.post.id}` : isCommentView(item.item) ? `comment-${item.item.comment.id}` : `pm-${item.item.id}`;
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
		return groups;
	}, {});
	return {
		type: new ReactiveState(type),
		page,
		items: new ReactiveState(Object.values(grouped)),
		moderationActions: moderationActions?.actions ?? [],
		filters: { community }
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map