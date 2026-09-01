import { o as escape_html, r as clsx } from "./validate.js";
import { t as attr_class } from "./server.js";
import { et as FormattedNumber } from "./client.svelte.js";
//#region src/lib/ui/info/LabelStat.svelte
function LabelStat($$renderer, $$props) {
	let { label, content, formatted = false, labelClass = "", contentClass = "", class: clazz = "", formatOptions } = $$props;
	if (content != "-1") {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<dl${attr_class(clsx(["flex flex-col", clazz]))}><dt${attr_class(clsx(["text-slate-600 dark:text-zinc-400 text-xs", labelClass]))}>${escape_html(label)}</dt> <dd${attr_class(clsx(["text-base", contentClass]))}>`);
		if (formatted) {
			$$renderer.push("<!--[0-->");
			FormattedNumber($$renderer, {
				number: Number(content),
				options: formatOptions
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html(content)}`);
		}
		$$renderer.push(`<!--]--></dd></dl>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
//#endregion
export { LabelStat as t };

//# sourceMappingURL=LabelStat.js.map