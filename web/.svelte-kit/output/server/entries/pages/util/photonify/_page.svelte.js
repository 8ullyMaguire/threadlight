import { o as derived } from "../../../../chunks/server.js";
import { Ut as TextInput } from "../../../../chunks/client.svelte.js";
import { n as photonify } from "../../../../chunks/plugins.js";
//#region src/routes/util/photonify/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let link = "";
		let photonified = derived(() => photonify(link));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<h1 class="font-bold text-2xl">Photonify links</h1> <p>Convert a link from a Lemmy post to a Photon link.</p> <div class="flex flex-row items-center flex-wrap gap-4">`);
			TextInput($$renderer, {
				label: "Input",
				placeholder: "https://lemmy.world/post/1",
				get value() {
					return link;
				},
				set value($$value) {
					link = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				label: "Output",
				value: photonified()
			});
			$$renderer.push(`<!----></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map