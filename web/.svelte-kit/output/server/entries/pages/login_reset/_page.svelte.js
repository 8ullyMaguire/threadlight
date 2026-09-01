import "../../../chunks/internal.js";
import "../../../chunks/server.js";
import { R as Header, Ut as TextInput, Zt as Button, _ as DEFAULT_INSTANCE_URL, o as profile, v as LINKED_INSTANCE_URL } from "../../../chunks/client.svelte.js";
//#region src/routes/login_reset/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let instance = LINKED_INSTANCE_URL || profile.current.instance || "";
		let email = "";
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="my-auto max-w-xl mx-auto flex flex-col gap-2">`);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Reset Password`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p>Enter your account's email, and a password reset link will be sent. If your account does not have an email, contact your server admins.</p> <form class="mt-2 flex flex-col gap-4">`);
			if (!LINKED_INSTANCE_URL) {
				$$renderer.push("<!--[0-->");
				TextInput($$renderer, {
					label: "Server domain",
					placeholder: DEFAULT_INSTANCE_URL,
					required: true,
					get value() {
						return instance;
					},
					set value($$value) {
						instance = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			TextInput($$renderer, {
				label: "Email",
				type: "email",
				required: true,
				placeholder: "example@example.com",
				get value() {
					return email;
				},
				set value($$value) {
					email = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				color: "primary",
				size: "lg",
				loading,
				disabled: loading,
				submit: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Submit`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form></div>`);
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