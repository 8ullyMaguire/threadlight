import { n as attr, o as escape_html, r as clsx } from "../../../chunks/validate.js";
import { c as ensure_array_like, l as head, t as attr_class } from "../../../chunks/server.js";
import { At as settings, F as CommonList, Kn as BugAnt, Ln as ChevronDown, Nt as MenuButton, On as EllipsisHorizontal, Pn as ChevronUp, Pt as Menu, R as Header, Rt as Modal, Zt as Button, _ as DEFAULT_INSTANCE_URL, l as Badge, o as profile, rr as DEFAULT_CLIENT_TYPE, un as Plus, v as LINKED_INSTANCE_URL } from "../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../chunks/Placeholder.js";
import { t as ArrowLeftOnRectangle } from "../../../chunks/ArrowLeftOnRectangle.js";
import { t as Identification } from "../../../chunks/Identification.js";
import { t as QuestionMarkCircle } from "../../../chunks/QuestionMarkCircle.js";
import { t as ProfileAvatar } from "../../../chunks/ProfileAvatar.js";
import { t as DebugObject } from "../../../chunks/DebugObject.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowRightOnRectangle.js
var ArrowRightOnRectangle = {
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z",
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
			"d": "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/accounts/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let debugging = false;
		let debugProfile = void 0;
		let removing = {
			shown: false,
			account: void 0
		};
		let radioSelected = profile.current.id;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("11yx1mx", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Accounts</title>`);
				});
			});
			if (debugging) {
				$$renderer.push("<!--[0-->");
				{
					function title($$renderer) {
						$$renderer.push(`<span class="flex flex-col"><h1 class="font-bold text-2xl">Debug</h1> <span class="text-slate-600 dark:text-zinc-400 text-base font-normal">Do NOT share anything from this menu.</span></span>`);
					}
					DebugObject($$renderer, {
						object: debugProfile?.id == profile.current?.id ? profile.current : debugProfile,
						get open() {
							return debugging;
						},
						set open($$value) {
							debugging = $$value;
							$$settled = false;
						},
						title,
						$$slots: { title: true }
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (removing.shown && removing.account) {
				$$renderer.push("<!--[0-->");
				{
					function customTitle($$renderer) {
						$$renderer.push(`<span>Log out</span>`);
					}
					Modal($$renderer, {
						get open() {
							return removing.shown;
						},
						set open($$value) {
							removing.shown = $$value;
							$$settled = false;
						},
						customTitle,
						children: ($$renderer) => {
							$$renderer.push(`<div class="flex flex-row items-center gap-2">`);
							ProfileAvatar($$renderer, {
								profile: removing.account,
								selected: true
							});
							$$renderer.push(`<!----> <div class="flex flex-col"><span class="font-bold">${escape_html(removing.account.username)}</span> <span class="text-sm text-slate-600 dark:text-zinc-400">${escape_html(removing.account.instance)}</span></div></div> <div class="flex flex-row gap-2 items-center">`);
							Button($$renderer, {
								size: "lg",
								class: "flex-1",
								onclick: () => removing.shown = false,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Cancel`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								onclick: () => {
									removing.shown = false;
									if (removing.account) profile.remove(removing.account.id);
								},
								size: "lg",
								class: "flex-1",
								color: "danger",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Remove`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: {
							customTitle: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function extended($$renderer) {
					$$renderer.push(`<div class="flex gap-2 items-center flex-wrap">`);
					Button($$renderer, {
						href: "/accounts/login",
						color: "primary",
						size: "lg",
						rounding: "2xl",
						icon: ArrowLeftOnRectangle,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Log in`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						href: "/signup",
						size: "lg",
						rounding: "2xl",
						icon: Identification,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Sign up`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (!LINKED_INSTANCE_URL) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							href: "/accounts/login/guest",
							size: "lg",
							rounding: "2xl",
							icon: Plus,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Add guest`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Accounts`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			if (profile.meta.profiles.length == 1 && !profile.current.jwt && profile.current.instance == DEFAULT_INSTANCE_URL) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					icon: Identification,
					title: "Not logged in",
					description: LINKED_INSTANCE_URL ? "You aren't logged in. You can sign up or log in here." : "You aren't logged in. You can log in, sign up, or add a new guest account here.",
					class: "my-auto"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<form class="accounts-grid gap-4 svelte-11yx1mx">`);
				CommonList($$renderer, {
					animate: false,
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(profile.meta.profiles);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let p = each_array[$$index];
							$$renderer.push(`<li${attr_class(clsx(["xs px-4 py-1", p.id == profile.meta.profile && "selected"]))}><label class="relative block"><input type="radio"${attr("id", p.id.toString())} name="profile"${attr("value", p.id)} class="hidden peer"${attr("checked", radioSelected === p.id, true)}/> <div${attr_class(clsx(["flex flex-row items-center gap-2 transition-all duration-75", "cursor-pointer relative ring-transparent"]))}><div class="absolute -inset-2 -inset-x-3 sm:-inset-y-3 sm:-inset-x-4 group-first/li:rounded-t-2xl group-last/li:rounded-b-2xl rounded-md ring-2 ring-inherit"></div> `);
							ProfileAvatar($$renderer, {
								profile: p,
								selected: profile?.current.id == p.id,
								size: 24
							});
							$$renderer.push(`<!----> <div class="flex flex-col overflow-hidden"><span class="break-words font-medium text-base">${escape_html(p.username)} `);
							if (!p.jwt) {
								$$renderer.push("<!--[0-->");
								Badge($$renderer, {
									class: "inline-grid w-6 h-6 p-0! place-items-center",
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
							$$renderer.push(`<!--]--></span> `);
							if (!LINKED_INSTANCE_URL) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="text-xs text-slate-600 dark:text-zinc-400"><span class="capitalize">${escape_html(p.client?.name ?? DEFAULT_CLIENT_TYPE.name)}</span> • ${escape_html(p.instance)}</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> `);
							{
								function target($$renderer, attachment) {
									Button($$renderer, {
										size: "square-md",
										color: "tertiary",
										class: "justify-self-end ml-auto z-50",
										"aria-label": "More actions",
										icon: EllipsisHorizontal
									});
								}
								Menu($$renderer, {
									placement: "bottom-end",
									target,
									children: ($$renderer) => {
										$$renderer.push(`<div class="px-4 py-2 flex items-center gap-2">`);
										Button($$renderer, {
											size: "square-md",
											color: "secondary",
											title: "Move up",
											onclick: () => profile.move(p.id, true),
											icon: ChevronUp
										});
										$$renderer.push(`<!----> `);
										Button($$renderer, {
											size: "square-md",
											color: "secondary",
											title: "Move down",
											onclick: () => profile.move(p.id, false),
											icon: ChevronDown
										});
										$$renderer.push(`<!----></div> `);
										if (settings.debugInfo) {
											$$renderer.push("<!--[0-->");
											MenuButton($$renderer, {
												onclick: () => {
													debugProfile = p;
													debugging = !debugging;
												},
												icon: BugAnt,
												children: ($$renderer) => {
													$$renderer.push(`<!---->Debug`);
												},
												$$slots: { default: true }
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (!LINKED_INSTANCE_URL || p.user) {
											$$renderer.push("<!--[0-->");
											MenuButton($$renderer, {
												onclick: () => {
													removing.account = p;
													removing.shown = !removing.shown;
												},
												color: "danger-subtle",
												icon: ArrowRightOnRectangle,
												children: ($$renderer) => {
													$$renderer.push(`<!---->Log out`);
												},
												$$slots: { default: true }
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]-->`);
									},
									$$slots: {
										target: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----></div></label></li>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form>`);
			}
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