import { a as onDestroy } from "../../../../../chunks/internal.js";
import { o as escape_html, r as clsx } from "../../../../../chunks/validate.js";
import { c as ensure_array_like, i as await_block, l as head, t as attr_class } from "../../../../../chunks/server.js";
import { At as settings, Nt as MenuButton, Pn as ChevronUp, Pt as Menu, R as Header, Ut as TextInput, Zt as Button, at as RelativeDate, gn as Minus, nn as Trash, nt as UserLink, o as profile, p as Markdown, pn as PaperAirplane, qt as Material, t as client, tr as publishedToDate, un as Plus } from "../../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../../chunks/Placeholder.js";
import { t as ArrowLeft } from "../../../../../chunks/ArrowLeft.js";
import { t as MarkdownEditor } from "../../../../../chunks/MarkdownEditor.js";
import { t as Flag } from "../../../../../chunks/Flag.js";
import { o as report } from "../../../../../chunks/moderation.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/EllipsisVertical.js
var EllipsisVertical = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM8 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9.5 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" }]
	},
	"outline": {
		"a": {
			"fill": "none",
			"viewBox": "0 0 24 24",
			"stroke-width": "1.5",
			"stroke": "currentColor"
		},
		"path": [{
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/inbox/messages/[user_id=integer]/Message.svelte
function Message($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { message, primary = false, ondelete, onreport, showTimestamp = true } = $$props;
		$$renderer.push(`<div${attr_class(`group relative w-full flex gap-1 items-center ${primary ? "flex-row-reverse" : "flex-row"}`)} style="max-width: min(80vw,24rem)"><div><div${attr_class(`${primary ? "bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900 hover:brightness-75" : "bg-slate-100 dark:bg-zinc-900 hover:brightness-125"} rounded-2xl w-full p-1.5 px-3 font-medium cursor-pointer transition-all`)}>`);
		Markdown($$renderer, {
			rendererOptions: { autoloadImages: false },
			source: message.private_message.content,
			class: "w-full"
		});
		$$renderer.push(`<!----></div> `);
		if (showTimestamp) {
			$$renderer.push("<!--[0-->");
			RelativeDate($$renderer, {
				class: "text-xs block -mt-0.5 ml-1 text-slate-600 dark:text-zinc-400",
				date: publishedToDate(message.private_message.published)
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			function target($$renderer, attachment) {
				Button($$renderer, {
					color: "tertiary",
					class: "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all shrink-0",
					size: "square-md",
					rounding: "pill",
					title: "Actions",
					children: ($$renderer) => {
						Icon($$renderer, {
							src: EllipsisVertical,
							size: "16",
							micro: true
						});
					},
					$$slots: { default: true }
				});
			}
			Menu($$renderer, {
				target,
				children: ($$renderer) => {
					if (primary) {
						$$renderer.push("<!--[0-->");
						MenuButton($$renderer, {
							color: "danger-subtle",
							onclick: () => ondelete?.(true),
							icon: Trash,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Delete`);
							},
							$$slots: { default: true }
						});
					} else {
						$$renderer.push("<!--[-1-->");
						MenuButton($$renderer, {
							color: "danger-subtle",
							onclick: () => onreport?.(true),
							icon: Flag,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Report`);
							},
							$$slots: { default: true }
						});
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: {
					target: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
//#region src/routes/inbox/messages/[user_id=integer]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let textbox = {
			message: "",
			loading: false
		};
		async function deleteMessage(id) {
			await client().deletePrivateMessage({
				deleted: true,
				private_message_id: id
			});
			data.message.value = { private_messages: data.message.value.private_messages.toSpliced(data.message.value.private_messages.findLastIndex((i) => i.private_message.id == id), 1) };
		}
		let interval = -1;
		let page = 1;
		async function loadMore(page = 1) {
			const res = await client().getPrivateMessages({
				creator_id: Number(data.creator.value.person_view.person.id),
				limit: 50,
				page
			});
			const messageSet = new Set(data.message.value.private_messages.map((i) => i.private_message.id));
			const newMessages = res.private_messages.filter((i) => !messageSet.has(i.private_message.id));
			data.message.value.private_messages.push(...newMessages);
			data.message.value.private_messages.sort((a, b) => publishedToDate(b.private_message.published).getTime() - publishedToDate(a.private_message.published).getTime());
			markRead();
		}
		async function markRead() {
			data.message.value.private_messages.filter((i) => !i.private_message.read && i.private_message.creator_id != profile.current.user?.local_user_view.person.id).forEach((i) => client().markPrivateMessageAsRead({
				private_message_id: i.private_message.id,
				read: true
			}));
		}
		onDestroy(() => {
			clearInterval(interval);
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1cdqzhb", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>
    \`Messaging $${escape_html(data.creator.value.person_view.person.name)}\`
  </title>`);
				});
			});
			{
				function extended($$renderer) {
					$$renderer.push(`<div class="flex flex-wrap gap-4">`);
					Button($$renderer, {
						size: "square-md",
						href: ".",
						title: "Back",
						icon: ArrowLeft
					});
					$$renderer.push(`<!----> `);
					UserLink($$renderer, {
						avatar: true,
						user: data.creator.value.person_view.person
					});
					$$renderer.push(`<!----></div>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Messages`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			Material($$renderer, {
				color: "transparent",
				rounding: "2xl",
				padding: "none",
				class: "bg-white dark:bg-zinc-950 dark:border-t-zinc-900 w-full overflow-auto relative flex-1 min-h-0 max-h-[66vh] md:max-h-[64vh]",
				children: ($$renderer) => {
					$$renderer.push(`<div class="h-full overflow-auto max-w-full"><ul id="chat-window" class="flex flex-col gap-1 flex-1 px-4 py-4 min-h-0 svelte-1cdqzhb"><div class="mt-auto"></div> <p class="mx-auto mt-auto text-slate-400 dark:text-zinc-600 text-center">\`This is the beginning of your conversation with $${escape_html(data.creator.value.person_view.person.name + "@" + new URL(data.creator.value.person_view.person.actor_id).hostname)}\`</p> `);
					if (data.message.value.private_messages.length % data.limit == 0) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							onclick: () => loadMore(++page),
							color: "ghost",
							size: "square-md",
							title: "Next",
							icon: ChevronUp,
							class: "mx-auto"
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <!--[-->`);
					const each_array = ensure_array_like(data.message.value.private_messages.toReversed());
					for (let index = 0, $$length = each_array.length; index < $$length; index++) {
						let private_message = each_array[index];
						const messages = data.message.value.private_messages.toReversed();
						const showTimestamp = index == 0 || new Date(private_message.private_message.published).getTime() - new Date(messages[index - 1].private_message.published).getTime() > 300 * 1e3;
						$$renderer.push(`<div${attr_class(clsx(private_message.creator.id == data.creator.value.person_view.person.id ? "self-start" : "self-end"))}>`);
						Message($$renderer, {
							ondelete: () => deleteMessage(private_message.private_message.id),
							onreport: () => report(private_message),
							message: private_message,
							primary: private_message.creator.id != data.creator.value.person_view.person.id,
							showTimestamp
						});
						$$renderer.push(`<!----></div>`);
					}
					$$renderer.push(`<!--]--></ul></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			await_block($$renderer, data.message.value, () => {}, (message) => {
				$$renderer.push(`<div class="sticky bottom-4 p-4"><form${attr_class(clsx([
					"flex w-full",
					"border-slate-200 dark:border-zinc-800",
					"p-2 gap-2 backdrop-blur-xl",
					"bg-white/50 dark:bg-zinc-950/50 border rounded-2xl",
					settings.messages.fullMarkdown ? "flex flex-col" : "flex-row h-14 items-center"
				]))}>`);
				if (settings.messages.fullMarkdown) {
					$$renderer.push("<!--[0-->");
					MarkdownEditor($$renderer, {
						previewButton: false,
						class: "flex-1 rounded-xl",
						get value() {
							return textbox.message;
						},
						set value($$value) {
							textbox.message = $$value;
							$$settled = false;
						}
					});
				} else {
					$$renderer.push("<!--[-1-->");
					Button($$renderer, {
						onclick: () => settings.messages.fullMarkdown = true,
						size: "custom",
						class: "h-9 w-9",
						rounding: "xl",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Plus,
								mini: true,
								size: "18"
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					TextInput($$renderer, {
						class: "rounded-xl! h-full flex-1 dark:bg-zinc-925!",
						get value() {
							return textbox.message;
						},
						set value($$value) {
							textbox.message = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!---->`);
				}
				$$renderer.push(`<!--]--> <div class="flex flex-row gap-2">`);
				if (settings.messages.fullMarkdown) {
					$$renderer.push("<!--[0-->");
					Button($$renderer, {
						onclick: () => settings.messages.fullMarkdown = false,
						size: "custom",
						class: "h-9 w-9",
						rounding: "xl",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Minus,
								mini: true,
								size: "18"
							});
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Button($$renderer, {
					title: "Send",
					size: "custom",
					rounding: "xl",
					class: "aspect-square h-9 flex-1",
					color: "primary",
					submit: true,
					loading: textbox.loading,
					disabled: textbox.loading,
					icon: PaperAirplane
				});
				$$renderer.push(`<!----></div></form></div>`);
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