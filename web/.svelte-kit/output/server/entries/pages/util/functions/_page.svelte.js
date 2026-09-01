import { o as escape_html } from "../../../../chunks/validate.js";
import { o as derived } from "../../../../chunks/server.js";
import { Ut as TextInput, bt as isVideo, yt as isImage } from "../../../../chunks/client.svelte.js";
//#region src/routes/util/functions/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let imageInput = "";
		let inputIsImage = derived(() => isImage(imageInput));
		let inputIsVideo = derived(() => isVideo(imageInput));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<h1 class="font-bold text-2xl">Functions</h1> <p>Various utility functions.</p> <h2 class="font-bold text-xl mt-4">Images</h2> `);
			TextInput($$renderer, {
				label: "Image/Video URL",
				placeholder: "image.jpg",
				get value() {
					return imageInput;
				},
				set value($$value) {
					imageInput = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <p>Image: ${escape_html(inputIsImage())}</p> <p>Video: ${escape_html(inputIsVideo())}</p>`);
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