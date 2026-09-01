import { o as escape_html } from "../../../../chunks/validate.js";
import "../../../../chunks/server.js";
import { Zt as Button, xt as placeholders } from "../../../../chunks/client.svelte.js";
//#region src/routes/util/placeholder/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let post = placeholders.get("post");
		let comment = placeholders.get("comment");
		let url = placeholders.get("url");
		$$renderer.push(`<h1 class="font-bold text-2xl">Placeholders</h1> <p>Photon randomly generates placeholders for use in text inputs and stuff. If
  you have "Random Placeholders" disabled in settings, they will be empty.</p> <h2 class="font-bold text-xl mt-4">Posts</h2> <p>${escape_html(post)}</p> `);
		Button($$renderer, {
			onclick: () => post = placeholders.get("post"),
			class: "w-max",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Generate`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <h2 class="font-bold text-xl mt-4">Comments</h2> <p>${escape_html(comment)}</p> `);
		Button($$renderer, {
			onclick: () => comment = placeholders.get("comment"),
			class: "w-max",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Generate`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <h2 class="font-bold text-xl mt-4">Urls</h2> <p>${escape_html(url)}</p> `);
		Button($$renderer, {
			onclick: () => url = placeholders.get("url"),
			class: "w-max",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Generate`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map