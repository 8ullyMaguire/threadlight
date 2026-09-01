import "./internal.js";
import { o as escape_html } from "./validate.js";
import "./server.js";
import "./navigation.js";
import { D as debounce, R as Header, Ut as TextInput, Yt as Spinner, Zt as Button, ar as page, ft as DOMAIN_REGEX_FORMS, nr as BaseClient, o as profile, rr as DEFAULT_CLIENT_TYPE, v as LINKED_INSTANCE_URL, vt as instanceToURL } from "./client.svelte.js";
//#region src/routes/login/guest/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = page.url.searchParams.get("redirect") ?? "/", children } = $$props;
		let form = {
			instance: "",
			username: `$Guest ${profile.meta.profiles.filter((p) => p.jwt == void 0).length + 1}`,
			loading: false,
			client: DEFAULT_CLIENT_TYPE
		};
		async function checkInstance() {
			const type = await BaseClient.fetchInfo(new URL(instanceToURL(form.instance)));
			if (type == null) throw Error("not_live_supported");
			form.client = type?.type;
		}
		let detectedClient = void 0;
		debounce(async () => {
			const startingText = form.instance;
			try {
				detectedClient = null;
				await checkInstance();
				if (startingText == form.instance) detectedClient = form.client.name;
			} catch {
				if (startingText == form.instance) detectedClient = void 0;
			}
		}, 500);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="max-w-xl w-full mx-auto h-max my-auto"><form class="flex flex-col gap-5"><div class="flex flex-col gap-2">`);
			children?.($$renderer);
			$$renderer.push(`<!----> `);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Add guest`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> <div class="inline-flex items-center gap-2">`);
			TextInput($$renderer, {
				required: true,
				label: "Name",
				placeholder: "Guest 2",
				minlength: 1,
				class: "flex-1",
				get value() {
					return form.username;
				},
				set value($$value) {
					form.username = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			if (!LINKED_INSTANCE_URL) {
				$$renderer.push("<!--[0-->");
				{
					function customLabel($$renderer) {
						$$renderer.push(`<!---->Server domain <span class="absolute right-0">`);
						if (detectedClient) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span class="capitalize font-normal">${escape_html(detectedClient)}</span>`);
						} else if (detectedClient === null) {
							$$renderer.push("<!--[1-->");
							Spinner($$renderer, {});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></span>`);
					}
					TextInput($$renderer, {
						required: true,
						pattern: DOMAIN_REGEX_FORMS,
						placeholder: "example.com",
						class: "flex-1",
						autocorrect: "off",
						autocapitalize: "none",
						get value() {
							return form.instance;
						},
						set value($$value) {
							form.instance = $$value;
							$$settled = false;
						},
						customLabel,
						$$slots: { customLabel: true }
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			Button($$renderer, {
				submit: true,
				class: "w-full",
				color: "primary",
				size: "lg",
				loading: form.loading,
				disabled: form.loading,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Submit`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form></div>`);
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
export { _page as t };

//# sourceMappingURL=_page2.js.map