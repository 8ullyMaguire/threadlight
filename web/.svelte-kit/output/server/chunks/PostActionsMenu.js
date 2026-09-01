import { o as escape_html } from "./validate.js";
import { a as bind_props, h as stringify } from "./server.js";
import { At as settings, H as deleteItem, Nt as MenuButton, Qn as ArrowTopRightOnSquare, Qt as XMark, U as markAsRead, ct as hidePost, nn as Trash, o as profile, z as PiefedClient } from "./client.svelte.js";
import { t as Eye } from "./Eye.js";
import { t as EyeSlash } from "./EyeSlash.js";
import { t as Flag } from "./Flag.js";
import { t as PencilSquare } from "./PencilSquare.js";
import { t as ShieldExclamation } from "./ShieldExclamation.js";
import { a as remove, o as report } from "./moderation.js";
//#region src/lib/feature/post/actions/PostActionsMenu.svelte
function PostActionsMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { post = void 0, onhide, editing = void 0 } = $$props;
		function crosspostB64() {
			return JSON.stringify({
				body: `${settings.crosspostOriginalLink ? `cross-posted from: ${post.post.ap_id}` : ``}\n${post.post.body ? ">" + post.post.body.split("\n").join("\n> ") : ""}`,
				name: post.post.name,
				url: post.post.url,
				nsfw: post.post.nsfw
			});
		}
		if (profile.current?.user && profile.current?.jwt && profile.current.user.local_user_view.person.id == post.creator.id) {
			$$renderer.push("<!--[0-->");
			MenuButton($$renderer, {
				onclick: () => editing = true,
				icon: PencilSquare,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Edit`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (profile.current?.jwt) {
			$$renderer.push("<!--[0-->");
			MenuButton($$renderer, {
				onclick: async () => {
					if (profile.current?.jwt) post.read = await markAsRead(post.post, !post.read);
				},
				icon: post.read ? EyeSlash : Eye,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(post.read ? "Mark as unread" : "Mark as read")}`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (profile.current?.jwt) {
			$$renderer.push("<!--[0-->");
			MenuButton($$renderer, {
				href: `/create/post?crosspost=${stringify(crosspostB64())}`,
				icon: ArrowTopRightOnSquare,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Crosspost`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (profile.current.user && post.creator.id == profile.current.user.local_user_view.person.id) {
				$$renderer.push("<!--[0-->");
				MenuButton($$renderer, {
					onclick: async () => {
						if (profile.current?.jwt) post.post.deleted = await deleteItem(post, !post.post.deleted);
					},
					color: "danger-subtle",
					icon: Trash,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(post.post.deleted ? "Restore" : "Delete")}`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (profile.isMod(post.community) || profile.isAdmin) {
				$$renderer.push("<!--[0-->");
				MenuButton($$renderer, {
					onclick: () => remove(post),
					color: "danger-subtle",
					icon: ShieldExclamation,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(post.post.removed ? "Restore" : "Remove")}`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (profile.current.user?.local_user_view.person.id != post.creator.id) {
				$$renderer.push("<!--[0-->");
				if (!(profile.client instanceof PiefedClient)) {
					$$renderer.push("<!--[0-->");
					MenuButton($$renderer, {
						onclick: async () => {
							if (!profile.current?.jwt) return;
							const hidden = await hidePost(post.post.id, !post.hidden, profile.current?.jwt);
							post.hidden = hidden;
							if (hidden) onhide?.(hidden);
						},
						color: "danger-subtle",
						icon: XMark,
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(post.hidden ? "Unhide" : "Hide")}`);
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				MenuButton($$renderer, {
					onclick: () => report(post),
					color: "danger-subtle",
					icon: Flag,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Report`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			post,
			editing
		});
	});
}
//#endregion
export { PostActionsMenu as default };

//# sourceMappingURL=PostActionsMenu.js.map