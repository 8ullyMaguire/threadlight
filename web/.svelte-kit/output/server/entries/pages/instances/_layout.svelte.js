import "../../../chunks/server.js";
import { I as Tabs, R as Header } from "../../../chunks/client.svelte.js";
//#region src/routes/instances/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	Tabs($$renderer, { routes: [{
		href: "/instances/linked",
		name: "Linked"
	}, {
		href: "/instances/blocked",
		name: "Blocked"
	}] });
	$$renderer.push(`<!----> `);
	Header($$renderer, {
		pageHeader: true,
		children: ($$renderer) => {
			$$renderer.push(`<!---->Instances`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map