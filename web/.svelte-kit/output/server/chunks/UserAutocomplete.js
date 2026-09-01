import { r as createEventDispatcher } from "./internal.js";
import { o as escape_html } from "./validate.js";
import { a as bind_props, f as spread_props } from "./server.js";
import { Nt as MenuButton, n as getClient, o as profile, s as Search, st as Avatar } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as XCircle } from "./XCircle.js";
//#region src/lib/feature/user/UserAutocomplete.svelte
function UserAutocomplete($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { q = "", instance = void 0, listing_type = "Subscribed", showWhenEmpty = false, hideOwnUser = false, label, $$slots, $$events, ...rest } = $$props;
		const dispatcher = createEventDispatcher();
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function noresults($$renderer) {
					$$renderer.push(`<div class="w-full h-full">`);
					if (showWhenEmpty) {
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
								url: item.avatar,
								alt: item.name,
								width: 24
							});
							$$renderer.push(`<!----> <div class="flex flex-col text-left"><span>${escape_html(item.name)}</span> <span class="text-xs opacity-80">${escape_html(new URL(item.actor_id).hostname)}</span></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				}
				Search($$renderer, spread_props([
					{
						search: async (q) => {
							const users = (await getClient(instance).search({
								q: q || " ",
								type_: "Users",
								limit: 20,
								listing_type,
								sort: "TopAll"
							})).users.map((c) => c.person);
							if (hideOwnUser) {
								const myself = profile.current.user?.local_user_view.person.id;
								return users.filter((c) => c.id != myself);
							}
							return users;
						},
						extractName: (c) => `${c.name}@${new URL(c.actor_id).hostname}`,
						label
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
export { UserAutocomplete as t };

//# sourceMappingURL=UserAutocomplete.js.map