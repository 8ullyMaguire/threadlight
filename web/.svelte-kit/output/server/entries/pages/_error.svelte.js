import { o as escape_html } from "../../chunks/validate.js";
import "../../chunks/server.js";
import { t as goto } from "../../chunks/navigation.js";
import { Zt as Button, ar as page, qt as Material, tt as errorMessage } from "../../chunks/client.svelte.js";
//#region src/routes/+error.svelte
function _error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function getError(message) {
			try {
				return {
					string: errorMessage(message),
					code: false
				};
			} catch {
				return {
					string: message,
					code: true
				};
			}
		}
		$$renderer.push(`<div class="flex flex-col gap-4 my-auto h-full justify-center max-w-xl w-full mx-auto">`);
		Material($$renderer, {
			rounding: "3xl",
			padding: "xl",
			color: "error",
			class: "space-y-2",
			children: ($$renderer) => {
				$$renderer.push(`<h1 class="text-4xl font-medium flex items-center flex-row gap-2 font-mono">${escape_html(page.status)}</h1> `);
				if (page?.error?.message) {
					$$renderer.push("<!--[0-->");
					const error = getError(page?.error?.message);
					if (error.code) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<code class="rounded-md dark:bg-zinc-950! px-2 py-1 min-w-48">${escape_html(error.string)}</code>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<p class="text-lg">${escape_html(error.string)}</p>`);
					}
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="flex items-center gap-2 px-4">`);
		Button($$renderer, {
			size: "lg",
			onclick: () => goto(page.url, { invalidateAll: true }),
			children: ($$renderer) => {
				$$renderer.push(`<!---->Retry`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			href: "/",
			size: "lg",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Home`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { _error as default };

//# sourceMappingURL=_error.svelte.js.map