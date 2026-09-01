import { c as run } from "./internal.js";
import { a as bind_props } from "./server.js";
import { Rt as Modal, Xt as ButtonGroup, Y as PostItem, Zt as Button, un as Plus } from "./client.svelte.js";
import { t as MarkdownEditor } from "./MarkdownEditor.js";
import { t as CommentItem } from "./CommentItem.js";
import { t as PrivateMessage } from "./PrivateMessage.js";
//#region src/lib/feature/moderation/ReportModal.svelte
function ReportModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = void 0, item = void 0 } = $$props;
		const isComment = (item) => "comment" in item;
		const isPost = (item) => !isComment(item) && "post" in item;
		let loading = false;
		let reason = "";
		const resetText = () => reason = "";
		run(() => {
			if (item) resetText();
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: "Report",
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<form class="flex flex-col gap-4">`);
					if (item) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="pointer-events-none list-none">`);
						if (isComment(item)) {
							$$renderer.push("<!--[0-->");
							CommentItem($$renderer, {
								actions: false,
								comment: item
							});
						} else if (isPost(item)) {
							$$renderer.push("<!--[1-->");
							PostItem($$renderer, { post: item });
						} else {
							$$renderer.push("<!--[-1-->");
							PrivateMessage($$renderer, { message: item });
						}
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					MarkdownEditor($$renderer, {
						required: true,
						rows: 4,
						label: "Reason",
						get value() {
							return reason;
						},
						set value($$value) {
							reason = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ButtonGroup($$renderer, {
						orientation: "horizontal",
						class: "flex flex-wrap",
						children: ($$renderer) => {
							Button($$renderer, {
								onclick: () => reason = "Spam/abuse",
								disabled: reason == "Spam/abuse",
								icon: Plus,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Spam/abuse`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								onclick: () => reason = "This submission breaks the rules because __",
								disabled: reason.startsWith("This submission breaks the rules because __".slice(0, -3)),
								icon: Plus,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Breaks community rules`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						submit: true,
						loading,
						disabled: loading,
						color: "primary",
						size: "lg",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Submit`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form>`);
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
export { ReportModal as default };

//# sourceMappingURL=ReportModal.js.map