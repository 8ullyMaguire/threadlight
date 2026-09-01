import { o as escape_html } from "../../../chunks/validate.js";
import "../../../chunks/server.js";
import { I as Tabs, l as Badge, o as profile } from "../../../chunks/client.svelte.js";
//#region src/routes/admin/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		$$renderer.push(`<!--[-->`);
		{
			const notifications = profile.inbox.notifications;
			if (notifications.applications > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="flex flex-row text-red-500 gap-2">`);
				Badge($$renderer, {
					color: "red-subtle",
					class: "w-max",
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(notifications.applications > 99 ? "∞" : notifications.applications)}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> unread applications</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]-->`);
		$$renderer.push(` `);
		Tabs($$renderer, { routes: [
			{
				href: "/admin/config",
				name: "Configuration"
			},
			{
				href: "/admin/applications",
				name: "Applications"
			},
			{
				href: "/admin/taglines",
				name: "Taglines"
			},
			{
				href: "/admin/team",
				name: "Admins"
			},
			{
				href: "/admin/federation",
				name: "Federation"
			},
			{
				href: "/admin/media",
				name: "Media"
			}
		] });
		$$renderer.push(`<!----> <div class="flex flex-col gap-4 h-full">`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map