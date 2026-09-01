import { n as attr, o as escape_html } from "../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, i as await_block, l as head, n as attr_style, o as derived, s as element } from "../../chunks/server.js";
import { $n as ArrowRight, A as Sort, At as settings, M as Pageination, O as PostFeed, Ot as SSR_ENABLED, R as Header, Zt as Button, ar as page, j as Location, k as ViewSelect, r as site } from "../../chunks/client.svelte.js";
import { n as Icon } from "../../chunks/Placeholder.js";
import { t as Skeleton } from "../../chunks/Skeleton.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		const FeedComponent = derived(() => (settings.infiniteScroll, PostFeed));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1uha8ag", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>
    ${escape_html(SSR_ENABLED && site.data ? site.data.site_view.site.name : "Frontpage")}
  </title>`);
				});
			});
			{
				function extended($$renderer) {
					$$renderer.push(`<form class="contents" method="get"${attr("action", page.url.pathname)}><div class="flex flex-row gap-2 max-w-full flex-wrap">`);
					Location($$renderer, {
						name: "type",
						navigate: true,
						get selected() {
							return data.filters.value.type_;
						},
						set selected($$value) {
							data.filters.value.type_ = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					Sort($$renderer, {
						placement: "bottom",
						name: "sort",
						navigate: true,
						get selected() {
							return data.filters.value.sort;
						},
						set selected($$value) {
							data.filters.value.sort = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> <div class="hidden md:block">`);
					ViewSelect($$renderer, { placement: "bottom" });
					$$renderer.push(`<!----></div> <noscript>`);
					Button($$renderer, {
						class: "self-end h-8.5 aspect-square",
						size: "custom",
						submit: true,
						children: ($$renderer) => {
							Icon($$renderer, {
								src: ArrowRight,
								size: "16",
								micro: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></noscript></div></form>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Frontpage`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			await_block($$renderer, data.feed.value, () => {
				$$renderer.push(`<div class="space-y-4"><!--[-->`);
				const each_array = ensure_array_like(new Array(5));
				for (let index = 0, $$length = each_array.length; index < $$length; index++) {
					let _ = each_array[index];
					$$renderer.push(`<!---->${escape_html(_)} <div class="animate-pop-in"${attr_style(`animation-delay: ${stringify(index * 50)}ms; opacity: 0; width: ${stringify(1 / ((index + 1) % 3) * 100)}%`)}>`);
					Skeleton($$renderer, {});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}, (feed) => {
				var bind_get = () => feed.client.lastSeen ?? 0;
				var bind_set = (v) => feed.client.lastSeen = v;
				var bind_get_1 = () => ({ itemHeights: feed.client.itemHeights ?? [] });
				var bind_set_1 = (v) => {
					if (v) feed.client.itemHeights = v.itemHeights;
				};
				if (FeedComponent()) {
					$$renderer.push("<!--[-->");
					FeedComponent()($$renderer, {
						get lastSeen() {
							return bind_get();
						},
						set lastSeen($$value) {
							bind_set($$value);
						},
						get virtualList() {
							return bind_get_1();
						},
						set virtualList($$value) {
							bind_set_1($$value);
						},
						get posts() {
							return feed.posts;
						},
						set posts($$value) {
							feed.posts = $$value;
							$$settled = false;
						},
						get params() {
							return feed.params;
						},
						set params($$value) {
							feed.params = $$value;
							$$settled = false;
						}
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` `);
				element($$renderer, settings.infiniteScroll && !settings.posts.noVirtualize ? "noscript" : "div", void 0, () => {
					Pageination($$renderer, {
						cursor: { next: feed.next_page },
						href: (page) => typeof page == "number" ? `?page=${page}` : `?cursor=${page}`,
						back: false
					});
				});
			});
			$$renderer.push(`<!--]-->`);
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