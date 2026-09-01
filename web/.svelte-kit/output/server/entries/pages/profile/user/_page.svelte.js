import { o as escape_html } from "../../../../chunks/validate.js";
import "../../../../chunks/server.js";
import { pt as ReactiveState } from "../../../../chunks/client.svelte.js";
import { t as _page$1 } from "../../../../chunks/_page5.js";
//#region src/routes/profile/user/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		if (data.user && data.sort && data.type && data.page) {
			$$renderer.push("<!--[0-->");
			_page$1($$renderer, { data: {
				items: new ReactiveState(data.user.submissions),
				filters: new ReactiveState({
					page: data.page,
					sort: data.sort,
					type: data.type,
					limit: data.limit
				}),
				person_view: { value: data.user.person_view },
				moderates: { value: data.user.moderates }
			} });
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`User data is missing. <pre>
    ${escape_html(JSON.stringify(data))}
  </pre>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map