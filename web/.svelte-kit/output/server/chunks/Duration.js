import { a as bind_props } from "./server.js";
import { Ht as Option, Ut as TextInput, Vt as Select } from "./client.svelte.js";
//#region src/lib/ui/form/Duration.svelte
function Duration($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, max, min = 0 } = $$props;
		let number = 0;
		let duration = value == -1 ? "permanent" : "day";
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex flex-row items-end gap-2">`);
			if (duration != "permanent") {
				$$renderer.push("<!--[0-->");
				TextInput($$renderer, {
					min,
					max,
					type: "number",
					label: "Number",
					class: "w-24",
					get value() {
						return number;
					},
					set value($$value) {
						number = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Select($$renderer, {
				baseClass: "flex-1",
				label: "Duration",
				get value() {
					return duration;
				},
				set value($$value) {
					duration = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Option($$renderer, {
						value: "minute",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Minutes`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "hour",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Hours`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "day",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Days`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "month",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Months`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "year",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Years`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						value: "permanent",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Permanent`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	});
}
//#endregion
export { Duration as t };

//# sourceMappingURL=Duration.js.map