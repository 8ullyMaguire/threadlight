import "../../../../chunks/internal.js";
import "../../../../chunks/server.js";
import "../../../../chunks/navigation.js";
import { R as Header, Ut as TextInput, Zt as Button, _ as DEFAULT_INSTANCE_URL, o as profile, v as LINKED_INSTANCE_URL } from "../../../../chunks/client.svelte.js";
//#region src/routes/password_change/[token]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let instance = LINKED_INSTANCE_URL || profile.current.instance || "";
		let password = "";
		let password_verify = "";
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="my-auto max-w-xl mx-auto flex flex-col gap-2">`);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Change password`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p>Choose your new password.</p> <form class="mt-2 flex flex-col gap-4">`);
			if (!LINKED_INSTANCE_URL) {
				$$renderer.push("<!--[0-->");
				TextInput($$renderer, {
					label: "Password",
					placeholder: DEFAULT_INSTANCE_URL,
					required: true,
					get value() {
						return instance;
					},
					set value($$value) {
						instance = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<span class="font-normal text-xs">Which server is your account hosted on?</span>`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			TextInput($$renderer, {
				label: "New password",
				type: "password",
				required: true,
				get value() {
					return password;
				},
				set value($$value) {
					password = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				label: "Verify new password",
				type: "password",
				required: true,
				get value() {
					return password_verify;
				},
				set value($$value) {
					password_verify = $$value;
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