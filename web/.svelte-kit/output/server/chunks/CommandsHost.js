import { o as escape_html, r as clsx } from "./validate.js";
import { i as await_block, t as attr_class } from "./server.js";
import { At as settings, Jt as TextLoader, Rt as Modal, T as EndPlaceholder, hn as Newspaper, jt as Popover, l as Badge, p as Markdown, wt as userLink, zt as Expandable } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ServerStack } from "./ServerStack.js";
import { t as LabelStat } from "./LabelStat.js";
import { t as EntityHeader } from "./EntityHeader.js";
import { t as ItemList } from "./ItemList.js";
import { t as SidebarButton } from "./SidebarButton.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/BuildingOffice.js
var BuildingOffice = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3.75 2a.75.75 0 0 0 0 1.5H4v9h-.25a.75.75 0 0 0 0 1.5H6a.5.5 0 0 0 .5-.5v-3A.5.5 0 0 1 7 10h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h2.25a.75.75 0 0 0 0-1.5H12v-9h.25a.75.75 0 0 0 0-1.5h-8.5ZM6.5 4a.5.5 0 0 0-.5.5V5a.5.5 0 0 0 .5.5H7a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 0 7 4h-.5ZM6 7a.5.5 0 0 1 .5-.5H7a.5.5 0 0 1 .5.5v.5A.5.5 0 0 1 7 8h-.5a.5.5 0 0 1-.5-.5V7Zm3-3a.5.5 0 0 0-.5.5V5a.5.5 0 0 0 .5.5h.5A.5.5 0 0 0 10 5v-.5a.5.5 0 0 0-.5-.5H9Zm-.5 3a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H9a.5.5 0 0 1-.5-.5V7Z",
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
			"d": "M4 16.5v-13h-.25a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5H16v13h.25a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5H4Zm3-11a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM11 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm.5 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z",
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
			"d": "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Moon.js
var Moon = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z",
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
			"d": "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Swatch.js
var Swatch = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8.5a2.5 2.5 0 0 1-5 0V3Zm3.25 8.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z",
			"clip-rule": "evenodd"
		}, { "d": "m8.5 11.035 3.778-3.778a1 1 0 0 0 0-1.414l-2.122-2.121a1 1 0 0 0-1.414 0l-.242.242v7.07ZM7.656 14H13a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-.344l-5 5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3.5 2A1.5 1.5 0 0 0 2 3.5V15a3 3 0 1 0 6 0V3.5A1.5 1.5 0 0 0 6.5 2h-3Zm11.753 6.99L9.5 14.743V6.257l1.51-1.51a1.5 1.5 0 0 1 2.122 0l2.121 2.121a1.5 1.5 0 0 1 0 2.122ZM8.364 18H16.5a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-2.136l-6 6ZM5 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 1 1-9 0V4.125Zm4.5 14.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z",
			"clip-rule": "evenodd"
		}, { "d": "M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257ZM12.738 17.625l6.474-6.474a1.875 1.875 0 0 0 0-2.651L15.5 4.787a1.875 1.875 0 0 0-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/UserGroup.js
var UserGroup = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.156 11.763c.16-.629.44-1.21.813-1.72a2.5 2.5 0 0 0-2.725 1.377c-.136.287.102.58.418.58h1.449c.01-.077.025-.156.045-.237ZM12.847 11.763c.02.08.036.16.046.237h1.446c.316 0 .554-.293.417-.579a2.5 2.5 0 0 0-2.722-1.378c.374.51.653 1.09.813 1.72ZM14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 13c-.552 0-1.013-.455-.876-.99a4.002 4.002 0 0 1 7.753 0c.136.535-.324.99-.877.99H5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" }]
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
			"d": "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z",
			"clip-rule": "evenodd"
		}, { "d": "M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" }]
	}
};
//#endregion
//#region src/lib/feature/instance/InstanceCard.svelte
function InstanceCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { site, taglines, admins, version, class: clazz = "" } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<aside${attr_class(clsx(["w-full text-slate-600 dark:text-zinc-400 flex flex-col gap-4 text-sm", clazz]))}>`);
			EntityHeader($$renderer, {
				name: site.site.name,
				avatar: site.site.icon,
				banner: site.site.banner || null,
				compact: "always",
				avatarCircle: false
			});
			$$renderer.push(`<!----> <div class="flex flex-col gap-1">`);
			if (taglines && taglines.length > 0) {
				$$renderer.push("<!--[0-->");
				Markdown($$renderer, {
					class: "px-3",
					source: taglines[Math.floor(Math.random() * taglines.length)].content
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			EndPlaceholder($$renderer, {
				size: "xs",
				margin: "sm",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Server info`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			SidebarButton($$renderer, {
				href: "/modlog",
				label: "Modlog",
				icon: Newspaper
			});
			$$renderer.push(`<!----> `);
			SidebarButton($$renderer, {
				href: "/legal",
				label: "Legal",
				icon: BuildingOffice
			});
			$$renderer.push(`<!----> `);
			SidebarButton($$renderer, {
				href: "/instances",
				label: "Linked servers",
				icon: ServerStack
			});
			$$renderer.push(`<!----> `);
			EndPlaceholder($$renderer, {
				size: "xs",
				margin: "sm",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Statistics`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="flex flex-row gap-4 flex-wrap px-3">`);
			LabelStat($$renderer, {
				label: "Users",
				content: site.counts.users.toString(),
				formatted: true
			});
			$$renderer.push(`<!----> `);
			LabelStat($$renderer, {
				label: "Posts",
				content: site.counts.posts.toString(),
				formatted: true
			});
			$$renderer.push(`<!----> `);
			LabelStat($$renderer, {
				label: "Comments",
				content: site.counts.comments.toString(),
				formatted: true
			});
			$$renderer.push(`<!----> `);
			{
				function target($$renderer, attachment) {
					$$renderer.push(`<button class="text-left cursor-pointer">`);
					LabelStat($$renderer, {
						label: "Active Today",
						content: site.counts.users_active_day.toString(),
						formatted: true
					});
					$$renderer.push(`<!----></button>`);
				}
				Popover($$renderer, {
					openOnHover: true,
					placement: "bottom-end",
					target,
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex flex-row gap-4 flex-wrap px-3">`);
						LabelStat($$renderer, {
							label: "Past week",
							content: site.counts.users_active_week.toString(),
							formatted: true
						});
						$$renderer.push(`<!----> `);
						LabelStat($$renderer, {
							label: "Past month",
							content: site.counts.users_active_month.toString(),
							formatted: true
						});
						$$renderer.push(`<!----> `);
						LabelStat($$renderer, {
							label: "6 months",
							content: site.counts.users_active_half_year.toString(),
							formatted: true
						});
						$$renderer.push(`<!----></div>`);
					},
					$$slots: {
						target: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			LabelStat($$renderer, {
				label: "Communities",
				content: site.counts.communities.toString(),
				formatted: true
			});
			$$renderer.push(`<!----></div> `);
			EndPlaceholder($$renderer, {
				size: "xs",
				margin: "sm",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Info`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="space-y-3 px-1.5 text-sm">`);
			{
				function title($$renderer) {
					$$renderer.push(`<span class="flex items-center gap-1 py-1 px-2 w-full">About</span>`);
				}
				Expandable($$renderer, {
					get open() {
						return settings.expand.about;
					},
					set open($$value) {
						settings.expand.about = $$value;
						$$settled = false;
					},
					title,
					children: ($$renderer) => {
						Markdown($$renderer, { source: site.site.description });
						$$renderer.push(`<!----> <div class="my-4"></div> `);
						Markdown($$renderer, { source: site.site.sidebar });
						$$renderer.push(`<!----> `);
						if (version) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="w-max">`);
							Badge($$renderer, {
								label: "Lemmy version",
								children: ($$renderer) => {
									Icon($$renderer, {
										src: ServerStack,
										micro: true,
										size: "14"
									});
									$$renderer.push(`<!----> ${escape_html(version)}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						title: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			if (admins) {
				$$renderer.push("<!--[0-->");
				{
					function title($$renderer) {
						$$renderer.push(`<span class="flex items-center gap-1 py-1 px-2 w-full">Admins</span>`);
					}
					Expandable($$renderer, {
						get open() {
							return settings.expand.team;
						},
						set open($$value) {
							settings.expand.team = $$value;
							$$settled = false;
						},
						title,
						children: ($$renderer) => {
							ItemList($$renderer, { items: admins.map((i) => ({
								id: i.person.id,
								name: i.person.display_name || i.person.name,
								url: userLink(i.person),
								avatar: i.person.avatar,
								instance: new URL(i.person.actor_id).hostname
							})) });
						},
						$$slots: {
							title: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div></aside>`);
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
//#region src/lib/ui/navbar/commands/CommandsHost.svelte
var chords = { commands: false };
function CommandsHost($$renderer) {
	let $$settled = true;
	let $$inner_renderer;
	function $$render_inner($$renderer) {
		if (chords.commands) {
			$$renderer.push("<!--[0-->");
			Modal($$renderer, {
				title: null,
				class: "p-0! gap-0!",
				get open() {
					return chords.commands;
				},
				set open($$value) {
					chords.commands = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					await_block($$renderer, import("./Commands.js"), () => {
						$$renderer.push(`<div class="h-128 flex flex-col gap-2 items-center justify-center">`);
						TextLoader($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<!---->Downloading actions`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div>`);
					}, ({ default: Commands }) => {
						if (Commands) {
							$$renderer.push("<!--[-->");
							Commands($$renderer, {
								get open() {
									return chords.commands;
								},
								set open($$value) {
									chords.commands = $$value;
									$$settled = false;
								}
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					});
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}
	do {
		$$settled = true;
		$$inner_renderer = $$renderer.copy();
		$$render_inner($$inner_renderer);
	} while (!$$settled);
	$$renderer.subsume($$inner_renderer);
}
//#endregion
export { Swatch as a, UserGroup as i, chords as n, Moon as o, InstanceCard as r, CommandsHost as t };

//# sourceMappingURL=CommandsHost.js.map