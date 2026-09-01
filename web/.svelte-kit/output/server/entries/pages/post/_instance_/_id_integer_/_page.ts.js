import { s as resolve, t as goto } from "../../../../../chunks/navigation.js";
import { At as settings, o as profile, pt as ReactiveState, t as client, z as PiefedClient } from "../../../../../chunks/client.svelte.js";
import { t as CommunityCard } from "../../../../../chunks/CommunityCard.js";
import { n as feeds, t as feed } from "../../../../../chunks/feed.svelte.js";
//#region src/routes/post/[instance]/[id=integer]/+page.ts
function buildContext(thread) {
	let parentId;
	let showContext = false;
	let max_depth = 3;
	if (thread) if (thread.split(".")[0] == "0") parentId = Number(thread.split(".")[1]);
	else {
		parentId = Number(thread.split(".")[0]);
		showContext = true;
		max_depth = 5;
	}
	return {
		parentId,
		showContext,
		max_depth,
		focus: thread?.split(".").at(-1)
	};
}
async function findInFeed(id, postId) {
	if (id == "/") return feeds.get(id)?.peek()?.posts.find((i) => i.post.id.toString() == postId);
	else return feeds.get(id)?.peek()?.posts.find((i) => i.post.id.toString() == postId);
}
async function load({ params, url, route }) {
	if (profile.current.instance != params.instance) goto(resolve("/post/[instance]/[id=integer]/confirm", params), { replaceState: true });
	const sort = settings?.defaultSort?.comments ?? "Hot";
	const cachedPost = await findInFeed("/", params.id) ?? await findInFeed("/c/[name]", params.id) ?? await findInFeed("/f/[id]", params.id);
	const { parentId, showContext, focus, max_depth: passedMaxDepth } = buildContext(url.searchParams.get("thread") || void 0);
	const max_depth = passedMaxDepth;
	const loaded = new ReactiveState(await feed(route.id, async (p) => {
		const commentPromise = client().getComments(p.comments);
		const postPromise = client().getPost(p.posts);
		return {
			post: p.preload ?? (await postPromise).post_view,
			comments: commentPromise.then((i) => i.comments),
			meta: postPromise.then((i) => ({
				community_view: i.community_view,
				cross_posts: i.cross_posts,
				post_view: i.post_view
			})),
			thread: p.thread,
			params: p
		};
	}).load({
		comments: {
			post_id: Number(params.id),
			type_: "All",
			max_depth: profile.client instanceof PiefedClient ? max_depth - 1 : max_depth,
			saved_only: false,
			sort,
			parent_id: parentId,
			limit: 1e10
		},
		posts: { id: Number(params.id) },
		preload: cachedPost,
		thread: {
			showContext,
			focus,
			singleThread: parentId != null
		}
	}));
	return {
		data: loaded,
		slots: { sidebar: {
			component: CommunityCard,
			props: { community_view: loaded.value.meta.then((i) => i.community_view) }
		} }
	};
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map