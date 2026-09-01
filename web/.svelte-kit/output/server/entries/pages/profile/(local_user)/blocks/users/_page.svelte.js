import "../../../../../../chunks/server.js";
import { Bn as Check, Zt as Button, nn as Trash, o as profile, wt as userLink } from "../../../../../../chunks/client.svelte.js";
import { t as Placeholder } from "../../../../../../chunks/Placeholder.js";
import { t as ArrowUturnUp } from "../../../../../../chunks/ArrowUturnUp.js";
import { t as ItemList } from "../../../../../../chunks/ItemList.js";
//#region src/routes/profile/(local_user)/blocks/users/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		async function unblock(id) {
			if (!data.person_blocks) return;
			data.person_blocks.splice(data.person_blocks.findIndex((i) => i.person.id == id), 1);
			await profile.client.blockPerson({
				block: false,
				person_id: id
			});
		}
		if (data.person_blocks && data.person_blocks?.length > 0) {
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
					items: data.person_blocks.map((i) => ({
						id: i.target.id,
						name: i.target.name,
						avatar: i.target.avatar,
						url: userLink(i.target),
						instance: new URL(i.target.actor_id).hostname,
						circle: true
					})),
					link: false,
					action,
					$$slots: { action: true }
				});
			}
		} else {
			$$renderer.push("<!--[-1-->");
			Placeholder($$renderer, {
				title: "No",
				blocked: true,
				users: true,
				description: "Blocking a user will hide their posts and comments from feeds.",
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