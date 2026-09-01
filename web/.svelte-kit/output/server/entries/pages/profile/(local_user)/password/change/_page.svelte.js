import "../../../../../../chunks/server.js";
import { Ut as TextInput, Zt as Button } from "../../../../../../chunks/client.svelte.js";
//#region src/routes/profile/(local_user)/password/change/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let oldPassword = "";
		let newPassword = "";
		let newPasswordVerify = "";
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="flex flex-col gap-4 w-full max-w-xl">`);
			TextInput($$renderer, {
				label: "Current password",
				type: "password",
				minlength: 10,
				required: true,
				get value() {
					return oldPassword;
				},
				set value($$value) {
					oldPassword = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				label: "New password",
				type: "password",
				minlength: 10,
				required: true,
				get value() {
					return newPassword;
				},
				set value($$value) {
					newPassword = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				label: "Verify new password",
				type: "password",
				minlength: 10,
				required: true,
				get value() {
					return newPasswordVerify;
				},
				set value($$value) {
					newPasswordVerify = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				size: "lg",
				color: "primary",
				submit: true,
				loading,
				disabled: loading,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Submit`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form>`);
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