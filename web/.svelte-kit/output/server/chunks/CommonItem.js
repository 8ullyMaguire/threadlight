import { n as attr, o as escape_html, r as clsx } from "./validate.js";
import { t as attr_class } from "./server.js";
import { st as Avatar } from "./client.svelte.js";
//#region src/lib/ui/layout/CommonItem.svelte
function CommonItem($$renderer, $$props) {
	let { href, icon, title, detail, children, orientation = "horizontal" } = $$props;
	$$renderer.push(`<div${attr_class(clsx(["flex gap-2 p-5", orientation == "horizontal" ? "flex-row items-center" : "flex-col items-start"]))}>`);
	Avatar($$renderer, {
		url: icon,
		alt: title,
		width: detail ? 32 : 24,
		circle: false
	});
	$$renderer.push(`<!----> <a class="flex-1 flex flex-col group"${attr("href", href)}><h3 class="font-medium text-base overflow-hidden text-ellipsis leading-5">${escape_html(title)}</h3> `);
	if (detail) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-slate-600 dark:text-zinc-400">${escape_html(detail)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></a> <div class="flex flex-row gap-2 items-center">`);
	children?.($$renderer);
	$$renderer.push(`<!----></div></div>`);
}
//#endregion
export { CommonItem as t };

//# sourceMappingURL=CommonItem.js.map