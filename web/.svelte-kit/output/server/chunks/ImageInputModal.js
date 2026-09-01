import { a as bind_props, o as derived } from "./server.js";
import { Rt as Modal, Ut as TextInput, Zt as Button } from "./client.svelte.js";
import { n as ImageAttachForm } from "./MarkdownEditor.js";
import { t as Switch } from "./Switch.js";
//#region src/lib/ui/form/ImageInputModal.svelte
function ImageInputModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = void 0, imageUrl: passedImageUrl = void 0 } = $$props;
		let imageUrl = derived(() => passedImageUrl);
		let customUrl = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: "Upload image",
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex justify-between gap-1 flex-wrap">`);
					Switch($$renderer, {
						options: [false, true],
						optionNames: ["Attach file", "URL"],
						get selected() {
							return customUrl;
						},
						set selected($$value) {
							customUrl = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => {
							passedImageUrl = void 0;
							open = false;
						},
						size: "xs",
						rounding: "xl",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Remove`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					if (customUrl) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<form class="contents">`);
						TextInput($$renderer, {
							label: "URL",
							pattern: "http(s)?:\\/\\/(.*).(png|jpg|gif|avif|webp|jpeg|jxl|svg|bmp)",
							get value() {
								return imageUrl();
							},
							set value($$value) {
								imageUrl($$value);
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							submit: true,
							color: "primary",
							size: "lg",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Submit`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></form>`);
					} else {
						$$renderer.push("<!--[-1-->");
						ImageAttachForm($$renderer, {
							multiple: false,
							onupload: (uploaded) => {
								open = false;
								passedImageUrl = uploaded[0];
							}
						});
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			imageUrl: passedImageUrl
		});
	});
}
//#endregion
export { ImageInputModal as t };

//# sourceMappingURL=ImageInputModal.js.map