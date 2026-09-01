import { l as head } from "../../../../chunks/server.js";
import { F as CommonList, Zt as Button, un as Plus } from "../../../../chunks/client.svelte.js";
//#region src/routes/settings/lists/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("10wkj1s", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>User Lists - Settings</title>`);
			});
		});
		CommonList($$renderer, {
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center justify-between mb-4"><h2 class="text-xl font-semibold">User Lists</h2> `);
				Button($$renderer, {
					href: "/settings/lists/create",
					icon: Plus,
					size: "md",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Create List`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground">Loading...</p>`);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map