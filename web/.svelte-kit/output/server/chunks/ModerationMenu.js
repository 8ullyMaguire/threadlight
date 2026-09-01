import { o as escape_html } from "./validate.js";
import { a as bind_props, h as stringify } from "./server.js";
import { En as Fire, K as isCommentView, Mt as MenuDivider, Nt as MenuButton, Pt as Menu, _n as Megaphone, bn as LockClosed, f as toast, hn as Newspaper, n as getClient, nn as Trash, o as profile, q as isPostView, tt as errorMessage } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ArrowsUpDown } from "./ArrowsUpDown.js";
import { t as LockOpen } from "./LockOpen.js";
import { t as ShieldExclamation } from "./ShieldExclamation.js";
import { a as remove, s as viewVotes, t as ban } from "./moderation.js";
//#region src/lib/feature/moderation/ModerationMenu.svelte
function ModerationMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item = void 0, target: passedTarget } = $$props;
		let acting = false;
		async function lock(lock) {
			if (!profile.current?.jwt || !isPostView(item)) return;
			acting = true;
			try {
				await getClient().lockPost({
					locked: lock,
					post_id: item.post.id
				});
				item.post.locked = lock;
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			acting = false;
		}
		async function pin(pinned, toInstance = false) {
			if (!profile.current?.jwt || !isPostView(item)) return;
			acting = true;
			try {
				await getClient().featurePost({
					feature_type: toInstance ? "Local" : "Community",
					featured: pinned,
					post_id: item.post.id
				});
				item.post.featured_community = pinned;
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			acting = false;
		}
		{
			function target($$renderer, attachment) {
				passedTarget($$renderer, attachment, acting);
				$$renderer.push(`<!---->`);
			}
			Menu($$renderer, {
				placement: "bottom-end",
				target,
				children: ($$renderer) => {
					if (profile.isMod(item.community) || profile.isAdmin) {
						$$renderer.push("<!--[0-->");
						MenuDivider($$renderer, {
							showLabel: true,
							children: ($$renderer) => {
								if (!item.community.local && !profile.isMod(item.community)) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`Moderation (Local only)`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`Moderation`);
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "warning-subtle",
							onclick: () => lock(!item.post.locked),
							loading: acting,
							icon: item.post.locked ? LockOpen : LockClosed,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(item.post.locked ? "Unlock" : "Lock")}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "success-subtle",
							onclick: () => pin(isPostView(item) ? !item.post.featured_community : false),
							loading: acting,
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Megaphone,
									size: "16",
									mini: true
								});
								$$renderer.push(`<!----> <div class="flex flex-row gap-2 text-left items-center justify-between w-full"><span>${escape_html(item.post.featured_community ? "Unfeature" : "Feature")}</span> `);
								if (profile.isAdmin) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<span class="text-xs opacity-80">Community</span>`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "danger-subtle",
							onclick: () => remove(item),
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Trash,
									size: "16",
									mini: true
								});
								$$renderer.push(`<!----> `);
								if (isCommentView(item)) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`${escape_html(item.comment.removed ? "Restore" : "Remove")}`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`${escape_html(item.post.removed ? "Restore" : "Remove")}`);
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						if (profile.current?.user && profile.current.user.local_user_view.person.id != item.creator.id) {
							$$renderer.push("<!--[0-->");
							MenuButton($$renderer, {
								color: "danger-subtle",
								onclick: () => ban(item.creator_banned_from_community, item.creator, item.community),
								children: ($$renderer) => {
									Icon($$renderer, {
										src: ShieldExclamation,
										size: "16",
										mini: true
									});
									$$renderer.push(`<!----> ${escape_html(item.creator_banned_from_community ? "Unban user from community" : "Ban user from community")}`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						MenuButton($$renderer, {
							color: "success-subtle",
							href: `/modlog?user=${stringify(item.creator.id)}`,
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Newspaper,
									size: "16",
									micro: true
								});
								$$renderer.push(`<!----> User moderation log`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "success-subtle",
							href: `/modlog?post=${stringify(item.post.id)}`,
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Newspaper,
									size: "16",
									micro: true
								});
								$$renderer.push(`<!----> Post moderation log`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "blue-subtle",
							onclick: () => viewVotes(item),
							children: ($$renderer) => {
								Icon($$renderer, {
									src: ArrowsUpDown,
									size: "16",
									micro: true
								});
								$$renderer.push(`<!----> Votes`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (profile.isAdmin) {
						$$renderer.push("<!--[0-->");
						MenuDivider($$renderer, {
							showLabel: true,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Administration`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "success-subtle",
							onclick: () => pin(isPostView(item) ? !item.post.featured_local : false, true),
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Megaphone,
									size: "16",
									mini: true
								});
								$$renderer.push(`<!----> <div class="flex flex-row gap-2 text-left items-center justify-between w-full"><span>${escape_html(item.post.featured_local ? "Unfeature" : "Feature")}</span> <span class="text-xs opacity-80">Server</span></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							color: "danger-subtle",
							onclick: () => remove(item, true),
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Fire,
									size: "16",
									mini: true
								});
								$$renderer.push(`<!----> Purge`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: {
					target: true,
					default: true
				}
			});
		}
		bind_props($$props, { item });
	});
}
//#endregion
export { ModerationMenu as default };

//# sourceMappingURL=ModerationMenu.js.map