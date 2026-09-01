import { n as attr, o as escape_html, r as clsx } from "./validate.js";
import { a as bind_props, o as derived, t as attr_class } from "./server.js";
import { Gt as Label, un as Plus } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { i as DocumentPlus } from "./MarkdownEditor.js";
import { t as ImageInputModal } from "./ImageInputModal.js";
//#region src/lib/ui/form/ImageInputUpload.svelte
function ImageInputUpload($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { imageUrl: passedImageUrl = void 0, label } = $$props;
		let imageUrl = derived(() => passedImageUrl);
		let open = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div>`);
			Label($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(label)}`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <button${attr_class(clsx([
				"flex flex-col items-center justify-center px-8 py-4 mx-auto w-full rounded-xl",
				"border border-slate-200 dark:border-zinc-800 border-dashed hover:border-slate-300 hover:dark:border-zinc-700",
				"cursor-pointer min-h-36 transition-colors bg-white dark:bg-zinc-950 relative"
			]))} type="button">`);
			if (imageUrl()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div>`);
				Icon($$renderer, {
					src: Plus,
					class: "text-slate-400 dark:text-zinc-500 absolute top-0 left-0 m-2",
					size: "20",
					micro: true
				});
				$$renderer.push(`<!----></div> <img${attr("src", imageUrl())} alt="" class="rounded-md mx-auto h-full"/>`);
			} else {
				$$renderer.push("<!--[-1-->");
				Icon($$renderer, {
					src: DocumentPlus,
					class: "text-slate-400 dark:text-zinc-500",
					size: "36",
					solid: true
				});
				$$renderer.push(`<!----> <p class="text-slate-600 dark:text-zinc-400 font-medium">Attach file</p>`);
			}
			$$renderer.push(`<!--]--> `);
			ImageInputModal($$renderer, {
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				get imageUrl() {
					return passedImageUrl;
				},
				set imageUrl($$value) {
					passedImageUrl = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></button></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { imageUrl: passedImageUrl });
	});
}
//#endregion
export { ImageInputUpload as t };

//# sourceMappingURL=ImageInputUpload.js.map