import "../../../../chunks/server.js";
import { At as settings, F as CommonList, Ht as Option, Ut as TextInput, Vt as Select, en as VideoCamera, ft as DOMAIN_REGEX_FORMS } from "../../../../chunks/client.svelte.js";
import { t as Setting } from "../../../../chunks/Setting.js";
import { t as ToggleSetting } from "../../../../chunks/ToggleSetting.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CursorArrowRays.js
var CursorArrowRays = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M7.25 1.75a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0v-1.5ZM11.536 2.904a.75.75 0 1 1 1.06 1.06l-1.06 1.061a.75.75 0 0 1-1.061-1.06l1.06-1.061ZM14.5 7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 .75-.75ZM4.464 9.975a.75.75 0 0 1 1.061 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061ZM4.5 7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 .75-.75ZM5.525 3.964a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 1.06-1.061l1.061 1.06ZM8.779 7.438a.75.75 0 0 0-1.368.366l-.396 5.283a.75.75 0 0 0 1.212.646l.602-.474.288 1.074a.75.75 0 1 0 1.449-.388l-.288-1.075.759.11a.75.75 0 0 0 .726-1.165L8.78 7.438Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 10.828a.75.75 0 0 1 0 1.061L6.11 12.95a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10.766 7.51a.75.75 0 0 0-1.37.365l-.492 6.861a.75.75 0 0 0 1.204.65l1.043-.799.985 3.678a.75.75 0 0 0 1.45-.388l-.978-3.646 1.292.204a.75.75 0 0 0 .74-1.16l-3.874-5.764Z" }]
	},
	"outline": {
		"a": {
			"fill": "none",
			"viewBox": "0 0 24 24",
			"stroke-width": "1.5",
			"stroke": "currentColor"
		},
		"path": [{
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Zm-8.962 3.712a.75.75 0 0 1 0 1.061l-1.591 1.591a.75.75 0 1 1-1.061-1.06l1.591-1.592a.75.75 0 0 1 1.06 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/settings/embeds/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			CommonList($$renderer, {
				children: ($$renderer) => {
					ToggleSetting($$renderer, {
						icon: CursorArrowRays,
						title: "Click to view",
						description: "Only load embeds once you click on them.",
						get checked() {
							return settings.embeds.clickToView;
						},
						set checked($$value) {
							settings.embeds.clickToView = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>YouTube</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span>The website to embed YouTube content in.</span>`);
						}
						Setting($$renderer, {
							icon: VideoCamera,
							title,
							description,
							children: ($$renderer) => {
								Select($$renderer, {
									get value() {
										return settings.embeds.youtube;
									},
									set value($$value) {
										settings.embeds.youtube = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										Option($$renderer, {
											value: "youtube",
											children: ($$renderer) => {
												$$renderer.push(`<!---->YouTube`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Option($$renderer, {
											value: "invidious",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Invidious`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Option($$renderer, {
											value: "piped",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Piped`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								});
							},
							$$slots: {
								title: true,
								description: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> `);
					if (settings.embeds.youtube == "invidious") {
						$$renderer.push("<!--[0-->");
						{
							function title($$renderer) {
								$$renderer.push(`<span>Invidious instance</span>`);
							}
							function description($$renderer) {
								$$renderer.push(`<span>The instance to embed YouTube content in.</span>`);
							}
							Setting($$renderer, {
								title,
								description,
								children: ($$renderer) => {
									TextInput($$renderer, {
										label: "Invidious instance",
										pattern: DOMAIN_REGEX_FORMS,
										get value() {
											return settings.embeds.invidious;
										},
										set value($$value) {
											settings.embeds.invidious = $$value;
											$$settled = false;
										}
									});
								},
								$$slots: {
									title: true,
									description: true,
									default: true
								}
							});
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (settings.embeds.youtube == "piped") {
						$$renderer.push("<!--[0-->");
						{
							function title($$renderer) {
								$$renderer.push(`<span>Piped instance</span>`);
							}
							function description($$renderer) {
								$$renderer.push(`<span>The instance to embed YouTube content in.</span>`);
							}
							Setting($$renderer, {
								title,
								description,
								children: ($$renderer) => {
									TextInput($$renderer, {
										label: "Piped instance",
										pattern: DOMAIN_REGEX_FORMS,
										get value() {
											return settings.embeds.piped;
										},
										set value($$value) {
											settings.embeds.piped = $$value;
											$$settled = false;
										}
									});
								},
								$$slots: {
									title: true,
									description: true,
									default: true
								}
							});
						}
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
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map