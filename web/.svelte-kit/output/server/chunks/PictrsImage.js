import { n as attr } from "./validate.js";
import { h as stringify } from "./server.js";
import { It as action, Lt as modal, Zt as Button, at as RelativeDate, er as ArrowDownTray, f as toast, nn as Trash, nt as UserLink, o as profile, t as client, tr as publishedToDate, vt as instanceToURL } from "./client.svelte.js";
//#region src/lib/feature/user/PictrsImage.svelte
function PictrsImage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let loading = false;
		async function deleteImage(image) {
			if (!profile.current?.jwt) return;
			try {
				loading = true;
				const res = await client().deleteImage({
					token: image.pictrs_delete_token,
					filename: image.pictrs_alias
				});
				ondelete?.(res);
			} catch (e) {
				toast({
					content: e,
					type: "error"
				});
			}
			loading = false;
		}
		let { image, user, ondelete } = $$props;
		function img($$renderer) {
			$$renderer.push(`<button class="cursor-pointer"><img${attr("src", `${stringify(instanceToURL(profile.current.instance))}/pictrs/image/${stringify(image.pictrs_alias)}`)} width="500" height="500" class="aspect-square w-full h-full object-cover rounded-xl" alt="pictrs"/></button>`);
		}
		$$renderer.push(`<div class="flex flex-col gap-1">`);
		img($$renderer);
		$$renderer.push(`<!----> `);
		if (user) {
			$$renderer.push("<!--[0-->");
			UserLink($$renderer, { user });
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-center gap-2">`);
		RelativeDate($$renderer, {
			class: "text-sm text-slate-700 dark:text-zinc-300",
			date: publishedToDate(image.published)
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			title: "Download",
			href: `${stringify(instanceToURL(profile.current.instance))}/pictrs/image/${stringify(image.pictrs_alias)}`,
			size: "square-md",
			class: "ml-auto",
			icon: ArrowDownTray
		});
		$$renderer.push(`<!----> `);
		Button($$renderer, {
			title: "Delete",
			onclick: () => {
				modal({
					title: "Confirm",
					body: "",
					snippet: img,
					actions: [action({
						close: true,
						content: "Cancel"
					}), action({
						type: "danger",
						action: () => deleteImage(image),
						close: true,
						content: "Delete"
					})]
				});
			},
			size: "square-md",
			loading,
			disabled: loading,
			icon: Trash
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { PictrsImage as t };

//# sourceMappingURL=PictrsImage.js.map