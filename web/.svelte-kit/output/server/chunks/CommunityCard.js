import { o as escape_html, r as clsx } from "./validate.js";
import { a as bind_props, h as stringify, i as await_block, t as attr_class } from "./server.js";
import { At as settings, Bn as Check, En as Fire, It as action, Lt as modal, Nt as MenuButton, On as EllipsisHorizontal, Pt as Menu, Rt as Modal, T as EndPlaceholder, Ut as TextInput, Yt as Spinner, Zt as Button, _t as fullCommunityName, d as removeToast, f as toast, hn as Newspaper, mn as NoSymbol, n as getClient, o as profile, on as ShieldCheck, p as Markdown, rn as Tag, t as client, tt as errorMessage, un as Plus, wt as userLink, zt as Expandable } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as Cog6Tooth } from "./Cog6Tooth.js";
import { t as LabelStat } from "./LabelStat.js";
import { t as EntityHeader } from "./EntityHeader.js";
import { t as ItemList } from "./ItemList.js";
import { t as SidebarButton } from "./SidebarButton.js";
import { t as addSubscription } from "./user.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/BuildingOffice2.js
var BuildingOffice2 = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.75 2a.75.75 0 0 0 0 1.5H2v9h-.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V3.5h.25a.75.75 0 0 0 0-1.5h-7.5ZM3.5 5.5A.5.5 0 0 1 4 5h.5a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5v-.5Zm.5 2a.5.5 0 0 0-.5.5v.5A.5.5 0 0 0 4 9h.5a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5H4Zm2-2a.5.5 0 0 1 .5-.5H7a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-.5.5h-.5A.5.5 0 0 1 6 6v-.5Zm.5 2A.5.5 0 0 0 6 8v.5a.5.5 0 0 0 .5.5H7a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5h-.5ZM11.5 6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.75a.75.75 0 0 0 0-1.5H14v-5h.25a.75.75 0 0 0 0-1.5H11.5Zm.5 1.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H12a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5Zm0 2.5a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 0-.5-.5H12Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1 2.75A.75.75 0 0 1 1.75 2h10.5a.75.75 0 0 1 0 1.5H12v13.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5H2v-13h-.25A.75.75 0 0 1 1 2.75ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM8 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM8.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM14.25 6a.75.75 0 0 0-.75.75V17a1 1 0 0 0 1 1h3.75a.75.75 0 0 0 0-1.5H18v-9h.25a.75.75 0 0 0 0-1.5h-4Zm.5 3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm.5 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z",
			"clip-rule": "evenodd"
		}]
	},
	"outline": {
		"a": {
			"fill": "none",
			"viewBox": "0 0 24 24",
			"stroke-width": "1.5",
			"stroke": "currentColor"
		},
		"path": [{
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/feature/community/CommunityFlair.svelte
function CommunityFlair($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { flair: passedFlair = "", community, onsubmit } = $$props;
		let flair = passedFlair;
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="contents">`);
			TextInput($$renderer, {
				label: "Content",
				required: true,
				get value() {
					return flair;
				},
				set value($$value) {
					flair = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				loading,
				submit: true,
				color: "primary",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Submit`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form>`);
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
//#region src/lib/feature/community/CommunityCard.svelte
async function block(id, block) {
	try {
		const loading = toast({
			content: ``,
			loading: true
		});
		await getClient().blockCommunity({
			community_id: id,
			block
		});
		removeToast(loading);
		toast({
			content: !block ? "Unblocked that community." : "Blocked that community.",
			type: "success"
		});
		return block;
	} catch (err) {
		toast({
			content: errorMessage(err),
			type: "error"
		});
		return !block;
	}
}
async function purgeCommunity(id) {
	const purgeToast = toast({
		content: "",
		loading: true
	});
	try {
		await client().purgeCommunity({ community_id: id });
		removeToast(purgeToast);
		toast({
			content: "Purged that community.",
			type: "success"
		});
	} catch (err) {
		toast({
			content: errorMessage(err),
			type: "error"
		});
	}
}
async function blockInstance(id) {
	try {
		const loading = toast({
			content: ``,
			loading: true
		});
		await getClient().blockInstance({
			instance_id: id,
			block: true
		});
		removeToast(loading);
		toast({
			content: `Successfully blocked that instance.`,
			type: "success"
		});
	} catch (err) {
		toast({
			content: errorMessage(err),
			type: "error"
		});
	}
}
function CommunityCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let loading = {
			blocking: false,
			subscribing: false
		};
		async function subscribe(community) {
			if (!profile.current?.jwt) return;
			loading.subscribing = true;
			const subscribed = community.subscribed == "Subscribed" || community.subscribed == "Pending";
			try {
				await getClient().followCommunity({
					community_id: community.community.id,
					follow: !subscribed
				});
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			community.subscribed = subscribed ? "NotSubscribed" : "Subscribed";
			addSubscription(community.community, !subscribed);
			loading.subscribing = false;
		}
		let setFlair = false;
		let { community_view = void 0, moderators = [], class: clazz = "" } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			await_block($$renderer, community_view, () => {
				$$renderer.push(`<div class="w-full h-full grid place-items-center" role="status" aria-label="Loading">`);
				Spinner($$renderer, { width: 24 });
				$$renderer.push(`<!----></div>`);
			}, (community_view) => {
				Modal($$renderer, {
					title: "Set",
					my: true,
					flair: true,
					get open() {
						return setFlair;
					},
					set open($$value) {
						setFlair = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						CommunityFlair($$renderer, {
							community: community_view.community.id,
							onsubmit: () => setFlair = !setFlair
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <aside${attr_class(clsx(["min-w-full pt-0 text-slate-600 dark:text-zinc-400 flex flex-col gap-1", clazz]))}>`);
				{
					function nameDetail($$renderer) {
						$$renderer.push(`<!---->!${escape_html(fullCommunityName(community_view.community.name, community_view.community.actor_id))}`);
					}
					EntityHeader($$renderer, {
						name: community_view.community.title,
						avatar: community_view.community.icon,
						banner: community_view.community.banner,
						avatarCircle: false,
						nameDetail,
						$$slots: { nameDetail: true }
					});
				}
				$$renderer.push(`<!----> `);
				EndPlaceholder($$renderer, {
					size: "xs",
					margin: "sm",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Community`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (profile.current?.jwt) {
					$$renderer.push("<!--[0-->");
					const subscribed = profile.current.user?.follows.some((i) => i.community.id == community_view.community.id);
					Button($$renderer, {
						disabled: loading.subscribing,
						loading: loading.subscribing,
						size: "md",
						color: subscribed ? "secondary" : "primary",
						onclick: () => subscribe(community_view),
						class: "px-4 relative z-[inherit]",
						alignment: "left",
						icon: community_view.subscribed == "Subscribed" ? Check : Plus,
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(subscribed ? "Subscribed" : "Subscribe")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (client().setFlair) {
						$$renderer.push("<!--[0-->");
						SidebarButton($$renderer, {
							onclick: () => setFlair = !setFlair,
							icon: Tag,
							label: "Set",
							my: true,
							flair: true
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profile.isMod(community_view.community)) {
					$$renderer.push("<!--[0-->");
					SidebarButton($$renderer, {
						href: `/c/${stringify(fullCommunityName(community_view.community.name, community_view.community.actor_id))}/settings`,
						icon: Cog6Tooth,
						label: "Edit"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				{
					function target($$renderer, attachment) {
						SidebarButton($$renderer, {
							label: "More",
							actions: true,
							icon: EllipsisHorizontal
						});
					}
					Menu($$renderer, {
						placement: "bottom-start",
						target,
						children: ($$renderer) => {
							MenuButton($$renderer, {
								href: `/modlog?community=${stringify(community_view.community.id)}`,
								children: ($$renderer) => {
									Icon($$renderer, {
										src: Newspaper,
										size: "16",
										mini: true
									});
									$$renderer.push(`<!----> Modlog`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							if (profile.current?.jwt) {
								$$renderer.push("<!--[0-->");
								if (profile.isMod(community_view.community)) {
									$$renderer.push("<!--[0-->");
									MenuButton($$renderer, {
										color: "success-subtle",
										href: `/moderation?community=${stringify(community_view.community.id)}`,
										children: ($$renderer) => {
											Icon($$renderer, {
												src: ShieldCheck,
												size: "16",
												micro: true
											});
											$$renderer.push(`<!----> Reports`);
										},
										$$slots: { default: true }
									});
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> `);
								MenuButton($$renderer, {
									color: "danger-subtle",
									size: "lg",
									onclick: () => block(community_view.community.id, !community_view.blocked),
									icon: NoSymbol,
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(community_view.blocked ? "Unblock" : "Block")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								if (profile.current?.user) {
									$$renderer.push("<!--[0-->");
									MenuButton($$renderer, {
										color: "danger-subtle",
										size: "lg",
										onclick: () => blockInstance(community_view.community.instance_id),
										icon: BuildingOffice2,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Block server`);
										},
										$$slots: { default: true }
									});
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]--> `);
								if (profile.isAdmin) {
									$$renderer.push("<!--[0-->");
									MenuButton($$renderer, {
										color: "danger-subtle",
										onclick: () => modal({
											title: "Purging community",
											body: `${community_view.community.title}: $This will delete all posts. Are you sure? (The button will enable in 3 seconds.)`,
											actions: [action({
												close: true,
												content: "Cancel"
											}), action({
												action: () => purgeCommunity(community_view.community.id),
												close: true,
												content: "Purge",
												type: "danger",
												icon: Fire
											})],
											dismissable: true,
											type: "error"
										}),
										icon: Fire,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Purge`);
										},
										$$slots: { default: true }
									});
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						},
						$$slots: {
							target: true,
							default: true
						}
					});
				}
				$$renderer.push(`<!----> `);
				EndPlaceholder($$renderer, {
					size: "xs",
					margin: "sm",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Statistics`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <div class="flex flex-row gap-4 flex-wrap px-3">`);
				LabelStat($$renderer, {
					label: "Members",
					content: community_view.counts.subscribers.toString(),
					formatted: true
				});
				$$renderer.push(`<!----> `);
				LabelStat($$renderer, {
					label: "Posts",
					content: community_view.counts.posts.toString(),
					formatted: true
				});
				$$renderer.push(`<!----> `);
				LabelStat($$renderer, {
					label: "Active",
					Today: true,
					content: community_view.counts.users_active_day.toString(),
					formatted: true
				});
				$$renderer.push(`<!----></div> `);
				EndPlaceholder($$renderer, {
					size: "xs",
					margin: "sm",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Info`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <div class="space-y-3 px-1.5 text-sm">`);
				{
					function title($$renderer) {
						$$renderer.push(`<span class="px-2 py-1 w-full">About</span>`);
					}
					Expandable($$renderer, {
						get open() {
							return settings.expand.about;
						},
						set open($$value) {
							settings.expand.about = $$value;
							$$settled = false;
						},
						title,
						children: ($$renderer) => {
							Markdown($$renderer, { source: community_view.community.description });
						},
						$$slots: {
							title: true,
							default: true
						}
					});
				}
				$$renderer.push(`<!----> `);
				if (moderators && moderators.length > 0) {
					$$renderer.push("<!--[0-->");
					{
						function title($$renderer) {
							$$renderer.push(`<span class="px-2 py-1 w-full">Moderators</span>`);
						}
						Expandable($$renderer, {
							get open() {
								return settings.expand.team;
							},
							set open($$value) {
								settings.expand.team = $$value;
								$$settled = false;
							},
							title,
							children: ($$renderer) => {
								ItemList($$renderer, { items: moderators.map((i) => ({
									id: i.moderator.id,
									name: i.moderator.display_name || i.moderator.name,
									url: userLink(i.moderator),
									avatar: i.moderator.avatar,
									instance: new URL(i.moderator.actor_id).hostname
								})) });
							},
							$$slots: {
								title: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></aside>`);
			});
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { community_view });
	});
}
//#endregion
export { CommunityFlair as a, purgeCommunity as i, block as n, BuildingOffice2 as o, blockInstance as r, CommunityCard as t };

//# sourceMappingURL=CommunityCard.js.map