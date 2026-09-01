import { o as escape_html } from "../../../../chunks/validate.js";
import { c as ensure_array_like, l as head } from "../../../../chunks/server.js";
import { Bt as Switch, Gt as Label, Ht as Option, Nt as MenuButton, Pt as Menu, R as Header, Ut as TextInput, Vt as Select, Zt as Button, l as Badge, qt as Material, r as site, un as Plus } from "../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../chunks/Placeholder.js";
import { t as MarkdownEditor } from "../../../../chunks/MarkdownEditor.js";
import { t as ImageInputUpload } from "../../../../chunks/ImageInputUpload.js";
//#region src/routes/admin/config/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data: pageData } = $$props;
		let data = pageData;
		const formData = data.site ? {
			...data.site.site_view.local_site,
			...data.site.site_view.site,
			discussion_languages: data.site.discussion_languages,
			credit_action_costs: data.site.site_view.local_site?.credit_action_costs ?? JSON.stringify({
				post_creation: 2,
				image_upload: 10,
				search: 0,
				private_message: 1,
				reaction: 0
			})
		} : void 0;
		let saving = false;
		function parseCreditCosts(json) {
			try {
				return JSON.parse(json);
			} catch {
				return {};
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("lg956f", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Administration</title>`);
				});
			});
			$$renderer.push(`<form class="flex flex-col gap-4">`);
			Header($$renderer, {
				pageHeader: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Configuration`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (formData) {
				$$renderer.push("<!--[0-->");
				var bind_get = () => formData.name ?? "";
				var bind_set = (v) => formData.description = v;
				var bind_get_1 = () => formData.description ?? "";
				var bind_set_1 = (v) => formData.description = v;
				var bind_get_2 = () => formData.sidebar ?? "";
				var bind_set_2 = (v) => formData.sidebar = v;
				var bind_get_3 = () => formData.legal_information ?? "";
				var bind_set_3 = (v) => formData.legal_information = v;
				TextInput($$renderer, {
					get value() {
						return bind_get();
					},
					set value($$value) {
						bind_set($$value);
					},
					label: "Name"
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					get value() {
						return bind_get_1();
					},
					set value($$value) {
						bind_set_1($$value);
					},
					label: "Description"
				});
				$$renderer.push(`<!----> `);
				MarkdownEditor($$renderer, {
					previewButton: true,
					get value() {
						return bind_get_2();
					},
					set value($$value) {
						bind_set_2($$value);
					},
					label: "Sidebar"
				});
				$$renderer.push(`<!----> `);
				MarkdownEditor($$renderer, {
					previewButton: true,
					get value() {
						return bind_get_3();
					},
					set value($$value) {
						bind_set_3($$value);
					},
					label: "Legal"
				});
				$$renderer.push(`<!----> `);
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
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.enable_downvotes;
					},
					set checked($$value) {
						formData.enable_downvotes = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Enable downvotes`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.enable_nsfw;
					},
					set checked($$value) {
						formData.enable_nsfw = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Enable NSFW`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Select($$renderer, {
					label: "Registration mode",
					class: "w-max",
					get value() {
						return formData.registration_mode;
					},
					set value($$value) {
						formData.registration_mode = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						Option($$renderer, {
							value: "Open",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Open`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "RequireApplication",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Require application`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "Closed",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Closed`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (formData.registration_mode == "RequireApplication") {
					$$renderer.push("<!--[0-->");
					MarkdownEditor($$renderer, {
						previewButton: true,
						label: "Application question",
						get value() {
							return formData.application_question;
						},
						set value($$value) {
							formData.application_question = $$value;
							$$settled = false;
						}
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Switch($$renderer, {
					get checked() {
						return formData.community_creation_admin_only;
					},
					set checked($$value) {
						formData.community_creation_admin_only = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Only admins can create communities`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.require_email_verification;
					},
					set checked($$value) {
						formData.require_email_verification = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Require email verification`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.application_email_admins;
					},
					set checked($$value) {
						formData.application_email_admins = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Email admins on receiving new applications`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.reports_email_admins;
					},
					set checked($$value) {
						formData.reports_email_admins = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Email admins on receiving new reports`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Select($$renderer, {
					label: "Listing Type",
					class: "w-max",
					get value() {
						return formData.default_post_listing_type;
					},
					set value($$value) {
						formData.default_post_listing_type = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						Option($$renderer, {
							value: "All",
							children: ($$renderer) => {
								$$renderer.push(`<!---->All`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "Local",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Local`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.private_instance;
					},
					set checked($$value) {
						formData.private_instance = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Private instance`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.hide_modlog_mod_names;
					},
					set checked($$value) {
						formData.hide_modlog_mod_names = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Hide modlog mod names`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Slur filter regex",
					placeholder: "(word1|word2)",
					get value() {
						return formData.slur_filter_regex;
					},
					set value($$value) {
						formData.slur_filter_regex = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.federation_enabled;
					},
					set checked($$value) {
						formData.federation_enabled = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Federation enabled`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.federation_debug;
					},
					set checked($$value) {
						formData.federation_debug = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Federation debug mode`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Switch($$renderer, {
					get checked() {
						return formData.captcha_enabled;
					},
					set checked($$value) {
						formData.captcha_enabled = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->CAPTCHA enabled`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <hr class="my-4 border-zinc-700"/> <h2 class="text-lg font-semibold mt-2 mb-2">Moderation &amp; Trust Privileges</h2> `);
				TextInput($$renderer, {
					label: "Unfair threshold (%)",
					type: "number",
					min: "0",
					max: "1",
					step: "0.05",
					get value() {
						return formData.unfair_threshold_pct;
					},
					set value($$value) {
						formData.unfair_threshold_pct = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Unfair penalty amount",
					type: "number",
					min: "0",
					max: "100",
					step: "1",
					get value() {
						return formData.unfair_penalty_amount;
					},
					set value($$value) {
						formData.unfair_penalty_amount = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Unfair min reviews",
					type: "number",
					min: "1",
					max: "100",
					step: "1",
					get value() {
						return formData.unfair_min_reviews;
					},
					set value($$value) {
						formData.unfair_min_reviews = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Unfair penalty cooldown (hours)",
					type: "number",
					min: "0",
					max: "720",
					step: "1",
					get value() {
						return formData.unfair_penalty_cooldown_hrs;
					},
					set value($$value) {
						formData.unfair_penalty_cooldown_hrs = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Min trust level for review voting",
					type: "number",
					min: "0",
					max: "3",
					step: "1",
					get value() {
						return formData.min_trust_level_for_review_voting;
					},
					set value($$value) {
						formData.min_trust_level_for_review_voting = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Min trust level for community create",
					type: "number",
					min: "0",
					max: "3",
					step: "1",
					get value() {
						return formData.min_trust_level_for_community_create;
					},
					set value($$value) {
						formData.min_trust_level_for_community_create = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Min trust level for curator",
					type: "number",
					min: "0",
					max: "3",
					step: "1",
					get value() {
						return formData.min_trust_level_for_curator;
					},
					set value($$value) {
						formData.min_trust_level_for_curator = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> <hr class="my-4 border-zinc-700"/> <h2 class="text-lg font-semibold mt-2 mb-2">Credit Action Costs</h2> <p class="text-sm text-zinc-500 mb-2">Define how many credits each action costs. Set to 0 to make an action free.</p> `);
				if (formData.credit_action_costs) {
					$$renderer.push("<!--[0-->");
					const parsed = parseCreditCosts(formData.credit_action_costs);
					var bind_get_4 = () => String(parsed.post_creation ?? 2);
					var bind_set_4 = (v) => {
						parsed.post_creation = Number(v);
						formData.credit_action_costs = JSON.stringify(parsed);
					};
					var bind_get_5 = () => String(parsed.image_upload ?? 10);
					var bind_set_5 = (v) => {
						parsed.image_upload = Number(v);
						formData.credit_action_costs = JSON.stringify(parsed);
					};
					var bind_get_6 = () => String(parsed.search ?? 0);
					var bind_set_6 = (v) => {
						parsed.search = Number(v);
						formData.credit_action_costs = JSON.stringify(parsed);
					};
					var bind_get_7 = () => String(parsed.private_message ?? 1);
					var bind_set_7 = (v) => {
						parsed.private_message = Number(v);
						formData.credit_action_costs = JSON.stringify(parsed);
					};
					var bind_get_8 = () => String(parsed.reaction ?? 0);
					var bind_set_8 = (v) => {
						parsed.reaction = Number(v);
						formData.credit_action_costs = JSON.stringify(parsed);
					};
					TextInput($$renderer, {
						get value() {
							return bind_get_4();
						},
						set value($$value) {
							bind_set_4($$value);
						},
						label: "Post creation cost",
						type: "number",
						min: "0",
						max: "100",
						step: "1"
					});
					$$renderer.push(`<!----> `);
					TextInput($$renderer, {
						get value() {
							return bind_get_5();
						},
						set value($$value) {
							bind_set_5($$value);
						},
						label: "Image upload cost",
						type: "number",
						min: "0",
						max: "100",
						step: "1"
					});
					$$renderer.push(`<!----> `);
					TextInput($$renderer, {
						get value() {
							return bind_get_6();
						},
						set value($$value) {
							bind_set_6($$value);
						},
						label: "Search cost",
						type: "number",
						min: "0",
						max: "100",
						step: "1"
					});
					$$renderer.push(`<!----> `);
					TextInput($$renderer, {
						get value() {
							return bind_get_7();
						},
						set value($$value) {
							bind_set_7($$value);
						},
						label: "Private message cost",
						type: "number",
						min: "0",
						max: "100",
						step: "1"
					});
					$$renderer.push(`<!----> `);
					TextInput($$renderer, {
						get value() {
							return bind_get_8();
						},
						set value($$value) {
							bind_set_8($$value);
						},
						label: "Reaction cost",
						type: "number",
						min: "0",
						max: "100",
						step: "1"
					});
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<p class="text-sm text-zinc-500 italic">No credit costs configured yet. Save the form with defaults to initialize.</p>`);
				}
				$$renderer.push(`<!--]--> <div class="space-y-1">`);
				Label($$renderer, {
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
										const each_array = ensure_array_like(site.data.all_languages.filter((l) => !formData.discussion_languages?.includes(l.id)));
										for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
											let language = each_array[$$index];
											MenuButton($$renderer, {
												class: "min-h-4 py-0",
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
							const each_array_1 = ensure_array_like(formData.discussion_languages ?? []);
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
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				color: "primary",
				size: "lg",
				loading: saving,
				disabled: saving,
				submit: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Save`);
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