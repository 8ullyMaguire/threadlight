import { a as bind_props, c as ensure_array_like } from "../../../../chunks/server.js";
import { M as Pageination, R as Header, ar as page } from "../../../../chunks/client.svelte.js";
import { t as PictrsImage } from "../../../../chunks/PictrsImage.js";
import { t as Fixate } from "../../../../chunks/Fixate.js";
//#region src/routes/admin/media/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		Header($$renderer, {
			pageHeader: true,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Media`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
		const each_array = ensure_array_like(data.images.value);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let image = each_array[$$index];
			$$renderer.push(`<div>`);
			PictrsImage($$renderer, {
				image: image.local_image,
				user: image.person,
				ondelete: () => {
					data.images.value = data.images.value.toSpliced(data.images.value.findIndex((i) => i.local_image.pictrs_delete_token == image.local_image.pictrs_delete_token), 1);
				}
			});
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		Fixate($$renderer, {
			placement: "bottom",
			children: ($$renderer) => {
				Pageination($$renderer, {
					page: Number(page.url.searchParams.get("page")) || 1,
					href: (page) => `?page=${page}`,
					hasMore: data.images.value.length == 20
				});
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!---->`);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map