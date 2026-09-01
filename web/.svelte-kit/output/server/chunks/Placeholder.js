import { o as escape_html, r as clsx } from "./validate.js";
import { c as ensure_array_like, h as stringify, o as derived, r as attributes, t as attr_class } from "./server.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/Icon.svelte
function Icon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { src, size = "24", mini = false, micro = false, solid = false, variant = null, class: className, style = "", $$slots, $$events, ...rest } = $$props;
		let selectedVariant = variant || (micro ? "micro" : mini ? "mini" : solid ? "solid" : "outline");
		let icon = derived(() => src?.[selectedVariant] || src?.outline || {});
		let svgAttributes = icon() ? {
			...icon().a,
			...className && { class: className },
			...style && { style }
		} : {};
		$$renderer.push(`<svg${attributes({
			...svgAttributes,
			xmlns: "http://www.w3.org/2000/svg",
			width: size,
			height: size,
			"aria-hidden": "true",
			...rest
		}, void 0, void 0, void 0, 3)}><!--[-->`);
		const each_array = ensure_array_like(icon()?.path ?? []);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let a = each_array[$$index];
			$$renderer.push(`<path${attributes({ ...a }, void 0, void 0, void 0, 3)}></path>`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region src/lib/ui/info/Placeholder.svelte
function Placeholder($$renderer, $$props) {
	let { icon = void 0, title, description = void 0, class: clazz = "", children, iconClass } = $$props;
	$$renderer.push(`<div${attr_class(`text-slate-500 dark:text-zinc-500 contrast-more:text-slate-700 contrast-more:dark:text-zinc-300 flex flex-col w-max mx-auto items-center gap-4 ${stringify(clazz)}`)}><div class="flex flex-col gap-2 items-center max-w-sm">`);
	if (icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div${attr_class(clsx([iconClass ? iconClass : "bg-slate-100 dark:bg-zinc-900 p-3 rounded-2xl text-primary-900 dark:text-primary-100"]))}>`);
		Icon($$renderer, {
			src: icon,
			size: "28",
			solid: true
		});
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div${attr_class(clsx(["space-y-2", clazz]))}><h1 class="text-slate-900 dark:text-zinc-100 text-xl font-medium text-center">${escape_html(title)}</h1> `);
	if (description) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-center font-normal max-w-80 mx-auto text-balance">${escape_html(description)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div> `);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { Icon as n, Placeholder as t };

//# sourceMappingURL=Placeholder.js.map