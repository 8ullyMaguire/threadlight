import { t as public_env } from "../../../../chunks/shared-server.js";
import { o as escape_html } from "../../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like } from "../../../../chunks/server.js";
import { $t as ViewColumns, A as Sort, At as settings, En as Fire, F as CommonList, Gn as Calendar, Ht as Option, Qn as ArrowTopRightOnSquare, Sn as Language, Ut as TextInput, Vn as ChatBubbleOvalLeftEllipsis, Vt as Select, Wn as ChartBar, Xn as ArrowsPointingOut, Zn as ArrowTrendingDown, Zt as Button, an as Star, b as Link, dn as Photo, jn as Clock, k as ViewSelect, kn as DocumentText, nn as Trash, rn as Tag, tn as Trophy, un as Plus, wn as GlobeAmericas } from "../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../chunks/Placeholder.js";
import { t as ArrowsUpDown } from "../../../../chunks/ArrowsUpDown.js";
import { t as CubeTransparent } from "../../../../chunks/CubeTransparent.js";
import { t as EyeSlash } from "../../../../chunks/EyeSlash.js";
import { t as Heart } from "../../../../chunks/Heart.js";
import { t as Switch } from "../../../../chunks/Switch.js";
import { t as Setting } from "../../../../chunks/Setting.js";
import { t as ToggleSetting } from "../../../../chunks/ToggleSetting.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowsRightLeft.js
var ArrowsRightLeft = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10.47 2.22a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H5.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Zm-4.94 6a.75.75 0 0 1 0 1.06l-.97.97h5.69a.75.75 0 0 1 0 1.5H4.56l.97.97a.75.75 0 1 1-1.06 1.06l-2.25-2.25a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0Z",
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
			"d": "M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z",
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
			"d": "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Bars2.js
var Bars2 = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 4.75A.75.75 0 0 1 2.75 4h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 6.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z",
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
			"d": "M2 6.75A.75.75 0 0 1 2.75 6h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 6.75Zm0 6.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z",
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
			"d": "M3.75 9h16.5m-16.5 6.75h16.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/BarsArrowDown.js
var BarsArrowDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 2.75A.75.75 0 0 1 2.75 2h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 2.75ZM2 6.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 2 6.25Zm0 3.5A.75.75 0 0 1 2.75 9h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 2 9.75ZM14.78 11.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.97.97V6.75a.75.75 0 0 1 1.5 0v5.69l.97-.97a.75.75 0 0 1 1.06 0Z",
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
			"d": "M2 3.75A.75.75 0 0 1 2.75 3h11.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 7.5a.75.75 0 0 1 .75-.75h7.508a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.5ZM14 7a.75.75 0 0 1 .75.75v6.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 1 1 1.1-1.02l1.95 2.1V7.75A.75.75 0 0 1 14 7ZM2 11.25a.75.75 0 0 1 .75-.75h4.562a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z",
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
			"d": "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 4.5A.75.75 0 0 1 3 3.75h14.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm0 4.5A.75.75 0 0 1 3 8.25h9.75a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 9Zm15-.75A.75.75 0 0 1 18 9v10.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V9a.75.75 0 0 1 .75-.75Zm-15 5.25a.75.75 0 0 1 .75-.75h9.75a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/TableCells.js
var TableCells = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15 11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6ZM7.25 7.5a.5.5 0 0 0-.5-.5H3a.5.5 0 0 0-.5.5V8a.5.5 0 0 0 .5.5h3.75a.5.5 0 0 0 .5-.5v-.5Zm1.5 3a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H9.25a.5.5 0 0 1-.5-.5v-.5ZM13.5 8v-.5A.5.5 0 0 0 13 7H9.25a.5.5 0 0 0-.5.5V8a.5.5 0 0 0 .5.5H13a.5.5 0 0 0 .5-.5Zm-6.75 3.5a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 0-.5-.5H3a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h3.75Z",
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
			"d": "M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 0 0 .627-.74Zm1.5 0a.75.75 0 0 0 .627.74h5.373a.75.75 0 0 0 .75-.75v-.615a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75v.625Zm6.75-3.63v-.625a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75v.625c0 .414.336.75.75.75h5.25a.75.75 0 0 0 .75-.75Zm-8.25 0v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v.625c0 .414.336.75.75.75H8.5a.75.75 0 0 0 .75-.75ZM17.5 7.5v-.625a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75V7.5c0 .414.336.75.75.75h5.25a.75.75 0 0 0 .75-.75Zm-8.25 0v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75V7.5c0 .414.336.75.75.75H8.5a.75.75 0 0 0 .75-.75Z",
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
			"d": "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 9.375A.375.375 0 0 0 20.625 9h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5ZM10.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5ZM3.375 15h7.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h7.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 10.875 9h-7.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/routes/settings/app/Filter.svelte
function Filter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { filter = void 0, onremove } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<li class="adaptive px-3 py-1.5 flex flex-row flex-wrap items-center xs gap-x-2 gap-y-0.5 svelte-jrsw3i">`);
			TextInput($$renderer, {
				label: "",
				class: "flex-1 min-w-96",
				get value() {
					return filter.match;
				},
				set value($$value) {
					filter.match = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Switch($$renderer, {
				options: [
					"hide",
					"minimize",
					"none"
				],
				optionNames: [
					"Hide",
					"Minimize",
					"Off"
				],
				get selected() {
					return filter.action;
				},
				set selected($$value) {
					filter.action = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				icon: Trash,
				size: "square-md",
				onclick: onremove,
				"aria-label": "Remove"
			});
			$$renderer.push(`<!----></li>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { filter });
	});
}
//#endregion
//#region src/routes/settings/app/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let localeMap = /* @__PURE__ */ new Map([
			["en", { name: "English" }],
			["ar", { name: "العربية" }],
			["he", { name: "עברית" }],
			["bg", { name: "български" }],
			["de", { name: "Deutsch" }],
			["es", { name: "Español" }],
			["et", { name: "eesti keel" }],
			["fi", { name: "suomi" }],
			["fr", { name: "Français" }],
			["hu", { name: "Magyar" }],
			["ja", { name: "日本語" }],
			["nl", { name: "Nederlands" }],
			["pl", { name: "Polski" }],
			["pt", { name: "Português (PT)" }],
			["pt-BR", { name: "Português (BR)" }],
			["tr", { name: "Türkçe" }],
			["ru", { name: "Русский" }],
			["zh-Hans", { name: "简体中文" }],
			["zh-Hant", { name: "繁體中文" }]
		]);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			CommonList($$renderer, {
				children: ($$renderer) => {
					if (public_env.PUBLIC_XYLIGHT_MODE) {
						$$renderer.push("<!--[0-->");
						{
							function title($$renderer) {
								$$renderer.push(`<span class="dark:text-pink-400 text-pink-600">Donate</span>`);
							}
							function description($$renderer) {
								$$renderer.push(`<!---->Photon will always be free and open-source, and is continously developed and designed to be helpful. If you like Photon and want to financially support its development, you can donate here.`);
							}
							Setting($$renderer, {
								icon: Heart,
								title,
								description,
								children: ($$renderer) => {
									Button($$renderer, {
										color: "none",
										class: "bg-linear-to-r ml-6 dark:from-pink-400 dark:to-fuchsia-400 from-pink-600 to-red-600 text-white dark:text-black",
										href: "https://buymeacoffee.com/xylight",
										target: "_blank",
										rounding: "xl",
										icon: Heart,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Donate`);
										},
										$$slots: { default: true }
									});
								},
								$$slots: {
									title: true,
									description: true,
									default: true
								}
							});
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					{
						function title($$renderer) {
							$$renderer.push(`<!---->Language`);
						}
						function description($$renderer) {
							$$renderer.push(`<p>The language used for text in the UI. `);
							Link($$renderer, {
								href: "/translators",
								highlight: true,
								class: "text-base font-semibold",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Credits`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></p>`);
						}
						Setting($$renderer, {
							icon: Language,
							title,
							description,
							children: ($$renderer) => {
								Select($$renderer, {
									get value() {
										return settings.language;
									},
									set value($$value) {
										settings.language = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										Option($$renderer, {
											icon: Language,
											value: null,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Auto`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> <!--[-->`);
										const each_array = ensure_array_like(localeMap.entries());
										for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
											let [key, value] = each_array[$$index];
											Option($$renderer, {
												"data-label": key == "placeholder",
												disabled: key == "placeholder",
												value: key,
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(value.name)}`);
												},
												$$slots: { default: true }
											});
										}
										$$renderer.push(`<!--]-->`);
									},
									$$slots: { default: true }
								});
							},
							$$slots: {
								title: true,
								description: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> `);
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>Post style</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<p>`);
							if (settings.view == "cozy") {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`Show posts with large images, rich embeds, and longer post bodies.`);
							} else if (settings.view == "compact") {
								$$renderer.push("<!--[1-->");
								$$renderer.push(`Show posts in a list, without post bodies and with tighter spacing.`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></p>`);
						}
						Setting($$renderer, {
							icon: ViewColumns,
							title,
							description,
							children: ($$renderer) => {
								ViewSelect($$renderer, { showLabel: false });
							},
							$$slots: {
								title: true,
								description: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>Default sort</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span>Changes the default sort type used in feeds.</span>`);
						}
						Setting($$renderer, {
							optionClass: "flex-2 max-w-full flex-wrap min-w-0 ",
							icon: ChartBar,
							title,
							description,
							children: ($$renderer) => {
								$$renderer.push(`<div class="flex flex-row flex-wrap flex-1 gap-2 w-full lg:w-max max-w-full lg:self-end">`);
								{
									function customLabel($$renderer) {
										$$renderer.push(`<div class="flex items-center gap-1">`);
										Icon($$renderer, {
											src: GlobeAmericas,
											size: "16",
											mini: true
										});
										$$renderer.push(`<!----> Location</div>`);
									}
									Select($$renderer, {
										get value() {
											return settings.defaultSort.feed;
										},
										set value($$value) {
											settings.defaultSort.feed = $$value;
											$$settled = false;
										},
										customLabel,
										children: ($$renderer) => {
											Option($$renderer, {
												value: "All",
												children: ($$renderer) => {
													$$renderer.push(`<!---->All`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												value: "Local",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Local`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												value: "Subscribed",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Subscriptions`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												value: "Moderator",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Moderator`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!---->`);
										},
										$$slots: {
											customLabel: true,
											default: true
										}
									});
								}
								$$renderer.push(`<!----> `);
								Sort($$renderer, {
									navigate: false,
									get selected() {
										return settings.defaultSort.sort;
									},
									set selected($$value) {
										settings.defaultSort.sort = $$value;
										$$settled = false;
									}
								});
								$$renderer.push(`<!----> `);
								{
									function customLabel($$renderer) {
										$$renderer.push(`<div class="flex items-center gap-1">`);
										Icon($$renderer, {
											src: ChatBubbleOvalLeftEllipsis,
											size: "14",
											mini: true
										});
										$$renderer.push(`<!----> Comments</div>`);
									}
									Select($$renderer, {
										get value() {
											return settings.defaultSort.comments;
										},
										set value($$value) {
											settings.defaultSort.comments = $$value;
											$$settled = false;
										},
										customLabel,
										children: ($$renderer) => {
											Option($$renderer, {
												icon: Fire,
												value: "Hot",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Hot`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												icon: Trophy,
												value: "Top",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Top`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												icon: Star,
												value: "New",
												children: ($$renderer) => {
													$$renderer.push(`<!---->New`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												icon: Clock,
												value: "Old",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Old`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Option($$renderer, {
												icon: ArrowTrendingDown,
												value: "Controversial",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Controversial`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!---->`);
										},
										$$slots: {
											customLabel: true,
											default: true
										}
									});
								}
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
						icon: BarsArrowDown,
						title: "Infinite scroll",
						description: "Loads new posts as you scroll and appends them to the feed.",
						get checked() {
							return settings.infiniteScroll;
						},
						set checked($$value) {
							settings.infiniteScroll = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>Content filters</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span>Hide or minimize posts matching given strings. Supports regular expressions.</span>`);
						}
						Setting($$renderer, {
							icon: EyeSlash,
							adaptive: false,
							mainClass: "rounded-b-none!",
							title,
							description,
							$$slots: {
								title: true,
								description: true
							}
						});
					}
					$$renderer.push(`<!----> <!--[-->`);
					const each_array_1 = ensure_array_like(settings.filters);
					for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
						let filter = each_array_1[index];
						Filter($$renderer, {
							onremove: () => settings.filters.splice(index, 1),
							get filter() {
								return filter;
							},
							set filter($$value) {
								filter = $$value;
								$$settled = false;
							}
						});
					}
					$$renderer.push(`<!--]--> <li class="rounded-t-none! -mt-1! border-t-0!">`);
					Button($$renderer, {
						color: "none",
						class: "w-full p-2",
						icon: Plus,
						onclick: () => settings.filters.push({
							match: "New filter.",
							action: "minimize",
							type: "keyword"
						}),
						children: ($$renderer) => {
							$$renderer.push(`<!---->Add`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></li> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>Thumbnail alignment</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span>Changes where thumbnails for posts are displayed in compact mode.</span>`);
						}
						Setting($$renderer, {
							icon: Photo,
							title,
							description,
							children: ($$renderer) => {
								Switch($$renderer, {
									options: [true, false],
									optionNames: ["Left", "Right"],
									get selected() {
										return settings.leftAlign;
									},
									set selected($$value) {
										settings.leftAlign = $$value;
										$$settled = false;
									}
								});
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
						icon: ArrowsRightLeft,
						title: "Reverse action row",
						description: "Reverses the order of actions on posts and comments.",
						get checked() {
							return settings.posts.reverseActions;
						},
						set checked($$value) {
							settings.posts.reverseActions = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: TableCells,
						supportedPlatforms: {
							desktop: true,
							tablet: false,
							mobile: false
						},
						title: "Limit layout width",
						description: "Improve readability by limiting the main content width.",
						get checked() {
							return settings.newWidth;
						},
						set checked($$value) {
							settings.newWidth = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: Calendar,
						title: "Absolute timestamps",
						description: "Replaces relative timestamps (3 hours ago) with absolute ones (15/6/25).",
						get checked() {
							return settings.absoluteDates;
						},
						set checked($$value) {
							settings.absoluteDates = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: ArrowsUpDown,
						title: "Vote ratio bar",
						description: "When the controversiality of a post reaches greater than 15%, a bar will be displayed in the vote buttons to help visualize sentiment.",
						get checked() {
							return settings.voteRatioBar;
						},
						set checked($$value) {
							settings.voteRatioBar = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: CubeTransparent,
						supportedPlatforms: {
							desktop: false,
							tablet: false,
							mobile: true
						},
						title: "Auto hide dock",
						description: "Hides the dock on mobile when you scroll down, re-appears when you scroll up.",
						get checked() {
							return settings.dock.autoHide;
						},
						set checked($$value) {
							settings.dock.autoHide = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: ArrowTopRightOnSquare,
						title: "Open posts in new tab",
						description: "Opens posts in a separate tab instead of the current.",
						get checked() {
							return settings.openLinksInNewTab;
						},
						set checked($$value) {
							settings.openLinksInNewTab = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					{
						function title($$renderer) {
							$$renderer.push(`<span>Font</span>`);
						}
						function description($$renderer) {
							$$renderer.push(`<span>The font used for text in the UI.</span>`);
						}
						Setting($$renderer, {
							icon: DocumentText,
							title,
							description,
							children: ($$renderer) => {
								Select($$renderer, {
									get value() {
										return settings.font;
									},
									set value($$value) {
										settings.font = $$value;
										$$settled = false;
									},
									children: ($$renderer) => {
										Option($$renderer, {
											value: "inter",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Inter`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Option($$renderer, {
											value: "system",
											children: ($$renderer) => {
												$$renderer.push(`<!---->System UI`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Option($$renderer, {
											value: "browser",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Browser`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Option($$renderer, {
											value: "serifs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Roboto Slab`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!---->`);
									},
									$$slots: { default: true }
								});
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
						icon: ArrowsPointingOut,
						title: "Expandable thumbnails",
						description: "Clicking on a post's image brings you to an expanded view rather than the post page.",
						get checked() {
							return settings.expandImages;
						},
						set checked($$value) {
							settings.expandImages = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: Bars2,
						title: "Hide duplicate embed content",
						description: "Hides the post title and body if they are identical to the embed.",
						get checked() {
							return settings.posts.deduplicateEmbed;
						},
						set checked($$value) {
							settings.posts.deduplicateEmbed = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: ArrowTopRightOnSquare,
						title: "Title opens URL",
						description: "Makes clicking the title open the post's attached URL, rather than the comments.",
						get checked() {
							return settings.posts.titleOpensUrl;
						},
						set checked($$value) {
							settings.posts.titleOpensUrl = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					ToggleSetting($$renderer, {
						icon: Tag,
						title: "Parse tags in title",
						description: "Take text in [brackets] and turn it into tags that you can click to search for.",
						get checked() {
							return settings.parseTags;
						},
						set checked($$value) {
							settings.parseTags = $$value;
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