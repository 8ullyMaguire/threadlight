import { r as clsx } from "./validate.js";
import { t as attr_class } from "./server.js";
//#region src/lib/ui/generic/Skeleton.svelte
function Skeleton($$renderer, $$props) {
	const sizes = {
		sm: "h-20",
		md: "h-30",
		lg: "h-36"
	};
	let { size = "lg" } = $$props;
	$$renderer.push(`<div${attr_class(clsx(["skeleton flex flex-col gap-2 w-full", sizes[size]]), "svelte-500wmx")}><div class="w-2/3 h-1/6 rounded-lg svelte-500wmx"></div> <div class="w-full h-4/6 rounded-lg svelte-500wmx"></div> <div class="w-32 h-1/6 rounded-lg svelte-500wmx"></div></div>`);
}
//#endregion
export { Skeleton as t };

//# sourceMappingURL=Skeleton.js.map