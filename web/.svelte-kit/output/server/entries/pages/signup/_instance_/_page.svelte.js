import { n as attr } from "../../../../chunks/validate.js";
import { h as stringify, i as await_block, l as head, o as derived } from "../../../../chunks/server.js";
import "../../../../chunks/navigation.js";
import { Bt as Switch, Dn as ExclamationTriangle, Gt as Label, R as Header, Ut as TextInput, Wt as TextArea, Yt as Spinner, Zt as Button, ar as page, n as getClient, p as Markdown, qt as Material, un as Plus } from "../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../chunks/Placeholder.js";
import { t as ArrowLeft } from "../../../../chunks/ArrowLeft.js";
import { t as ArrowPath } from "../../../../chunks/ArrowPath.js";
import { t as AtSymbol } from "../../../../chunks/AtSymbol.js";
import { t as Envelope } from "../../../../chunks/Envelope.js";
import { t as Key } from "../../../../chunks/Key.js";
import { t as QuestionMarkCircle } from "../../../../chunks/QuestionMarkCircle.js";
import { t as XCircle } from "../../../../chunks/XCircle.js";
import { t as EntityHeader } from "../../../../chunks/EntityHeader.js";
import { t as ErrorContainer } from "../../../../chunks/ErrorContainer.js";
//#region src/routes/signup/[instance]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const instance = page.params.instance;
		let captchaRequired = data.site_view.local_site.captcha_enabled;
		let email = "";
		let username = "";
		let password = "";
		let passwordVerify = "";
		let captcha = void 0;
		let verifyCaptcha = void 0;
		let application = "";
		let submitting = false;
		let honeypot = void 0;
		let nsfw = false;
		const getCaptcha = async () => captcha = await getClient(instance, fetch).getCaptcha();
		let captchaAudio = derived(() => captcha?.ok?.wav ? `data:audio/wav;base64,${captcha.ok.wav}` : "");
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1bi4187", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Sign up</title>`);
				});
			});
			$$renderer.push(`<div class="flex flex-col md:flex-row flex-1/2 gap-8 h-full max-w-6xl mx-auto">`);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<form class="flex flex-col gap-4 h-full w-full flex-2/3">`);
			Button($$renderer, {
				href: "/accounts",
				class: " mb-4 w-max",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: ArrowLeft,
						size: "16",
						micro: true
					});
					$$renderer.push(`<!----> Back`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			{
				function extended($$renderer) {
					$$renderer.push(`<div class="md:hidden">`);
					EntityHeader($$renderer, {
						name: data.site_view.site.name,
						avatar: data.site_view.site.icon,
						banner: data.site_view.site.banner || null,
						compact: "always",
						avatarCircle: false
					});
					$$renderer.push(`<!----></div>`);
				}
				Header($$renderer, {
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Sign Up`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			ErrorContainer($$renderer, { scope: page.url.pathname });
			$$renderer.push(`<!----> `);
			if (data.site_view.local_site.registration_mode != "Closed") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-col md:flex-row gap-2 *:flex-1">`);
				TextInput($$renderer, {
					label: "Email",
					required: data.site_view.local_site.require_email_verification,
					type: "email",
					icon: Envelope,
					size: "md",
					get value() {
						return email;
					},
					set value($$value) {
						email = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Username",
					required: true,
					icon: AtSymbol,
					get value() {
						return username;
					},
					set value($$value) {
						username = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div class="flex flex-col md:flex-row *:flex-1 gap-2">`);
				TextInput($$renderer, {
					label: "Password",
					required: true,
					type: "password",
					icon: Key,
					get value() {
						return password;
					},
					set value($$value) {
						password = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Confirm password",
					required: true,
					type: "password",
					icon: Key,
					get value() {
						return passwordVerify;
					},
					set value($$value) {
						passwordVerify = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> `);
				if (data.site_view.local_site.registration_mode == "RequireApplication") {
					$$renderer.push("<!--[0-->");
					Material($$renderer, {
						rounding: "2xl",
						color: "warning",
						icon: ExclamationTriangle,
						children: ($$renderer) => {
							$$renderer.push(`<!---->To join this server, you must fill out this application, and wait to be accepted. You will receive an email if your application is accepted.`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Material($$renderer, {
						rounding: "2xl",
						color: "info",
						children: ($$renderer) => {
							if (data.site_view.local_site.application_question) {
								$$renderer.push("<!--[0-->");
								Markdown($$renderer, { source: data.site_view.local_site.application_question });
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					TextArea($$renderer, {
						label: "Application",
						required: true,
						get value() {
							return application;
						},
						set value($$value) {
							application = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!---->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (captchaRequired) {
					$$renderer.push("<!--[0-->");
					Label($$renderer, {
						class: "block -mb-3 font-medium text-sm",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Captcha`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Material($$renderer, {
						rounding: "2xl",
						children: ($$renderer) => {
							$$renderer.push(`<div class="flex flex-col gap-4">`);
							await_block($$renderer, getCaptcha(), () => {
								Spinner($$renderer, { width: 32 });
							}, () => {
								if (captcha?.ok) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<img${attr("src", `data:image/png;base64,${stringify(captcha.ok.png)}`)} alt="Captcha" class="w-max"/> <audio controls=""${attr("src", captchaAudio())}></audio>`);
								} else {
									$$renderer.push("<!--[-1-->");
									Material($$renderer, {
										class: "flex gap-2 dark:text-yellow-200 text-yellow-800 bg-yellow-500/20",
										children: ($$renderer) => {
											Icon($$renderer, {
												src: QuestionMarkCircle,
												mini: true,
												size: "24"
											});
											$$renderer.push(`<!----> No captcha was returned`);
										},
										$$slots: { default: true }
									});
								}
								$$renderer.push(`<!--]-->`);
							});
							$$renderer.push(`<!--]--> `);
							Button($$renderer, {
								onclick: () => getCaptcha(),
								size: "square-md",
								children: ($$renderer) => {
									Icon($$renderer, {
										src: ArrowPath,
										size: "16",
										mini: true
									});
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							TextInput($$renderer, {
								required: true,
								get value() {
									return verifyCaptcha;
								},
								set value($$value) {
									verifyCaptcha = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Switch($$renderer, {
					get checked() {
						return nsfw;
					},
					set checked($$value) {
						nsfw = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Show NSFW content`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <input type="dn" name="honeypot"${attr("value", honeypot)} class="hidden"/> `);
				Button($$renderer, {
					submit: true,
					color: "primary",
					size: "lg",
					loading: submitting,
					disabled: submitting,
					class: "mt-auto",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Submit`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="my-auto">`);
				Placeholder($$renderer, {
					icon: XCircle,
					title: "Registrations closed",
					description: "This server has registrations closed. Find another server.",
					children: ($$renderer) => {
						Button($$renderer, {
							icon: Plus,
							href: "/signup",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Find another server`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></form>`);
			$$renderer.push(`<!--]--> <div class="flex-1/2 flex flex-col gap-2 max-md:hidden"><div class="w-full sticky top-0">`);
			EntityHeader($$renderer, {
				name: data.site_view.site.name,
				avatar: data.site_view.site.icon,
				banner: data.site_view.site.banner || null,
				avatarCircle: false,
				bio: data.site_view.site.sidebar
			});
			$$renderer.push(`<!----></div></div></div>`);
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