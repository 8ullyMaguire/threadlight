import "../../../../../../chunks/server.js";
import { t as goto } from "../../../../../../chunks/navigation.js";
import { Mn as ClipboardDocument, Rt as Modal, Ut as TextInput, Zt as Button, ar as page, f as toast, qt as Material, t as client, tt as errorMessage } from "../../../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../../../chunks/Placeholder.js";
import { t as Key } from "../../../../../../chunks/Key.js";
import "headless-qr";
//#region src/routes/profile/(local_user)/password/2fa/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let totpLink = void 0;
		let totpEnabled = data.my_user?.local_user_view.local_user.totp_2fa_enabled;
		let verify_totp = "";
		let openModal = false;
		async function twofa(enabled, update = false) {
			try {
				if (!enabled && !update) {
					openModal = true;
					return;
				}
				if (update) {
					await client().updateTotp({
						enabled,
						totp_token: verify_totp
					});
					toast({
						content: `2FA has been ${enabled ? "enabled" : "disabled"}`,
						type: "success"
					});
					goto(page.url, { invalidateAll: true });
				} else {
					totpLink = (await client().generateTotpSecret()).totp_secret_url;
					openModal = true;
				}
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="w-full flex flex-col h-full">`);
			Modal($$renderer, {
				dismissable: false,
				title: "2FA",
				get open() {
					return openModal;
				},
				set open($$value) {
					openModal = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					if (totpLink && !totpEnabled) {
						$$renderer.push("<!--[0-->");
						Material($$renderer, {
							rounding: "2xl",
							color: "uniform",
							class: "",
							children: ($$renderer) => {
								$$renderer.push(`<svg></svg>`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						{
							function suffix($$renderer) {
								$$renderer.push(`<button class="contents">`);
								Icon($$renderer, {
									src: ClipboardDocument,
									size: "20",
									mini: true
								});
								$$renderer.push(`<!----></button>`);
							}
							TextInput($$renderer, {
								disabled: true,
								type: "password",
								value: totpLink,
								label: "TOTP",
								suffix,
								children: ($$renderer) => {
									$$renderer.push(`<span class="font-normal text-xs">Paste this in your authenticator app.</span>`);
								},
								$$slots: {
									suffix: true,
									default: true
								}
							});
						}
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <form class="flex flex-col gap-2 w-full">`);
					TextInput($$renderer, {
						placeholder: "012345",
						label: "2FA Code",
						pattern: "\\d{6}",
						required: true,
						get value() {
							return verify_totp;
						},
						set value($$value) {
							verify_totp = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					if (totpEnabled) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							submit: true,
							size: "lg",
							color: "primary",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Disable`);
							},
							$$slots: { default: true }
						});
					} else {
						$$renderer.push("<!--[-1-->");
						Button($$renderer, {
							submit: true,
							size: "lg",
							color: "primary",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Enable`);
							},
							$$slots: { default: true }
						});
					}
					$$renderer.push(`<!--]--></form>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="flex flex-col items-center justify-center h-full gap-4 p-4">`);
			if (totpEnabled) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					iconClass: "p-3 bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400 rounded-full",
					icon: Key,
					title: "2FA is enabled",
					children: ($$renderer) => {
						Button($$renderer, {
							onclick: () => twofa(false, false),
							rounding: "pill",
							color: "primary",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Disable`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
			} else {
				$$renderer.push("<!--[-1-->");
				Placeholder($$renderer, {
					iconClass: "p-3 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-full",
					icon: Key,
					title: "2FA is disabled",
					children: ($$renderer) => {
						Button($$renderer, {
							onclick: () => twofa(true, false),
							rounding: "pill",
							color: "primary",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Setup`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--></div></div>`);
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