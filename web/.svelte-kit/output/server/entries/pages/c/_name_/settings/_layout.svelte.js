import { n as attr, o as escape_html } from "../../../../../chunks/validate.js";
import { l as head, o as derived } from "../../../../../chunks/server.js";
import { I as Tabs, _t as fullCommunityName } from "../../../../../chunks/client.svelte.js";
//#region src/routes/c/[name]/settings/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		let communityUrl = derived(() => `/c/${fullCommunityName(data.community.value.community_view.community.name, data.community.value.community_view.community.actor_id)}`);
		head("148vq5f", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.community.value.community_view.community.title)}</title>`);
			});
			$$renderer.push(`<meta name="og:title"${attr("content", data.community.value.community_view.community.title)}/> `);
			if (data.community.value.community_view.community.description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta name="og:description"${attr("content", data.community.value.community_view.community.description)}/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`<div class="flex flex-col gap-4 h-full">`);
		Tabs($$renderer, { routes: [{
			href: `${communityUrl()}/settings`,
			name: "Settings"
		}, {
			href: `${communityUrl()}/settings/team`,
			name: "Team"
		}] });
		$$renderer.push(`<!----> `);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map