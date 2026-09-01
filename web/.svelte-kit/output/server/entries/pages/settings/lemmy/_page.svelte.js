import "../../../../chunks/server.js";
import { At as settings, Bt as Switch, Dn as ExclamationTriangle, F as CommonList, Yn as Bars3, sn as Share } from "../../../../chunks/client.svelte.js";
import { t as CubeTransparent } from "../../../../chunks/CubeTransparent.js";
import { t as Eye } from "../../../../chunks/Eye.js";
import { t as EyeSlash } from "../../../../chunks/EyeSlash.js";
import { t as ServerStack } from "../../../../chunks/ServerStack.js";
import { t as Setting } from "../../../../chunks/Setting.js";
import { t as ToggleSetting } from "../../../../chunks/ToggleSetting.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/BookOpen.js
var BookOpen = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M7.25 3.688a8.035 8.035 0 0 0-4.872-.523A.48.48 0 0 0 2 3.64v7.994c0 .345.342.588.679.512a6.02 6.02 0 0 1 4.571.81V3.688ZM8.75 12.956a6.02 6.02 0 0 1 4.571-.81c.337.075.679-.167.679-.512V3.64a.48.48 0 0 0-.378-.475 8.034 8.034 0 0 0-4.872.523v9.268Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.75 16.82A7.462 7.462 0 0 1 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06v-11a.75.75 0 0 0-.546-.721A9.006 9.006 0 0 0 15 3a8.963 8.963 0 0 0-4.25 1.065V16.82ZM9.25 4.065A8.963 8.963 0 0 0 5 3c-.85 0-1.673.118-2.454.339A.75.75 0 0 0 2 4.06v11a.75.75 0 0 0 .954.721A7.506 7.506 0 0 1 5 15.5c1.579 0 3.042.487 4.25 1.32V4.065Z" }]
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
			"d": "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/User.js
var User = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" }]
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
			"d": "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/settings/lemmy/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			CommonList($$renderer, {
				children: ($$renderer) => {
					ToggleSetting($$renderer, {
						icon: Eye,
						title: "Show hidden posts",
						description: "Shows the posts you've manually hidden.",
						get checked() {
							return settings.posts.showHidden;
						},
						set checked($$value) {
							settings.posts.showHidden = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: Bars3,
						title: "Compact featured posts",
						description: "Makes featured posts more compact.",
						get checked() {
							return settings.posts.compactFeatured;
						},
						set checked($$value) {
							settings.posts.compactFeatured = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: BookOpen,
						title: "Mark posts as read automatically",
						description: "Marks posts as read when you visit them.",
						get checked() {
							return settings.markPostsAsRead;
						},
						set checked($$value) {
							settings.markPostsAsRead = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: CubeTransparent,
						title: "Fade read posts",
						description: "Fade the title of posts you've already read",
						get checked() {
							return settings.markReadPosts;
						},
						set checked($$value) {
							settings.markReadPosts = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: Share,
						title: "Mark crossposts",
						description: "Insert 'crossposted from' and a link when crossposting.",
						get checked() {
							return settings.crosspostOriginalLink;
						},
						set checked($$value) {
							settings.crosspostOriginalLink = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>Hide submissions</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span><p>Hide certain types of submissions.</p></span>`);
						}
						Setting($$renderer, {
							icon: EyeSlash,
							title,
							description,
							children: ($$renderer) => {
								$$renderer.push(`<div class="flex flex-col items-start gap-4 flex-wrap">`);
								Switch($$renderer, {
									get checked() {
										return settings.hidePosts.deleted;
									},
									set checked($$value) {
										settings.hidePosts.deleted = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										$$renderer.push(`<!---->Deleted by user`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Switch($$renderer, {
									get checked() {
										return settings.hidePosts.removed;
									},
									set checked($$value) {
										settings.hidePosts.removed = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										$$renderer.push(`<!---->Removed by moderator`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></div>`);
							},
							$$slots: {
								title: true,
								description: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: ExclamationTriangle,
						title: "NSFW blur",
						description: "Blurs images and remove post bodies of NSFW posts.",
						get checked() {
							return settings.nsfwBlur;
						},
						set checked($$value) {
							settings.nsfwBlur = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					{
						function title($$renderer) {
							$$renderer.push(`<!---->Show server identifiers`);
						}
						function description($$renderer) {
							$$renderer.push(`<!---->Shows the servers where certain content originated from.`);
						}
						Setting($$renderer, {
							icon: ServerStack,
							title,
							description,
							children: ($$renderer) => {
								$$renderer.push(`<div class="flex flex-row flex-wrap items-center gap-4">`);
								Switch($$renderer, {
									get checked() {
										return settings.showInstances.user;
									},
									set checked($$value) {
										settings.showInstances.user = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										$$renderer.push(`<!---->Users`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Switch($$renderer, {
									get checked() {
										return settings.showInstances.comments;
									},
									set checked($$value) {
										settings.showInstances.comments = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										$$renderer.push(`<!---->Comments`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Switch($$renderer, {
									get checked() {
										return settings.showInstances.community;
									},
									set checked($$value) {
										settings.showInstances.community = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										$$renderer.push(`<!---->Communities`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----></div>`);
							},
							$$slots: {
								title: true,
								description: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: User,
						title: "Use display name",
						description: "Show users' display names instead of their actual usernames.",
						get checked() {
							return settings.displayNames;
						},
						set checked($$value) {
							settings.displayNames = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!---->`);
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