import { r as clsx } from "./validate.js";
import { t as attr_class } from "./server.js";
import { l as Badge } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ComputerDesktop } from "./ComputerDesktop.js";
import { n as DevicePhoneMobile, t as DeviceTablet } from "./DeviceTablet.js";
//#region src/routes/settings/Setting.svelte
function Setting($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { supportedPlatforms = {
			desktop: true,
			tablet: true,
			mobile: true
		}, mainClass = "", optionClass = "", class: clazz = "", title, description, children, icon, adaptive = true } = $$props;
		$$renderer.push(`<li${attr_class(clsx(["flex flex-col w-full justify-between gap-2 max-w-full @container/setting setting", mainClass]), "svelte-uej830")}>`);
		if (Object.values(supportedPlatforms).some((v) => v == false)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 flex-wrap">`);
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
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class(clsx([
			"setting-grid items-center",
			adaptive && "adaptive",
			clazz
		]), "svelte-uej830")}>`);
		if (icon) {
			$$renderer.push("<!--[0-->");
			Icon($$renderer, {
				src: icon,
				mini: true,
				size: "32",
				class: "bg-red-200/20 dark:bg-red-600/20 p-1.5 rounded-lg color\n          text-red-300 dark:text-red-300 float-left mr-2 clear-both",
				style: "grid-area: icon;"
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2 class="font-medium text-base" style="grid-area: title; place-self: end start;">`);
		title?.($$renderer);
		$$renderer.push(`<!----></h2> `);
		if (description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-slate-600 dark:text-zinc-400 text-sm" style="grid-area: description; place-self: start start;">`);
			description?.($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (children) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(clsx(["w-full flex flex-col gap-2 flex-1 max-w-full shrink-0 row-span-2 max-md:mt-2", optionClass]), "svelte-uej830")} style="grid-area: children;">`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></li>`);
	});
}
//#endregion
export { Setting as t };

//# sourceMappingURL=Setting.js.map