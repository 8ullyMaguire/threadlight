import { h as stringify } from "../../../../chunks/server.js";
import { F as CommonList } from "../../../../chunks/client.svelte.js";
import { t as CommonItem } from "../../../../chunks/CommonItem.js";
//#region src/routes/explore/topics/TopicItem.svelte
function TopicItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { topic } = $$props;
		CommonItem($$renderer, {
			title: topic.title ?? topic.name,
			href: `/topic/${stringify(topic.id)}`
		});
	});
}
//#endregion
//#region src/routes/explore/topics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		{
			function item($$renderer, topic) {
				TopicItem($$renderer, { topic });
			}
			CommonList($$renderer, {
				items: data.topics.value,
				item,
				$$slots: { item: true }
			});
		}
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map