import { o as escape_html, r as clsx } from "../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, l as head, t as attr_class } from "../../../chunks/server.js";
import { t as goto } from "../../../chunks/navigation.js";
import { Bn as Check, Ct as searchParam, F as CommonList, Ht as Option, M as Pageination, R as Header, Vn as ChatBubbleOvalLeftEllipsis, Vt as Select, Xt as ButtonGroup, Zt as Button, ar as page, at as RelativeDate, gt as escapeHtml, n as getClient, o as profile, p as Markdown, pn as PaperAirplane, qt as Material, st as Avatar, tr as publishedToDate, zt as Expandable } from "../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../chunks/Placeholder.js";
import { t as ArrowPath } from "../../../chunks/ArrowPath.js";
import { t as AtSymbol } from "../../../chunks/AtSymbol.js";
import { t as Eye } from "../../../chunks/Eye.js";
import { t as EyeSlash } from "../../../chunks/EyeSlash.js";
import { t as Funnel } from "../../../chunks/Funnel.js";
import { t as Inbox } from "../../../chunks/Inbox.js";
import { t as CommentItem } from "../../../chunks/CommentItem.js";
import { t as Fixate } from "../../../chunks/Fixate.js";
import { t as PrivateMessage } from "../../../chunks/PrivateMessage.js";
//#region src/routes/inbox/InboxItem.svelte
function InboxItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item = void 0 } = $$props;
		let loading = false;
		async function markAsRead(isRead) {
			if (isRead && item.read) return;
			loading = true;
			switch (item.type) {
				case "person_mention":
					await getClient().markPersonMentionAsRead({
						person_mention_id: item.id,
						read: isRead
					});
					break;
				case "comment_reply":
					await getClient().markCommentReplyAsRead({
						comment_reply_id: item.id,
						read: isRead
					});
					break;
				case "private_message": await getClient().markPrivateMessageAsRead({
					private_message_id: item.id,
					read: isRead
				});
			}
			item.read = isRead;
			if (profile.current.user) profile.inbox.notifications.inbox += isRead ? -1 : 1;
			loading = false;
		}
		function actions($$renderer) {
			Button($$renderer, {
				color: item.read ? "secondary" : "primary",
				loading,
				disabled: loading || item.creator.id == profile.current.user?.local_user_view.person.id,
				onclick: (e) => {
					e.stopPropagation();
					markAsRead(!item.read);
				},
				size: "sm",
				rounding: "pill",
				class: "shrink-0",
				icon: item.read ? EyeSlash : Eye,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(item.read ? "Mark as unread" : "Mark as read")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				href: item.type == "private_message" ? `/inbox/messages/${item.item.private_message.creator_id}` : `/comment/${item.item.comment.id}`,
				size: "sm",
				rounding: "pill",
				class: "shrink-0",
				onclick: () => markAsRead(true),
				children: ($$renderer) => {
					$$renderer.push(`<!---->Jump`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		}
		{
			function title($$renderer) {
				$$renderer.push(`<div class="flex flex-row gap-2 items-center w-full"><div class="relative">`);
				Avatar($$renderer, {
					url: item.creator.avatar,
					width: 28,
					alt: item.creator.name
				});
				$$renderer.push(`<!----> `);
				Material($$renderer, {
					color: "uniform",
					padding: "none",
					class: "absolute -bottom-2 -right-2 p-1",
					rounding: "full",
					children: ($$renderer) => {
						Icon($$renderer, {
							src: item.type == "comment_reply" ? ChatBubbleOvalLeftEllipsis : item.type == "person_mention" ? AtSymbol : PaperAirplane,
							size: "12",
							micro: true
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="flex flex-col"><div class="text-sm font-normal text-slate-600 dark:text-zinc-400">`);
				if (item.type == "comment_reply") {
					$$renderer.push("<!--[0-->");
					Markdown($$renderer, {
						inline: true,
						source: `**${item.creator.name}** replied to you in **${escapeHtml(item.item.post.name)}**`,
						noStyle: true
					});
				} else if (item.type == "person_mention") {
					$$renderer.push("<!--[1-->");
					Markdown($$renderer, {
						inline: true,
						source: `**${item.creator.name}** mentioned you in **${escapeHtml(item.item.post.name)}**`,
						noStyle: true
					});
				} else if (item.type == "private_message") {
					$$renderer.push("<!--[2-->");
					Markdown($$renderer, {
						inline: true,
						source: `**${item.creator.name}** messaged **${escapeHtml(item.item.recipient.name)}**`,
						noStyle: true
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="text-xs text-slate-600 dark:text-zinc-400">`);
				RelativeDate($$renderer, { date: publishedToDate(item.published) });
				$$renderer.push(`<!----></div></div> <div class="flex-1"></div> `);
				ButtonGroup($$renderer, {
					orientation: "horizontal",
					class: "md:flex hidden shrink-0",
					children: ($$renderer) => {
						actions($$renderer);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			}
			function extended($$renderer) {
				ButtonGroup($$renderer, {
					orientation: "horizontal",
					class: "flex md:hidden",
					children: ($$renderer) => {
						actions($$renderer);
					},
					$$slots: { default: true }
				});
			}
			function content($$renderer) {
				if (item.type == "comment_reply" || item.type == "person_mention") {
					$$renderer.push("<!--[0-->");
					CommentItem($$renderer, {
						comment: item.item,
						community: false,
						meta: false,
						class: "py-0!",
						commentClass: "py-0!"
					});
				} else {
					$$renderer.push("<!--[-1-->");
					PrivateMessage($$renderer, {
						message: item.item,
						meta: false
					});
				}
				$$renderer.push(`<!--]-->`);
			}
			Expandable($$renderer, {
				open: true,
				icon: false,
				title,
				extended,
				content,
				$$slots: {
					title: true,
					extended: true,
					content: true
				}
			});
		}
		bind_props($$props, { item });
	});
}
//#endregion
//#region src/routes/inbox/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let markingAsRead = false;
		async function markAllAsRead() {
			if (!profile.current?.user) {
				goto("/login");
				return;
			}
			markingAsRead = true;
			const response = await getClient().markAllAsRead();
			profile.inbox.notifications.inbox = 0;
			goto(page.url, { invalidateAll: true }).then(() => {
				markingAsRead = false;
			});
			return response.replies;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("9rszxv", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Inbox</title>`);
				});
			});
			{
				function extended($$renderer) {
					var bind_get = () => data.unreadOnly.value.toString();
					var bind_set = (v) => data.unreadOnly.value = v == "true";
					$$renderer.push(`<div class="flex gap-2 tracking-normal items-end">`);
					{
						function customLabel($$renderer) {
							$$renderer.push(`<div class="flex items-center gap-1">`);
							Icon($$renderer, {
								src: Funnel,
								size: "15",
								mini: true
							});
							$$renderer.push(`<!----> Filter</div>`);
						}
						Select($$renderer, {
							class: "relative",
							get value() {
								return bind_get();
							},
							set value($$value) {
								bind_set($$value);
							},
							onchange: () => searchParam(page.url, "unreadOnly", data.unreadOnly.value ? "true" : "false", "page"),
							customLabel,
							children: ($$renderer) => {
								Option($$renderer, {
									value: "false",
									children: ($$renderer) => {
										$$renderer.push(`<!---->All`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Option($$renderer, {
									value: "true",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Unread`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: {
								customLabel: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> <div class="flex-1"></div> `);
					Button($$renderer, {
						onclick: markAllAsRead,
						loading: markingAsRead,
						disabled: markingAsRead || data.inbox.value.length == 0,
						color: "primary",
						icon: Check,
						size: "lg",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Mark All Read`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => goto(page.url, { invalidateAll: true }),
						size: "square-lg",
						"aria-label": "Refresh",
						icon: ArrowPath
					});
					$$renderer.push(`<!----></div>`);
				}
				Header($$renderer, {
					pageHeader: true,
					class: "lg:flex-row justify-between flex-col",
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Inbox`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			if (!data.inbox?.value || (data.inbox.value?.length ?? 0) == 0) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					icon: Inbox,
					title: "No new notifications",
					description: "Messages, replies, and mentions will appear here.",
					class: "self-center justify-self-center my-auto"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				CommonList($$renderer, {
					size: "md",
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(data.inbox.value);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let item = each_array[$$index];
							$$renderer.push(`<li${attr_class(clsx([!item.read && "bg-blue-300/10! dark:bg-blue-500/5!"]))}>`);
							InboxItem($$renderer, { item });
							$$renderer.push(`<!----></li>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--> `);
			if (!(data.page == 1 && (data?.inbox?.value.length ?? 0) == 0)) {
				$$renderer.push("<!--[0-->");
				Fixate($$renderer, {
					placement: "bottom",
					children: ($$renderer) => {
						Pageination($$renderer, {
							hasMore: !(!data.inbox || (data.inbox.value?.length ?? 0) < (data?.limit ?? 0)),
							page: data.page,
							href: (page) => `?page=${page}`
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
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