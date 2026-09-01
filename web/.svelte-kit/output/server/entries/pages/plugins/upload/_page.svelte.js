import { o as escape_html } from "../../../../chunks/validate.js";
import { l as head } from "../../../../chunks/server.js";
import "../../../../chunks/navigation.js";
import { Ht as Option, Ut as TextInput, Vt as Select, Zt as Button } from "../../../../chunks/client.svelte.js";
import { t as ArrowLeft } from "../../../../chunks/ArrowLeft.js";
import { t as ArrowUpTray } from "../../../../chunks/ArrowUpTray.js";
//#region src/routes/plugins/upload/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let name = "";
		let description = "";
		let version = "1.0.0";
		let pluginType = "filter";
		let submitting = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("y0fi2x", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Upload Plugin - Marketplace</title>`);
				});
			});
			$$renderer.push(`<div class="max-w-lg mx-auto p-4"><div class="mb-6">`);
			Button($$renderer, {
				href: "/plugins",
				icon: ArrowLeft,
				size: "sm",
				variant: "ghost",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Back to Marketplace`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <h2 class="text-2xl font-semibold mb-6">Upload Plugin</h2> <form class="flex flex-col gap-4">`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			TextInput($$renderer, {
				label: "Name",
				placeholder: "My Awesome Plugin",
				required: true,
				get value() {
					return name;
				},
				set value($$value) {
					name = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				label: "Description",
				placeholder: "What does this plugin do?",
				get value() {
					return description;
				},
				set value($$value) {
					description = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				label: "Version",
				placeholder: "1.0.0",
				get value() {
					return version;
				},
				set value($$value) {
					version = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Select($$renderer, {
				label: "Plugin Type",
				get value() {
					return pluginType;
				},
				set value($$value) {
					pluginType = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Option($$renderer, {
						value: "filter",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Filter`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "transformer",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Transformer`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "analyzer",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Analyzer`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "renderer",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Renderer`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div><label class="text-sm font-medium block mb-1">WASM File</label> <input type="file" accept=".wasm" class="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"/> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			Button($$renderer, {
				type: "submit",
				disabled: submitting,
				icon: ArrowUpTray,
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html("Upload Plugin")}`);
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