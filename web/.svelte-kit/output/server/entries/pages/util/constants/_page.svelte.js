import { o as escape_html } from "../../../../chunks/validate.js";
import "../../../../chunks/server.js";
import { ft as DOMAIN_REGEX_FORMS } from "../../../../chunks/client.svelte.js";
//#region src/routes/util/constants/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<h1 class="font-bold text-2xl">Constants</h1> <p>Constants used throughout the app.</p> <table class="table-fixed"><thead class="svelte-7n2rnb"><tr><td class="svelte-7n2rnb">Name</td><td class="svelte-7n2rnb">Value</td></tr></thead><tbody><tr><td class="svelte-7n2rnb">DOMAIN_REGEX</td><td class="svelte-7n2rnb">${escape_html(DOMAIN_REGEX_FORMS)}</td></tr></tbody></table>`);
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map