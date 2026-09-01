import { n as attr, o as escape_html } from "../../../chunks/validate.js";
import { c as ensure_array_like, l as head } from "../../../chunks/server.js";
import { A as Sort, Ht as Option, I as Tabs, P as SearchBar, R as Header, ar as page, j as Location, o as profile, t as client, v as LINKED_INSTANCE_URL } from "../../../chunks/client.svelte.js";
import { t as ServerStack } from "../../../chunks/ServerStack.js";
//#region src/routes/explore/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		let search = page.data.query || "";
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("w72ts9", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Explore</title>`);
				});
			});
			if (client().getTopics && client().getFeeds) {
				$$renderer.push("<!--[0-->");
				Tabs($$renderer, { routes: [
					{
						href: "/explore/communities",
						name: "Communities"
					},
					{
						href: "/explore/feeds",
						name: "Feeds"
					},
					{
						href: "/explore/topics",
						name: "Topics"
					}
				] });
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function extended($$renderer) {
					if (page.route.id == "/explore/communities") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<form method="get"${attr("action", page.url.pathname)} class="contents">`);
						SearchBar($$renderer, {
							get query() {
								return search;
							},
							set query($$value) {
								search = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> <div class="flex flex-row flex-wrap gap-4 items-center">`);
						Location($$renderer, {
							name: "type",
							selected: data.type,
							onchange: () => void 0,
							children: ($$renderer) => {
								if (!LINKED_INSTANCE_URL) {
									$$renderer.push("<!--[0-->");
									const instanceSet = new Set(profile.meta.profiles.map((i) => i.instance));
									if (instanceSet.size > 1) {
										$$renderer.push("<!--[0-->");
										Option($$renderer, {
											disabled: true,
											"data-label": "true",
											children: ($$renderer) => {
												$$renderer.push(`<!---->—`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> <!--[-->`);
										const each_array = ensure_array_like(instanceSet);
										for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
											let instance = each_array[$$index];
											Option($$renderer, {
												icon: ServerStack,
												value: encodeURIComponent(`instance-${instance}`),
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(instance)}`);
												},
												$$slots: { default: true }
											});
										}
										$$renderer.push(`<!--]-->`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Sort($$renderer, {
							name: "sort",
							selected: data.sort,
							onchange: () => void 0
						});
						$$renderer.push(`<!----></div></form>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Explore`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			children?.($$renderer);
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
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map