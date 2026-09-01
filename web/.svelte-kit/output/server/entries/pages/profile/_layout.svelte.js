import { l as head } from "../../../chunks/server.js";
import { I as Tabs, Nt as MenuButton, On as EllipsisHorizontal, Pt as Menu, Zt as Button, dn as Photo } from "../../../chunks/client.svelte.js";
import { n as Icon } from "../../../chunks/Placeholder.js";
import { t as ArrowUp } from "../../../chunks/ArrowUp.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowDown.js
var ArrowDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z",
			"clip-rule": "evenodd"
		}]
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
			"d": "M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/profile/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("15d9fpn", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Profile</title>`);
		});
	});
	$$renderer.push(`<div class="flex flex-row justify-between">`);
	Tabs($$renderer, {
		routes: [
			{
				href: "/profile/user",
				name: "Submissions"
			},
			{
				href: "/profile/settings",
				name: "Edit"
			},
			{
				href: "/profile/blocks",
				name: "Blocked"
			},
			{
				href: "/profile/password",
				name: "Credentials"
			}
		],
		children: ($$renderer) => {
			{
				function target($$renderer, attachment) {
					Button($$renderer, {
						"aria-label": "More actions",
						size: "square-sm",
						color: "none",
						class: "z-0 text-slate-600 dark:text-zinc-500 hover:bg-slate-100 hover:dark:bg-zinc-800",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: EllipsisHorizontal,
								size: "16",
								micro: true
							});
						},
						$$slots: { default: true }
					});
				}
				Menu($$renderer, {
					class: "flex-1",
					placement: "bottom-end",
					target,
					children: ($$renderer) => {
						MenuButton($$renderer, {
							href: "/profile/media",
							icon: Photo,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Media`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							href: "/profile/voted/up",
							icon: ArrowUp,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Upvoted`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							href: "/profile/voted/down",
							icon: ArrowDown,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Downvoted`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						target: true,
						default: true
					}
				});
			}
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div> `);
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map