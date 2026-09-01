import "../../../../chunks/server.js";
import { F as CommonList, R as Header, Zt as Button, f as toast, nn as Trash, nt as UserLink, o as profile, t as client, tt as errorMessage, un as Plus } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
import { t as QuestionMarkCircle } from "../../../../chunks/QuestionMarkCircle.js";
import { t as UserAutocomplete } from "../../../../chunks/UserAutocomplete.js";
//#region src/routes/admin/team/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data: pageData } = $$props;
		let data = pageData;
		let adding = false;
		async function removeAdmin(id, confirm) {
			if (!confirm) return toast({
				content: "Are you sure you want to remove that admin?",
				action: () => removeAdmin(id, true)
			});
			if (!profile.current?.jwt) return;
			try {
				const res = await client().addAdmin({
					added: false,
					person_id: id
				});
				data.site.admins = res.admins;
				toast({
					content: "Removed that admin.",
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
				$$renderer.push(`<!---->Admins`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (data.site) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<ul>`);
			if (data.site.admins.length <= 0) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					icon: QuestionMarkCircle,
					title: "No admins",
					description: "Somehow there's no admins of this site. How??"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				{
					function item($$renderer, admin) {
						$$renderer.push(`<div class="flex items-center justify-between">`);
						UserLink($$renderer, {
							avatar: true,
							showInstance: false,
							user: admin.person
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							onclick: () => {
								removeAdmin(admin.person.id, false);
							},
							size: "square-md",
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
						items: data.site?.admins ?? [],
						item,
						$$slots: { item: true }
					});
				}
			}
			$$renderer.push(`<!--]--></ul> <form class="flex flex-row gap-2 mt-auto w-full"><div class="w-full">`);
			UserAutocomplete($$renderer, {
				listing_type: "All",
				onselect: (p) => p?.id
			});
			$$renderer.push(`<!----></div> `);
			Button($$renderer, {
				loading: adding,
				disabled: adding,
				rounding: "xl",
				color: "primary",
				size: "sm",
				submit: true,
				icon: Plus,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Add`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map