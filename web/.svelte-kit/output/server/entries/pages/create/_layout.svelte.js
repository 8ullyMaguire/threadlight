import "../../../chunks/server.js";
import { I as Tabs, R as Header, o as profile, r as site } from "../../../chunks/client.svelte.js";
//#region src/routes/create/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		if (!site || !(site.data?.site_view.local_site.community_creation_admin_only && !profile.isAdmin)) {
			$$renderer.push("<!--[0-->");
			Tabs($$renderer, {
				margin: false,
				routes: [{
					href: "/create/post",
					name: "Post"
				}, {
					href: "/create/community",
					name: "Community"
				}]
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Header($$renderer, {
			pageHeader: true,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Create`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map