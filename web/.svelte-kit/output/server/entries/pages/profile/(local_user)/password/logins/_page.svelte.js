import { o as escape_html } from "../../../../../../chunks/validate.js";
import { c as ensure_array_like } from "../../../../../../chunks/server.js";
import { at as RelativeDate, qt as Material, tr as publishedToDate } from "../../../../../../chunks/client.svelte.js";
import { UAParser } from "ua-parser-js";
//#region src/routes/profile/(local_user)/password/logins/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		Material($$renderer, {
			color: "transparent",
			class: "flex flex-col gap-4 border overflow-auto max-h-160\n  h-full w-full\n  min-w-0 max-w-full",
			rounding: "2xl",
			padding: "none",
			children: ($$renderer) => {
				$$renderer.push(`<table><thead class="sticky top-0"><tr class="divide-x border-b divide-slate-200 dark:divide-zinc-800 h-12 *:px-4 bg-slate-50 dark:bg-zinc-900"><th align="left">User Agent</th><th align="left">IP</th><th align="right" class="w-24">Date</th></tr></thead><tbody class="divide-y *:h-14 divide-slate-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950"><!--[-->`);
				const each_array = ensure_array_like(data.tokens);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let token = each_array[$$index];
					const ua = new UAParser(token.user_agent).getResult();
					$$renderer.push(`<tr class="divide-x *:px-3 divide-slate-200 dark:divide-zinc-800"><td><div class="text-base">${escape_html(ua.os.name)} ${escape_html(ua.os.version)}</div> <div class="text-sm">${escape_html(ua.browser.name)}</div></td><td><span class="font-mono">${escape_html(token.ip)}</span></td><td align="right">`);
					RelativeDate($$renderer, { date: publishedToDate(token.published) });
					$$renderer.push(`<!----></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table>`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map