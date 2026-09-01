import "../../../../chunks/internal.js";
import { o as escape_html } from "../../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, l as head, t as attr_class } from "../../../../chunks/server.js";
import { Bn as Check, Dn as ExclamationTriangle, Kt as FileInput, Qt as XMark, R as Header, Ut as TextInput, Zt as Button, at as RelativeDate, f as toast, jt as Popover, o as profile, qt as Material, t as client, tr as publishedToDate, tt as errorMessage, un as Plus } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
//#region src/routes/admin/federation/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		let blockInstance = {
			instance: "",
			loading: false
		};
		let allowInstance = {
			instance: "",
			loading: false
		};
		let saving = false;
		async function save() {
			try {
				if (!profile.current?.jwt || !data.instances.value?.blocked) return;
				saving = true;
				const blockedInstances = data.instances.value.blocked.map((i) => i.domain);
				const allowedInstances = data.instances.value.allowed?.map((i) => i.domain);
				await client().editSite({
					allowed_instances: allowedInstances,
					blocked_instances: blockedInstances
				});
				toast({
					content: "Updated your site.",
					type: "success"
				});
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			saving = false;
		}
		let csv = void 0;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("3si1cu", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Federation</title>`);
				});
			});
			Header($$renderer, {
				pageHeader: true,
				class: "font-bold text-2xl flex items-center justify-between",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Federation `);
					Button($$renderer, {
						color: "primary",
						onclick: save,
						loading: saving,
						disabled: saving,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Save`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (data.site && data.instances.value?.blocked) {
				$$renderer.push("<!--[0-->");
				{
					function button($$renderer) {
						Button($$renderer, {
							class: "w-max",
							icon: Plus,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Upload CSV`);
							},
							$$slots: { default: true }
						});
					}
					function choose($$renderer) {}
					FileInput($$renderer, {
						preview: false,
						get files() {
							return csv;
						},
						set files($$value) {
							csv = $$value;
							$$settled = false;
						},
						button,
						choose,
						$$slots: {
							button: true,
							choose: true
						}
					});
				}
				$$renderer.push(`<!----> <div class="flex flex-col md:flex-row gap-4"><div class="flex-1 w-full max-h-168 h-full flex flex-col gap-2"><h2 class="font-bold text-lg">Blocked servers</h2> <form class="flex flex-row gap-2">`);
				TextInput($$renderer, {
					placeholder: "Block a server...",
					class: "flex-1",
					get value() {
						return blockInstance.instance;
					},
					set value($$value) {
						blockInstance.instance = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					submit: true,
					loading: blockInstance.loading,
					disabled: blockInstance.loading,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Block`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form> `);
				Material($$renderer, {
					class: "h-full overflow-auto",
					color: "uniform",
					rounding: "2xl",
					children: ($$renderer) => {
						$$renderer.push(`<ul${attr_class(`*:py-3 dark:divide-zinc-800! ${allowInstance.instance != "" ? "opacity-50" : ""}`)}>`);
						if (data.instances.value.blocked.length > 0) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<!--[-->`);
							const each_array = ensure_array_like(data.instances.value.blocked.toSorted((b, a) => b.domain.localeCompare(a.domain)));
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let instance = each_array[$$index];
								$$renderer.push(`<div class="flex justify-between items-center first:pt-0 last:pb-0"><div class="flex flex-col"><span class="font-medium">${escape_html(instance.domain)}</span> <span class="text-xs text-slate-600 dark:text-zinc-400 capitalize">${escape_html(instance.software ?? "Unknown")} • `);
								RelativeDate($$renderer, { date: publishedToDate(instance.published) });
								$$renderer.push(`<!----></span></div> `);
								Button($$renderer, {
									size: "square-md",
									onclick: () => {
										if (!data.instances.value?.blocked) return;
										data.instances.value.blocked = data.instances.value?.blocked.filter((i) => i.id != instance.id);
									},
									icon: XMark
								});
								$$renderer.push(`<!----></div>`);
							}
							$$renderer.push(`<!--]-->`);
						} else {
							$$renderer.push("<!--[-1-->");
							Placeholder($$renderer, {
								icon: Check,
								title: "No blocked servers",
								description: "Blocking an server will hide new submissions from that server."
							});
						}
						$$renderer.push(`<!--]--></ul>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="md:flex-1 w-full max-h-168 flex flex-col gap-2"><h2 class="font-bold text-lg flex items-center space-x-1"><span>Whitelisted servers</span> `);
				if (allowInstance.instance || !(data.instances.value.allowed?.length == 0)) {
					$$renderer.push("<!--[0-->");
					{
						function target($$renderer, attachment) {
							Icon($$renderer, {
								src: ExclamationTriangle,
								solid: true,
								class: "text-yellow-500",
								size: "20"
							});
						}
						Popover($$renderer, {
							openOnHover: true,
							placement: "bottom-end",
							target,
							children: ($$renderer) => {
								$$renderer.push(`<p class="font-normal">Whitelisting an server will block every other server.</p>`);
							},
							$$slots: {
								target: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></h2> <form class="flex flex-row gap-2">`);
				TextInput($$renderer, {
					placeholder: "Whitelist a server",
					class: "flex-1",
					get value() {
						return allowInstance.instance;
					},
					set value($$value) {
						allowInstance.instance = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					submit: true,
					loading: allowInstance.loading,
					disabled: allowInstance.loading,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Whitelist`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form> `);
				Material($$renderer, {
					class: "h-full overflow-auto",
					color: "uniform",
					rounding: "2xl",
					children: ($$renderer) => {
						$$renderer.push(`<ul class="*:py-3 dark:divide-zinc-800!">`);
						if (data.instances.value.allowed && (data?.instances?.value?.allowed?.length ?? 0) > 0) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<!--[-->`);
							const each_array_1 = ensure_array_like(data.instances.value.allowed.toSorted((b, a) => b.domain.localeCompare(a.domain)));
							for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
								let instance = each_array_1[$$index_1];
								$$renderer.push(`<div class="flex justify-between items-center first:pt-0 last:pb-0"><div class="flex flex-col"><span class="font-medium">${escape_html(instance.domain)}</span> <span class="text-xs text-slate-600 dark:text-zinc-400 capitalize">${escape_html(instance.software ?? "Unknown")} • `);
								RelativeDate($$renderer, { date: publishedToDate(instance.published) });
								$$renderer.push(`<!----></span></div> `);
								Button($$renderer, {
									size: "square-md",
									onclick: () => {
										if (!data.instances.value?.allowed) return;
										data.instances.value.allowed = data.instances.value?.allowed.filter((i) => i.id != instance.id);
									},
									icon: XMark
								});
								$$renderer.push(`<!----></div>`);
							}
							$$renderer.push(`<!--]-->`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<div class="my-auto h-max">`);
							Placeholder($$renderer, {
								icon: Check,
								title: "No whitelisted servers",
								description: "Whitelisting an server will block every other server."
							});
							$$renderer.push(`<!----></div>`);
						}
						$$renderer.push(`<!--]--></ul>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map