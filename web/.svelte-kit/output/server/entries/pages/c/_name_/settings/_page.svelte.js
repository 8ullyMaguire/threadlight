import { o as escape_html } from "../../../../../chunks/validate.js";
import "../../../../../chunks/server.js";
import { R as Header, st as Avatar } from "../../../../../chunks/client.svelte.js";
import { t as CommunityForm } from "../../../../../chunks/CommunityForm.js";
//#region src/lib/feature/community/CommunityTitle.svelte
function CommunityTitle($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community } = $$props;
		$$renderer.push(`<div class="flex flex-row gap-3 items-center">`);
		Avatar($$renderer, {
			width: 48,
			url: community.icon,
			alt: community.name
		});
		$$renderer.push(`<!----> <div class="flex flex-col gap-0"><h1 class="font-bold text-xl">${escape_html(community.title)}</h1> <span class="dark:text-zinc-400 text-slate-600 text-sm">!${escape_html(community.name)}@${escape_html(new URL(community.actor_id).hostname)}</span></div></div>`);
	});
}
//#endregion
//#region src/routes/c/[name]/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="flex flex-col gap-4">`);
		{
			function extended($$renderer) {
				CommunityTitle($$renderer, { community: data.community.value.community_view.community });
			}
			Header($$renderer, {
				pageHeader: true,
				extended,
				children: ($$renderer) => {
					$$renderer.push(`<span>Settings</span>`);
				},
				$$slots: {
					extended: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----> `);
		{
			function formtitle($$renderer) {}
			CommunityForm($$renderer, {
				edit: data.community.value.community_view.community.id,
				formData: {
					name: data.community.value.community_view.community.name,
					displayName: data.community.value.community_view.community.title,
					nsfw: data.community.value.community_view.community.nsfw,
					postsLockedToModerators: data.community.value.community_view.community.posting_restricted_to_mods,
					sidebar: data.community.value.community_view.community.description ?? "",
					icon: data.community.value.community_view.community.icon,
					banner: data.community.value.community_view.community.banner,
					visibility: data.community.value.community_view.community.visibility,
					submitting: false,
					languages: data.community.value.discussion_languages
				},
				formtitle,
				$$slots: { formtitle: true }
			});
		}
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map