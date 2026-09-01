import "../../../../chunks/server.js";
import { Jt as TextLoader } from "../../../../chunks/client.svelte.js";
//#region src/routes/util/components/+page.svelte
function _page($$renderer) {
	TextLoader($$renderer, {
		children: ($$renderer) => {
			$$renderer.push(`<!---->Hello textloader`);
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map