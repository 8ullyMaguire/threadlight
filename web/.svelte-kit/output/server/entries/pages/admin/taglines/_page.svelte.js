import "../../../../chunks/internal.js";
import "../../../../chunks/server.js";
import { F as CommonList, R as Header, Zt as Button, f as toast, n as getClient, nn as Trash, o as profile, p as Markdown, tt as errorMessage, un as Plus } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
import { t as MarkdownEditor } from "../../../../chunks/MarkdownEditor.js";
//#region src/routes/admin/taglines/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let taglines = [...data.site?.taglines.map((t) => t.content) ?? []];
		let newTagline = "";
		let saving = false;
		async function save() {
			if (!profile.current?.jwt) return;
			saving = true;
			try {
				await getClient().editSite({ taglines });
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
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (taglines.length > 0) {
				$$renderer.push("<!--[0-->");
				Header($$renderer, {
					pageHeader: true,
					class: "justify-between",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Taglines`);
						Button($$renderer, {
							color: "primary",
							onclick: save,
							loading: saving,
							disabled: saving,
							size: "lg",
							class: "h-max",
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
				{
					function item($$renderer, tagline) {
						$$renderer.push(`<div class="flex">`);
						Markdown($$renderer, {
							source: tagline,
							inline: true
						});
						$$renderer.push(`<!----> <div class="flex gap-2 ml-auto">`);
						Button($$renderer, {
							onclick: () => {
								taglines.splice(taglines.findIndex((i) => i == tagline), 1);
								taglines = taglines;
							},
							size: "square-md",
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Trash,
									mini: true,
									size: "16"
								});
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div></div>`);
					}
					CommonList($$renderer, {
						items: taglines,
						item,
						$$slots: { item: true }
					});
				}
				$$renderer.push(`<!----> <form class="flex flex-col mt-auto gap-2 w-full">`);
				MarkdownEditor($$renderer, {
					images: false,
					get value() {
						return newTagline;
					},
					set value($$value) {
						newTagline = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					size: "lg",
					submit: true,
					icon: Plus,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Add`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="my-auto">`);
				Placeholder($$renderer, {
					icon: Plus,
					title: "No taglines",
					description: "A random tagline will appear on the site card when users visit your server.",
					children: ($$renderer) => {
						$$renderer.push(`<div class="mt-4 max-w-xl w-full flex flex-col gap-2 text-slate-900 dark:text-zinc-50"><form class="flex flex-col gap-2 w-full">`);
						MarkdownEditor($$renderer, {
							placeholder: "Add a tagline",
							images: false,
							get value() {
								return newTagline;
							},
							set value($$value) {
								newTagline = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							size: "lg",
							submit: true,
							icon: Plus,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Add`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></form> `);
						Button($$renderer, {
							onclick: save,
							color: "primary",
							size: "lg",
							class: "w-full",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Save`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
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