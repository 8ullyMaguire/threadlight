import "../../../chunks/internal.js";
import "../../../chunks/shared-server.js";
import "../../../chunks/validate.js";
import { l as head } from "../../../chunks/server.js";
import "../../../chunks/navigation.js";
import { R as Header, Ut as TextInput, Zt as Button, _ as DEFAULT_INSTANCE_URL, c as Note } from "../../../chunks/client.svelte.js";
import { n as Icon } from "../../../chunks/Placeholder.js";
import { t as ArrowLeft } from "../../../chunks/ArrowLeft.js";
//#region src/routes/signup/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedInstance = "";
		let validating = false;
		let placeholder = DEFAULT_INSTANCE_URL;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("kmqcod", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Sign Up</title>`);
				});
			});
			$$renderer.push(`<div class="mx-auto max-w-xl flex flex-col gap-4 my-auto h-max w-full">`);
			Button($$renderer, {
				href: "/accounts",
				class: "mb-4 w-max",
				rounding: "pill",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: ArrowLeft,
						size: "16",
						micro: true
					});
					$$renderer.push(`<!----> Back`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign Up`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p>Choose the server your account's information will be hosted on.</p> `);
			Note($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->You can access all content across the Fediverse regardless of your account's server, it is generally okay to pick any of the following.`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <form class="flex flex-col gap-4">`);
			TextInput($$renderer, {
				label: "Choose a server",
				required: true,
				placeholder,
				oninput: () => {
					selectedInstance = selectedInstance.toLowerCase().replaceAll(" ", "");
				},
				get value() {
					return selectedInstance;
				},
				set value($$value) {
					selectedInstance = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				submit: true,
				color: "primary",
				size: "lg",
				loading: validating,
				disabled: validating,
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