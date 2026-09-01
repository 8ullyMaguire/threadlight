import "../../../../chunks/server.js";
import { t as CommunityForm } from "../../../../chunks/CommunityForm.js";
//#region src/routes/create/community/+page.svelte
function _page($$renderer) {
	{
		function formtitle($$renderer) {}
		CommunityForm($$renderer, {
			formtitle,
			$$slots: { formtitle: true }
		});
	}
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map