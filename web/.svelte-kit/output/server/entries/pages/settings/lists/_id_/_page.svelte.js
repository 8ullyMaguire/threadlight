import { o as escape_html } from "../../../../../chunks/validate.js";
import { l as head, o as derived } from "../../../../../chunks/server.js";
import "../../../../../chunks/navigation.js";
import { Zt as Button, ar as page } from "../../../../../chunks/client.svelte.js";
import { t as ArrowLeft } from "../../../../../chunks/ArrowLeft.js";
//#region src/routes/settings/lists/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => Number(page.params.id));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1h47jko", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html("List")} - Settings</title>`);
				});
			});
			$$renderer.push(`<div class="max-w-2xl mx-auto p-4"><div class="mb-6">`);
			Button($$renderer, {
				href: "/settings/lists",
				icon: ArrowLeft,
				size: "sm",
				variant: "ghost",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Back to Lists`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-muted-foreground">Loading...</p>`);
			$$renderer.push(`<!--]--></div>`);
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