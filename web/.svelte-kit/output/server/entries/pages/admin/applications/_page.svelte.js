import { o as escape_html, r as clsx } from "../../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, t as attr_class } from "../../../../chunks/server.js";
import { Bn as Check, Ct as searchParam, F as CommonList, Gt as Label, Ht as Option, M as Pageination, Qt as XMark, R as Header, Rt as Modal, Vt as Select, Xt as ButtonGroup, Zt as Button, ar as page, at as RelativeDate, f as toast, nt as UserLink, o as profile, on as ShieldCheck, qt as Material, t as client, tr as publishedToDate, tt as errorMessage } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
import { t as MarkdownEditor } from "../../../../chunks/MarkdownEditor.js";
import { t as Funnel } from "../../../../chunks/Funnel.js";
import { t as ShieldExclamation } from "../../../../chunks/ShieldExclamation.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ClipboardDocumentCheck.js
var ClipboardDocumentCheck = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M2 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm6.585 1.08a.75.75 0 0 1 .336 1.005l-1.75 3.5a.75.75 0 0 1-1.16.234l-1.75-1.5a.75.75 0 0 1 .977-1.139l1.02.875 1.321-2.64a.75.75 0 0 1 1.006-.336Z",
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
			"d": "M18 5.25a2.25 2.25 0 0 0-2.012-2.238A2.25 2.25 0 0 0 13.75 1h-1.5a2.25 2.25 0 0 0-2.238 2.012c-.875.092-1.6.686-1.884 1.488H11A2.5 2.5 0 0 1 13.5 7v7h2.25A2.25 2.25 0 0 0 18 11.75v-6.5ZM12.25 2.5a.75.75 0 0 0-.75.75v.25h3v-.25a.75.75 0 0 0-.75-.75h-1.5Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Zm6.874 4.166a.75.75 0 1 0-1.248-.832l-2.493 3.739-.853-.853a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.154-.114l3-4.5Z",
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
			"d": "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/feature/moderation/ApplicationDenyModal.svelte
function ApplicationDenyModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, user, denying = void 0, denyReason = "" } = $$props;
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: "Deny application",
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<form class="flex flex-col gap-4">`);
					UserLink($$renderer, {
						avatar: true,
						user
					});
					$$renderer.push(`<!----> `);
					MarkdownEditor($$renderer, {
						label: "Reason",
						rows: 4,
						get value() {
							return denyReason;
						},
						set value($$value) {
							denyReason = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						color: "primary",
						size: "lg",
						submit: true,
						loading,
						disabled: loading,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Deny`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></form>`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			denying,
			denyReason
		});
	});
}
//#endregion
//#region src/routes/admin/applications/Application.svelte
function Application($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { application = void 0 } = $$props;
		let approving = false;
		let denying = false;
		let denyReason = "";
		let reviewing = false;
		async function review(approve) {
			if (!profile.current?.jwt) return;
			let registrationApplicationAnswer = {
				approve,
				id: application.registration_application.id
			};
			if (approve) approving = true;
			else {
				reviewing = true;
				while (reviewing) await new Promise((res) => setTimeout(res, 1e3));
				if (!denying) {
					denyReason = "";
					return;
				}
				if (denyReason != "") registrationApplicationAnswer.deny_reason = denyReason;
			}
			try {
				await client().approveRegistrationApplication(registrationApplicationAnswer);
				toast({
					content: approve ? "Approved that application." : "Denied that application.",
					type: "success"
				});
				application.creator_local_user.accepted_application = approve;
				application.admin = profile.current.user.local_user_view.person;
				application.registration_application.deny_reason = denyReason;
				profile.inbox.notifications.applications -= 1;
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			approving = false;
			denying = false;
			denyReason = "";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (reviewing) {
				$$renderer.push("<!--[0-->");
				ApplicationDenyModal($$renderer, {
					user: application.creator,
					get open() {
						return reviewing;
					},
					set open($$value) {
						reviewing = $$value;
						$$settled = false;
					},
					get denying() {
						return denying;
					},
					set denying($$value) {
						denying = $$value;
						$$settled = false;
					},
					get denyReason() {
						return denyReason;
					},
					set denyReason($$value) {
						denyReason = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex flex-col gap-2"><div class="flex flex-col gap-2"><span class="text-slate-600 dark:text-zinc-400 text-xs">`);
			RelativeDate($$renderer, { date: publishedToDate(application.registration_application.published) });
			$$renderer.push(`<!----></span> <span class="text-sm">`);
			UserLink($$renderer, {
				user: application.creator,
				avatar: true,
				avatarSize: 20
			});
			$$renderer.push(`<!----></span></div> <div>`);
			Material($$renderer, {
				color: "uniform",
				rounding: "xl",
				padding: "none",
				class: "dark:bg-zinc-925 p-3 py-2",
				children: ($$renderer) => {
					$$renderer.push(`<p>${escape_html(application.registration_application.answer)}</p>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <div class="flex flex-row gap-1"><div class="flex flex-col md:flex-row gap-2 md:items-center">`);
			if (application.admin) {
				$$renderer.push("<!--[0-->");
				const accepted = application.creator_local_user.accepted_application;
				if (typeof application.registration_application.deny_reason !== "undefined" && application.registration_application.deny_reason !== "") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div><div class="flex items-center gap-1 text-sm">`);
					Icon($$renderer, {
						src: accepted ? ShieldCheck : ShieldExclamation,
						mini: true,
						size: "20",
						class: accepted ? "text-green-400" : "text-red-400"
					});
					$$renderer.push(`<!----> `);
					UserLink($$renderer, {
						avatar: true,
						user: application.admin
					});
					$$renderer.push(`<!----> `);
					Label($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(accepted ? "Approved" : "Denied")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Label($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->:`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> <p>${escape_html(application.registration_application.deny_reason)}</p></div> <div class="md:ml-auto"></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex items-center gap-1 text-sm">`);
					Icon($$renderer, {
						src: accepted ? ShieldCheck : ShieldExclamation,
						mini: true,
						size: "20",
						class: accepted ? "text-green-400" : "text-red-400"
					});
					$$renderer.push(`<!----> `);
					UserLink($$renderer, {
						avatar: true,
						user: application.admin
					});
					$$renderer.push(`<!----> `);
					Label($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(accepted ? "Approved" : "Denied")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> <div class="md:ml-auto"></div>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex-1"></div> `);
			ButtonGroup($$renderer, {
				orientation: "horizontal",
				class: "flex",
				children: ($$renderer) => {
					Button($$renderer, {
						size: "square-md",
						class: `hover:bg-slate-200 ${application.creator_local_user.accepted_application === false && application.admin ? "text-red-500!" : ""}`,
						"aria-label": "Deny",
						onclick: () => review(false),
						loading: denying || reviewing,
						disabled: approving || denying || reviewing,
						icon: XMark
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						size: "square-md",
						class: `hover:bg-slate-200 ${application.creator_local_user.accepted_application ? "text-green-500!" : ""}`,
						title: "Approve",
						onclick: () => review(true),
						loading: approving,
						disabled: approving || denying || reviewing,
						icon: Check
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { application });
	});
}
//#endregion
//#region src/routes/admin/applications/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Header($$renderer, {
				pageHeader: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Applications`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <form action="/admin/applications" class="w-max">`);
			{
				function customLabel($$renderer) {
					$$renderer.push(`<span class="flex items-center gap-1">`);
					Icon($$renderer, {
						src: Funnel,
						size: "15",
						mini: true
					});
					$$renderer.push(`<!----> Filter</span>`);
				}
				Select($$renderer, {
					onchange: async () => {
						searchParam(page.url, "type", data.type.value, "page");
					},
					get value() {
						return data.type.value;
					},
					set value($$value) {
						data.type.value = $$value;
						$$settled = false;
					},
					customLabel,
					children: ($$renderer) => {
						Option($$renderer, {
							value: "all",
							children: ($$renderer) => {
								$$renderer.push(`<!---->All`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "unread",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Unread`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						customLabel: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----></form> `);
			if (data.applications?.value && data.applications?.value.length > 0) {
				$$renderer.push("<!--[0-->");
				CommonList($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(data.applications?.value);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let application = each_array[$$index];
							$$renderer.push(`<li${attr_class(clsx(application.creator_local_user.accepted_application ? "material-success" : "material-error"))}>`);
							Application($$renderer, { application });
							$$renderer.push(`<!----></li>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (data.applications?.value.length >= 40) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="mt-auto">`);
					Pageination($$renderer, {
						page: data.page,
						href: (page) => `?page=${page}`
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Placeholder($$renderer, {
					icon: ClipboardDocumentCheck,
					title: "No new applications",
					description: "Applications to join your server will appear here."
				});
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