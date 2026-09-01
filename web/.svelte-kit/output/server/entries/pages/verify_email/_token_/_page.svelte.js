import "../../../../chunks/server.js";
import { R as Header, qt as Material, v as LINKED_INSTANCE_URL } from "../../../../chunks/client.svelte.js";
//#region src/routes/verify_email/[token]/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<div class="flex flex-col h-max my-auto gap-2 max-w-xl mx-auto">`);
	Material($$renderer, {
		rounding: "3xl",
		padding: "xl",
		color: "success",
		class: "space-y-2",
		children: ($$renderer) => {
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Success`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p class="text-lg">Your email was verified. You can now close this window.</p>`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	if (!LINKED_INSTANCE_URL) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p>You somehow got to this menu despite not being linked here by the email.
      Nice!</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map