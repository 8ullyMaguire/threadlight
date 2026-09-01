import { n as attr, o as escape_html, r as clsx } from "../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, l as head, n as attr_style, o as derived, t as attr_class } from "../../../chunks/server.js";
import { It as action, Lt as modal, R as Header, Rt as Modal, Wt as TextArea, Zt as Button, c as Note, er as ArrowDownTray, f as toast, nn as Trash, qt as Material, un as Plus, zn as CheckCircle } from "../../../chunks/client.svelte.js";
import { n as Icon } from "../../../chunks/Placeholder.js";
import { t as ArrowPath } from "../../../chunks/ArrowPath.js";
import { t as ArrowUpTray } from "../../../chunks/ArrowUpTray.js";
import { i as getDefaultColors, r as theme } from "../../../chunks/theme.svelte.js";
import { t as FreeTextInput } from "../../../chunks/FreeTextInput.js";
//#region src/routes/theme/ColorSwatch.svelte
function ColorSwatch($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, oncontextmenu, onchange, class: clazz = "" } = $$props;
		$$renderer.push(`<div${attr_class(`w-full h-8 relative rounded-md border dark:border-zinc-600 dark:hover:border-zinc-400 transition-colors ${stringify(clazz)}`)}${attr_style(`background-color: rgb(${stringify(value)});`)}><input class="rounded-md border cursor-pointer absolute top-0 left-0 w-full h-full opacity-0" type="color"${attr("value", value)}/></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/routes/theme/ThemePreset.svelte
function ThemePreset($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { theme: theme$1 = void 0 } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<button class="h-full">`);
			Material($$renderer, {
				padding: "none",
				rounding: "none",
				color: "default",
				class: ["rounded-2xl flex relative cursor-pointer h-full flex-col text-left p-0.5"],
				children: ($$renderer) => {
					$$renderer.push(`<div${attr_class(clsx(["h-20 w-full rounded-xl flex flex-row flex-wrap p-3 gap-2"]))}${attr_style(`background-color: rgb(${stringify(theme$1.colors["zinc"][900])}); color: rgb(${stringify(theme$1.colors["zinc"][50])});`)}><div${attr_style(`color: rgb(${stringify(theme$1.colors["zinc"][50])})`)} class="text-xs">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div> <div class="w-3 h-3 rounded-full ml-auto"${attr_style(`background-color: rgb(${stringify(theme$1.colors["primary"][100])})`)}></div></div> `);
					if (theme$1.id == theme.data.currentTheme) {
						$$renderer.push("<!--[0-->");
						Icon($$renderer, {
							src: CheckCircle,
							size: "20",
							solid: true,
							class: "absolute top-0 right-0 m-2 text-primary-100"
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="px-4 py-2 flex items-center gap-1 justify-between">`);
					FreeTextInput($$renderer, {
						disabled: theme$1.id <= 0,
						class: ["text-left font-medium text-lg font-display disabled:pointer-events-none"],
						get value() {
							return theme$1.name;
						},
						set value($$value) {
							theme$1.name = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(theme$1.name)}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (theme$1.id > 0) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							color: "ghost",
							size: "square-md",
							class: "shrink-0",
							rounding: "xl",
							onclick: () => {
								modal({
									actions: [action({
										close: true,
										type: "secondary",
										content: "Cancel"
									}), action({
										close: true,
										content: "Confirm",
										type: "danger",
										action: () => {
											const index = theme.data.themes.map((t) => t.id).indexOf(theme$1.id);
											theme.data.themes = theme.data.themes.toSpliced(index, 1);
											if (theme$1.id == theme.data.currentTheme) theme.data.currentTheme = 0;
										}
									})],
									type: "error",
									body: "",
									title: "Delete theme"
								});
							},
							icon: Trash
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></button>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { theme: theme$1 });
	});
}
//#endregion
//#region src/routes/theme/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let importing = false;
		let importText = "";
		let defaultColors = derived(getDefaultColors);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1y3nc6e", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Theme</title>`);
				});
			});
			if (importing) {
				$$renderer.push("<!--[0-->");
				Modal($$renderer, {
					onaction: () => {
						try {
							if (importText == "") throw new Error("import failed");
							theme.data.themes.push({
								colors: JSON.parse(importText),
								id: Math.max(...theme.data.themes.map((i) => i.id)) + 1,
								name: "Imported theme"
							});
							toast({
								content: "Success",
								type: "success"
							});
							importing = false;
						} catch (err) {
							toast({
								content: err,
								type: "error"
							});
						}
					},
					title: "Import",
					action: "Import",
					get open() {
						return importing;
					},
					set open($$value) {
						importing = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						TextArea($$renderer, {
							style: "font-family: monospace;",
							get value() {
								return importText;
							},
							set value($$value) {
								importText = $$value;
								$$settled = false;
							}
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function extended($$renderer) {
					$$renderer.push(`<div class="flex items-center gap-2">`);
					Button($$renderer, {
						onclick: () => {
							importing = !importing;
						},
						size: "lg",
						icon: ArrowDownTray,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Import`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => {
							navigator.clipboard.writeText(JSON.stringify(theme.current.colors));
							toast({ content: "Copied theme preset to clipboard." });
						},
						size: "lg",
						icon: ArrowUpTray,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Export`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						disabled: theme.current.id <= 0,
						onclick: () => {
							modal({
								actions: [action({
									content: "Cancel",
									close: true
								}), action({
									action: () => {
										theme.current.colors = {
											other: {},
											primary: {},
											zinc: {},
											slate: {}
										};
									},
									content: "Reset",
									close: true,
									type: "danger"
								})],
								title: "Reset theme",
								body: "This will reset all of your colors to the default. It is recommended to export your theme before this."
							});
						},
						size: "lg",
						icon: ArrowPath,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Reset`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Theme`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> <div class="flex flex-col gap-4 h-full"><h3 class="relative -mb-7 z-10 left-6 font-medium text-sm bg-slate-25 dark:bg-zinc-925 w-max px-1">Presets</h3> `);
			Material($$renderer, {
				color: "uniform",
				rounding: "2xl",
				class: "overflow-auto max-h-96 relative @container",
				children: ($$renderer) => {
					$$renderer.push(`<div class="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 gap-2"><!--[-->`);
					const each_array = ensure_array_like(theme.data.themes);
					for (let index = 0, $$length = each_array.length; index < $$length; index++) {
						each_array[index];
						ThemePreset($$renderer, {
							get theme() {
								return theme.data.themes[index];
							},
							set theme($$value) {
								theme.data.themes[index] = $$value;
								$$settled = false;
							}
						});
					}
					$$renderer.push(`<!--]--> <button>`);
					Button($$renderer, {
						rounding: "xl",
						size: "square-xl",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Plus,
								size: "28"
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></button></div>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (theme.current.id <= 0) {
				$$renderer.push("<!--[0-->");
				Note($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->This is a default theme, and cannot be modified.`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div${attr_class("relative", void 0, {
				"opacity-50": theme.current.id <= 0,
				"pointer-events-none": theme.current.id <= 0
			})}>`);
			Material($$renderer, {
				color: "uniform",
				class: "items-center gap-x-4 color-grid gap-y-2",
				rounding: "2xl",
				children: ($$renderer) => {
					Header($$renderer, {
						size: "sm",
						style: "grid-column: span 2 / span 2;",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Accent`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					ColorSwatch($$renderer, {
						value: theme.current.colors.primary?.[900],
						onchange: (e) => {
							theme.current.colors.primary[900] = e;
						},
						oncontextmenu: (e) => {
							e.preventDefault();
							theme.current.colors.primary[900] = defaultColors().primary[900];
							return true;
						},
						class: "w-12! h-12! col-span-1"
					});
					$$renderer.push(`<!----> `);
					ColorSwatch($$renderer, {
						value: theme.current.colors.primary?.[100],
						onchange: (e) => {
							theme.current.colors.primary[100] = e;
						},
						oncontextmenu: (e) => {
							e.preventDefault();
							theme.current.colors.primary[100] = defaultColors().primary[100];
							return true;
						},
						class: "w-12! h-12! col-span-1"
					});
					$$renderer.push(`<!----> <span class="font-medium text-sm -mt-2">Light</span> <span class="font-medium text-sm -mt-2">Dark</span>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"><!--[-->`);
			const each_array_1 = ensure_array_like(Object.entries(defaultColors()));
			for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
				let [category, value] = each_array_1[$$index_2];
				Material($$renderer, {
					rounding: "2xl",
					color: "uniform",
					class: "flex flex-col gap-2",
					children: ($$renderer) => {
						Header($$renderer, {
							class: "capitalize",
							size: "sm",
							style: "grid-column: span 2 / span 2;",
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(category)}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <div class="flex flex-row gap-1 flex-wrap items-center space-evenly"><!--[-->`);
						const each_array_2 = ensure_array_like(Object.entries(value));
						for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
							let [shade] = each_array_2[$$index_1];
							$$renderer.push(`<div class="flex flex-col gap-0.5 w-10 group">`);
							ColorSwatch($$renderer, {
								onchange: (e) => {
									theme.current.colors[category][shade] = e;
								},
								oncontextmenu: (e) => {
									e.preventDefault();
									theme.current.colors[category][shade] = defaultColors()[category][shade];
									return true;
								},
								get value() {
									return theme.current.colors[category][shade];
								},
								set value($$value) {
									theme.current.colors[category][shade] = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----> <span class="font-medium -mt-1 capitalize">${escape_html(shade)}</span></div>`);
						}
						$$renderer.push(`<!--]--></div>`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--></div></div></div>`);
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