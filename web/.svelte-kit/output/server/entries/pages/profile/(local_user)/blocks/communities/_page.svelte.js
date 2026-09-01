import "../../../../../../chunks/server.js";
import { Bn as Check, Zt as Button, ht as communityLink, nn as Trash, o as profile } from "../../../../../../chunks/client.svelte.js";
import { t as Placeholder } from "../../../../../../chunks/Placeholder.js";
import { t as ArrowUturnUp } from "../../../../../../chunks/ArrowUturnUp.js";
import { t as ItemList } from "../../../../../../chunks/ItemList.js";
//#region src/routes/profile/(local_user)/blocks/communities/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		async function unblock(id) {
			if (!data.community_blocks) return;
			data.community_blocks.splice(data.community_blocks.findIndex((i) => i.community.id == id), 1);
			await profile.client.blockCommunity({
				block: false,
				community_id: id
			});
		}
		if (data.community_blocks && data.community_blocks?.length > 0) {
			$$renderer.push("<!--[0-->");
			{
				function action($$renderer, block) {
					Button($$renderer, {
						title: "Jump",
						size: "square-md",
						href: block.url,
						color: "primary",
						icon: ArrowUturnUp
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						title: "Unblock",
						size: "square-md",
						onclick: () => unblock(block.id),
						icon: Trash
					});
					$$renderer.push(`<!---->`);
				}
				ItemList($$renderer, {
					items: data.community_blocks.map((i) => ({
						id: i.community.id,
						name: i.community.title,
						avatar: i.community.icon,
						url: communityLink(i.community),
						instance: new URL(i.community.actor_id).hostname
					})),
					link: false,
					action,
					$$slots: { action: true }
				});
			}
		} else {
			$$renderer.push("<!--[-1-->");
			Placeholder($$renderer, {
				title: "No blocked communities",
				description: "Blocking a community will hide its posts from feeds.",
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