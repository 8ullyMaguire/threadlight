import { o as escape_html } from "../../../../../../chunks/validate.js";
import "../../../../../../chunks/server.js";
import { F as CommonList, It as action, Lt as modal, R as Header, Zt as Button, f as toast, n as getClient, nn as Trash, o as profile, st as Avatar, tt as errorMessage, un as Plus } from "../../../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../../../chunks/Placeholder.js";
import { t as UserAutocomplete } from "../../../../../../chunks/UserAutocomplete.js";
//#region src/routes/c/[name]/settings/team/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let formData = {
			newModerator: -1,
			addingModerator: false
		};
		async function removeMod(id) {
			if (!profile.current?.jwt) return;
			try {
				const res = await getClient().addModToCommunity({
					added: false,
					community_id: data.community.value.community_view.community.id,
					person_id: id
				});
				data.community.value.moderators = res.moderators;
				toast({
					content: "Updated community moderators.",
					type: "success"
				});
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
		}
		Header($$renderer, {
			pageHeader: true,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Moderators`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		{
			function item($$renderer, moderator) {
				$$renderer.push(`<div class="flex items-center gap-2 justify-between"><div class="flex gap-2 items-center">`);
				Avatar($$renderer, {
					width: 28,
					url: moderator.moderator.avatar,
					alt: moderator.moderator.name
				});
				$$renderer.push(`<!----> <div class="flex flex-col gap-0">${escape_html(moderator.moderator.display_name ?? moderator.moderator.name)} <span class="text-xs text-slate-600 dark:text-zinc-400">${escape_html(new URL(moderator.moderator.actor_id).hostname)}</span></div></div> `);
				Button($$renderer, {
					size: "square-md",
					onclick: () => {
						modal({
							title: "Remove",
							body: `Are you sure you want to remove ${moderator.moderator.name} as a moderator?`,
							actions: [action({
								content: "Remove",
								action: () => removeMod(moderator.moderator.id),
								type: "danger",
								close: true
							}), action({
								content: "Cancel",
								close: true
							})]
						});
					},
					children: ($$renderer) => {
						Icon($$renderer, {
							src: Trash,
							mini: true,
							size: "16"
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			}
			CommonList($$renderer, {
				items: data.community.value.moderators,
				item,
				$$slots: { item: true }
			});
		}
		$$renderer.push(`<!----> <form class="mt-auto flex gap-2 w-full mb-3 sm:mb-6"><div class="w-full">`);
		UserAutocomplete($$renderer, {
			listing_type: "All",
			onselect: (p) => {
				if (p) formData.newModerator = p.id;
			}
		});
		$$renderer.push(`<!----></div> `);
		Button($$renderer, {
			loading: formData.addingModerator,
			disabled: formData.addingModerator,
			rounding: "xl",
			color: "primary",
			submit: true,
			icon: Plus,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Add`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></form>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map