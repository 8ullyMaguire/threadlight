import { n as attr_style } from "./server.js";
import { nt as UserLink, o as profile, p as Markdown } from "./client.svelte.js";
//#region src/lib/feature/inbox/PrivateMessage.svelte
function PrivateMessage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { message, meta = true, style = "" } = $$props;
		$$renderer.push(`<div class="flex flex-col gap-2 text-sm"${attr_style(style)}>`);
		if (meta) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-row gap-2 items-center flex-wrap"><span class="font-medium text-xs">From</span> `);
			UserLink($$renderer, {
				showInstance: false,
				user: message.creator,
				avatar: true,
				avatarSize: 20
			});
			$$renderer.push(`<!----> `);
			if (profile.current?.user?.local_user_view.person.id != message.recipient.id) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`to `);
				UserLink($$renderer, {
					showInstance: false,
					user: message.recipient,
					avatar: true,
					avatarSize: 20
				});
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Markdown($$renderer, {
			rendererOptions: { autoloadImages: false },
			source: message.private_message.content
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { PrivateMessage as t };

//# sourceMappingURL=PrivateMessage.js.map