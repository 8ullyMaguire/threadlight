import { r as clsx } from "./validate.js";
import { h as stringify, n as attr_style, t as attr_class } from "./server.js";
import { st as Avatar } from "./client.svelte.js";
//#region src/lib/feature/legacy/ProfileAvatar.svelte
function ProfileAvatar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { profile = void 0, selected = false, size = 22 } = $$props;
		if (profile) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_style(`width: ${stringify(size)}px; height: ${stringify(size)}px;`)}${attr_class(clsx([profile.avatar && "bg-slate-200 rounded-full dark:bg-zinc-700"]))}>`);
			Avatar($$renderer, {
				url: profile.avatar,
				alt: profile.username,
				width: size,
				class: [
					"shrink-0 rounded-full",
					selected && "scale-75",
					"transition-transform"
				]
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { ProfileAvatar as t };

//# sourceMappingURL=ProfileAvatar.js.map