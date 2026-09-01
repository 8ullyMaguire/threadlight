import "../../../../../../chunks/server.js";
import { Bn as Check, Zt as Button, nn as Trash, o as profile } from "../../../../../../chunks/client.svelte.js";
import { t as Placeholder } from "../../../../../../chunks/Placeholder.js";
import { t as ItemList } from "../../../../../../chunks/ItemList.js";
//#region src/routes/profile/(local_user)/blocks/instances/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		async function unblock(id) {
			if (!data.my_user?.instance_blocks) return;
			data.my_user?.instance_blocks.splice(data.my_user?.instance_blocks.findIndex((i) => i.instance.id == id), 1);
			await profile.client.blockInstance({
				block: false,
				instance_id: id
			});
		}
		if (data.my_user?.instance_blocks && data.my_user?.instance_blocks?.length > 0) {
			$$renderer.push("<!--[0-->");
			{
				function action($$renderer, block) {
					Button($$renderer, {
						title: "Unblock",
						size: "square-md",
						onclick: () => unblock(block.id),
						icon: Trash
					});
				}
				ItemList($$renderer, {
					items: data.my_user?.instance_blocks.map((i) => ({
						id: i.instance.id,
						name: i.site?.name ?? i.instance.domain,
						avatar: i.site?.icon,
						instance: i.instance.domain
					})),
					link: false,
					action,
					$$slots: { action: true }
				});
			}
		} else {
			$$renderer.push("<!--[-1-->");
			Placeholder($$renderer, {
				title: "No blocked servers",
				description: "Blocking a server will hide posts from its communities from feeds.",
				icon: Check,
				class: "my-auto"
			});
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map