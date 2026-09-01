import { o as escape_html } from "./validate.js";
import { f as spread_props, o as derived } from "./server.js";
import { Zt as Button, ar as page } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
//#region src/lib/ui/sidebar/SidebarButton.svelte
function SidebarButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { href, icon, class: clazz = "", customIcon, children, label, $$slots, $$events, ...rest } = $$props;
		let selected = derived(() => page.url.pathname.startsWith(href ?? "2026-02-08 hey guyz") ?? false);
		{
			function prefix($$renderer) {
				if (customIcon) {
					$$renderer.push("<!--[0-->");
					customIcon($$renderer, { selected: selected() });
					$$renderer.push(`<!---->`);
				} else if (icon) {
					$$renderer.push("<!--[1-->");
					Icon($$renderer, {
						src: icon,
						solid: true,
						size: "18"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			Button($$renderer, spread_props([
				{
					color: "tertiary",
					alignment: "left",
					rounding: "xl"
				},
				rest,
				{
					href,
					weight: "none",
					class: [
						"hover:text-slate-900 hover:dark:text-zinc-50",
						selected() ? "text-primary-900 dark:text-primary-100 cursor-default!" : "text-slate-600 dark:text-zinc-400",
						clazz
					],
					shadow: "none",
					prefix,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(label)} `);
						children?.($$renderer);
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						prefix: true,
						default: true
					}
				}
			]));
		}
	});
}
//#endregion
export { SidebarButton as t };

//# sourceMappingURL=SidebarButton.js.map