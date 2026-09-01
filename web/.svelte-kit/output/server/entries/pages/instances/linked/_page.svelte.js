import { o as escape_html } from "../../../../chunks/validate.js";
import "../../../../chunks/server.js";
import { Bn as Check, E as VirtualList, Ut as TextInput, at as RelativeDate, tr as publishedToDate } from "../../../../chunks/client.svelte.js";
import { t as Placeholder } from "../../../../chunks/Placeholder.js";
//#region src/routes/instances/linked/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data: passedData } = $$props;
		let data = passedData;
		let filter = "";
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (data) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-col gap-4"><form>`);
				TextInput($$renderer, {
					label: "Filter",
					get value() {
						return filter;
					},
					set value($$value) {
						filter = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></form> `);
				if (data.linked && data.linked.length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					{
						function item($$renderer, index) {
							if (data.linked[index]) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="flex justify-between items-center first:pt-0 last:pb-0 my-3 px-6"><div class="flex flex-col"><span class="font-medium">${escape_html(data.linked[index].domain)}</span> <span class="text-xs text-slate-600 dark:text-zinc-400 capitalize">${escape_html(data.linked[index].software ?? "Unknown")} • `);
								RelativeDate($$renderer, { date: publishedToDate(data.linked[index].published) });
								$$renderer.push(`<!----></span></div></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						VirtualList($$renderer, {
							items: data.linked,
							useWindow: false,
							height: 600,
							estimatedHeight: 50,
							class: "overflow-auto border rounded-2xl border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950\n      divide-y divide-slate-200 dark:divide-zinc-900 w-full",
							item,
							$$slots: { item: true }
						});
					}
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					Placeholder($$renderer, {
						icon: Check,
						title: "No linked instances",
						description: "This instance does not federate with any others."
					});
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
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