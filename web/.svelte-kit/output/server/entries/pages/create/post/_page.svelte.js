import { a as onDestroy } from "../../../../chunks/internal.js";
import { l as head, o as derived } from "../../../../chunks/server.js";
import { t as goto } from "../../../../chunks/navigation.js";
import { ar as page, dt as postLink, h as PostFormState } from "../../../../chunks/client.svelte.js";
import { t as PostForm } from "../../../../chunks/PostForm.js";
import { n as setSessionStorage, t as getSessionStorage } from "../../../../chunks/session.js";
//#region src/routes/create/post/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let community = getSessionStorage("lastSeenCommunity");
		onDestroy(() => {
			setSessionStorage("lastSeenCommunity", void 0);
		});
		let crosspost = derived(() => {
			const crosspostParam = page.url.searchParams.get("crosspost");
			try {
				return crosspostParam ? JSON.parse(crosspostParam || "{}") : void 0;
			} catch {
				return;
			}
		});
		head("1cnksh0", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Create post</title>`);
			});
		});
		{
			function title($$renderer) {}
			PostForm($$renderer, {
				init: crosspost() ? new PostFormState(crosspost()) : community ? new PostFormState({ community: community?.community }) : void 0,
				onsubmit: (post) => goto(postLink(post.post)),
				title,
				$$slots: { title: true }
			});
		}
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map