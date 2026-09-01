import { r as createEventDispatcher } from "./internal.js";
import { o as escape_html } from "./validate.js";
import { a as bind_props, f as spread_props, o as derived } from "./server.js";
import { Nt as MenuButton, n as getClient, s as Search, st as Avatar } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ServerStack } from "./ServerStack.js";
import { t as XCircle } from "./XCircle.js";
//#region src/lib/ui/form/ObjectAutocomplete.svelte
function ObjectAutocomplete($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { type = "community", q = "", instance = void 0, listing_type = "Subscribed", showWhenEmpty = false, required, $$slots, $$events, ...rest } = $$props;
		const dispatcher = createEventDispatcher();
		let instances = derived(() => type == "instance" && getClient().getFederatedInstances());
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (type == "community") {
				$$renderer.push("<!--[0-->");
				{
					function noresults($$renderer) {
						$$renderer.push(`<div class="w-full h-full">`);
						if (q == "" && showWhenEmpty) {
							$$renderer.push("<!--[0-->");
							MenuButton($$renderer, {
								onclick: () => dispatcher("select", void 0),
								children: ($$renderer) => {
									Icon($$renderer, {
										src: XCircle,
										size: "16",
										mini: true
									});
									$$renderer.push(`<!----> <div class="flex flex-col text-left"><span>None</span></div>`);
								},
								$$slots: { default: true }
							});
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<span class="mx-auto my-auto">No results.</span>`);
						}
						$$renderer.push(`<!--]--></div>`);
					}
					function children($$renderer, { item, select }) {
						$$renderer.push(`<div>`);
						MenuButton($$renderer, {
							onclick: () => select(item),
							children: ($$renderer) => {
								Avatar($$renderer, {
									url: item.community.icon,
									alt: item.community.title,
									width: 24
								});
								$$renderer.push(`<!----> <div class="flex flex-col text-left"><span>${escape_html(item.community.title)}</span> <span class="text-xs opacity-80">${escape_html(new URL(item.community.actor_id).hostname)}</span></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					}
					Search($$renderer, spread_props([
						{
							search: async (q) => {
								return (await getClient(instance).search({
									q: q || " ",
									type_: "Communities",
									limit: 20,
									listing_type,
									sort: "TopAll"
								})).communities;
							},
							extractName: (c) => `${c.community.name}@${new URL(c.community.actor_id).hostname}`,
							required
						},
						rest,
						{
							get query() {
								return q;
							},
							set query($$value) {
								q = $$value;
								$$settled = false;
							},
							noresults,
							children,
							$$slots: {
								noresults: true,
								default: true
							}
						}
					]));
				}
			} else if (type == "instance") {
				$$renderer.push("<!--[1-->");
				{
					function noresults($$renderer) {
						$$renderer.push(`<div class="w-full h-full">`);
						if (q == "" && showWhenEmpty) {
							$$renderer.push("<!--[0-->");
							MenuButton($$renderer, {
								onclick: () => dispatcher("select", void 0),
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex flex-col text-left"><span>None (Start typing to search)</span></div>`);
								},
								$$slots: { default: true }
							});
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<span class="mx-auto my-auto">No results.</span>`);
						}
						$$renderer.push(`<!--]--></div>`);
					}
					function children($$renderer, { item, select }) {
						$$renderer.push(`<div>`);
						MenuButton($$renderer, {
							onclick: () => select(item),
							children: ($$renderer) => {
								Icon($$renderer, {
									src: ServerStack,
									size: "16",
									mini: true
								});
								$$renderer.push(`<!----> <div class="flex flex-col text-left"><span>${escape_html(item.domain)}</span></div>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					}
					Search($$renderer, spread_props([
						{
							search: async (q) => {
								const results = await instances() || {};
								return q ? (results.federated_instances?.linked || []).filter((i) => i.software === "lemmy" && i.domain.includes(q)) : [];
							},
							extractName: (i) => `${i.domain}`
						},
						rest,
						{
							get query() {
								return q;
							},
							set query($$value) {
								q = $$value;
								$$settled = false;
							},
							noresults,
							children,
							$$slots: {
								noresults: true,
								default: true
							}
						}
					]));
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { q });
	});
}
//#endregion
export { ObjectAutocomplete as t };

//# sourceMappingURL=ObjectAutocomplete.js.map