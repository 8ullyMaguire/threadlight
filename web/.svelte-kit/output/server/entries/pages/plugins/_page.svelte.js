import { l as head } from "../../../chunks/server.js";
import { Zt as Button } from "../../../chunks/client.svelte.js";
//#region src/routes/plugins/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1nj0iur", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Plugin Marketplace</title>`);
			});
		});
		$$renderer.push(`<div class="max-w-4xl mx-auto p-4"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-semibold">Plugin Marketplace</h2> `);
		Button($$renderer, {
			href: "/plugins/upload",
			size: "md",
			children: ($$renderer) => {
				$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-1"><path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H5.25a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd"></path></svg> Upload Plugin`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-muted-foreground">Loading plugins...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map