import { o as escape_html } from "./validate.js";
import { a as bind_props } from "./server.js";
import { Bt as Switch, l as Badge } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ComputerDesktop } from "./ComputerDesktop.js";
import { n as DevicePhoneMobile, t as DeviceTablet } from "./DeviceTablet.js";
//#region src/routes/settings/ToggleSetting.svelte
function ToggleSetting($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title, description = void 0, checked = false, beta = false, supportedPlatforms = {
			desktop: true,
			tablet: true,
			mobile: true
		}, icon } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<li class="flex flex-col w-full justify-between gap-x-2 max-w-full setting @container/setting">`);
			if (Object.values(supportedPlatforms).some((v) => v == false) || beta) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 flex-wrap">`);
				if (beta) {
					$$renderer.push("<!--[0-->");
					Badge($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Beta`);
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (Object.values(supportedPlatforms).some((v) => v == false)) {
					$$renderer.push("<!--[0-->");
					if (supportedPlatforms.desktop) {
						$$renderer.push("<!--[0-->");
						{
							function icon($$renderer) {
								Icon($$renderer, {
									src: ComputerDesktop,
									micro: true,
									size: "14"
								});
							}
							Badge($$renderer, {
								icon,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Desktop`);
								},
								$$slots: {
									icon: true,
									default: true
								}
							});
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (supportedPlatforms.tablet) {
						$$renderer.push("<!--[0-->");
						{
							function icon($$renderer) {
								Icon($$renderer, {
									src: DeviceTablet,
									micro: true,
									size: "14"
								});
							}
							Badge($$renderer, {
								icon,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Tablet`);
								},
								$$slots: {
									icon: true,
									default: true
								}
							});
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (supportedPlatforms.mobile) {
						$$renderer.push("<!--[0-->");
						{
							function icon($$renderer) {
								Icon($$renderer, {
									src: DevicePhoneMobile,
									micro: true,
									size: "14"
								});
							}
							Badge($$renderer, {
								icon,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Mobile`);
								},
								$$slots: {
									icon: true,
									default: true
								}
							});
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex @md/setting:flex-row gap-2">`);
			if (icon) {
				$$renderer.push("<!--[0-->");
				Icon($$renderer, {
					src: icon,
					size: "32",
					mini: true,
					class: "bg-red-200/20 dark:bg-red-600/20 p-1.5 self-center\n         rounded-lg color text-red-300 dark:text-red-300"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Switch($$renderer, {
				class: "flex-row-reverse items-center w-full",
				labelClass: "flex-1 mr-auto",
				get checked() {
					return checked;
				},
				set checked($$value) {
					checked = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<h1 class="font-medium text-base">${escape_html(title)}</h1> `);
					if (description) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-slate-600 dark:text-zinc-400 text-sm">${escape_html(description)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></li>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { checked });
	});
}
//#endregion
export { ToggleSetting as t };

//# sourceMappingURL=ToggleSetting.js.map