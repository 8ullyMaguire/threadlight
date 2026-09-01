import { n as attr, o as escape_html } from "./validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, u as props_id } from "./server.js";
import { L as TabButton } from "./client.svelte.js";
//#region src/lib/ui/form/Switch.svelte
function Switch($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const id = props_id($$renderer);
		let { options, disabled = [], optionNames = [], selected = void 0, children, onselect } = $$props;
		let selectedIndex = 0;
		$$renderer.push(`<fieldset class="flex items-center gap-1 w-max max-w-full z-0 p-0.5 relative overflow-auto border border-slate-200 dark:border-zinc-800 rounded-full"><!--[-->`);
		const each_array = ensure_array_like(options);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let option = each_array[index];
			$$renderer.push(`<label><input type="radio"${attr("checked", selectedIndex === index, true)}${attr("value", index)}${attr("name", id)}${attr("id", `${id}-${stringify(option?.toString())}`)} class="hidden"/> `);
			TabButton($$renderer, {
				selected: selectedIndex == index,
				disabled: disabled[index],
				element: "div",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(optionNames[index] || option)}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></label>`);
		}
		$$renderer.push(`<!--]--></fieldset> `);
		children?.($$renderer, { selected });
		$$renderer.push(`<!---->`);
		bind_props($$props, { selected });
	});
}
//#endregion
export { Switch as t };

//# sourceMappingURL=Switch.js.map