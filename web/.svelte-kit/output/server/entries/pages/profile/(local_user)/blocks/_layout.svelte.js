import "../../../../../chunks/server.js";
import { I as Tabs, R as Header } from "../../../../../chunks/client.svelte.js";
//#region src/routes/profile/(local_user)/blocks/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	{
		function extended($$renderer) {
			Tabs($$renderer, {
				routes: [
					{
						href: "/profile/blocks/users",
						name: "Users"
					},
					{
						href: "/profile/blocks/communities",
						name: "Communities"
					},
					{
						href: "/profile/blocks/instances",
						name: "Servers"
					}
				],
				style: "subpage",
				margin: false
			});
		}
		Header($$renderer, {
			pageHeader: true,
			extended,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Blocked`);
			},
			$$slots: {
				extended: true,
				default: true
			}
		});
	}
	$$renderer.push(`<!----> `);
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map