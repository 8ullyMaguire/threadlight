import { r as clsx } from "./validate.js";
import { t as attr_class } from "./server.js";
//#region src/lib/ui/generic/Fixate.svelte
function Fixate($$renderer, $$props) {
	const placements = {
		top: "placement-top",
		bottom: "placement-bottom"
	};
	let { placement, children } = $$props;
	$$renderer.push(`<div${attr_class(clsx(["sticky z-30 mb-0 pointer-events-none *:pointer-events-auto", placements[placement]]), "svelte-mnmyjv")}>`);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { Fixate as t };

//# sourceMappingURL=Fixate.js.map