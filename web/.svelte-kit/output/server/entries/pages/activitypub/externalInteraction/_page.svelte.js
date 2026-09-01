import { n as attr, o as escape_html, r as clsx } from "../../../../chunks/validate.js";
import { i as await_block, t as attr_class } from "../../../../chunks/server.js";
import { Y as PostItem, Yt as Spinner, st as Avatar, wt as userLink } from "../../../../chunks/client.svelte.js";
import { t as LabelStat } from "../../../../chunks/LabelStat.js";
import { t as CommentItem } from "../../../../chunks/CommentItem.js";
import { t as CommunityItem } from "../../../../chunks/CommunityItem.js";
//#region src/lib/feature/user/UserItem.svelte
function UserItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, view = "compact", showCounts = true, class: clazz = "flex flex-col gap-4 text-sm max-w-full relative", icon } = $$props;
		$$renderer.push(`<div${attr_class(clsx(clazz))}><div${attr_class(`flex ${view == "cozy" ? "flex-col gap-2" : "flex-row"} items-center max-w-full w-full`)}><a${attr("href", userLink(user.person))} class="flex-1"><div${attr_class(`flex ${view == "cozy" ? "flex-col gap-2" : "flex-row"} gap-2 items-center`)}>`);
		if (icon) {
			$$renderer.push("<!--[0-->");
			icon($$renderer);
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			Avatar($$renderer, {
				url: user.person.avatar,
				width: 32,
				alt: user.person.name
			});
		}
		$$renderer.push(`<!--]--> <div class="flex flex-col"><div class="font-medium text-base">${escape_html(user.person.display_name ?? user.person.name)}</div> <div class="text-sm text-slate-600 dark:text-zinc-400">${escape_html(new URL(user.person.actor_id).hostname)}</div></div></div></a></div> `);
		if (showCounts) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-row gap-3 items-center justify-center">`);
			if (user.counts.post_count) {
				$$renderer.push("<!--[0-->");
				LabelStat($$renderer, {
					content: user.counts.post_count.toString(),
					formatted: true,
					label: "Posts"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (user.counts.comment_count) {
				$$renderer.push("<!--[0-->");
				LabelStat($$renderer, {
					content: user.counts.comment_count.toString(),
					formatted: true,
					label: "Comments"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/activitypub/externalInteraction/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex flex-col items-center justify-center h-full gap-3">`);
			await_block($$renderer, data.resolved, () => {
				Spinner($$renderer, { width: 32 });
				$$renderer.push(`<!----> <span class="font-medium text-lg">Federating...</span>`);
			}, (object) => {
				$$renderer.push(`<div class="w-full max-w-md">`);
				if (object.community) {
					$$renderer.push("<!--[0-->");
					CommunityItem($$renderer, {
						get community() {
							return object.community;
						},
						set community($$value) {
							object.community = $$value;
							$$settled = false;
						}
					});
				} else if (object.person) {
					$$renderer.push("<!--[1-->");
					UserItem($$renderer, { user: object.person });
				} else if (object.post) {
					$$renderer.push("<!--[2-->");
					PostItem($$renderer, { post: object.post });
				} else if (object.comment) {
					$$renderer.push("<!--[3-->");
					CommentItem($$renderer, { comment: object.comment });
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			});
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map