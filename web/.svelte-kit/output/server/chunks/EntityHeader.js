import { n as attr, o as escape_html, r as clsx } from "./validate.js";
import { c as ensure_array_like, o as derived, r as attributes, s as element, t as attr_class } from "./server.js";
import { B as Blobs, X as PostBody, qt as Material, st as Avatar } from "./client.svelte.js";
import { t as LabelStat } from "./LabelStat.js";
//#region src/lib/ui/text/TextProps.svelte
var wrapClass = {
	wrap: "",
	"no-wrap": "overflow-hidden text-ellipsis whitespace-nowrap",
	force: "break-words"
};
function TextProps($$renderer, $$props) {
	let { wrap = "wrap", class: clazz = "", children } = $$props;
	let classes = derived(() => `${wrapClass[wrap]} ${clazz ?? ""}`);
	$$renderer.push(`<span${attr_class(clsx(classes()))}>`);
	children?.($$renderer);
	$$renderer.push(`<!----></span>`);
}
//#endregion
//#region src/lib/ui/generic/EntityHeader.svelte
function EntityHeader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { avatar, name, bio, banner, url, stats = [], class: clazz = "", nameDetail, actions, children, compact, avatarCircle = true, $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<div${attributes({
			...rest,
			class: clsx(["z-10 text-sm w-full space-y-4 @container", clazz])
		}, "svelte-5c4wgm")}>`);
		{
			function pfp($$renderer, width) {
				Avatar($$renderer, {
					width,
					url: avatar,
					alt: name,
					circle: avatarCircle,
					class: [
						"relative",
						banner !== null && "-mt-4 @md:-mt-8",
						!avatarCircle && "rounded-xl @md:rounded-3xl!"
					]
				});
			}
			Material($$renderer, {
				padding: "xl",
				rounding: "3xl",
				class: "flex flex-col gap-2 @lg:gap-4",
				pfp,
				children: ($$renderer) => {
					if (banner !== null) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="relative overflow-hidden rounded-t-[inherit] -m-6 mask-b-from-0 h-32 @lg:h-48">`);
						if (banner) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<img${attr("src", banner)} class="w-full object-cover h-full bg-white dark:bg-zinc-900" height="192" alt="User banner"/>`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<div class="scale-150 h-full">`);
							Blobs($$renderer, { seed: name });
							$$renderer.push(`<!----></div>`);
						}
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="contents @md:hidden">`);
					pfp($$renderer, 48);
					$$renderer.push(`<!----></div> <div class="hidden @md:contents">`);
					pfp($$renderer, 72);
					$$renderer.push(`<!----></div> <div class="space-y-1">`);
					element($$renderer, url ? "a" : "h1", () => {
						$$renderer.push(`${attr("href", url)}${attr_class(clsx(["text-xl @md:text-2xl font-medium tracking-tight", url && "hover:underline hover:text-primary-900 dark:hover:text-primary-100"]))}`);
					}, () => {
						$$renderer.push(`${escape_html(name)}`);
					});
					$$renderer.push(` `);
					if (nameDetail) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="flex items-center gap-0 text-sm text-slate-600 dark:text-zinc-400 max-w-full w-max">`);
						TextProps($$renderer, {
							wrap: "no-wrap",
							children: ($$renderer) => {
								nameDetail?.($$renderer);
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: {
					pfp: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----> `);
		if (actions || stats.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-4"><div class="flex flex-col flex-1">`);
			if (actions) {
				$$renderer.push("<!--[0-->");
				actions?.($$renderer);
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (stats.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx([
					compact == "lg" && "lg:hidden",
					compact == "always" ? "hidden" : "flex",
					"text-sm flex-row flex-wrap overflow-hidden gap-4 h-full"
				]))}><!--[-->`);
				const each_array = ensure_array_like(stats);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let stat = each_array[$$index];
					LabelStat($$renderer, {
						label: stat.name,
						content: stat.value,
						labelClass: "text-sm",
						contentClass: "text-lg"
					});
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (bio) {
			$$renderer.push("<!--[0-->");
			PostBody($$renderer, {
				body: bio,
				class: [
					compact == "lg" && "lg:hidden",
					compact == "always" && "hidden",
					"relative"
				],
				clickThrough: false
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (children) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-3 py-4 pt-0 mt-4">`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { EntityHeader as t };

//# sourceMappingURL=EntityHeader.js.map