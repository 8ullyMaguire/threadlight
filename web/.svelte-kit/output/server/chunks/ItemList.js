import { o as escape_html } from "./validate.js";
import "./server.js";
import { F as CommonList, Zt as Button, st as Avatar } from "./client.svelte.js";
//#region src/lib/ui/generic/ItemList.svelte
function ItemList($$renderer, $$props) {
	let { items, link = true, action } = $$props;
	{
		function item($$renderer, item) {
			Button($$renderer, {
				class: "font-normal w-full h-max block gap-2",
				gap: "lg",
				color: "none",
				alignment: "left",
				href: link ? item.url : void 0,
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex-none">`);
					Avatar($$renderer, {
						url: item.avatar,
						alt: item.name,
						title: item.name,
						width: 24,
						circle: item.circle ?? false
					});
					$$renderer.push(`<!----></div> <div class="flex flex-col max-w-full break-words"><span>${escape_html(item.name)}</span> `);
					if (item.instance) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-xs text-slate-600 dark:text-zinc-400">${escape_html(item.instance)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> `);
					if (action) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex-1"></div> `);
						action($$renderer, item);
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		CommonList($$renderer, {
			animate: false,
			class: "px-1 py-0.5",
			size: "xs",
			items,
			item,
			$$slots: { item: true }
		});
	}
}
//#endregion
export { ItemList as t };

//# sourceMappingURL=ItemList.js.map