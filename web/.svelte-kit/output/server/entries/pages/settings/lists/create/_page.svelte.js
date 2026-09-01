import { n as attr, o as escape_html } from "../../../../../chunks/validate.js";
import { l as head } from "../../../../../chunks/server.js";
import "../../../../../chunks/navigation.js";
import { Ht as Option, Ut as TextInput, Vt as Select, Zt as Button } from "../../../../../chunks/client.svelte.js";
import { t as ArrowLeft } from "../../../../../chunks/ArrowLeft.js";
//#region src/routes/settings/lists/create/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let name = "";
		let description = "";
		let listType = "follow";
		let submitting = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("ziczn7", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Create List - Settings</title>`);
				});
			});
			$$renderer.push(`<div class="max-w-lg mx-auto p-4"><div class="mb-6">`);
			Button($$renderer, {
				href: "/settings/lists",
				icon: ArrowLeft,
				size: "sm",
				variant: "ghost",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Back to Lists`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <h2 class="text-2xl font-semibold mb-6">Create New List</h2> <form class="flex flex-col gap-4">`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			TextInput($$renderer, {
				label: "Name",
				placeholder: "My List",
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
				placeholder: "A short description of this list",
				get value() {
					return description;
				},
				set value($$value) {
					description = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Select($$renderer, {
				label: "Type",
				get value() {
					return listType;
				},
				set value($$value) {
					listType = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Option($$renderer, {
						value: "follow",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Follow`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "block",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Block`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <fieldset class="flex flex-col gap-2"><legend class="text-sm font-medium mb-1">Visibility</legend> <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="visibility" value="private"${attr("checked", true, true)} class="radio"/> <span>Private</span></label> <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="visibility" value="public"${attr("checked", false, true)} class="radio"/> <span>Public</span></label></fieldset> `);
			Button($$renderer, {
				type: "submit",
				disabled: submitting,
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html("Create List")}`);
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