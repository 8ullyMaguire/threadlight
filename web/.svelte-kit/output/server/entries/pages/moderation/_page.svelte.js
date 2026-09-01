import { s as tick } from "../../../chunks/internal.js";
import { n as attr, o as escape_html, r as clsx } from "../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, i as await_block, o as derived, s as element, t as attr_class } from "../../../chunks/server.js";
import { t as goto } from "../../../chunks/navigation.js";
import { Bn as Check, Ct as searchParam, F as CommonList, Gt as Label, Ht as Option, M as Pageination, Qt as XMark, R as Header, Rt as Modal, Vt as Select, Y as PostItem, Yt as Spinner, Zt as Button, ar as page, at as RelativeDate, f as toast, it as CommunityLink, jn as Clock, l as Badge, n as getClient, nt as UserLink, o as profile, on as ShieldCheck, qt as Material, st as Avatar, t as client, tt as errorMessage } from "../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../chunks/Placeholder.js";
import { r as ProgressBar } from "../../../chunks/MarkdownEditor.js";
import { t as Funnel } from "../../../chunks/Funnel.js";
import { t as CommentItem } from "../../../chunks/CommentItem.js";
import { t as Fixate } from "../../../chunks/Fixate.js";
import { t as PrivateMessage } from "../../../chunks/PrivateMessage.js";
import "../../../chunks/_page4.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CheckBadge.js
var CheckBadge = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15 8c0 .982-.472 1.854-1.202 2.402a2.995 2.995 0 0 1-.848 2.547 2.995 2.995 0 0 1-2.548.849A2.996 2.996 0 0 1 8 15a2.996 2.996 0 0 1-2.402-1.202 2.995 2.995 0 0 1-2.547-.848 2.995 2.995 0 0 1-.849-2.548A2.996 2.996 0 0 1 1 8c0-.982.472-1.854 1.202-2.402a2.995 2.995 0 0 1 .848-2.547 2.995 2.995 0 0 1 2.548-.849A2.995 2.995 0 0 1 8 1c.982 0 1.854.472 2.402 1.202a2.995 2.995 0 0 1 2.547.848c.695.695.978 1.645.849 2.548A2.996 2.996 0 0 1 15 8Zm-3.291-2.843a.75.75 0 0 1 .135 1.052l-4.25 5.5a.75.75 0 0 1-1.151.043l-2.25-2.5a.75.75 0 1 1 1.114-1.004l1.65 1.832 3.7-4.789a.75.75 0 0 1 1.052-.134Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z",
			"clip-rule": "evenodd"
		}]
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
			"d": "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/moderation/Report.svelte
function Report($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item: items = void 0 } = $$props;
		const item = items[0];
		let resolving = false;
		async function resolve() {
			if (!profile.current?.jwt || !profile.current.user) return;
			resolving = true;
			try {
				switch (item.type) {
					case "comment":
						await Promise.all(items.map(async (i) => getClient().resolveCommentReport({
							report_id: i.id,
							resolved: !i.resolved
						}).then((res) => {
							i.resolved = res.comment_report_view.comment_report.resolved;
							i.resolver = res.comment_report_view.resolver;
							profile.inbox.notifications.reports += i.resolved ? -1 : 1;
						})));
						break;
					case "post":
						await Promise.all(items.map(async (i) => getClient().resolvePostReport({
							report_id: i.id,
							resolved: !i.resolved
						}).then((res) => {
							i.resolved = res.post_report_view.post_report.resolved;
							i.resolver = res.post_report_view.resolver;
							profile.inbox.notifications.reports += i.resolved ? -1 : 1;
						})));
						break;
					case "message":
						await Promise.all(items.map(async (i) => getClient().resolvePrivateMessageReport({
							report_id: i.id,
							resolved: !i.resolved
						}).then((res) => {
							i.resolved = res.private_message_report_view.private_message_report.resolved;
							i.resolver = res.private_message_report_view.resolver;
							profile.inbox.notifications.reports += i.resolved ? -1 : 1;
						})));
						break;
				}
				toast({
					content: item.resolved ? "Resolved that report." : "Unresolved that report.",
					type: "success"
				});
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			resolving = false;
		}
		let usersModal = false;
		let reasonsModal = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: "Report from",
				get open() {
					return usersModal;
				},
				set open($$value) {
					usersModal = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800"><!--[-->`);
					const each_array = ensure_array_like(items);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let item = each_array[$$index];
						UserLink($$renderer, {
							avatar: false,
							user: item.creator,
							class: "py-1"
						});
					}
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Modal($$renderer, {
				title: "Reason",
				get open() {
					return reasonsModal;
				},
				set open($$value) {
					reasonsModal = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800"><!--[-->`);
					const each_array_1 = ensure_array_like(items);
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let item = each_array_1[$$index_1];
						$$renderer.push(`<div class="py-2">`);
						UserLink($$renderer, {
							avatar: false,
							user: item.creator,
							class: "py-1 block"
						});
						$$renderer.push(`<!----> <blockquote class="italic text-sm pl-4 border-l-2 border-slate-300 dark:border-zinc-700">${escape_html(item.reason)}</blockquote></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div${attr_class(clsx(["flex flex-row flex-wrap gap-4"]))}>`);
			if (item.type == "comment" || item.type == "post") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-col gap-1.5"><span class="text-xs font-medium">Community</span> <a${attr("href", `?community=${stringify(item.item.community.id)}`)} class="flex items-center gap-1 font-medium hover:underline">`);
				Avatar($$renderer, {
					circle: false,
					url: item.item.community.icon,
					alt: item.item.community.name,
					width: 24
				});
				$$renderer.push(`<!----> ${escape_html(item.item.community.title)}</a></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (items.length > 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="flex-1 text-2xl font-medium hover:underline cursor-pointer text-left w-max">${escape_html(items.length)}x</button>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex flex-col gap-1.5"><span class="text-xs font-medium">Report from</span> <span class="font-bold">`);
				UserLink($$renderer, {
					avatar: true,
					user: item.creator
				});
				$$renderer.push(`<!----></span></div>`);
			}
			$$renderer.push(`<!--]--> <div class="flex-1"></div> `);
			Button($$renderer, {
				onclick: resolve,
				class: "h-max self-end",
				loading: resolving,
				disabled: resolving,
				rounding: "pill",
				size: "sm",
				color: item.resolved ? "secondary" : "primary",
				icon: CheckBadge,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(!item.resolved ? "Resolve" : "Unresolve")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Material($$renderer, {
				rounding: "xl",
				color: "uniform",
				class: "dark:bg-zinc-950",
				children: ($$renderer) => {
					if (item.type == "comment") {
						$$renderer.push("<!--[0-->");
						CommentItem($$renderer, {
							comment: item.item,
							class: "p-0!"
						});
					} else if (item.type == "post") {
						$$renderer.push("<!--[1-->");
						PostItem($$renderer, { post: item.item });
					} else if (item.type == "message") {
						$$renderer.push("<!--[2-->");
						PrivateMessage($$renderer, { message: {
							creator: item.reportee,
							private_message: item.item,
							recipient: item.creator
						} });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="flex flex-row gap-4 items-center flex-wrap"><div>`);
			Label($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Reason`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p>${escape_html(item.reason)}</p> `);
			if (items.length > 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="cursor-pointer">`);
				Badge($$renderer, {
					class: "w-max my-1",
					children: ($$renderer) => {
						$$renderer.push(`<!---->+${escape_html(items.length - 1)}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex-1"></div> `);
			if (item.resolver) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div>`);
				Label($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->Resolved by`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				UserLink($$renderer, {
					avatar: true,
					user: item.resolver
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { item: items });
	});
}
//#endregion
//#region src/routes/moderation/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		let batch = { progress: -1 };
		async function markAllAsResolved() {
			if (!data.items?.value) return;
			batch.progress = 0;
			await Promise.all(data.items?.value.map((report) => {
				report.map((r) => {
					switch (r.type) {
						case "comment": {
							const promise = client().resolveCommentReport({
								report_id: r.id,
								resolved: true
							});
							promise.then(() => batch.progress += 1 / data.items?.value.length);
							return promise;
						}
						case "post": {
							const promise = client().resolvePostReport({
								report_id: r.id,
								resolved: true
							});
							promise.then(() => batch.progress += 1 / data.items?.value.length);
							return promise;
						}
						case "message": {
							const promise = client().resolvePrivateMessageReport({
								report_id: r.id,
								resolved: true
							});
							promise.then(() => batch.progress += 1 / data.items?.value.length);
							return promise;
						}
					}
				});
			}));
			toast({
				content: "Batch action completed.",
				type: "success"
			});
			await goto(page.url, { invalidateAll: true });
			batch.progress = -1;
		}
		let actionLogItems = derived(() => (data.moderationActions ?? []).map((action) => ({
			actionName: "Unknown",
			timestamp: new Date(action.created_at).getTime(),
			reason: action.reason || "",
			moderator: action.moderator || void 0,
			community: action.community || void 0,
			moderatee: action.target_user || void 0,
			content: action.target_post?.title || action.reason || "",
			id: action.id,
			link: action.target_post_id ? `/post/${action.target_post_id}` : void 0
		})));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function extended($$renderer) {
					$$renderer.push(`<div class="flex flex-row gap-2 flex-wrap items-end">`);
					{
						function customLabel($$renderer) {
							$$renderer.push(`<span class="flex items-center gap-1">`);
							Icon($$renderer, {
								src: Funnel,
								size: "15",
								mini: true
							});
							$$renderer.push(`<!----> Filter</span>`);
						}
						Select($$renderer, {
							onchange: async () => {
								await tick();
								searchParam(page.url, "type", data.type.value, "page");
							},
							get value() {
								return data.type.value;
							},
							set value($$value) {
								data.type.value = $$value;
								$$settled = false;
							},
							customLabel,
							children: ($$renderer) => {
								Option($$renderer, {
									value: "all",
									children: ($$renderer) => {
										$$renderer.push(`<!---->All`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Option($$renderer, {
									value: "unread",
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
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						loading: batch.progress >= 0,
						disabled: batch.progress >= 0 || data.items.value?.length == 0,
						onclick: markAllAsResolved,
						size: "lg",
						class: "ml-auto",
						color: "primary",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Check,
								size: "16",
								mini: true
							});
							$$renderer.push(`<!----> Mark page resolved`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					if (data.filters.community) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<ul class="font-normal flex flex-col gap-2 mt-2"><li><span class="text-sm text-slate-600 dark:text-zinc-400">Community</span> `);
						await_block($$renderer, client().getCommunity({ id: data.filters.community }), () => {
							Spinner($$renderer, { width: 24 });
						}, (community) => {
							$$renderer.push(`<a class="inline" aria-label="Remove" href="?community=">`);
							Icon($$renderer, {
								src: XMark,
								size: "16",
								micro: true,
								class: "inline"
							});
							$$renderer.push(`<!----></a> `);
							CommunityLink($$renderer, {
								class: "w-max inline",
								community: community.community_view.community
							});
							$$renderer.push(`<!---->`);
						});
						$$renderer.push(`<!--]--></li></ul>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Moderation`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> <div class="flex flex-col gap-6">`);
			if (batch.progress > 0) {
				$$renderer.push("<!--[0-->");
				ProgressBar($$renderer, { progress: batch.progress });
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.items?.value && data.items?.value.length > 0) {
				$$renderer.push("<!--[0-->");
				CommonList($$renderer, {
					size: "lg",
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(data.items.value ?? []);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let item = each_array[$$index];
							element($$renderer, item.length == 1 ? "li" : "div", () => {
								$$renderer.push(` class="z-0 relative"`);
							}, () => {
								Material($$renderer, {
									rounding: item.length == 1 ? "none" : "2xl",
									color: item.length == 1 ? "none" : "distinct",
									padding: item.length == 1 ? "none" : "md",
									class: ["space-y-2 w-full z-10 relative"],
									children: ($$renderer) => {
										Report($$renderer, { item });
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								if (item.length > 1) {
									$$renderer.push("<!--[0-->");
									Material($$renderer, {
										padding: "none",
										rounding: "none",
										color: "uniform",
										class: "-mt-1 rounded-b-2xl w-[97%] h-6 opacity-70 left-1/2 -translate-x-1/2 -z-10 relative"
									});
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							});
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Fixate($$renderer, {
					placement: "bottom",
					children: ($$renderer) => {
						Pageination($$renderer, {
							page: data.page,
							href: (current) => `?page=${current}`,
							hasMore: data.items.value.length >= 20
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="h-full grid place-items-center">`);
				Placeholder($$renderer, {
					icon: ShieldCheck,
					title: "No new reports",
					description: "When submissions are reported, you can act on them here."
				});
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (actionLogItems().length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-col gap-3"><h2 class="text-lg font-semibold flex items-center gap-2">`);
				Icon($$renderer, {
					src: Clock,
					size: "20",
					mini: true
				});
				$$renderer.push(`<!----> Recent Moderation Actions</h2> `);
				Material($$renderer, {
					color: "uniform",
					rounding: "2xl",
					class: "overflow-hidden",
					children: ($$renderer) => {
						$$renderer.push(`<div style="width:100%; overflow-x: auto;" class="table-container svelte-1cfidl9"><table class="table overflow-x-auto table-fixed relative w-full min-w-xl svelte-1cfidl9"><colgroup><col style="width: 15%;"/><col style="width: 20%;"/><col style="width: 30%;"/><col style="width: 35%;"/></colgroup><thead class="text-left svelte-1cfidl9"><tr class="rounded-t-lg overflow-hidden svelte-1cfidl9"><th class="svelte-1cfidl9">Date</th><th class="svelte-1cfidl9">Moderator</th><th class="svelte-1cfidl9">Type</th><th class="svelte-1cfidl9">Reason / Target</th></tr></thead><tbody class="text-sm divide-y divide-slate-200 dark:divide-zinc-800 svelte-1cfidl9"><!--[-->`);
						const each_array_1 = ensure_array_like(actionLogItems());
						for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
							let action = each_array_1[$$index_1];
							$$renderer.push(`<tr><td><span class="text-xs">`);
							RelativeDate($$renderer, { date: new Date(action.timestamp) });
							$$renderer.push(`<!----></span></td><td>`);
							if (action.moderator) {
								$$renderer.push("<!--[0-->");
								UserLink($$renderer, {
									showInstance: false,
									avatar: true,
									avatarSize: 18,
									user: action.moderator
								});
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<span class="text-slate-400 dark:text-zinc-500 text-xs">Auto</span>`);
							}
							$$renderer.push(`<!--]--></td><td><span class="text-xs font-medium text-slate-600 dark:text-zinc-400">${escape_html(action.actionName === "Unknown" ? "Mod Action" : action.actionName)}</span></td><td><span class="text-xs truncate block max-w-[250px]">`);
							if (action.content) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`${escape_html(action.content)}`);
							} else if (action.reason) {
								$$renderer.push("<!--[1-->");
								$$renderer.push(`${escape_html(action.reason)}`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<span class="text-slate-400 dark:text-zinc-500">No details</span>`);
							}
							$$renderer.push(`<!--]--></span></td></tr>`);
						}
						$$renderer.push(`<!--]--></tbody></table></div>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map