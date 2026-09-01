import "../../../chunks/server.js";
import { I as Tabs } from "../../../chunks/client.svelte.js";
//#region src/routes/util/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="flex flex-col gap-2">`);
	Tabs($$renderer, { routes: [
		{
			href: "/util",
			name: "Home"
		},
		{
			href: "/util/instance",
			name: "Photon instance"
		},
		{
			href: "/util/photonify",
			name: "Photonify Links"
		},
		{
			href: "/util/placeholder",
			name: "Placeholders"
		},
		{
			href: "/util/constants",
			name: "Constants"
		},
		{
			href: "/functions",
			name: "Functions"
		}
	] });
	$$renderer.push(`<!----> `);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map