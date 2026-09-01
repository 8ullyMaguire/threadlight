import "./internal.js";
import { o as escape_html, r as clsx } from "./validate.js";
import { a as bind_props, r as attributes } from "./server.js";
//#region src/lib/ui/form/FreeTextInput.svelte
function FreeTextInput($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { label = void 0, value = void 0, required = false, class: clazz = "", $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<label class="w-full">`);
		if (label) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm font-medium">${escape_html(label)} `);
			if (required) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-red-600 font-bold">*</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <textarea${attributes({
			required,
			...rest,
			rows: 1,
			class: clsx(["focus:outline-hidden w-full bg-transparent resize-none", clazz])
		})}>`);
		const $$body = escape_html(value);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></label>`);
		bind_props($$props, { value });
	});
}
//#endregion
export { FreeTextInput as t };

//# sourceMappingURL=FreeTextInput.js.map