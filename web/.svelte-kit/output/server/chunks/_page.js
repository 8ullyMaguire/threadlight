import { o as escape_html } from "./validate.js";
import { l as head } from "./server.js";
import "./navigation.js";
import { D as debounce, R as Header, Ut as TextInput, Xt as ButtonGroup, Yt as Spinner, Zt as Button, _ as DEFAULT_INSTANCE_URL, a as LemmyClient, ar as page, c as Note, ft as DOMAIN_REGEX_FORMS, nr as BaseClient, rr as DEFAULT_CLIENT_TYPE, v as LINKED_INSTANCE_URL, vt as instanceToURL, z as PiefedClient } from "./client.svelte.js";
import { t as Identification } from "./Identification.js";
import { t as QuestionMarkCircle } from "./QuestionMarkCircle.js";
import { t as UserCircle } from "./UserCircle.js";
import { t as ErrorContainer } from "./ErrorContainer.js";
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = page.url.searchParams.get("redirect") ?? "/", children } = $$props;
		let form = {
			instance: DEFAULT_INSTANCE_URL,
			username: "",
			password: "",
			totp: "",
			loading: false,
			attempts: 0,
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
			head("1x05zx6", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Log in</title>`);
				});
			});
			$$renderer.push(`<form class="flex flex-col gap-5 max-w-xl w-full mx-auto h-max my-auto"><div class="flex flex-col">`);
			children?.($$renderer);
			$$renderer.push(`<!----> `);
			Header($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Log in`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			ErrorContainer($$renderer, {
				class: "pt-2",
				scope: page.route.id
			});
			$$renderer.push(`<!----></div> `);
			if (form.client.name == "piefed") {
				$$renderer.push("<!--[0-->");
				Note($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->Piefed support is experimental. Some features are not supported.`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex items-center gap-2">`);
			TextInput($$renderer, {
				id: "username",
				label: "Username",
				class: "flex-1",
				required: true,
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
						id: "instance_url",
						placeholder: DEFAULT_INSTANCE_URL,
						disabled: LINKED_INSTANCE_URL != void 0,
						class: "flex-1",
						required: true,
						pattern: DOMAIN_REGEX_FORMS,
						autocorrect: "off",
						autocapitalize: "off",
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
			$$renderer.push(`<!--]--></div> <div role="presentation" class="flex flex-row gap-2">`);
			TextInput($$renderer, {
				id: "password",
				label: "Password",
				type: "password",
				minlength: form.client.name == "piefed" ? PiefedClient.constants.password.minLength : LemmyClient.constants.password.minLength,
				maxlength: form.client.name == "piefed" ? PiefedClient.constants.password.maxLength : LemmyClient.constants.password.maxLength,
				required: true,
				class: "flex-1!",
				get value() {
					return form.password;
				},
				set value($$value) {
					form.password = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			TextInput($$renderer, {
				id: "totp",
				label: "2FA Code",
				placeholder: "123456",
				pattern: "\\d{6}",
				minlength: 6,
				maxlength: 6,
				class: "w-24",
				get value() {
					return form.totp;
				},
				set value($$value) {
					form.totp = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> `);
			Button($$renderer, {
				loading: form.loading,
				disabled: form.loading,
				color: "primary",
				size: "lg",
				submit: true,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Log in`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <hr class="border-slate-200 dark:border-zinc-800"/> `);
			ButtonGroup($$renderer, {
				orientation: "horizontal",
				class: "flex overflow-auto",
				children: ($$renderer) => {
					Button($$renderer, {
						href: "/signup",
						icon: Identification,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Sign up`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						href: "/login_reset",
						icon: QuestionMarkCircle,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Forgot password`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (!LINKED_INSTANCE_URL) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							href: "/login/guest",
							icon: UserCircle,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Guest`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></form>`);
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

//# sourceMappingURL=_page.js.map