import { l as head } from "../../../chunks/server.js";
import { Ct as searchParam, F as CommonList, Hn as ChatBubbleOvalLeft, Ht as Option, Jn as Bookmark, M as Pageination, R as Header, Vt as Select, Y as PostItem, Yn as Bars3, ar as page } from "../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../chunks/Placeholder.js";
import { t as AdjustmentsHorizontal } from "../../../chunks/AdjustmentsHorizontal.js";
import { t as PencilSquare } from "../../../chunks/PencilSquare.js";
import { t as CommentItem } from "../../../chunks/CommentItem.js";
import { t as Fixate } from "../../../chunks/Fixate.js";
//#region src/routes/saved/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let type = data.type;
		const isComment = (item) => "comment" in item;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("9wavdg", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Saved</title>`);
				});
			});
			{
				function extended($$renderer) {
					$$renderer.push(`<div class="flex items-center">`);
					{
						function customLabel($$renderer) {
							$$renderer.push(`<div class="flex items-center gap-0.5">`);
							Icon($$renderer, {
								src: AdjustmentsHorizontal,
								size: "15",
								mini: true
							});
							$$renderer.push(`<!----> Filter</div>`);
						}
						Select($$renderer, {
							onchange: () => searchParam(page.url, "type", type, "page"),
							get value() {
								return type;
							},
							set value($$value) {
								type = $$value;
								$$settled = false;
							},
							customLabel,
							children: ($$renderer) => {
								Option($$renderer, {
									icon: Bars3,
									value: "all",
									children: ($$renderer) => {
										$$renderer.push(`<!---->All`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Option($$renderer, {
									icon: PencilSquare,
									value: "posts",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Posts`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Option($$renderer, {
									icon: ChatBubbleOvalLeft,
									value: "comments",
									children: ($$renderer) => {
										$$renderer.push(`<!---->Comments`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: {
								customLabel: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----></div>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Saved`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			if (!data.data || (data.data?.length ?? 0) == 0) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					icon: Bookmark,
					title: "No saved items",
					description: "Save posts or comments, and they'll be here to refer to them later.",
					class: "my-auto"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				{
					function item($$renderer, item) {
						if (isComment(item)) {
							$$renderer.push("<!--[0-->");
							CommentItem($$renderer, { comment: item });
						} else {
							$$renderer.push("<!--[-1-->");
							PostItem($$renderer, { post: item });
						}
						$$renderer.push(`<!--]-->`);
					}
					CommonList($$renderer, {
						items: data.data,
						size: "lg",
						item,
						$$slots: { item: true }
					});
				}
			}
			$$renderer.push(`<!--]--> `);
			Fixate($$renderer, {
				placement: "bottom",
				children: ($$renderer) => {
					Pageination($$renderer, {
						hasMore: data.data.length == 40,
						href: (page) => `?page=${page}`,
						page: data.page
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
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map