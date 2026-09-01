import "../../chunks/internal.js";
import { t as public_env } from "../../chunks/shared-server.js";
import { n as attr, o as escape_html, r as clsx } from "../../chunks/validate.js";
import { c as ensure_array_like, f as spread_props, g as unsubscribe_stores, h as stringify, i as await_block, l as head, m as store_mutate, n as attr_style, o as derived, p as store_get, t as attr_class } from "../../chunks/server.js";
import { t as goto } from "../../chunks/navigation.js";
import { At as settings, Ft as ModalContainer, Ht as Option, Jn as Bookmark, N as Shell, Nn as ChevronUpDown, Nt as MenuButton, Pt as Menu, T as EndPlaceholder, Tn as GlobeAlt, Vt as Select, Yn as Bars3, Yt as Spinner, Zt as Button, ar as page, cn as PuzzlePiece, ht as communityLink, in as Sun, l as Badge, o as profile, on as ShieldCheck, r as site, rr as DEFAULT_CLIENT_TYPE, rt as Logo, st as Avatar, u as ToastContainer, v as LINKED_INSTANCE_URL, x as ExpandableImage, yn as MagnifyingGlass, zn as CheckCircle, zt as Expandable } from "../../chunks/client.svelte.js";
import { n as Icon } from "../../chunks/Placeholder.js";
import { t as ArrowLeftOnRectangle } from "../../chunks/ArrowLeftOnRectangle.js";
import { a as Swatch, i as UserGroup, n as chords, o as Moon, r as InstanceCard, t as CommandsHost } from "../../chunks/CommandsHost.js";
import { t as Cog6Tooth } from "../../chunks/Cog6Tooth.js";
import { t as ComputerDesktop } from "../../chunks/ComputerDesktop.js";
import { t as Home } from "../../chunks/Home.js";
import { t as Identification } from "../../chunks/Identification.js";
import { t as Inbox } from "../../chunks/Inbox.js";
import { t as PencilSquare } from "../../chunks/PencilSquare.js";
import { t as QuestionMarkCircle } from "../../chunks/QuestionMarkCircle.js";
import { t as ServerStack } from "../../chunks/ServerStack.js";
import { t as UserCircle } from "../../chunks/UserCircle.js";
import { i as getDefaultColors, n as rgbToHex, r as theme, t as inDarkColorScheme } from "../../chunks/theme.svelte.js";
import { t as ItemList } from "../../chunks/ItemList.js";
import { t as SidebarButton } from "../../chunks/SidebarButton.js";
import { r as modals } from "../../chunks/moderation.js";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Haptics } from "@capacitor/haptics";
import nProgress from "nprogress";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Forward.js
var Forward = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M2.53 3.956A1 1 0 0 0 1 4.804v6.392a1 1 0 0 0 1.53.848l5.113-3.196c.16-.1.279-.233.357-.383v2.73a1 1 0 0 0 1.53.849l5.113-3.196a1 1 0 0 0 0-1.696L9.53 3.956A1 1 0 0 0 8 4.804v2.731a.992.992 0 0 0-.357-.383L2.53 3.956Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.288 4.818A1.5 1.5 0 0 0 1 6.095v7.81a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905c.155-.096.285-.213.389-.344v2.973a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905a1.5 1.5 0 0 0 0-2.552l-6.323-3.906A1.5 1.5 0 0 0 10 6.095v2.972a1.506 1.506 0 0 0-.389-.343L3.288 4.818Z" }]
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
			"d": "M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" }]
	}
};
//#endregion
//#region src/lib/feature/moderation/Moderation.svelte
function Moderation($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (store_get($$store_subs ??= {}, "$modals", modals).reporting.open) {
				$$renderer.push("<!--[0-->");
				await_block($$renderer, import("../../chunks/ReportModal.js"), () => {}, ({ default: ReportModal }) => {
					ReportModal($$renderer, {
						get open() {
							return store_get($$store_subs ??= {}, "$modals", modals).reporting.open;
						},
						set open($$value) {
							store_mutate($$store_subs ??= {}, "$modals", modals, store_get($$store_subs ??= {}, "$modals", modals).reporting.open = $$value);
							$$settled = false;
						},
						get item() {
							return store_get($$store_subs ??= {}, "$modals", modals).reporting.item;
						},
						set item($$value) {
							store_mutate($$store_subs ??= {}, "$modals", modals, store_get($$store_subs ??= {}, "$modals", modals).reporting.item = $$value);
							$$settled = false;
						}
					});
				});
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (store_get($$store_subs ??= {}, "$modals", modals).removing.open) {
				$$renderer.push("<!--[0-->");
				await_block($$renderer, import("../../chunks/RemoveModal.js"), () => {}, ({ default: RemoveModal }) => {
					RemoveModal($$renderer, {
						item: store_get($$store_subs ??= {}, "$modals", modals).removing.item,
						purge: store_get($$store_subs ??= {}, "$modals", modals).removing.purge,
						get open() {
							return store_get($$store_subs ??= {}, "$modals", modals).removing.open;
						},
						set open($$value) {
							store_mutate($$store_subs ??= {}, "$modals", modals, store_get($$store_subs ??= {}, "$modals", modals).removing.open = $$value);
							$$settled = false;
						}
					});
				});
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (store_get($$store_subs ??= {}, "$modals", modals).banning.open) {
				$$renderer.push("<!--[0-->");
				await_block($$renderer, import("../../chunks/BanModal.js"), () => {}, ({ default: BanModal }) => {
					BanModal($$renderer, {
						banned: store_get($$store_subs ??= {}, "$modals", modals).banning.banned,
						user: store_get($$store_subs ??= {}, "$modals", modals).banning.user,
						community: store_get($$store_subs ??= {}, "$modals", modals).banning.community,
						get open() {
							return store_get($$store_subs ??= {}, "$modals", modals).banning.open;
						},
						set open($$value) {
							store_mutate($$store_subs ??= {}, "$modals", modals, store_get($$store_subs ??= {}, "$modals", modals).banning.open = $$value);
							$$settled = false;
						}
					});
				});
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (store_get($$store_subs ??= {}, "$modals", modals).votes.open) {
				$$renderer.push("<!--[0-->");
				await_block($$renderer, import("../../chunks/ViewVotesModal.js"), () => {}, ({ default: VotesModal }) => {
					VotesModal($$renderer, {
						item: store_get($$store_subs ??= {}, "$modals", modals).votes.item,
						get open() {
							return store_get($$store_subs ??= {}, "$modals", modals).votes.open;
						},
						set open($$value) {
							store_mutate($$store_subs ??= {}, "$modals", modals, store_get($$store_subs ??= {}, "$modals", modals).votes.open = $$value);
							$$settled = false;
						}
					});
				});
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/ui/navbar/NavButton.svelte
function NavButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { label, icon, href, adaptive = true, isSelectedFilter = (path) => href != void 0 && path == href, class: clazz = "", customIcon, children, $$slots, $$events, ...rest } = $$props;
		let isSelected = derived(() => isSelectedFilter(page.url.pathname));
		{
			function prefix($$renderer) {
				$$renderer.push(`<div class="prefix">`);
				if (customIcon) {
					$$renderer.push("<!--[0-->");
					customIcon?.($$renderer, {
						size: 16,
						isSelected: isSelected()
					});
					$$renderer.push(`<!---->`);
				} else if (icon) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="hidden md:block">`);
					Icon($$renderer, {
						src: icon,
						size: "16",
						micro: true
					});
					$$renderer.push(`<!----></div> <div class="block md:hidden">`);
					Icon($$renderer, {
						src: icon,
						size: "20",
						mini: true
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			Button($$renderer, spread_props([rest, {
				color: "none",
				rounding: "none",
				class: [
					"nav-btn",
					adaptive && "nav-btn-dynamic",
					isSelected() && "nav-btn-selected",
					clazz
				],
				shadow: "none",
				size: "custom",
				href,
				title: label,
				"aria-selected": isSelected(),
				prefix,
				children: ($$renderer) => {
					$$renderer.push(`<span${attr_class(`hidden ${adaptive ? "md:block" : ""}`)}>${escape_html(label)}</span> `);
					children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: {
					prefix: true,
					default: true
				}
			}]));
		}
	});
}
//#endregion
//#region src/lib/ui/navbar/Navbar.svelte
function Navbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { style = "", class: clazz = "" } = $$props;
		CommandsHost($$renderer, {});
		$$renderer.push(`<!----> <nav${attr_class(clsx(["navbar @container", clazz]), "svelte-hvaosf")}${attr_style(style)} data-sveltekit-preload-data="">`);
		{
			function customIcon($$renderer) {
				if (LINKED_INSTANCE_URL) {
					$$renderer.push("<!--[0-->");
					if (site.data) {
						$$renderer.push("<!--[0-->");
						Avatar($$renderer, {
							alt: site.data.site_view.site.name,
							url: site.data.site_view.site.icon,
							width: 32,
							circle: false
						});
					} else {
						$$renderer.push("<!--[-1-->");
						Spinner($$renderer, { width: 32 });
					}
					$$renderer.push(`<!--]-->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="hidden md:block text-primary-900! dark:text-primary-100!">`);
					Logo($$renderer, { width: 32 });
					$$renderer.push(`<!----></div> <div${attr_class(clsx(["block md:hidden text-inherit!"]))}><div class="prefix">`);
					Icon($$renderer, {
						src: Home,
						size: "20",
						mini: true
					});
					$$renderer.push(`<!----></div></div>`);
				}
				$$renderer.push(`<!--]-->`);
			}
			NavButton($$renderer, {
				oncontextmenu: (e) => {
					e.preventDefault();
					chords.commands = true;
					return true;
				},
				icon: Home,
				href: "/",
				label: "Home",
				class: ["logo border-0 md:w-10! md:h-10 md:px-0! -order-1", !LINKED_INSTANCE_URL ? "md:rounded-full!" : "rounded-none!"],
				adaptive: false,
				customIcon,
				$$slots: { customIcon: true }
			});
		}
		$$renderer.push(`<!----> <div class="hidden md:block md:flex-1"></div> <div class="sr-only md:not-sr-only md:contents">`);
		if (profile.isAdmin) {
			$$renderer.push("<!--[0-->");
			NavButton($$renderer, {
				href: "/admin",
				label: "Admin",
				icon: ServerStack,
				class: "relative order-0",
				isSelectedFilter: (path) => path.startsWith("/admin")
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (profile.isMod()) {
			$$renderer.push("<!--[0-->");
			NavButton($$renderer, {
				href: "/moderation",
				label: "Moderation",
				class: "relative order-0",
				icon: ShieldCheck
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		NavButton($$renderer, {
			href: "/explore/communities",
			label: "Explore",
			icon: GlobeAlt,
			isSelectedFilter: (path) => path.startsWith("/explore"),
			class: "order-1"
		});
		$$renderer.push(`<!----> `);
		NavButton($$renderer, {
			href: "/search",
			label: "Search",
			icon: MagnifyingGlass,
			class: "order-3 md:order-2"
		});
		$$renderer.push(`<!----> `);
		NavButton($$renderer, {
			href: "/plugins",
			label: "Plugins",
			icon: PuzzlePiece,
			isSelectedFilter: (path) => path.startsWith("/plugins"),
			class: "order-4 md:order-3"
		});
		$$renderer.push(`<!----> `);
		NavButton($$renderer, {
			label: "Create",
			href: "/create",
			isSelectedFilter: (path) => path.startsWith("/create"),
			icon: PencilSquare,
			class: "order-2 md:order-3 nav-btn-sm-primary"
		});
		$$renderer.push(`<!----> `);
		{
			function target($$renderer, attachment) {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <button${attr_class(clsx([
					"w-10 h-10 rounded-full",
					"transition-all relative grid place-items-center",
					" group cursor-pointer order-4"
				]), "svelte-hvaosf")} title="Profile">`);
				if (profile.current?.user) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class(clsx(["h-full aspect-square object-cover rounded-full grid place-items-center", "border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 bg-slate-50 dark:bg-zinc-900"]))}>`);
					Avatar($$renderer, {
						url: profile.current.user.local_user_view.person.avatar,
						width: 36,
						alt: profile.current.user.local_user_view.person.name,
						class: "group-hover:scale-90 transition-transform group-active:scale-85"
					});
					$$renderer.push(`<!----></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full grid place-items-center">`);
					Icon($$renderer, {
						src: Bars3,
						micro: true,
						size: "18"
					});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--> `);
				if (Math.max(...Object.values(profile.inbox.notifications)) > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="w-2 h-2 absolute top-0.5 right-0.5 bg-red-500 rounded-full"></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button>`);
			}
			function children($$renderer, open) {
				if (open) {
					$$renderer.push("<!--[0-->");
					await_block($$renderer, import("../../chunks/Profile.js"), () => {
						$$renderer.push(`<div class="p-8 w-full h-full grid place-items-center">`);
						Spinner($$renderer, { width: 20 });
						$$renderer.push(`<!----></div>`);
					}, ({ default: Profile }) => {
						if (Profile) {
							$$renderer.push("<!--[-->");
							Profile($$renderer, {});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					});
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			Menu($$renderer, {
				placement: "bottom",
				target,
				children,
				$$slots: {
					target: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----></nav>`);
	});
}
//#endregion
//#region src/lib/feature/user/ProfileSelection.svelte
function ProfileSelection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { profiles, selectable = true } = $$props;
		function switchTo(id) {
			profile.meta.profile = id;
			goto(page.url, { invalidateAll: true });
		}
		{
			function target($$renderer, passedAttachment) {
				{
					function prefix($$renderer) {
						Avatar($$renderer, {
							url: profile.current.avatar,
							alt: profile.current.username,
							width: 24
						});
					}
					function suffix($$renderer) {
						if (selectable) {
							$$renderer.push("<!--[0-->");
							Icon($$renderer, {
								src: ChevronUpDown,
								size: "16",
								micro: true,
								class: "block justify-self-end"
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Button($$renderer, {
						color: "tertiary",
						alignment: "left",
						size: "md",
						rounding: "xl",
						class: "flex flex-row gap-2! items-center",
						"aria-label": "Accounts selector",
						prefix,
						suffix,
						children: ($$renderer) => {
							$$renderer.push(`<div class="flex-1"><div class="font-medium">${escape_html(profile.current.username)}</div> `);
							if (!LINKED_INSTANCE_URL) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="text-xs text-slate-500 dark:text-zinc-500"><span class="capitalize">${escape_html(profile.current.client?.name ?? DEFAULT_CLIENT_TYPE.name)}</span> • ${escape_html(profile.current.instance)}</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
						},
						$$slots: {
							prefix: true,
							suffix: true,
							default: true
						}
					});
				}
			}
			Menu($$renderer, {
				placement: "bottom",
				target,
				children: ($$renderer) => {
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(profiles);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let p = each_array[$$index];
						const selected = profile.meta.profile == p.id;
						{
							function prefix($$renderer) {
								Avatar($$renderer, {
									url: p.avatar,
									alt: p.username,
									width: 24
								});
							}
							MenuButton($$renderer, {
								onclick: () => switchTo(p.id),
								class: [selected && "bg-slate-100! dark:bg-zinc-800!", "gap-2!"],
								prefix,
								children: ($$renderer) => {
									$$renderer.push(`<div><div class="font-medium text-sm">${escape_html(p.username)}</div> `);
									if (!LINKED_INSTANCE_URL) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="text-xs text-slate-500 dark:text-zinc-500"><span class="capitalize">${escape_html(p.client?.name ?? DEFAULT_CLIENT_TYPE.name)}</span> • ${escape_html(p.instance)}</div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="flex-1"></div> `);
									if (!p.jwt) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											color: "gray-subtle",
											class: "p-1!",
											children: ($$renderer) => {
												Icon($$renderer, {
													src: QuestionMarkCircle,
													size: "16",
													micro: true
												});
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (selected) {
										$$renderer.push("<!--[0-->");
										Icon($$renderer, {
											src: CheckCircle,
											class: "text-primary-900 dark:text-primary-100",
											size: "16",
											micro: true
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: {
									prefix: true,
									default: true
								}
							});
						}
					}
					$$renderer.push(`<!--]--> `);
					MenuButton($$renderer, {
						href: "/accounts",
						icon: UserGroup,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Accounts`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: {
					target: true,
					default: true
				}
			});
		}
	});
}
//#endregion
//#region src/lib/ui/sidebar/Sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { style = "", class: clazz = "" } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<nav aria-label="Sidebar"${attr_class(clsx(["flex flex-col overflow-auto gap-1", clazz]))}${attr_style(style)}>`);
			ProfileSelection($$renderer, {
				selectable: !(LINKED_INSTANCE_URL && !profile.current.jwt && profile.meta.profiles.length == 1),
				profiles: profile.meta.profiles
			});
			$$renderer.push(`<!----> `);
			EndPlaceholder($$renderer, {
				margin: "sm",
				size: "xs",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Profile`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (profile.current?.jwt) {
				$$renderer.push("<!--[0-->");
				const notifications = profile.inbox.notifications;
				SidebarButton($$renderer, {
					icon: UserCircle,
					href: "/profile",
					label: "Profile"
				});
				$$renderer.push(`<!----> `);
				SidebarButton($$renderer, {
					icon: Inbox,
					href: "/inbox",
					label: "Inbox",
					children: ($$renderer) => {
						if (notifications.inbox > 0) {
							$$renderer.push("<!--[0-->");
							Badge($$renderer, {
								class: "min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto",
								color: "red-subtle",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(notifications.inbox > 99 ? "∞" : notifications.inbox)}`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				SidebarButton($$renderer, {
					icon: Bookmark,
					href: "/saved",
					label: "Saved"
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				SidebarButton($$renderer, {
					href: "/login",
					label: "Log",
					in: true,
					icon: ArrowLeftOnRectangle
				});
				$$renderer.push(`<!----> `);
				SidebarButton($$renderer, {
					href: "/signup",
					label: "Sign",
					up: true,
					icon: Identification
				});
				$$renderer.push(`<!----> `);
				SidebarButton($$renderer, {
					href: "/accounts",
					label: "Accounts",
					icon: UserGroup
				});
				$$renderer.push(`<!---->`);
			}
			$$renderer.push(`<!--]--> `);
			EndPlaceholder($$renderer, {
				margin: "sm",
				size: "xs",
				children: ($$renderer) => {
					$$renderer.push(`<!---->App`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			SidebarButton($$renderer, {
				href: "/settings",
				label: "Settings",
				icon: Cog6Tooth
			});
			$$renderer.push(`<!----> `);
			{
				function target($$renderer, attachment) {
					SidebarButton($$renderer, {
						label: "Color",
						scheme: true,
						icon: theme.colorScheme == "system" ? ComputerDesktop : theme.colorScheme == "light" ? Sun : Moon,
						class: "w-full relative",
						children: ($$renderer) => {
							Option($$renderer, {
								value: "system",
								class: "hidden",
								icon: ComputerDesktop,
								children: ($$renderer) => {
									$$renderer.push(`<!---->System`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "light",
								class: "hidden",
								icon: Sun,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Light`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "dark",
								class: "hidden",
								icon: Moon,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Dark`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Icon($$renderer, {
								micro: true,
								size: "16",
								src: ChevronUpDown,
								class: "ml-auto"
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				}
				Select($$renderer, {
					size: "sm",
					get value() {
						return theme.colorScheme;
					},
					set value($$value) {
						theme.colorScheme = $$value;
						$$settled = false;
					},
					target,
					$$slots: { target: true }
				});
			}
			$$renderer.push(`<!----> `);
			SidebarButton($$renderer, {
				href: "/theme",
				label: "Theme",
				icon: Swatch
			});
			$$renderer.push(`<!----> `);
			if (profile.current?.user) {
				$$renderer.push("<!--[0-->");
				EndPlaceholder($$renderer, {
					margin: "sm",
					size: "xs",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Communities`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <div class="space-y-3">`);
				if (profile.current?.user.moderates.length > 0) {
					$$renderer.push("<!--[0-->");
					{
						function title($$renderer) {
							$$renderer.push(`<span class="px-2 py-1 w-full">`);
							{
								function action($$renderer) {
									$$renderer.push(`<span class="dark:text-white text-black">${escape_html(profile.current.user?.moderates.length)}</span>`);
								}
								EndPlaceholder($$renderer, {
									border: false,
									action,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Moderating`);
									},
									$$slots: {
										action: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----></span>`);
						}
						Expandable($$renderer, {
							class: "px-1.5",
							get open() {
								return settings.expand.moderates;
							},
							set open($$value) {
								settings.expand.moderates = $$value;
								$$settled = false;
							},
							title,
							children: ($$renderer) => {
								ItemList($$renderer, { items: profile.current.user.moderates.map((i) => ({
									id: i.community.id,
									name: i.community.title,
									url: communityLink(i.community),
									avatar: i.community.icon,
									instance: new URL(i.community.actor_id).hostname
								})) });
							},
							$$slots: {
								title: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				{
					function title($$renderer) {
						$$renderer.push(`<span class="px-2 py-1 w-full">`);
						{
							function action($$renderer) {
								$$renderer.push(`<span class="dark:text-white text-black">${escape_html(profile.current.user?.follows.length)}</span>`);
							}
							EndPlaceholder($$renderer, {
								border: false,
								action,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Subscriptions`);
								},
								$$slots: {
									action: true,
									default: true
								}
							});
						}
						$$renderer.push(`<!----></span>`);
					}
					Expandable($$renderer, {
						class: "px-1.5",
						get open() {
							return settings.expand.communities;
						},
						set open($$value) {
							settings.expand.communities = $$value;
							$$settled = false;
						},
						title,
						children: ($$renderer) => {
							ItemList($$renderer, { items: profile.current.user.follows.map((i) => ({
								id: i.community.id,
								name: i.community.title,
								url: communityLink(i.community),
								avatar: i.community.icon,
								instance: new URL(i.community.actor_id).hostname
							})) });
						},
						$$slots: {
							title: true,
							default: true
						}
					});
				}
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex-1 h-full mt-auto"></div> <footer class="flex gap-6 flex-col xl:flex-row text-sm text-slate-600 dark:text-zinc-300 flex-wrap"><div class="flex items-center gap-2">`);
			Logo($$renderer, { width: 16 });
			$$renderer.push(`<!----> <span class="font-medium">${escape_html("2.4.0")}</span></div> `);
			if (public_env.PUBLIC_XYLIGHT_MODE?.toLowerCase() == "true") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a class="text-blue-600 dark:text-blue-400" href="https://github.com/xyphyn/photon">Source</a> <a class="text-blue-600 dark:text-blue-400" href="https://buymeacoffee.com/xylight">Donate</a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></footer></nav>`);
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
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		nProgress.configure({
			minimum: .4,
			trickleSpeed: 200,
			easing: "ease-out",
			speed: 300,
			showSpinner: false
		});
		App.addListener("backButton", () => {
			history.back();
		});
		if (Capacitor.isNativePlatform()) navigator.vibrate = (pattern) => {
			Haptics.vibrate({ duration: (Array.isArray(pattern) ? pattern[0] : pattern) ?? 100 });
			return true;
		};
		head("12qhfyh", $$renderer, ($$renderer) => {
			if (site.data?.site_view) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta name="theme-color"${attr("content", rgbToHex(theme.colorScheme && inDarkColorScheme() ? theme.current.colors.zinc?.[925] ?? getDefaultColors().zinc[925] : theme.current.colors.slate?.[25] ?? getDefaultColors().slate[25]))}/> `);
				if (LINKED_INSTANCE_URL) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<link rel="icon"${attr("href", site.data?.site_view?.site.icon)}/> <meta name="description"${attr("content", site.data?.site_view?.site.description)}/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<meta name="description" content="A sleek client for Lemmy"/>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
		Button($$renderer, {
			class: "fixed -top-16 focus:top-0 left-0 m-4 z-300 transition-all",
			href: "#main",
			icon: Forward,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Skip Navigation`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		{
			function sidebar($$renderer, { style: s, class: c }) {
				Sidebar($$renderer, {
					class: [c, "p-3 sm:p-6 w-full"],
					style: s
				});
			}
			function main($$renderer, { style: s, class: c }) {
				$$renderer.push(`<main${attr_class(`px-3 pt-3 sm:px-6 sm:pt-6 min-w-0 w-full flex flex-col h-full relative ${stringify(c)}`)}${attr_style(s)} id="main">`);
				children?.($$renderer);
				$$renderer.push(`<!----></main>`);
			}
			function navbar($$renderer, { style: s, class: c }) {
				Navbar($$renderer, {
					class: c,
					style: s
				});
			}
			function suffix($$renderer, { class: c }) {
				$$renderer.push(`<!---->`);
				if (page.data.slots?.sidebar?.component) {
					$$renderer.push("<!--[0-->");
					const SvelteComponent = page.data.slots.sidebar.component;
					if (SvelteComponent) {
						$$renderer.push("<!--[-->");
						SvelteComponent($$renderer, spread_props([page.data.slots.sidebar.props, { class: [c, "p-3 sm:p-6"] }]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else if (site.data?.site_view) {
					$$renderer.push("<!--[1-->");
					InstanceCard($$renderer, {
						site: site.data.site_view,
						taglines: site.data.taglines,
						admins: site.data.admins,
						version: site.data.version,
						class: [c, "p-3 sm:p-6"]
					});
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="h-64 w-full grid place-items-center">`);
					Spinner($$renderer, { width: 32 });
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
				$$renderer.push(`<!---->`);
			}
			Shell($$renderer, {
				sidebar,
				main,
				navbar,
				suffix,
				children: ($$renderer) => {
					Moderation($$renderer, {});
					$$renderer.push(`<!----> `);
					ToastContainer($$renderer, {});
					$$renderer.push(`<!----> `);
					ExpandableImage($$renderer, {});
					$$renderer.push(`<!----> `);
					ModalContainer($$renderer, {});
					$$renderer.push(`<!---->`);
				},
				$$slots: {
					sidebar: true,
					main: true,
					navbar: true,
					suffix: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map