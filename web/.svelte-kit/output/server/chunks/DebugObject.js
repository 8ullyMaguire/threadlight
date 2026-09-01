import { n as attr, o as escape_html } from "./validate.js";
import { a as bind_props, c as ensure_array_like, t as attr_class } from "./server.js";
import { Rt as Modal } from "./client.svelte.js";
//#region src/lib/ui/util/debug/DebugTree.svelte
function DebugTree_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { object, isParent = false } = $$props;
		$$renderer.push(`<ul${attr_class("leading-8", void 0, { "ml-4": !isParent })}><!--[-->`);
		const each_array = ensure_array_like(Object.keys(object));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let key = each_array[$$index];
			$$renderer.push(`<details${attr("open", false, true)}><summary class="cursor-pointer"><code>${escape_html(key)}</code></summary> `);
			if (typeof object[key] === "object") {
				$$renderer.push("<!--[0-->");
				DebugTree_1($$renderer, {
					object: object[key],
					isParent: false
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<pre class="break-words">${escape_html(object[key])}</pre>`);
			}
			$$renderer.push(`<!--]--></details>`);
		}
		$$renderer.push(`<!--]--></ul>`);
	});
}
//#endregion
//#region src/lib/ui/util/debug/DebugObject.svelte
function DebugObject($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { object, open = false, title } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function customTitle($$renderer) {
					$$renderer.push(`<span>`);
					if (title) {
						$$renderer.push("<!--[0-->");
						title($$renderer);
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`Debug`);
					}
					$$renderer.push(`<!--]--></span>`);
				}
				Modal($$renderer, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					customTitle,
					children: ($$renderer) => {
						DebugTree_1($$renderer, {
							object,
							isParent: true
						});
					},
					$$slots: {
						customTitle: true,
						default: true
					}
				});
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
export { DebugObject as t };

//# sourceMappingURL=DebugObject.js.map