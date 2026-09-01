import { o as escape_html, r as clsx } from "./validate.js";
import { a as bind_props, f as spread_props, h as stringify, t as attr_class } from "./server.js";
import { At as settings, Bn as Check, En as Fire, It as action, Lt as modal, Nt as MenuButton, On as EllipsisHorizontal, Pt as Menu, Rt as Modal, Zt as Button, _t as fullCommunityName, hn as Newspaper, mn as NoSymbol, o as profile, on as ShieldCheck, ot as formatRelativeDate, rn as Tag, t as client, tr as publishedToDate, un as Plus, wt as userLink, zt as Expandable } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { a as CommunityFlair, i as purgeCommunity, n as block, o as BuildingOffice2, r as blockInstance } from "./CommunityCard.js";
import { t as Cog6Tooth } from "./Cog6Tooth.js";
import { t as EntityHeader } from "./EntityHeader.js";
import { t as ItemList } from "./ItemList.js";
import { t as Subscribe } from "./Subscribe.js";
//#region src/lib/feature/community/CommunityHeader.svelte
function CommunityHeader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community = void 0, subscribed = void 0, counts = void 0, moderators = [], blocked = false, banner = !(settings.nsfwBlur && community.nsfw), class: clazz = "", compact, $$slots, $$events, ...rest } = $$props;
		let setFlair = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
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
						community: community.id,
						onsubmit: () => setFlair = !setFlair
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function nameDetail($$renderer) {
					$$renderer.push(`<button class="text-sm flex gap-0 items-center">!${escape_html(fullCommunityName(community.name, community.actor_id))}</button>`);
				}
				EntityHeader($$renderer, spread_props([rest, {
					compact,
					banner: banner ? community.banner : void 0,
					avatar: community.icon,
					name: community.title,
					url: `/c/${stringify(fullCommunityName(community.name, community.actor_id))}`,
					stats: counts ? [
						{
							name: "Members",
							value: counts.subscribers.toString()
						},
						{
							name: "Posts",
							value: counts.posts.toString()
						},
						{
							name: "Active Today",
							value: counts.users_active_day.toString()
						},
						{
							name: "Created",
							format: false,
							value: formatRelativeDate(publishedToDate(community.published), { style: "short" }).toString()
						}
					] : [],
					bio: community.description,
					class: ["tracking-normal", clazz],
					nameDetail,
					children: ($$renderer) => {
						if (moderators.length > 0) {
							$$renderer.push("<!--[0-->");
							{
								function title($$renderer) {
									$$renderer.push(`<!---->Moderators <hr class="flex-1 border-slate-200 dark:border-zinc-800 mx-3"/>`);
								}
								Expandable($$renderer, {
									class: [compact == "lg" && "lg:hidden"],
									title,
									children: ($$renderer) => {
										ItemList($$renderer, { items: moderators.map((m) => ({
											id: m.moderator.id,
											name: m.moderator.name,
											url: userLink(m.moderator),
											avatar: m.moderator.avatar,
											instance: new URL(m.moderator.actor_id).hostname
										})) });
									},
									$$slots: {
										title: true,
										default: true
									}
								});
							}
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> <div${attr_class(clsx(["flex items-center gap-2 h-max w-max", compact == "lg" && "lg:hidden"]))}>`);
						if (profile.current?.jwt) {
							$$renderer.push("<!--[0-->");
							{
								function children($$renderer, { subscribe, subscribing }) {
									Button($$renderer, {
										disabled: subscribing,
										loading: subscribing,
										color: subscribed == "NotSubscribed" ? "primary" : "secondary",
										onclick: async () => {
											subscribed = (await subscribe())?.community_view.subscribed ?? "NotSubscribed";
										},
										class: "relative z-[inherit]",
										size: "lg",
										icon: subscribed != "NotSubscribed" ? Check : Plus,
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(subscribed == "Subscribed" || subscribed == "Pending" ? "Subscribed" : "Subscribe")}`);
										},
										$$slots: { default: true }
									});
								}
								Subscribe($$renderer, {
									community: {
										community,
										banned_from_community: false,
										blocked: false,
										counts,
										subscribed
									},
									children,
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!----> `);
							if (client().setFlair) {
								$$renderer.push("<!--[0-->");
								Button($$renderer, {
									size: "square-lg",
									onclick: () => setFlair = !setFlair,
									"aria-label": "Set",
									my: true,
									flair: true,
									children: ($$renderer) => {
										Icon($$renderer, {
											src: Tag,
											size: "16",
											micro: true
										});
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (profile.current?.user && profile.current.user.moderates.map((c) => c.community.id).includes(community.id)) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								color: "secondary",
								size: "square-lg",
								href: `/c/${stringify(fullCommunityName(community.name, community.actor_id))}/settings`,
								children: ($$renderer) => {
									Icon($$renderer, {
										src: Cog6Tooth,
										size: "16",
										mini: true
									});
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						{
							function target($$renderer, attachment) {
								Button($$renderer, {
									size: "square-lg",
									icon: EllipsisHorizontal
								});
							}
							Menu($$renderer, {
								placement: "top-end",
								target,
								children: ($$renderer) => {
									MenuButton($$renderer, {
										href: `/modlog?community=${stringify(community.id)}`,
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
									if (profile.isMod(community)) {
										$$renderer.push("<!--[0-->");
										MenuButton($$renderer, {
											color: "success-subtle",
											href: `/moderation?community=${stringify(community.id)}`,
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
									if (profile.current?.jwt) {
										$$renderer.push("<!--[0-->");
										MenuButton($$renderer, {
											color: "danger-subtle",
											size: "lg",
											onclick: () => block(community.id, !blocked),
											icon: NoSymbol,
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(blocked ? "Unblock" : "Block")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										MenuButton($$renderer, {
											color: "danger-subtle",
											size: "lg",
											onclick: () => blockInstance(community.instance_id),
											icon: BuildingOffice2,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Block server`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										if (profile.isAdmin) {
											$$renderer.push("<!--[0-->");
											MenuButton($$renderer, {
												color: "danger-subtle",
												onclick: () => modal({
													title: "Purging community",
													body: `${community.title}: $This will delete all posts. Are you sure? (The button will enable in 3 seconds.)`,
													actions: [action({
														close: true,
														content: "Cancel"
													}), action({
														action: () => purgeCommunity(community.id),
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
						$$renderer.push(`<!----></div>`);
					},
					$$slots: {
						nameDetail: true,
						default: true
					}
				}]));
			}
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			community,
			subscribed
		});
	});
}
//#endregion
export { CommunityHeader as t };

//# sourceMappingURL=CommunityHeader2.js.map