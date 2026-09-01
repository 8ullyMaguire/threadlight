import { h as stringify } from "../../../../chunks/server.js";
import { F as CommonList, R as Header, Yt as Spinner, Zt as Button, o as profile } from "../../../../chunks/client.svelte.js";
import { t as CommunityItem } from "../../../../chunks/CommunityItem.js";
//#region src/routes/moderation/communities/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		Header($$renderer, {
			pageHeader: true,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Communities`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="w-full h-full flex flex-col mt-4">`);
		if (!profile.current.user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mx-auto my-auto">`);
			Spinner($$renderer, { width: 24 });
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			{
				function item($$renderer, moderate) {
					const community = moderate.community;
					CommunityItem($$renderer, {
						community: {
							banned_from_community: false,
							blocked: false,
							community,
							counts: {
								comments: 0,
								community_id: 0,
								posts: 0,
								published: "2023-10-05",
								subscribers: 0,
								subscribers_local: 0,
								users_active_day: 0,
								users_active_half_year: 0,
								users_active_month: 0,
								users_active_week: 0
							},
							subscribed: "NotSubscribed"
						},
						children: ($$renderer) => {
							Button($$renderer, {
								href: `/moderation?community=${stringify(community.id)}`,
								color: "secondary",
								rounding: "pill",
								size: "sm",
								class: "h-max self-center",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Reports`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="w-2"></div> `);
							Button($$renderer, {
								href: `/moderation/c/${stringify(community.id)}`,
								color: "primary",
								rounding: "pill",
								size: "sm",
								class: "h-max self-center",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Manage`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				}
				CommonList($$renderer, {
					items: profile.current.user.moderates,
					item,
					$$slots: { item: true }
				});
			}
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map