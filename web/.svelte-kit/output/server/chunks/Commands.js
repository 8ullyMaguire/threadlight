import { r as createEventDispatcher } from "./internal.js";
import { o as escape_html, r as clsx } from "./validate.js";
import { a as bind_props, c as ensure_array_like, f as spread_props, g as unsubscribe_stores, o as derived, t as attr_class } from "./server.js";
import { t as goto } from "./navigation.js";
import { F as CommonList, T as EndPlaceholder, Ut as TextInput, Zt as Button, p as Markdown, st as Avatar } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as Home } from "./Home.js";
import { t as QuestionMarkCircle } from "./QuestionMarkCircle.js";
import "./theme.svelte.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowUturnDown.js
var ArrowUturnDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.75 3.5A2.75 2.75 0 0 0 7 6.25v5.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V6.25a4.25 4.25 0 0 1 8.5 0v1a.75.75 0 0 1-1.5 0v-1A2.75 2.75 0 0 0 9.75 3.5Z",
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
			"d": "M2.232 12.207a.75.75 0 0 1 1.06.025l3.958 4.146V6.375a5.375 5.375 0 0 1 10.75 0V9.25a.75.75 0 0 1-1.5 0V6.375a3.875 3.875 0 0 0-7.75 0v10.003l3.957-4.146a.75.75 0 0 1 1.085 1.036l-5.25 5.5a.75.75 0 0 1-1.085 0l-5.25-5.5a.75.75 0 0 1 .025-1.06Z",
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
			"d": "m15 15-6 6m0 0-6-6m6 6V9a6 6 0 0 1 12 0v3"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15 3.75A5.25 5.25 0 0 0 9.75 9v10.19l4.72-4.72a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 1 1 1.06-1.06l4.72 4.72V9a6.75 6.75 0 0 1 13.5 0v3a.75.75 0 0 1-1.5 0V9c0-2.9-2.35-5.25-5.25-5.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/ui/navbar/commands/CommandItem.svelte
function CommandItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { action, children, $$slots, $$events, ...rest } = $$props;
		Button($$renderer, spread_props([
			{
				href: action.href,
				alignment: "left",
				color: "none",
				size: "custom",
				class: "px-3! py-2! w-full",
				"data-sveltekit-preload-code": "viewport",
				"data-sveltekit-preload-data": "tap"
			},
			rest,
			{
				children: ($$renderer) => {
					if (typeof action.icon === "string") {
						$$renderer.push("<!--[0-->");
						Avatar($$renderer, {
							url: action.icon,
							width: 20
						});
					} else {
						$$renderer.push("<!--[-1-->");
						Icon($$renderer, {
							src: action.icon ?? QuestionMarkCircle,
							solid: true,
							size: "20",
							class: "text-slate-600 dark:text-zinc-400"
						});
					}
					$$renderer.push(`<!--]--> `);
					children?.($$renderer);
					$$renderer.push(`<!----> <div class="inline-flex flex-col">`);
					Markdown($$renderer, {
						inline: true,
						source: action.name
					});
					$$renderer.push(`<!----> `);
					if (action.detail) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="font-normal text-xs">${escape_html(action.detail)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="flex-1"></div> `);
					if (action.shortcut) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex items-center gap-0.5 text-xs font-medium">⌘ ${escape_html(action.shortcut)}</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (action.subActions) {
						$$renderer.push("<!--[0-->");
						Icon($$renderer, {
							src: ArrowUturnDown,
							size: "16",
							micro: true,
							class: ""
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region src/lib/ui/navbar/commands/Commands.svelte
function Commands($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { open = false, groups = [] } = $$props;
		let search = "";
		const dispatch = createEventDispatcher();
		let selectedIndex = 0;
		let filteredGroups = [];
		let breadcrumbs = [];
		let input = void 0;
		function updateFilteredGroups() {
			if (breadcrumbs.length === 0) filteredGroups = groups;
			else {
				const lastAction = breadcrumbs[breadcrumbs.length - 1];
				filteredGroups = [{
					name: lastAction.name,
					actions: lastAction.subActions || []
				}];
			}
			selectedIndex = 0;
			search = "";
		}
		function flattenActions(actions, subaction = true) {
			return actions.flatMap((action) => [action, ...action.subActions && subaction ? flattenActions(action.subActions) : []]);
		}
		function togglePalette() {
			open = !open;
			if (open) {
				search = "";
				selectedIndex = 0;
				filteredGroups = groups;
				breadcrumbs = [];
			}
		}
		async function handleSelect(action) {
			if (!action) return;
			if (action.subActions && action.subActions.length > 0) {
				breadcrumbs = [...breadcrumbs, action];
				updateFilteredGroups();
			} else {
				if (action.href) goto(action.href);
				if (action.handle) action.handle();
				togglePalette();
				dispatch("select", action);
			}
		}
		derived(() => filteredGroups.flatMap((group) => group.actions));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			TextInput($$renderer, {
				class: "sticky rounded-none! border-t-0 border-x-0 focus-within:border-inherit! focus-within:ring-0!",
				size: "lg",
				placeholder: "Command palette",
				get value() {
					return search;
				},
				set value($$value) {
					search = $$value;
					$$settled = false;
				},
				get element() {
					return input;
				},
				set element($$value) {
					input = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <div class="h-128 overflow-auto border-slate-200 dark:border-zinc-800 p-5">`);
			if (breadcrumbs.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 my-1"><button class="text-[13px] font-medium text-slate-600 dark:text-zinc-400">`);
				Icon($$renderer, {
					src: Home,
					size: "16",
					mini: true
				});
				$$renderer.push(`<!----></button> <!--[-->`);
				const each_array = ensure_array_like(breadcrumbs);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let crumb = each_array[$$index];
					$$renderer.push(`<span class="text-base text-slate-400 dark:text-zinc-600">/</span> <span class="text-[13px] font-medium">${escape_html(crumb.name)}</span>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="space-y-1"><!--[-->`);
			const each_array_1 = ensure_array_like(filteredGroups);
			for (let groupIndex = 0, $$length = each_array_1.length; groupIndex < $$length; groupIndex++) {
				let group = each_array_1[groupIndex];
				$$renderer.push(`<div${attr_class(clsx(["space-y-1", group.actions.length == 0 && "hidden"]))}>`);
				EndPlaceholder($$renderer, {
					margin: "md",
					size: "sm",
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(group.name)}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				CommonList($$renderer, {
					size: "xs",
					class: "p-0! sm:p-0! lg:p-0!",
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array_2 = ensure_array_like(group.actions);
						for (let actionIndex = 0, $$length = each_array_2.length; actionIndex < $$length; actionIndex++) {
							let action = each_array_2[actionIndex];
							const globalIndex = filteredGroups.slice(0, groupIndex).reduce((sum, g) => sum + g.actions.length, 0) + actionIndex;
							$$renderer.push(`<li${attr_class(clsx(["custom-size", globalIndex == selectedIndex && "selected"]))}>`);
							CommandItem($$renderer, {
								action,
								onclick: (e) => {
									if (action.href) {
										togglePalette();
										return;
									}
									e.stopPropagation();
									handleSelect(action);
								}
							});
							$$renderer.push(`<!----></li>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, {
			open,
			groups
		});
	});
}
//#endregion
export { Commands as default };

//# sourceMappingURL=Commands.js.map