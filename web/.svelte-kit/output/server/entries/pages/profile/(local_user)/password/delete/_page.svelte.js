import "../../../../../../chunks/server.js";
import { t as goto } from "../../../../../../chunks/navigation.js";
import { Bt as Switch, Ut as TextInput, Zt as Button, d as removeToast, f as toast, o as profile, t as client } from "../../../../../../chunks/client.svelte.js";
//#region src/routes/profile/(local_user)/password/delete/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let deletion = {
			modal: false,
			password: "",
			deleteContent: false
		};
		async function deleteAccount(level) {
			switch (level) {
				case 0:
					toast({
						content: "Are you sure you want to delete your account?",
						action: () => deleteAccount(1)
					});
					return;
				case 1:
					toast({
						content: "Are you really sure?",
						action: () => deleteAccount(2)
					});
					return;
				case 2:
					toast({
						content: "Final warning. Are you really sure?",
						action: () => deleteAccount(3)
					});
					return;
				case 3:
					deletion.modal = true;
					deletion.password = "";
					return;
			}
			if (!(deletion.password || null)) toast({
				content: "You must provide your password.",
				type: "warning"
			});
			const id = toast({
				content: "Deleting your account...",
				loading: true
			});
			try {
				await client().deleteAccount({
					password: deletion.password,
					delete_content: deletion.deleteContent
				});
				profile.remove(profile.current.id);
				profile.meta.profile = -1;
				toast({ content: "Your account was deleted." });
				goto("/");
			} catch (err) {
				toast({
					content: err,
					type: "error"
				});
			} finally {
				removeToast(id);
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="w-full flex flex-col gap-4 max-w-xl">`);
			TextInput($$renderer, {
				label: "Password",
				type: "password",
				get value() {
					return deletion.password;
				},
				set value($$value) {
					deletion.password = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			{
				function description($$renderer) {
					$$renderer.push(`<span>This will delete ALL of your submissions.</span>`);
				}
				Switch($$renderer, {
					get checked() {
						return deletion.deleteContent;
					},
					set checked($$value) {
						deletion.deleteContent = $$value;
						$$settled = false;
					},
					description,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Delete content`);
					},
					$$slots: {
						description: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				submit: true,
				color: "danger",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Submit`);
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
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map