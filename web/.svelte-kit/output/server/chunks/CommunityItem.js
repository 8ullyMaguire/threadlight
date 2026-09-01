import { r as clsx } from "./validate.js";
import { a as bind_props, h as stringify, t as attr_class } from "./server.js";
import { At as settings, Bn as Check, Cn as InformationCircle, Dn as ExclamationTriangle, Dt as SvelteURL, Lt as modal, Zt as Button, _t as fullCommunityName, mn as NoSymbol, nn as Trash, o as profile, t as client, un as Plus, vn as MapPin } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as CommunityCard } from "./CommunityCard.js";
import { t as addSubscription } from "./user.js";
import { t as CommonItem } from "./CommonItem.js";
import { t as Subscribe } from "./Subscribe.js";
//#region src/lib/feature/community/CommunityItem.svelte
function CommunityItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community = void 0, view = "compact", showCounts = true, resolveObject, children } = $$props;
		function communityInfo($$renderer) {
			CommunityCard($$renderer, { community_view: community });
		}
		CommonItem($$renderer, {
			icon: settings.nsfwBlur && community.community.nsfw ? void 0 : community.community.icon,
			href: `/c/${stringify(fullCommunityName(community.community.name, community.community.actor_id))}`,
			title: community.community.title,
			detail: `${stringify(new SvelteURL(community.community.actor_id).hostname)}${!showCounts ? ` • ${Intl.NumberFormat("en", { notation: "compact" }).format(community.counts.subscribers)}` : ""}`,
			orientation: view == "cozy" ? "vertical" : "horizontal",
			children: ($$renderer) => {
				if (!children) {
					$$renderer.push("<!--[0-->");
					if (community.community.deleted) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span title="Deleted">`);
						Icon($$renderer, {
							src: Trash,
							class: "text-red-500 inline",
							micro: true,
							size: "14"
						});
						$$renderer.push(`<!----></span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (community.community.nsfw) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span title="NSFW">`);
						Icon($$renderer, {
							src: ExclamationTriangle,
							class: "text-red-500 inline",
							micro: true,
							size: "14"
						});
						$$renderer.push(`<!----></span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (community.banned_from_community) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span title="You are banned from this community.">`);
						Icon($$renderer, {
							src: NoSymbol,
							class: "text-red-500 inline",
							micro: true,
							size: "14"
						});
						$$renderer.push(`<!----></span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (community.community.visibility == "LocalOnly") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span title="Local">`);
						Icon($$renderer, {
							src: MapPin,
							class: "text-green-500 inline",
							micro: true,
							size: "14"
						});
						$$renderer.push(`<!----></span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					Button($$renderer, {
						rounding: "xl",
						color: "ghost",
						onclick: () => modal({
							title: "Community",
							snippet: communityInfo
						}),
						"aria-label": "Info",
						size: "square-md",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: InformationCircle,
								size: "16",
								mini: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					{
						function children($$renderer, { subscribe, subscribing }) {
							const subscribed = community.subscribed == "Subscribed" || community.subscribed == "Pending";
							Button($$renderer, {
								disabled: subscribing || !profile.current?.jwt,
								loading: subscribing,
								onclick: async () => {
									const object = resolveObject && await client().resolveObject({ q: community.community.actor_id });
									const res = object ? await subscribe(object.community?.community.id) : await subscribe();
									if (res) {
										const newSubscribed = res.community_view.subscribed != "NotSubscribed" ? "Subscribed" : "NotSubscribed";
										community.subscribed = newSubscribed;
										addSubscription(community.community, newSubscribed == "Subscribed");
									}
								},
								size: "custom",
								title: subscribed ? "Subscribed" : "Subscribe",
								color: subscribed ? "secondary" : "primary",
								rounding: "xl",
								class: [
									subscribed && "text-slate-600 dark:text-zinc-400",
									" h-8.5 rounded-full",
									view == "compact" ? "aspect-square @md:px-2 @md:min-w-30 @md:aspect-auto" : "px-3"
								],
								icon: subscribed ? Check : Plus,
								children: ($$renderer) => {
									$$renderer.push(`<span${attr_class(clsx([view == "compact" && "hidden", "@md:block"]))}>`);
									if (subscribed) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`Subscribed`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`Subscribe`);
									}
									$$renderer.push(`<!--]--></span>`);
								},
								$$slots: { default: true }
							});
						}
						Subscribe($$renderer, {
							community,
							children,
							$$slots: { default: true }
						});
					}
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					children?.($$renderer);
					$$renderer.push(`<!---->`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		bind_props($$props, { community });
	});
}
//#endregion
export { CommunityItem as t };

//# sourceMappingURL=CommunityItem.js.map