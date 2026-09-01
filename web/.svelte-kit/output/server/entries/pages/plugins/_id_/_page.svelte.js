import { o as escape_html } from "../../../../chunks/validate.js";
import { l as head, o as derived } from "../../../../chunks/server.js";
import { ar as page } from "../../../../chunks/client.svelte.js";
//#region src/routes/plugins/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => Number(page.params.id));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1141x2j", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html("Plugin")} - Marketplace</title>`);
				});
			});
			$$renderer.push(`<div class="max-w-3xl mx-auto p-4"><div class="mb-6"><a href="/plugins" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd"></path></svg> Back to Marketplace</a></div> `);
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