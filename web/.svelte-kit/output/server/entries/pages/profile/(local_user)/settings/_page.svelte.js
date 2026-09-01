import { o as escape_html } from "../../../../../chunks/validate.js";
import { c as ensure_array_like } from "../../../../../chunks/server.js";
import { Bt as Switch, Gt as Label, Nt as MenuButton, Pt as Menu, R as Header, Ut as TextInput, Zt as Button, l as Badge, qt as Material, r as site, un as Plus } from "../../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../../chunks/Placeholder.js";
import { t as MarkdownEditor } from "../../../../../chunks/MarkdownEditor.js";
import { t as ImageInputUpload } from "../../../../../chunks/ImageInputUpload.js";
//#region src/routes/profile/(local_user)/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { inline = false, data, children } = $$props;
		let formData = {
			...data.my_user?.local_user_view?.local_user,
			...data.my_user?.local_user_view?.person,
			discussion_languages: data.my_user?.discussion_languages
		};
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="flex flex-col gap-4 h-full">`);
			if (!inline) {
				$$renderer.push("<!--[0-->");
				Header($$renderer, {
					pageHeader: true,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Edit`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			children?.($$renderer);
			$$renderer.push(`<!----> `);
			if (data.my_user?.local_user_view?.local_user && formData) {
				$$renderer.push("<!--[0-->");
				var bind_get = () => formData.bio ?? "";
				var bind_set = (v) => formData.bio = v;
				TextInput($$renderer, {
					label: "Email",
					get value() {
						return formData.email;
					},
					set value($$value) {
						formData.email = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Display",
					name: true,
					placeholder: "Optional",
					get value() {
						return formData.display_name;
					},
					set value($$value) {
						formData.display_name = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				MarkdownEditor($$renderer, {
					images: false,
					get value() {
						return bind_get();
					},
					set value($$value) {
						bind_set($$value);
					},
					label: "Bio",
					previewButton: true
				});
				$$renderer.push(`<!----> <div class="flex gap-2 items-center *:flex-1">`);
				ImageInputUpload($$renderer, {
					label: "Avatar",
					get imageUrl() {
						return formData.avatar;
					},
					set imageUrl($$value) {
						formData.avatar = $$value;
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
				TextInput($$renderer, {
					label: "Chat",
					on: true,
					Matrix: true,
					placeholder: "@user:example.com",
					get value() {
						return formData.matrix_user_id;
					},
					set value($$value) {
						formData.matrix_user_id = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.show_nsfw;
					},
					set checked($$value) {
						formData.show_nsfw = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Show NSFW content`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.bot_account;
					},
					set checked($$value) {
						formData.bot_account = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Bot account`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.show_bot_accounts;
					},
					set checked($$value) {
						formData.show_bot_accounts = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Show bots`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.show_read_posts;
					},
					set checked($$value) {
						formData.show_read_posts = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Show read posts`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <div class="space-y-1">`);
				Label($$renderer, {
					id: "languages",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Languages`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <p>If any are set, you will only see content explicitly tagged as that language. Most content, untagged, falls under 'Undetermined'.</p> `);
				Material($$renderer, {
					rounding: "xl",
					color: "uniform",
					class: "dark:bg-zinc-950",
					children: ($$renderer) => {
						if (site.data && formData.discussion_languages) {
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
										const each_array = ensure_array_like(site.data.all_languages.filter((l) => !formData.discussion_languages?.includes(l.id)));
										for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
											let language = each_array[$$index];
											MenuButton($$renderer, {
												class: "min-h-[16px] py-0",
												onclick: () => {
													formData.discussion_languages?.push(language.id);
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
							const each_array_1 = ensure_array_like(formData.discussion_languages);
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
					size: "lg",
					color: "primary",
					class: "mt-auto",
					loading,
					disabled: loading,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Save`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></form>`);
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