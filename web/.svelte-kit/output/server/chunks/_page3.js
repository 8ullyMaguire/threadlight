import { o as escape_html } from "./validate.js";
import { c as ensure_array_like, h as stringify, t as attr_class } from "./server.js";
import { s as resolve, t as goto } from "./navigation.js";
import { Jt as TextLoader, R as Header, Zt as Button, ar as page, f as toast, o as profile, qt as Material, t as client, tt as errorMessage, un as Plus, v as LINKED_INSTANCE_URL } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as QuestionMarkCircle } from "./QuestionMarkCircle.js";
import { t as SidebarButton } from "./SidebarButton.js";
import { t as ProfileAvatar } from "./ProfileAvatar.js";
//#region src/lib/feature/user/ProfileButton.svelte
function ProfileButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let switching = false;
		let { prof, guest = false } = $$props;
		{
			function customIcon($$renderer) {
				ProfileAvatar($$renderer, {
					profile: prof,
					selected: profile.current?.id == prof.id
				});
			}
			SidebarButton($$renderer, {
				alignment: "left",
				loading: switching,
				rounding: "lg",
				loaderWidth: 22,
				selected: profile.current?.id == prof.id,
				onclick: async () => {
					switching = true;
					if (profile.current?.id != prof.id) profile.meta.profile = prof.id;
					await goto(page.url, { invalidateAll: true });
					switching = false;
				},
				class: "w-full font-normal",
				customIcon,
				children: ($$renderer) => {
					$$renderer.push(`<span${attr_class(`inline-flex flex-col gap-0 ${profile.current?.id == prof.id ? "font-semibold" : ""}`)}>${escape_html(prof.username ?? prof.user?.local_user_view.person.name)} `);
					if (!guest && !LINKED_INSTANCE_URL) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="text-slate-500 dark:text-zinc-400 font-normal text-xs">${escape_html(prof.instance)}</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></span> `);
					if (!prof.jwt) {
						$$renderer.push("<!--[0-->");
						Icon($$renderer, {
							src: QuestionMarkCircle,
							size: "14",
							micro: true,
							class: "ml-auto opacity-50"
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: {
					customIcon: true,
					default: true
				}
			});
		}
	});
}
//#endregion
//#region src/routes/post/[instance]/[id=integer]/confirm/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { type = "post" } = $$props;
		let _state = "loading";
		let manual = false;
		const fetched = profile.current.instance;
		async function fetchOnHome() {
			const initialManual = manual;
			_state = "loading";
			try {
				const res = await client().resolveObject({ q: `https://${page.params.instance}/${type}/${page.params.id}` });
				if (type == "post" && !res.post || type == "comment" && !res.comment) throw new Error("cant_find_object");
				if (initialManual != manual) return;
				goto(resolve(`/${type}/[instance]/[id=integer]`, {
					instance: profile.current.instance,
					id: type == "post" ? res.post.post.id.toString() : res.comment.comment.id.toString()
				}), { replaceState: true });
				_state = "found";
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
				manual = true;
				_state = "error";
			}
		}
		$$renderer.push(`<div class="w-full h-full flex flex-col justify-center mx-auto max-w-xl gap-6">`);
		if (!manual) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<header class="space-y-1">`);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<div class="grid w-full">`);
					if (_state == "loading") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div style="grid-column: 1; grid-row: 1;">`);
						TextLoader($$renderer, {
							class: "text-3xl!",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Locating content`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					} else if (_state == "found") {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<div style="grid-column: 1; grid-row: 1;">`);
						TextLoader($$renderer, {
							class: "text-3xl!",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Redirecting`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p></p> `);
			Button($$renderer, {
				color: "secondary",
				size: "lg",
				onclick: () => manual = true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Cancel`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></header>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<header class="space-y-1"><div class="font-mono bg-slate-100 dark:bg-zinc-950 rounded-xs p-0.5 px-1 w-max">${escape_html(page.params.instance)}/${escape_html(type)}/${escape_html(page.params.id)}</div> `);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Cross-server content`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <p>\`That content does not originate from $${escape_html(fetched)}.\`</p></header> <div class="flex flex-row items-center gap-2 flex-wrap">`);
			if (profile.current.jwt) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					loading: _state == "loading",
					size: "lg",
					color: "primary",
					onclick: fetchOnHome,
					children: ($$renderer) => {
						$$renderer.push(`<!---->\`Continue on $${escape_html(fetched)}\``);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				size: "lg",
				onclick: () => history.back(),
				children: ($$renderer) => {
					$$renderer.push(`<!---->Go back`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			if (profile.meta.profiles) {
				$$renderer.push("<!--[0-->");
				const filtered = profile.meta.profiles.filter((i) => i.instance == page.params.instance);
				$$renderer.push(`<div class="space-y-1"><div class="font-medium text-sm">\`Switch to an account on $${escape_html(page.params.instance)}\`</div> `);
				Material($$renderer, {
					color: "uniform",
					padding: "sm",
					rounding: "2xl",
					class: "dark:bg-zinc-950 max-h-96 overflow-auto",
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(filtered);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let profile = each_array[$$index];
							ProfileButton($$renderer, { prof: profile });
						}
						$$renderer.push(`<!--]--> `);
						SidebarButton($$renderer, {
							href: `/accounts/login/guest?redirect=${stringify(page.url)}`,
							icon: Plus,
							class: "rounded-lg",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Add guest`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as t };

//# sourceMappingURL=_page3.js.map