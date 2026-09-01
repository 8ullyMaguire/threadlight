import { o as escape_html } from "./validate.js";
import { h as stringify, o as derived, t as attr_class } from "./server.js";
import { En as Fire, Gt as Label, _n as Megaphone, at as RelativeDate, b as Link, bn as LockClosed, it as CommunityLink, nn as Trash, nt as UserLink, qt as Material, zn as CheckCircle } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as LockOpen } from "./LockOpen.js";
import { t as QuestionMarkCircle } from "./QuestionMarkCircle.js";
import { t as XCircle } from "./XCircle.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/UserMinus.js
var UserMinus = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 13c.552 0 1.01-.452.9-.994a5.002 5.002 0 0 0-9.802 0c-.109.542.35.994.902.994h8ZM10.75 5.25a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 0 0 8 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 0 0-11.908 0ZM12.75 7.75a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z" }]
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
			"d": "M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.375 2.25a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25ZM10.375 12a7.125 7.125 0 0 0-7.124 7.247.75.75 0 0 0 .363.63 13.067 13.067 0 0 0 6.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 0 0 .364-.63l.001-.12v-.002A7.125 7.125 0 0 0 10.375 12ZM16 9.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/UserPlus.js
var UserPlus = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 13c.552 0 1.01-.452.9-.994a5.002 5.002 0 0 0-9.802 0c-.109.542.35.994.902.994h8ZM12.5 3.5a.75.75 0 0 1 .75.75v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1v-1a.75.75 0 0 1 .75-.75Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" }]
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
			"d": "M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" }]
	}
};
//#endregion
//#region src/routes/modlog/ModlogAction.svelte
function ModlogAction($$renderer, $$props) {
	let { action } = $$props;
	const getAction = (action) => {
		switch (action) {
			case "ban": return {
				icon: XCircle,
				class: "text-red-600 dark:text-red-400",
				text: "Ban (instance)"
			};
			case "banCommunity": return {
				icon: XCircle,
				class: "text-red-600 dark:text-red-400",
				text: "Ban (Community)"
			};
			case "unban": return {
				icon: CheckCircle,
				class: "text-green-600 dark:text-green-400",
				text: "Unban (instance)"
			};
			case "unbanCommunity": return {
				icon: CheckCircle,
				class: "text-green-600 dark:text-green-400",
				text: "Unban (Community)"
			};
			case "commentRemoval": return {
				icon: Trash,
				class: "text-red-600 dark:text-red-400",
				text: "Removal"
			};
			case "commentRestore": return {
				icon: Trash,
				class: "text-green-600 dark:text-green-400",
				text: "Restoration"
			};
			case "postRemoval": return {
				icon: Trash,
				class: "text-red-600 dark:text-red-400",
				text: "Removal"
			};
			case "postRestore": return {
				icon: Trash,
				class: "text-green-600 dark:text-green-400",
				text: "Restoration"
			};
			case "modAdd": return {
				icon: UserPlus,
				class: "text-green-600 dark:text-green-400",
				text: "Added Mod"
			};
			case "modRemove": return {
				icon: UserMinus,
				class: "text-red-600 dark:text-red-400",
				text: "Removed Mod"
			};
			case "postFeature": return {
				icon: Megaphone,
				class: "text-green-600 dark:text-green-400",
				text: "Featured Post"
			};
			case "postUnfeature": return {
				icon: Megaphone,
				class: "text-red-600 dark:text-red-400",
				text: "Unfeatured Post"
			};
			case "postLock": return {
				icon: LockClosed,
				class: "text-yellow-600 dark:text-yellow-400",
				text: "Locked Post"
			};
			case "postUnlock": return {
				icon: LockOpen,
				class: "text-yellow-600 dark:text-yellow-400",
				text: "Unlocked Post"
			};
			case "purge": return {
				icon: Fire,
				class: "text-red-600 dark:text-red-400",
				text: "Purge"
			};
			case "adminAdd": return {
				icon: UserPlus,
				class: "text-green-600 dark:text-green-400",
				text: "Added Admin"
			};
			case "adminRemove": return {
				icon: UserMinus,
				class: "text-red-600 dark:text-red-400",
				text: "Removed Admin"
			};
		}
		return {
			icon: QuestionMarkCircle,
			text: "Unknown",
			class: ""
		};
	};
	let actionData = derived(() => getAction(action));
	$$renderer.push(`<span class="font-bold"><span${attr_class(`flex items-center gap-1 ${stringify(actionData().class)}`)}>`);
	Icon($$renderer, {
		src: actionData().icon,
		size: "16",
		mini: true,
		class: "inline shrink-0"
	});
	$$renderer.push(`<!----> ${escape_html(actionData().text)}</span></span>`);
}
//#endregion
//#region src/routes/modlog/item/ModlogItemCard.svelte
function ModlogItemCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item } = $$props;
		Material($$renderer, {
			color: "uniform",
			rounding: "2xl",
			class: "flex flex-col",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex flex-row justify-between flex-wrap gap-2">`);
				if (item.community) {
					$$renderer.push("<!--[0-->");
					CommunityLink($$renderer, {
						community: item.community,
						avatar: true,
						showInstance: true
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Label($$renderer, {
					class: "font-normal",
					children: ($$renderer) => {
						RelativeDate($$renderer, { date: new Date(item.timestamp) });
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				if (item.actionName) {
					$$renderer.push("<!--[0-->");
					Label($$renderer, {
						class: "mt-2",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Action`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <span class="text-base">`);
					ModlogAction($$renderer, { action: item.actionName });
					$$renderer.push(`<!----></span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (item.moderator) {
					$$renderer.push("<!--[0-->");
					Label($$renderer, {
						class: "mt-2",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Moderator`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <span class="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">`);
					UserLink($$renderer, {
						showInstance: true,
						avatar: true,
						user: item.moderator
					});
					$$renderer.push(`<!----></span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (item.moderatee) {
					$$renderer.push("<!--[0-->");
					Label($$renderer, {
						class: "mt-2",
						children: ($$renderer) => {
							$$renderer.push(`<!---->User`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					UserLink($$renderer, {
						showInstance: true,
						avatar: true,
						user: item.moderatee
					});
					$$renderer.push(`<!---->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (item.link || item.content) {
					$$renderer.push("<!--[0-->");
					Label($$renderer, {
						class: "mt-2",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Item`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (item.link && item.content) {
						$$renderer.push("<!--[0-->");
						Link($$renderer, {
							href: item.link,
							highlight: true,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(item.content)}`);
							},
							$$slots: { default: true }
						});
					} else if (item.content) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<p>${escape_html(item.content)}</p>`);
					} else if (item.link) {
						$$renderer.push("<!--[2-->");
						Link($$renderer, {
							href: item.link,
							highlight: true
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (item.reason) {
					$$renderer.push("<!--[0-->");
					Label($$renderer, {
						class: "mt-2",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Reason`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> <p>${escape_html(item.reason)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
export { ModlogAction as n, ModlogItemCard as t };

//# sourceMappingURL=ModlogItemCard.js.map