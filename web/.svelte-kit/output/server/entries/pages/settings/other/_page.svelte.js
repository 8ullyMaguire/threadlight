import "../../../../chunks/server.js";
import { At as settings, F as CommonList, Kn as BugAnt, Yn as Bars3 } from "../../../../chunks/client.svelte.js";
import { t as ToggleSetting } from "../../../../chunks/ToggleSetting.js";
//#region src/routes/settings/other/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			CommonList($$renderer, {
				children: ($$renderer) => {
					ToggleSetting($$renderer, {
						icon: BugAnt,
						title: "Debug info",
						description: "Displays debug information.",
						get checked() {
							return settings.debugInfo;
						},
						set checked($$value) {
							settings.debugInfo = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: Bars3,
						title: "Don't virtualize feeds",
						description: "Virtualization only renders visible posts, increasing performance drastically. Disable virtualization if you are having stutter problems. This will disable infinite scroll.",
						get checked() {
							return settings.posts.noVirtualize;
						},
						set checked($$value) {
							settings.posts.noVirtualize = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map