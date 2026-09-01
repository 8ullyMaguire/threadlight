import "../../../chunks/server.js";
import { I as Tabs } from "../../../chunks/client.svelte.js";
//#region src/routes/inbox/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	Tabs($$renderer, {
		routes: [
			{
				href: "/inbox",
				name: "All"
			},
			{
				href: "/inbox?type=replies",
				name: "Replies"
			},
			{
				href: "/inbox?type=mentions",
				name: "Mentions"
			},
			{
				href: "/inbox/messages",
				name: "Messages"
			}
		],
		class: "overflow-auto"
	});
	$$renderer.push(`<!----> `);
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map