import { t as public_env } from "../../../../chunks/shared-server.js";
import { o as escape_html } from "../../../../chunks/validate.js";
import "../../../../chunks/server.js";
import { R as Header, _ as DEFAULT_INSTANCE_URL, v as LINKED_INSTANCE_URL } from "../../../../chunks/client.svelte.js";
//#region src/routes/util/instance/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		Header($$renderer, {
			pageHeader: true,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Photon instance`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <pre>
  photon version: ${escape_html("2.4.0")}
  
  linked instance: ${escape_html(LINKED_INSTANCE_URL ?? "none")}
  default instance: ${escape_html(DEFAULT_INSTANCE_URL)}
  SSR enabled: ${escape_html(public_env.PUBLIC_SSR_ENABLED ?? "false")}
  default theme: ${escape_html(public_env.PUBLIC_THEME ?? "mr xylight's very awesome colors")}
</pre>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map