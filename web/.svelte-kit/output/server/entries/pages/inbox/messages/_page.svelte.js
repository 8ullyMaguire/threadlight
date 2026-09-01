import { n as attr, o as escape_html } from "../../../../chunks/validate.js";
import { c as ensure_array_like, h as stringify, i as await_block } from "../../../../chunks/server.js";
import { s as resolve, t as goto } from "../../../../chunks/navigation.js";
import { Et as SvelteSet, F as CommonList, M as Pageination, R as Header, Rt as Modal, Vn as ChatBubbleOvalLeftEllipsis, Zt as Button, at as RelativeDate, o as profile, st as Avatar, tr as publishedToDate } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
import { t as Inbox } from "../../../../chunks/Inbox.js";
import { t as Skeleton } from "../../../../chunks/Skeleton.js";
import { t as Fixate } from "../../../../chunks/Fixate.js";
import { t as UserAutocomplete } from "../../../../chunks/UserAutocomplete.js";
//#region src/routes/inbox/messages/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function getOtherPartyId(message) {
			return message.creator.id == profile.current.user?.local_user_view.person.id ? message.recipient.id : message.creator.id;
		}
		function filterDuplicates(array, predicate) {
			const seen = new SvelteSet();
			return array.filter((element) => {
				const value = predicate(element);
				if (seen.has(value)) return false;
				else {
					seen.add(value);
					return true;
				}
			});
		}
		function conversationPreviews(conversations) {
			return filterDuplicates(conversations, (i) => getOtherPartyId(i)).filter((c) => c.creator.id != c.recipient.id).map((i) => ({
				user: i.creator.id != profile.current.user?.local_user_view.person.id ? i.creator : i.recipient,
				message: {
					date: publishedToDate(i.private_message.published),
					last_sender: i.creator.id,
					content: i.private_message.content
				}
			}));
		}
		let searchModal = {
			open: false,
			user: void 0
		};
		let { data } = $$props;
		function startChat($$renderer) {
			Button($$renderer, {
				color: "primary",
				size: "lg",
				class: "w-max",
				onclick: () => searchModal.open = !searchModal.open,
				children: ($$renderer) => {
					Icon($$renderer, {
						src: ChatBubbleOvalLeftEllipsis,
						size: "18",
						mini: true
					});
					$$renderer.push(`<!----> Start chat`);
				},
				$$slots: { default: true }
			});
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: "Start chat",
				get open() {
					return searchModal.open;
				},
				set open($$value) {
					searchModal.open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					UserAutocomplete($$renderer, {
						listing_type: "All",
						hideOwnUser: true,
						onselect: (u) => {
							if (!u) return;
							goto(resolve("/inbox/messages/[user_id=integer]", { user_id: u.id.toString() }));
						}
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Header($$renderer, {
				pageHeader: true,
				extended: startChat,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Messages`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			await_block($$renderer, data.messages, () => {
				$$renderer.push(`<div class="w-full h-full flex flex-col gap-2"><!--[-->`);
				const each_array = ensure_array_like(new Array(5));
				for (let index = 0, $$length = each_array.length; index < $$length; index++) {
					let _ = each_array[index];
					$$renderer.push(`<!---->${escape_html(_)} <div>`);
					Skeleton($$renderer, {});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}, (res) => {
				const conversations = res.private_messages;
				const previews = conversationPreviews(conversations);
				if (previews.length == 0) {
					$$renderer.push("<!--[0-->");
					Placeholder($$renderer, {
						title: "No messages",
						icon: Inbox,
						class: "my-auto",
						children: ($$renderer) => {
							startChat?.($$renderer);
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				{
					function item($$renderer, preview) {
						$$renderer.push(`<a${attr("href", `/inbox/messages/${stringify(preview.user.id)}`)} class="flex flex-row items-center gap-2">`);
						Avatar($$renderer, {
							url: preview.user.avatar,
							alt: preview.user.name,
							width: 32
						});
						$$renderer.push(`<!----> <div class="flex flex-col w-full overflow-hidden"><div class="font-medium">${escape_html(preview.user.name)}</div> <div class="flex w-full"><div class="text-sm text-ellipsis whitespace-nowrap bg-linear-to-r from-slate-700 via-slate-700 to-slate-700/0 dark:from-zinc-300 dark:via-zinc-300 dark:to-zinc-300/0 text-transparent bg-clip-text flex-1 overflow-hidden">`);
						if (preview.message.last_sender == profile.current.user?.local_user_view.person.id) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`${escape_html(profile.current.user?.local_user_view.person.name)}:`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> ${escape_html(preview.message.content)}</div> `);
						RelativeDate($$renderer, {
							date: preview.message.date,
							class: "inline-block text-xs text-slate-600 dark:text-zinc-400 shrink-0"
						});
						$$renderer.push(`<!----></div></div></a>`);
					}
					CommonList($$renderer, {
						items: previews,
						item,
						$$slots: { item: true }
					});
				}
				$$renderer.push(`<!----> `);
				if (res.private_messages.length == 50 || data.page != 1) {
					$$renderer.push("<!--[0-->");
					Fixate($$renderer, {
						placement: "bottom",
						children: ($$renderer) => {
							Pageination($$renderer, {
								page: data.page,
								hasMore: res.private_messages.length == 50,
								href: (current) => `/inbox/messages?page=${current}`
							});
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			});
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