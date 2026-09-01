import { c as ensure_array_like, h as stringify, i as await_block } from "../../../../../chunks/server.js";
import { R as Header, Yt as Spinner, Zt as Button, qt as Material, zt as Expandable } from "../../../../../chunks/client.svelte.js";
import { t as ModlogItemCard } from "../../../../../chunks/ModlogItemCard.js";
import { t as ban } from "../../../../../chunks/moderation.js";
import { t as Switch } from "../../../../../chunks/Switch.js";
import { t as UserAutocomplete } from "../../../../../chunks/UserAutocomplete.js";
import { t as CommunityHeader } from "../../../../../chunks/CommunityHeader2.js";
//#region src/routes/moderation/c/[id=integer]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let banFromCommunity = false;
		let { data } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function extended($$renderer) {
					CommunityHeader($$renderer, {
						community: data.community.community_view.community,
						counts: data.community.community_view.counts,
						moderators: data.community.moderators,
						subscribed: data.community.community_view.subscribed,
						banner: false
					});
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					$$slots: { extended: true }
				});
			}
			$$renderer.push(`<!----> <div class="flex flex-col *:py-2 divide-y divide-slate-200 dark:divide-zinc-800">`);
			{
				function title($$renderer) {
					$$renderer.push(`<!---->Recent moderation logs`);
				}
				Expandable($$renderer, {
					title,
					children: ($$renderer) => {
						Material($$renderer, {
							color: "uniform",
							rounding: "2xl",
							class: "dark:bg-zinc-950 max-h-96 h-full overflow-auto space-y-4 mt-1",
							children: ($$renderer) => {
								await_block($$renderer, data.modlog, () => {
									Spinner($$renderer, { width: 24 });
								}, (log) => {
									$$renderer.push(`<!--[-->`);
									const each_array = ensure_array_like(log);
									for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
										let modLog = each_array[$$index];
										ModlogItemCard($$renderer, { item: modLog });
									}
									$$renderer.push(`<!--]--> <div class="sticky -bottom-4 pb-4 w-full flex items-center bg-gradient-to-b from-white/0 to-white dark:from-zinc-950/0 dark:to-zinc-950">`);
									Button($$renderer, {
										color: "primary",
										rounding: "pill",
										class: "mx-auto",
										href: `/modlog?community=${stringify(data.community.community_view.community.id)}`,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Read more`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div>`);
								});
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: {
						title: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			{
				function title($$renderer) {
					$$renderer.push(`<div>Ban user from community</div>`);
				}
				Expandable($$renderer, {
					title,
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex flex-col gap-4">`);
						Switch($$renderer, {
							options: [false, true],
							optionNames: ["Ban", "Unban"],
							get selected() {
								return banFromCommunity;
							},
							set selected($$value) {
								banFromCommunity = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> `);
						UserAutocomplete($$renderer, {
							onselect: (p) => {
								if (!p) return;
								ban(banFromCommunity, p, data.community.community_view.community);
							},
							listing_type: "All"
						});
						$$renderer.push(`<!----></div>`);
					},
					$$slots: {
						title: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----></div>`);
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