import { a as onDestroy } from "./internal.js";
import { o as escape_html, r as clsx } from "./validate.js";
import { c as ensure_array_like, o as derived, t as attr_class } from "./server.js";
import { Dn as ExclamationTriangle } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
//#region src/lib/ui/info/ErrorContainer.svelte
var errors = [];
function clearErrorScope(scope) {
	errors = errors.filter((error) => error.scope != scope);
}
function ErrorContainer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		onDestroy(() => {
			clearErrorScope(scope);
		});
		let { scope, message, children, class: clazz = "" } = $$props;
		let scopedErrors = derived(() => errors.filter((e) => e.scope == scope || e.scope == "global"));
		if (scopedErrors().length > 0 || message) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(clsx(["flex flex-col gap-4", clazz]), "svelte-188sv7y")}><div class="info-container material-error svelte-188sv7y">`);
			Icon($$renderer, {
				src: ExclamationTriangle,
				size: "20",
				micro: true,
				class: "inline-block rounded-lg clear-both float-left mr-2"
			});
			$$renderer.push(`<!----> `);
			if (message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`${escape_html(message)}`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			children?.($$renderer);
			$$renderer.push(`<!----> <!--[-->`);
			const each_array = ensure_array_like(scopedErrors());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let error = each_array[$$index];
				$$renderer.push(`<p>${escape_html(error.message)}</p>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { ErrorContainer as t };

//# sourceMappingURL=ErrorContainer.js.map