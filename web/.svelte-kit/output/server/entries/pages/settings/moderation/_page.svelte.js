import { o as escape_html } from "../../../../chunks/validate.js";
import { c as ensure_array_like } from "../../../../chunks/server.js";
import { At as settings, F as CommonList, Ut as TextInput, Zt as Button, nn as Trash, un as Plus, zt as Expandable } from "../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../chunks/Placeholder.js";
import { t as MarkdownEditor } from "../../../../chunks/MarkdownEditor.js";
import { i as removalTemplate } from "../../../../chunks/moderation.js";
import { t as Setting } from "../../../../chunks/Setting.js";
//#region src/routes/settings/moderation/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			CommonList($$renderer, {
				children: ($$renderer) => {
					{
						function title($$renderer) {
							$$renderer.push(`<span>Removal reply presets</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span><p>Presets to use for 'reply reason' in the submission removal dialog.</p> <ul class="leading-6"><li>Syntax</li> <li><code>{{reason}}</code></li> <li><code>{{post}}</code></li> <li><code>{{community}}</code></li> <li><code>{{username}}</code></li></ul></span>`);
						}
						Setting($$renderer, {
							icon: Trash,
							adaptive: false,
							title,
							description,
							$$slots: {
								title: true,
								description: true
							}
						});
					}
					$$renderer.push(`<!----> <!--[-->`);
					const each_array = ensure_array_like(settings.moderation.presets);
					for (let index = 0, $$length = each_array.length; index < $$length; index++) {
						let preset = each_array[index];
						$$renderer.push(`<li>`);
						{
							function title($$renderer) {
								$$renderer.push(`<!---->${escape_html(preset.title)}`);
							}
							Expandable($$renderer, {
								title,
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex flex-col gap-3">`);
									TextInput($$renderer, {
										label: "Title",
										placeholder: "Reason 1",
										get value() {
											return preset.title;
										},
										set value($$value) {
											preset.title = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> `);
									MarkdownEditor($$renderer, {
										label: "Content",
										images: false,
										previewButton: true,
										beforePreview: (input) => removalTemplate(input ?? "", {
											postTitle: "<Example post>",
											communityLink: "[!community@example.com]()",
											reason: "<Being a meanie>",
											username: "@Bob"
										}),
										get value() {
											return preset.content;
										},
										set value($$value) {
											preset.content = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										color: "danger",
										rounding: "pill",
										onclick: () => {
											settings.moderation.presets.splice(index, 1);
											settings.moderation.presets = settings.moderation.presets;
										},
										class: "w-max",
										children: ($$renderer) => {
											Icon($$renderer, {
												src: Trash,
												size: "16",
												mini: true
											});
											$$renderer.push(`<!----> Remove`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div>`);
								},
								$$slots: {
									title: true,
									default: true
								}
							});
						}
						$$renderer.push(`<!----></li>`);
					}
					$$renderer.push(`<!--]--> <li>`);
					Button($$renderer, {
						color: "none",
						class: "w-full p-2",
						onclick: () => {
							settings.moderation.presets = [...settings.moderation.presets, {
								title: `Preset ${settings.moderation.presets.length + 1}`,
								content: "Your submission in *{{post}}* was removed for *{{reason}}*."
							}];
						},
						icon: Plus,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Add Preset`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></li>`);
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
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map