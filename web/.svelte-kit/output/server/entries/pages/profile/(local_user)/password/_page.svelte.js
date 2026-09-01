import "../../../../../chunks/server.js";
import { t as Placeholder } from "../../../../../chunks/Placeholder.js";
import { t as Key } from "../../../../../chunks/Key.js";
//#region src/routes/profile/(local_user)/password/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<div class="h-full grid place-items-center">`);
	Placeholder($$renderer, {
		icon: Key,
		title: "Manage",
		how: true,
		you: true,
		log: true,
		in: true,
		description: "You can enable 2FA for greater security, change your password, view logged in devices, or delete your account here."
	});
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map