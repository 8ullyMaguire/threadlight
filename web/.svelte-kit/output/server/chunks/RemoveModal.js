import { c as run } from "./internal.js";
import { o as escape_html } from "./validate.js";
import { a as bind_props, c as ensure_array_like, o as derived } from "./server.js";
import { At as settings, Bt as Switch, En as Fire, Ht as Option, K as isCommentView, Rt as Modal, Vt as Select, Z as Post, Zt as Button, nn as Trash, q as isPostView } from "./client.svelte.js";
import { t as MarkdownEditor } from "./MarkdownEditor.js";
import { t as Comment } from "./Comment.js";
import "./moderation.js";
import { t as Switch$1 } from "./Switch.js";
//#region src/lib/feature/moderation/RemoveModal.svelte
function RemoveModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = void 0, item = void 0, purge = false } = $$props;
		let reason = "";
		let commentReason = settings.moderation.defaultRemoveAction != null;
		let privateMessage = settings.moderation.defaultRemoveAction == "message";
		let loading = false;
		let preset = settings.moderation.presets[0]?.content ?? "";
		let removed = derived(() => item ? isCommentView(item) ? item.comment.removed : item.post.removed : false);
		let replyReason = "";
		const resetText = () => {
			reason = "";
		};
		run(() => {
			if (item) resetText();
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: purge ? "Purging Submission" : removed() ? "Restoring Submission" : "Removing Submission",
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					if (item) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<form class="flex flex-col gap-4 list-none">`);
						if (isCommentView(item)) {
							$$renderer.push("<!--[0-->");
							Comment($$renderer, {
								node: {
									children: [],
									comment_view: item,
									depth: 1
								},
								actions: false
							});
						} else if (isPostView(item)) {
							$$renderer.push("<!--[1-->");
							Post($$renderer, {
								actions: false,
								post: item
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						MarkdownEditor($$renderer, {
							rows: 3,
							label: "Reason",
							placeholder: "Optional",
							get value() {
								return reason;
							},
							set value($$value) {
								reason = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> `);
						if (!removed()) {
							$$renderer.push("<!--[0-->");
							Switch($$renderer, {
								get checked() {
									return commentReason;
								},
								set checked($$value) {
									commentReason = $$value;
									$$settled = false;
								},
								children: ($$renderer) => {
									$$renderer.push(`<!---->Notify author`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							if (commentReason) {
								$$renderer.push("<!--[0-->");
								Switch$1($$renderer, {
									options: [false, true],
									optionNames: ["Comment", "Message"],
									get selected() {
										return privateMessage;
									},
									set selected($$value) {
										privateMessage = $$value;
										$$settled = false;
									}
								});
								$$renderer.push(`<!----> `);
								{
									function customLabel($$renderer) {
										$$renderer.push(`<div class="flex justify-between items-end mb-1">Reply `);
										Select($$renderer, {
											placeholder: "No preset",
											get value() {
												return preset;
											},
											set value($$value) {
												preset = $$value;
												$$settled = false;
											},
											children: ($$renderer) => {
												$$renderer.push(`<!--[-->`);
												const each_array = ensure_array_like(settings.moderation.presets);
												for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
													let preset = each_array[$$index];
													Option($$renderer, {
														value: preset.content,
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(preset.title)}`);
														},
														$$slots: { default: true }
													});
												}
												$$renderer.push(`<!--]-->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div>`);
									}
									MarkdownEditor($$renderer, {
										placeholder: replyReason,
										rows: 3,
										get value() {
											return replyReason;
										},
										set value($$value) {
											replyReason = $$value;
											$$settled = false;
										},
										customLabel,
										$$slots: { customLabel: true }
									});
								}
								$$renderer.push(`<!---->`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						Button($$renderer, {
							color: purge ? "danger" : "primary",
							size: "lg",
							loading,
							disabled: loading,
							submit: true,
							icon: purge ? Fire : Trash,
							children: ($$renderer) => {
								if (purge) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`Purge`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`${escape_html(removed() ? "Restore" : "Remove")}`);
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></form>`);
					} else $$renderer.push("<!--[-1-->");
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
			item
		});
	});
}
//#endregion
export { RemoveModal as default };

//# sourceMappingURL=RemoveModal.js.map