import "../../../../chunks/server.js";
import { Zt as Button } from "../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../chunks/Placeholder.js";
import { t as ArrowLeft } from "../../../../chunks/ArrowLeft.js";
import { t as _page$1 } from "../../../../chunks/_page.js";
//#region src/routes/accounts/login/+page.svelte
function _page($$renderer) {
	_page$1($$renderer, {
		ref: "/accounts",
		children: ($$renderer) => {
			Button($$renderer, {
				size: "custom",
				color: "none",
				class: "w-max hover:underline text-slate-600 dark:text-zinc-400",
				onclick: () => history?.back(),
				children: ($$renderer) => {
					Icon($$renderer, {
						src: ArrowLeft,
						size: "16",
						micro: true
					});
					$$renderer.push(`<!----> Accounts`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map