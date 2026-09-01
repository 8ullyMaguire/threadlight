import { o as escape_html } from "../../../../../chunks/validate.js";
import { a as bind_props } from "../../../../../chunks/server.js";
import { F as CommonList, K as isCommentView, M as Pageination, R as Header, Y as PostItem } from "../../../../../chunks/client.svelte.js";
import { t as CommentItem } from "../../../../../chunks/CommentItem.js";
import { t as Fixate } from "../../../../../chunks/Fixate.js";
//#region src/routes/profile/voted/[type]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Header($$renderer, {
				pageHeader: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(data.upvoted ? "Upvoted" : "Downvoted")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function item($$renderer, item) {
					if (isCommentView(item)) {
						$$renderer.push("<!--[0-->");
						CommentItem($$renderer, { comment: item });
					} else if (!isCommentView(item)) {
						$$renderer.push("<!--[1-->");
						PostItem($$renderer, { post: item });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				CommonList($$renderer, {
					items: data.items,
					item,
					$$slots: { item: true }
				});
			}
			$$renderer.push(`<!----> `);
			Fixate($$renderer, {
				placement: "bottom",
				children: ($$renderer) => {
					Pageination($$renderer, {
						href: (page) => `?page=${page}`,
						get page() {
							return data.filters.value.page;
						},
						set page($$value) {
							data.filters.value.page = $$value;
							$$settled = false;
						}
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map