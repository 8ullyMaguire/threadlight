import { o as escape_html } from "../../../../chunks/validate.js";
import { h as stringify } from "../../../../chunks/server.js";
import { Cn as InformationCircle, F as CommonList, Lt as modal, Zt as Button, p as Markdown, st as Avatar } from "../../../../chunks/client.svelte.js";
import { t as LabelStat } from "../../../../chunks/LabelStat.js";
import { t as CommonItem } from "../../../../chunks/CommonItem.js";
//#region src/lib/ui/generic/Entity.svelte
function Entity($$renderer, $$props) {
	let { name, label = void 0, icon = void 0, customIcon } = $$props;
	$$renderer.push(`<div class="flex flex-row gap-2 items-center">`);
	if (customIcon) {
		$$renderer.push("<!--[0-->");
		customIcon($$renderer);
		$$renderer.push(`<!---->`);
	} else {
		$$renderer.push("<!--[-1-->");
		Avatar($$renderer, {
			url: icon,
			width: 32,
			alt: name,
			circle: false
		});
	}
	$$renderer.push(`<!--]--> <div class="flex flex-col"><span class="font-semibold text-base">${escape_html(name)}</span> <span class="text-sm">${escape_html(label)}</span></div></div>`);
}
//#endregion
//#region src/routes/explore/feeds/FeedItem.svelte
function FeedItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { feed } = $$props;
		function feedModal($$renderer) {
			Entity($$renderer, {
				icon: feed.icon,
				name: feed.title,
				label: feed.name
			});
			$$renderer.push(`<!----> `);
			Markdown($$renderer, { source: feed.description });
			$$renderer.push(`<!----> `);
			LabelStat($$renderer, {
				label: "Members",
				content: feed.subscriptions_count
			});
			$$renderer.push(`<!---->`);
		}
		CommonItem($$renderer, {
			icon: feed.icon,
			title: feed.title,
			detail: `${stringify(feed.name)} • ${stringify(feed.subscriptions_count)}`,
			href: `/f/${stringify(feed.id)}`,
			children: ($$renderer) => {
				Button($$renderer, {
					onclick: () => modal({
						title: "Info",
						snippet: feedModal
					}),
					color: "ghost",
					size: "custom",
					rounding: "xl",
					class: "h-8.5 aspect-square",
					icon: InformationCircle,
					"aria-label": "Info"
				});
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/routes/explore/feeds/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		{
			function item($$renderer, feed) {
				FeedItem($$renderer, { feed });
			}
			CommonList($$renderer, {
				items: data.feeds.value,
				item,
				$$slots: { item: true }
			});
		}
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map