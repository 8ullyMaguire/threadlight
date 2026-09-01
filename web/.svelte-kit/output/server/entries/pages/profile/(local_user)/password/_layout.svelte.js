import { o as escape_html, r as clsx } from "../../../../../chunks/validate.js";
import { t as attr_class } from "../../../../../chunks/server.js";
import { I as Tabs, R as Header, ar as page } from "../../../../../chunks/client.svelte.js";
//#region src/routes/profile/(local_user)/password/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const routes = [
			{
				name: "2FA",
				href: "/profile/password/2fa"
			},
			{
				name: "Change password",
				href: "/profile/password/change"
			},
			{
				name: "Logins",
				href: "/profile/password/logins"
			},
			{
				name: "Delete account",
				href: "/profile/password/delete"
			}
		];
		{
			function extended($$renderer) {
				Tabs($$renderer, {
					style: "subpage",
					margin: false,
					routes
				});
			}
			Header($$renderer, {
				pageHeader: true,
				extended,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(routes.find((r) => page.url.pathname == r.href)?.name ?? "Credentials")}`);
				},
				$$slots: {
					extended: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----> <div${attr_class(clsx([page.url.pathname == "/profile/password" && " p-8", "flex flex-col justify-center items-center h-full"]))}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map