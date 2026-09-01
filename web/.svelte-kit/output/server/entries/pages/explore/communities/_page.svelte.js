import { n as attr, o as escape_html, r as clsx } from "../../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, n as attr_style, o as derived, t as attr_class } from "../../../../chunks/server.js";
import { B as Blobs, Bn as Check, Cn as InformationCircle, Dn as ExclamationTriangle, F as CommonList, Lt as modal, M as Pageination, T as EndPlaceholder, Zt as Button, ar as page, ht as communityLink, ir as navigating, mn as NoSymbol, nn as Trash, o as profile, qt as Material, st as Avatar, t as client, un as Plus, ut as optimizeImageURL, vn as MapPin } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
import { t as CommunityCard } from "../../../../chunks/CommunityCard.js";
import { t as QuestionMarkCircle } from "../../../../chunks/QuestionMarkCircle.js";
import { t as addSubscription } from "../../../../chunks/user.js";
import { t as Skeleton } from "../../../../chunks/Skeleton.js";
import { t as Subscribe } from "../../../../chunks/Subscribe.js";
import { t as CommunityItem } from "../../../../chunks/CommunityItem.js";
import { t as Fixate } from "../../../../chunks/Fixate.js";
//#region src/lib/feature/community/CommunityItemBig.svelte
function CommunityItemBig($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community = void 0, resolveObject, children } = $$props;
		function communityInfo($$renderer) {
			CommunityCard($$renderer, { community_view: community });
		}
		$$renderer.push(`<div${attr_class(clsx(["flex flex-col items-start gap-2 p-4 h-full cursor-pointer", "rounded-[inherit] overflow-hidden hover:bg-slate-50 hover:dark:bg-zinc-925 relative z-0 transition-colors"]))}><a${attr("href", communityLink(community.community))} aria-label="Open link" class="absolute inset-0 z-10"></a> <div class="-m-4 mask-b-from-25% relative h-24" style="min-width: calc(100% + calc(var(--spacing) * 8));">`);
		if (community.community.banner) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", optimizeImageURL(community.community.banner, 512))} alt="" class="object-cover min-h-full min-w-full"/>`);
		} else if (community.community.icon) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<img${attr("src", community.community.icon)} alt="" class="object-cover blur-3xl"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="scale-200 min-w-full mask-b-from-25%">`);
			Blobs($$renderer, { seed: community.community.name });
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex flex-row justify-between w-full items-start"><header class="flex-1 flex flex-col group"><h3 class="font-medium overflow-hidden text-ellipsis leading-5 text-xl font-display">${escape_html(community.community.title)}</h3> <p class="text-sm text-slate-600 dark:text-zinc-400">${escape_html(new URL(community.community.actor_id).hostname)}</p></header> `);
		Avatar($$renderer, {
			url: community.community.icon,
			alt: community.community.title,
			width: 48,
			circle: null,
			class: "rounded-xl"
		});
		$$renderer.push(`<!----></div> `);
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
			$$renderer.push(`<span title="You" are="" banned="" from="" this="" community.="">`);
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
		$$renderer.push(`<!--]--> <div class="flex gap-2 items-center justify-end w-full z-30 mt-auto">`);
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
					title: subscribed ? "Subscribed" : "Subscribe",
					color: subscribed ? "secondary" : "primary",
					class: [subscribed && "text-slate-600 dark:text-zinc-400"],
					icon: subscribed ? Check : Plus,
					children: ($$renderer) => {
						$$renderer.push(`<span${attr_class(clsx(["@md:block"]))}>`);
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
		$$renderer.push(`<!----></div> `);
		if (children) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-row gap-2 items-center">`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { community });
	});
}
//#endregion
//#region src/routes/explore/communities/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let showTop = derived(() => (data.query ?? false) && data.communities.length > 0 && data.page == 1);
		if (navigating.to?.route.id == "/communities") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col gap-3"><!--[-->`);
			const each_array = ensure_array_like(new Array(5));
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let _ = each_array[index];
				$$renderer.push(`<!---->${escape_html(_)} <div${attr_style(`width: ${stringify(1 / ((index + 1) % 3) * 100)}%`)}>`);
				Skeleton($$renderer, {});
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<ul class="flex flex-col h-full">`);
			if (data.communities.length == 0) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					icon: QuestionMarkCircle,
					title: "No results",
					description: "There are no results that match that filter. Try refining your search."
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (showTop()) {
				$$renderer.push("<!--[0-->");
				EndPlaceholder($$renderer, {
					size: "lg",
					margin: "md",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Top results`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 items-center border-0!"><!--[-->`);
				const each_array_1 = ensure_array_like(data.communities.slice(0, 3));
				for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
					let community = each_array_1[index];
					$$renderer.push(`<div class="h-full">`);
					Material($$renderer, {
						padding: "none",
						rounding: "3xl",
						class: "h-full",
						children: ($$renderer) => {
							CommunityItemBig($$renderer, { community });
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.communities.slice(showTop() ? 3 : 0).length > 0) {
				$$renderer.push("<!--[0-->");
				EndPlaceholder($$renderer, {
					size: "lg",
					margin: "md",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Other results`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.communities) {
				$$renderer.push("<!--[0-->");
				const sliced = data.communities.slice(showTop() ? 3 : 0);
				{
					function item($$renderer, community) {
						CommunityItem($$renderer, {
							community,
							resolveObject: data.type.startsWith("instance-"),
							showCounts: false
						});
					}
					CommonList($$renderer, {
						items: sliced,
						item,
						$$slots: { item: true }
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--> `);
		Fixate($$renderer, {
			placement: "bottom",
			children: ($$renderer) => {
				Pageination($$renderer, {
					page: Number(page.url.searchParams.get("page")) || 1,
					href: (c) => `?page=${c}`,
					hasMore: data.communities.length >= 40
				});
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map