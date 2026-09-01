import { o as escape_html } from "./validate.js";
import { a as bind_props, c as ensure_array_like } from "./server.js";
import "./navigation.js";
import { Bt as Switch, Gt as Label, Ht as Option, Nt as MenuButton, Pt as Menu, R as Header, Tn as GlobeAlt, Ut as TextInput, Vt as Select, Zt as Button, l as Badge, qt as Material, r as site, un as Plus, vn as MapPin } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as MarkdownEditor } from "./MarkdownEditor.js";
import "./user.js";
import { t as ImageInputUpload } from "./ImageInputUpload.js";
//#region src/lib/feature/community/CommunityForm.svelte
function CommunityForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* The community ID to edit.
		*/
		let { edit = void 0, formData: passedFormData = {
			name: "",
			displayName: "",
			sidebar: "",
			nsfw: false,
			postsLockedToModerators: false,
			submitting: false,
			visibility: "Public",
			languages: void 0
		}, formtitle } = $$props;
		let formData = passedFormData;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="flex flex-col gap-4 h-full w-full">`);
			if (formtitle) {
				$$renderer.push("<!--[0-->");
				formtitle($$renderer);
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Header($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->Community`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--> `);
			TextInput($$renderer, {
				required: true,
				label: "Name",
				oninput: () => {
					formData.name = formData.name.toLowerCase().replaceAll(" ", "_");
				},
				disabled: edit != void 0,
				get value() {
					return formData.name;
				},
				set value($$value) {
					formData.name = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				required: true,
				label: "Display name",
				get value() {
					return formData.displayName;
				},
				set value($$value) {
					formData.displayName = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <div class="flex flex-row gap-4 flex-wrap *:flex-1">`);
			ImageInputUpload($$renderer, {
				label: "Icon",
				get imageUrl() {
					return formData.icon;
				},
				set imageUrl($$value) {
					formData.icon = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			ImageInputUpload($$renderer, {
				label: "Banner",
				get imageUrl() {
					return formData.banner;
				},
				set imageUrl($$value) {
					formData.banner = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> `);
			MarkdownEditor($$renderer, {
				previewButton: true,
				label: "Sidebar",
				get value() {
					return formData.sidebar;
				},
				set value($$value) {
					formData.sidebar = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Switch($$renderer, {
				get checked() {
					return formData.nsfw;
				},
				set checked($$value) {
					formData.nsfw = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<!---->NSFW`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Switch($$renderer, {
				get checked() {
					return formData.postsLockedToModerators;
				},
				set checked($$value) {
					formData.postsLockedToModerators = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<!---->Only moderators can post`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Select($$renderer, {
				label: "Visibility",
				class: "w-max",
				get value() {
					return formData.visibility;
				},
				set value($$value) {
					formData.visibility = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Option($$renderer, {
						icon: GlobeAlt,
						value: "Public",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Public`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Option($$renderer, {
						icon: MapPin,
						value: "LocalOnly",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Local Only`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="space-y-1">`);
			Label($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Languages`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Material($$renderer, {
				rounding: "xl",
				color: "uniform",
				class: "dark:bg-zinc-950",
				children: ($$renderer) => {
					if (site.data) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex gap-2 flex-wrap flex-row">`);
						{
							function target($$renderer, attachment) {
								$$renderer.push(`<button type="button">`);
								Badge($$renderer, {
									color: "blue-subtle",
									children: ($$renderer) => {
										Icon($$renderer, {
											src: Plus,
											micro: true,
											size: "14"
										});
										$$renderer.push(`<!----> Add`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></button>`);
							}
							Menu($$renderer, {
								class: "gap-px",
								target,
								children: ($$renderer) => {
									$$renderer.push(`<!--[-->`);
									const each_array = ensure_array_like(site.data.all_languages.filter((l) => !formData.languages?.includes(l.id)));
									for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
										let language = each_array[$$index];
										MenuButton($$renderer, {
											class: "min-h-[16px] py-0",
											onclick: () => {
												formData.languages = [...formData.languages ?? [], language.id];
											},
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(language.name)}`);
											},
											$$slots: { default: true }
										});
									}
									$$renderer.push(`<!--]-->`);
								},
								$$slots: {
									target: true,
									default: true
								}
							});
						}
						$$renderer.push(`<!----> <!--[-->`);
						const each_array_1 = ensure_array_like(formData.languages ?? []);
						for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
							let languageId = each_array_1[index];
							const language = site.data.all_languages.find((l) => l.id == languageId);
							$$renderer.push(`<button type="button" class="hover:brightness-150 transition-all">`);
							Badge($$renderer, {
								class: "cursor-pointer",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(language?.name)}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></button>`);
						}
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			Button($$renderer, {
				submit: true,
				color: "primary",
				size: "lg",
				class: "mt-auto",
				loading: formData.submitting,
				disabled: formData.submitting,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(edit ? "Save" : "Submit")}`);
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
		bind_props($$props, { formData: passedFormData });
	});
}
//#endregion
export { CommunityForm as t };

//# sourceMappingURL=CommunityForm.js.map