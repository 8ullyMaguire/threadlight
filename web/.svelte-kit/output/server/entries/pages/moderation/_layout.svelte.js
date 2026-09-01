import { l as head } from "../../../chunks/server.js";
import { I as Tabs } from "../../../chunks/client.svelte.js";
//#region src/routes/moderation/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("hsazk6", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Moderation</title>`);
		});
	});
	Tabs($$renderer, { routes: [{
		href: "/moderation",
		name: "Reports"
	}, {
		href: "/moderation/communities",
		name: "Communities"
	}] });
	$$renderer.push(`<!----> `);
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map