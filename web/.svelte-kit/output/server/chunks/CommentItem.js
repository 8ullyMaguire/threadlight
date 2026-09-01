import { r as clsx } from "./validate.js";
import { f as spread_props, h as stringify, t as attr_class } from "./server.js";
import { Q as PostMeta, Zt as Button, tr as publishedToDate } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ArrowUturnUp } from "./ArrowUturnUp.js";
import { t as Comment } from "./Comment.js";
//#region src/lib/feature/comment/CommentItem.svelte
function CommentItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { comment, community = false, meta = true, class: clazz = "", commentClass = "", actions = true, $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<div${attr_class(clsx(["flex flex-col flex-1 rounded-none list-none", clazz]))}>`);
		if (meta) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-row justify-between items-center gap-2"><div class="flex flex-col gap-2">`);
			PostMeta($$renderer, {
				badges: {
					nsfw: comment.post.nsfw,
					removed: comment.post.removed,
					admin: false,
					moderator: false,
					saved: false,
					deleted: comment.post.deleted,
					featured: comment.post.featured_community || comment.post.featured_local,
					locked: comment.post.locked
				},
				published: publishedToDate(comment.comment.published),
				community: community ? comment.community : void 0,
				title: comment.post.name,
				id: comment.post.id,
				titleClass: "text-sm text-slate-500 dark:text-zinc-400"
			});
			$$renderer.push(`<!----></div> `);
			Button($$renderer, {
				color: "primary",
				rounding: "pill",
				size: "sm",
				href: `/comment/${stringify(comment.comment.id)}`,
				class: "self-start",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Jump `);
					Icon($$renderer, {
						src: ArrowUturnUp,
						size: "14",
						micro: true
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Comment($$renderer, spread_props([
			{
				node: {
					children: [],
					comment_view: comment,
					depth: 1,
					expanded: true
				},
				replying: false,
				meta,
				actions
			},
			rest,
			{ class: commentClass }
		]));
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { CommentItem as t };

//# sourceMappingURL=CommentItem.js.map