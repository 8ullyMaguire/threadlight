import { o as escape_html } from "../../../../chunks/validate.js";
import { a as bind_props, i as await_block, l as head } from "../../../../chunks/server.js";
import { C as PostListShell, Dt as SvelteURL, Yt as Spinner, ht as communityLink, zt as Expandable } from "../../../../chunks/client.svelte.js";
import { t as EntityHeader } from "../../../../chunks/EntityHeader.js";
import { t as ItemList } from "../../../../chunks/ItemList.js";
//#region src/routes/topic/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		let title = "Loading...";
		data.topic.then((i) => title = i?.name ?? "");
		head("1inrd1c", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>
    ${escape_html(title)}
  </title>`);
			});
		});
		{
			function extended($$renderer) {
				$$renderer.push(`<div class="min-h-56 grid place-items-center">`);
				await_block($$renderer, data.topic, () => {
					Spinner($$renderer, { width: 32 });
				}, (topic) => {
					if (topic) {
						$$renderer.push("<!--[0-->");
						{
							function nameDetail($$renderer) {
								$$renderer.push(`<p class="text-lg">${escape_html(topic.name)}</p>`);
							}
							EntityHeader($$renderer, {
								class: "w-full relative flex flex-col",
								compact: "always",
								avatarCircle: false,
								name: topic.name,
								nameDetail,
								children: ($$renderer) => {
									if (topic.communities) {
										$$renderer.push("<!--[0-->");
										{
											function title($$renderer) {
												$$renderer.push(`<!---->Communities`);
											}
											Expandable($$renderer, {
												title,
												children: ($$renderer) => {
													ItemList($$renderer, { items: topic.communities.map((i) => ({
														id: i.id,
														name: i.title,
														url: communityLink(i),
														avatar: i.icon,
														instance: new SvelteURL(i.actor_id).hostname
													})) });
												},
												$$slots: {
													title: true,
													default: true
												}
											});
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: {
									nameDetail: true,
									default: true
								}
							});
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				});
				$$renderer.push(`<!--]--></div>`);
			}
			PostListShell($$renderer, {
				client: data.client,
				posts: data.posts,
				cursor: data.next_page,
				getParams: data.params,
				params: { sort: data.params.sort },
				extended,
				$$slots: { extended: true }
			});
		}
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map