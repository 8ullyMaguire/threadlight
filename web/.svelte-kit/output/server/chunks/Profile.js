import { t as public_env } from "./shared-server.js";
import { o as escape_html } from "./validate.js";
import "./server.js";
import { At as settings, Ht as Option, Jn as Bookmark, Kn as BugAnt, Lt as modal, Mt as MenuDivider, Nt as MenuButton, Vt as Select, Yt as Spinner, Zt as Button, in as Sun, l as Badge, o as profile, on as ShieldCheck, r as site } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ArrowLeftOnRectangle } from "./ArrowLeftOnRectangle.js";
import { a as Swatch, i as UserGroup, n as chords, o as Moon, r as InstanceCard } from "./CommandsHost.js";
import { t as Cog6Tooth } from "./Cog6Tooth.js";
import { t as ComputerDesktop } from "./ComputerDesktop.js";
import { t as Identification } from "./Identification.js";
import { t as Inbox } from "./Inbox.js";
import { t as ServerStack } from "./ServerStack.js";
import { t as UserCircle } from "./UserCircle.js";
import { r as theme } from "./theme.svelte.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CodeBracketSquare.js
var CodeBracketSquare = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm4.78 1.97a.75.75 0 0 1 0 1.06L5.81 8l.97.97a.75.75 0 1 1-1.06 1.06l-1.5-1.5a.75.75 0 0 1 0-1.06l1.5-1.5a.75.75 0 0 1 1.06 0Zm2.44 1.06a.75.75 0 0 1 1.06-1.06l1.5 1.5a.75.75 0 0 1 0 1.06l-1.5 1.5a.75.75 0 1 1-1.06-1.06l.97-.97-.97-.97Z",
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
			"d": "M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z",
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
			"d": "M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CommandLine.js
var CommandLine = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2.22 1.97a.75.75 0 0 0 0 1.06l.97.97-.97.97a.75.75 0 1 0 1.06 1.06l1.5-1.5a.75.75 0 0 0 0-1.06l-1.5-1.5a.75.75 0 0 0-1.06 0ZM8.75 8.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z",
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
			"d": "M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25Zm.943 8.752a.75.75 0 0 1 .055-1.06L6.128 9l-1.88-1.693a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 0 1-1.06-.055ZM9.75 10.25a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z",
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
			"d": "m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/ui/navbar/Profile.svelte
function siteSnippet($$renderer) {
	if (site.data) {
		$$renderer.push("<!--[0-->");
		InstanceCard($$renderer, {
			site: site.data.site_view,
			admins: site.data.admins,
			taglines: site.data.taglines,
			version: site.data.version
		});
	} else {
		$$renderer.push("<!--[-1-->");
		Spinner($$renderer, {});
	}
	$$renderer.push(`<!--]-->`);
}
function notifBadge($$renderer, number) {
	if (number > 0) {
		$$renderer.push("<!--[0-->");
		Badge($$renderer, {
			color: "red-subtle",
			class: "min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto",
			children: ($$renderer) => {
				$$renderer.push(`<!---->${escape_html(number > 99 ? "∞" : number)}`);
			},
			$$slots: { default: true }
		});
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
function key($$renderer, label) {
	$$renderer.push(`<span class="text-[12px] rounded-md border border-slate-300 dark:border-zinc-700 border-b-2 px-2 py-0.5">${escape_html(label)}</span>`);
}
function Profile($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (profile.current?.jwt) {
				$$renderer.push("<!--[0-->");
				const notifications = profile.inbox.notifications;
				MenuButton($$renderer, {
					href: "/inbox",
					icon: Inbox,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Inbox `);
						if (notifications.inbox > 0) {
							$$renderer.push("<!--[0-->");
							Badge($$renderer, {
								color: "red-subtle",
								class: "text-xs ml-auto font-bold py-0.5!",
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
				if (profile.isMod()) {
					$$renderer.push("<!--[0-->");
					{
						function suffix($$renderer) {
							notifBadge($$renderer, notifications.reports);
						}
						MenuButton($$renderer, {
							href: "/moderation",
							icon: ShieldCheck,
							suffix,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Reports`);
							},
							$$slots: {
								suffix: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profile.isAdmin) {
					$$renderer.push("<!--[0-->");
					{
						function suffix($$renderer) {
							notifBadge($$renderer, notifications.applications);
						}
						MenuButton($$renderer, {
							href: "/admin/applications",
							icon: ServerStack,
							suffix,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Applications`);
							},
							$$slots: {
								suffix: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				MenuDivider($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->Profile`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				MenuButton($$renderer, {
					href: "/profile",
					icon: UserCircle,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Profile`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				MenuButton($$renderer, {
					href: "/saved",
					icon: Bookmark,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Saved`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				MenuButton($$renderer, {
					href: "/accounts/login",
					icon: ArrowLeftOnRectangle,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Log in`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				MenuButton($$renderer, {
					href: "/signup",
					icon: Identification,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Sign up`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
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
			$$renderer.push(`<!----> `);
			MenuDivider($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->App`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			MenuButton($$renderer, {
				href: "/settings",
				icon: Cog6Tooth,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Settings`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function target($$renderer, attachment) {
					MenuButton($$renderer, {
						icon: theme.colorScheme == "system" ? ComputerDesktop : theme.colorScheme == "light" ? Sun : Moon,
						class: " w-full",
						nest: true,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Color scheme`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
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
					$$renderer.push(`<!---->`);
				}
				Select($$renderer, {
					size: "sm",
					placement: "bottom",
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
			MenuButton($$renderer, {
				href: "/theme",
				icon: Swatch,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Theme`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			MenuButton($$renderer, {
				onclick: () => chords.commands = !chords.commands,
				icon: CommandLine,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Command palette <div class="text-slate-600 dark:text-zinc-400 text-xs ml-auto max-sm:hidden">`);
					key($$renderer, "Ctrl");
					$$renderer.push(`<!----> `);
					key($$renderer, "K");
					$$renderer.push(`<!----></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (settings.debugInfo) {
				$$renderer.push("<!--[0-->");
				MenuButton($$renderer, {
					href: "/util",
					icon: BugAnt,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Debug`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <li class="flex flex-col px-2 py-1 mx-auto my-1 text-xs w-full"><div class="flex flex-row gap-2 w-full items-center"><div class="flex-1"><button class="hover:brightness-110 transition-all">`);
			Badge($$renderer, {
				color: "blue-subtle",
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html("2.4.0")}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></button></div> `);
			Button($$renderer, {
				onclick: () => {
					modal({
						title: "Server info",
						snippet: siteSnippet,
						body: ""
					});
				},
				color: "tertiary",
				title: "Server info",
				size: "square-md",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: ServerStack,
						size: "16",
						micro: true
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (public_env.PUBLIC_XYLIGHT_MODE?.toLowerCase() == "true") {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					color: "tertiary",
					href: "https://github.com/Xyphyn/Photon",
					title: "Source",
					size: "square-md",
					children: ($$renderer) => {
						Icon($$renderer, {
							src: CodeBracketSquare,
							size: "16",
							micro: true
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></li>`);
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
export { Profile as default };

//# sourceMappingURL=Profile.js.map