import "../../../chunks/server.js";
import { R as Header, Yt as Spinner, p as Markdown, r as site } from "../../../chunks/client.svelte.js";
//#region src/routes/legal/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="flex flex-row w-full">`);
		if (site.data) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col flex-1 gap-4">`);
			Header($$renderer, {
				pageHeader: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Legal`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Markdown($$renderer, { source: site.data.site_view.local_site.legal_information ?? "This server does not have any legal information." });
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			Spinner($$renderer, {});
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map