import { n as getClient, o as profile, pt as ReactiveState, tr as publishedToDate } from "../../../chunks/client.svelte.js";
import { error } from "@sveltejs/kit";
//#region src/lib/feature/inbox/index.ts
var generalizeCommentReply = (item) => ({
	type: "comment_reply",
	id: item.comment_reply.id,
	published: item.comment_reply.published,
	item: { ...item },
	creator: item.creator,
	read: item.comment_reply.read
});
var generalizePersonMention = (item) => ({
	type: "person_mention",
	id: item.person_mention.id,
	published: item.person_mention.published,
	item: { ...item },
	creator: item.creator,
	read: item.person_mention.read
});
var generalizePrivateMessage = (item) => ({
	type: "private_message",
	id: item.private_message.id,
	published: item.private_message.published,
	item,
	creator: item.creator,
	read: item.private_message.read
});
//#endregion
//#region src/routes/inbox/+page.ts
async function load({ url, fetch }) {
	if (!profile.current.jwt) error(401);
	const type = url.searchParams.get("type") || "all";
	const client = getClient(void 0, fetch);
	const page = Number(url.searchParams.get("page")) || 1;
	const unreadOnly = (url.searchParams.get("unreadOnly") || "false") == "true";
	const params = {
		limit: 20,
		page,
		unread_only: unreadOnly
	};
	const [replies, mentions, privateMessages] = await Promise.all([
		type == "all" || type == "replies" ? client.getReplies({
			...params,
			sort: "New"
		}) : { replies: [] },
		type == "all" || type == "mentions" ? client.getPersonMentions({
			...params,
			sort: "New"
		}) : { mentions: [] },
		type == "all" || type == "messages" ? client.getPrivateMessages({ ...params }) : { private_messages: [] }
	]);
	const data = [
		...replies.replies.map(generalizeCommentReply),
		...mentions.mentions.map(generalizePersonMention),
		...privateMessages.private_messages.filter((i) => i.private_message.creator_id != profile.current.user?.local_user_view.person.id).map(generalizePrivateMessage)
	].sort((a, b) => publishedToDate(b.published).getTime() - publishedToDate(a.published).getTime());
	const totalNotifs = type == "all" ? data.filter((i) => i.type != "private_message" && !i.read).length : 0;
	profile.inbox.notifications.inbox = totalNotifs;
	return {
		unreadOnly: new ReactiveState(unreadOnly),
		type,
		page,
		inbox: new ReactiveState(data),
		limit: 20
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map