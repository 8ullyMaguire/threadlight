import { o as escape_html } from "./validate.js";
import { a as bind_props } from "./server.js";
import { Bt as Switch, Gt as Label, Rt as Modal, Zt as Button, it as CommunityLink, st as Avatar } from "./client.svelte.js";
import { t as MarkdownEditor } from "./MarkdownEditor.js";
import { t as Duration } from "./Duration.js";
//#region src/lib/feature/moderation/BanModal.svelte
function BanModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, user: item = void 0, community, banned } = $$props;
		let reason = "";
		let deleteData = false;
		let expires = -1;
		let loading = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: banned ? "Unbanning User" : "Banning User",
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					if (item) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<form class="flex flex-col gap-4"><div class="flex items-center gap-1">`);
						Avatar($$renderer, {
							url: item.avatar,
							alt: item.name,
							width: 24
						});
						$$renderer.push(`<!----> <span class="font-bold">${escape_html(item.name)}</span></div> `);
						if (community) {
							$$renderer.push("<!--[0-->");
							CommunityLink($$renderer, {
								community,
								avatar: true
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						MarkdownEditor($$renderer, {
							required: true,
							label: "Reason",
							get value() {
								return reason;
							},
							set value($$value) {
								reason = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> `);
						if (!banned) {
							$$renderer.push("<!--[0-->");
							{
								function description($$renderer) {
									$$renderer.push(`<!---->This will delete ALL of this user's submissions here.`);
								}
								Switch($$renderer, {
									get checked() {
										return deleteData;
									},
									set checked($$value) {
										deleteData = $$value;
										$$settled = false;
									},
									description,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Delete data`);
									},
									$$slots: {
										description: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----> `);
							Label($$renderer, {
								text: "Expires",
								"(UTC)": true,
								children: ($$renderer) => {
									Duration($$renderer, {
										get value() {
											return expires;
										},
										set value($$value) {
											expires = $$value;
											$$settled = false;
										}
									});
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						Button($$renderer, {
							submit: true,
							color: "primary",
							loading,
							disabled: loading,
							size: "lg",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Submit`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></form>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			user: item
		});
	});
}
//#endregion
export { BanModal as default };

//# sourceMappingURL=BanModal.js.map