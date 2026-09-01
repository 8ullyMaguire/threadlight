import { a as onDestroy, f as __exportAll, p as __reExport, r as createEventDispatcher, s as tick } from "./internal.js";
import { t as public_env } from "./shared-server.js";
import "./exports.js";
import { _t as run, m as writable, n as attr, o as escape_html, r as clsx } from "./validate.js";
import { S as getContext, a as bind_props, c as ensure_array_like, f as spread_props, g as unsubscribe_stores, h as stringify, i as await_block, n as attr_style, o as derived, p as store_get, r as attributes, s as element, t as attr_class, u as props_id, v as html, w as setContext } from "./server.js";
import { n as invalidate, r as stores, t as goto } from "./navigation.js";
import { n as Icon, t as Placeholder } from "./Placeholder.js";
import { t as innerHeight } from "./window.js";
import { n as photonify, r as subSupscriptExtension, t as linkify } from "./plugins.js";
import { error } from "@sveltejs/kit";
import { flip, offset, shift } from "@floating-ui/dom";
import { marked } from "marked";
import { createAvatar } from "@dicebear/core";
import * as initials from "@dicebear/initials";
import createClient from "openapi-fetch";
import { LemmyHttp } from "lemmy-js-client";
stores.updated.check;
//#endregion
//#region node_modules/@sveltejs/kit/src/runtime/app/state/server.js
function context() {
	return getContext("__request__");
}
var page$1 = {
	get data() {
		return context().page.data;
	},
	get error() {
		return context().page.error;
	},
	get form() {
		return context().page.form;
	},
	get params() {
		return context().page.params;
	},
	get route() {
		return context().page.route;
	},
	get state() {
		return context().page.state;
	},
	get status() {
		return context().page.status;
	},
	get url() {
		return context().page.url;
	}
};
var navigating$1 = {
	from: null,
	to: null,
	type: null,
	willUnload: null,
	delta: null,
	complete: null
};
//#endregion
//#region node_modules/@sveltejs/kit/src/runtime/app/state/index.js
/**
* A read-only reactive object with information about the current page, serving several use cases:
* - retrieving the combined `data` of all pages/layouts anywhere in your component tree (also see [loading data](https://svelte.dev/docs/kit/load))
* - retrieving the current value of the `form` prop anywhere in your component tree (also see [form actions](https://svelte.dev/docs/kit/form-actions))
* - retrieving the page state that was set through `goto`, `pushState` or `replaceState` (also see [goto](https://svelte.dev/docs/kit/$app-navigation#goto) and [shallow routing](https://svelte.dev/docs/kit/shallow-routing))
* - retrieving metadata such as the URL you're on, the current route and its parameters, and whether or not there was an error
*
* ```svelte
* <!--- file: +layout.svelte --->
* <script>
* 	import { page } from '$app/state';
* <\/script>
*
* <p>Currently at {page.url.pathname}</p>
*
* {#if page.error}
* 	<span class="red">Problem detected</span>
* {:else}
* 	<span class="small">All systems operational</span>
* {/if}
* ```
*
* Changes to `page` are available exclusively with runes. (The legacy reactivity syntax will not reflect any changes)
*
* ```svelte
* <!--- file: +page.svelte --->
* <script>
* 	import { page } from '$app/state';
* 	const id = $derived(page.params.id); // This will correctly update id for usage on this page
* 	$: badId = page.params.id; // Do not use; will never update after initial load
* <\/script>
* ```
*
* On the server, values can only be read during rendering (in other words _not_ in e.g. `load` functions). In the browser, the values can be read at any time.
*
* @type {import('@sveltejs/kit').Page}
*/
var page = page$1;
/**
* A read-only object representing an in-progress navigation, with `from`, `to`, `type` and (if `type === 'popstate'`) `delta` properties.
* Values are `null` when no navigation is occurring, or during server rendering.
* @type {import('@sveltejs/kit').Navigation | { from: null, to: null, type: null, willUnload: null, delta: null, complete: null }}
*/
var navigating = navigating$1;
//#endregion
//#region src/lib/api/base.ts
var DEFAULT_CLIENT_TYPE = public_env.PUBLIC_INSTANCE_TYPE == "lemmy" ? {
	name: "lemmy",
	baseUrl: "/api/v3"
} : public_env.PUBLIC_INSTANCE_TYPE == "piefedalpha" ? {
	name: "piefed",
	baseUrl: "/api/alpha"
} : {
	name: "threadlight",
	baseUrl: "/api/v1"
};
var BaseClient = class {
	static constants;
	static async fetchInfo(base) {
		try {
			const res = await fetch(new URL("/nodeinfo/2.1", base));
			if (!res.ok) return null;
			const software = (await res.json()).software;
			switch (software.name) {
				case "lemmy": return {
					type: {
						baseUrl: "/api/v3",
						name: "lemmy"
					},
					version: software.version
				};
				case "piefed": return {
					type: {
						baseUrl: "/api/alpha",
						name: "piefed"
					},
					version: software.version
				};
				case "threadlight": return {
					type: {
						baseUrl: "/api/v1",
						name: "threadlight"
					},
					version: software.version
				};
				default: return null;
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	}
};
//#endregion
//#region src/lib/ui/util/date.ts
var publishedToDate = (published) => published.endsWith("Z") ? new Date(published) : /* @__PURE__ */ new Date(`${published}Z`);
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArchiveBox.js
var ArchiveBox = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3Z" }, {
			"fill-rule": "evenodd",
			"d": "M3 6h10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm3 2.75A.75.75 0 0 1 6.75 8h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 6 8.75Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" }, {
			"fill-rule": "evenodd",
			"d": "M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z",
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
			"d": "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" }, {
			"fill-rule": "evenodd",
			"d": "m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowDownTray.js
var ArrowDownTray = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" }, { "d": "M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" }, { "d": "M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" }]
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
			"d": "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowRight.js
var ArrowRight = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z",
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
			"d": "M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z",
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
			"d": "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowTopRightOnSquare.js
var ArrowTopRightOnSquare = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" }, { "d": "M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z",
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
			"d": "M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowTrendingDown.js
var ArrowTrendingDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.22 4.22a.75.75 0 0 1 1.06 0L6 7.94l2.761-2.762a.75.75 0 0 1 1.158.12 24.9 24.9 0 0 1 2.718 5.556l.729-1.261a.75.75 0 0 1 1.299.75l-1.591 2.755a.75.75 0 0 1-1.025.275l-2.756-1.591a.75.75 0 1 1 .75-1.3l1.097.634a23.417 23.417 0 0 0-1.984-4.211L6.53 9.53a.75.75 0 0 1-1.06 0L1.22 5.28a.75.75 0 0 1 0-1.06Z",
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
			"d": "M1.22 5.222a.75.75 0 0 1 1.06 0L7 9.942l3.768-3.769a.75.75 0 0 1 1.113.058 20.908 20.908 0 0 1 3.813 7.254l1.574-2.727a.75.75 0 0 1 1.3.75l-2.475 4.286a.75.75 0 0 1-1.025.275l-4.287-2.475a.75.75 0 0 1 .75-1.3l2.71 1.565a19.422 19.422 0 0 0-3.013-6.024L7.53 11.533a.75.75 0 0 1-1.06 0l-5.25-5.25a.75.75 0 0 1 0-1.06Z",
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
			"d": "M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.72 5.47a.75.75 0 0 1 1.06 0L9 11.69l3.756-3.756a.75.75 0 0 1 .985-.066 12.698 12.698 0 0 1 4.575 6.832l.308 1.149 2.277-3.943a.75.75 0 1 1 1.299.75l-3.182 5.51a.75.75 0 0 1-1.025.275l-5.511-3.181a.75.75 0 0 1 .75-1.3l3.943 2.277-.308-1.149a11.194 11.194 0 0 0-3.528-5.617l-3.809 3.81a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.061Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowTrendingUp.js
var ArrowTrendingUp = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z",
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
			"d": "M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z",
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
			"d": "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowsPointingOut.js
var ArrowsPointingOut = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.75 9a.75.75 0 0 1 .75.75v1.69l2.22-2.22a.75.75 0 0 1 1.06 1.06L4.56 12.5h1.69a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75v-3.5A.75.75 0 0 1 2.75 9ZM2.75 7a.75.75 0 0 0 .75-.75V4.56l2.22 2.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h1.69a.75.75 0 0 0 0-1.5h-3.5a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75ZM13.25 9a.75.75 0 0 0-.75.75v1.69l-2.22-2.22a.75.75 0 1 0-1.06 1.06l2.22 2.22H9.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75ZM13.25 7a.75.75 0 0 1-.75-.75V4.56l-2.22 2.22a.75.75 0 1 1-1.06-1.06l2.22-2.22H9.75a.75.75 0 0 1 0-1.5h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z" }]
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
			"d": "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Bars3.js
var Bars3 = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z",
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
			"d": "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z",
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
			"d": "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Bookmark.js
var Bookmark = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.75 2a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.28.53L8 10.06l3.72 3.72a.75.75 0 0 0 1.28-.53V2.75a.75.75 0 0 0-.75-.75h-8.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z",
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
			"d": "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/BookmarkSlash.js
var BookmarkSlash = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M13 2.75v7.775L4.475 2h7.775a.75.75 0 0 1 .75.75ZM3 13.25V5.475l4.793 4.793L4.28 13.78A.75.75 0 0 1 3 13.25ZM2.22 2.22a.75.75 0 0 1 1.06 0l10.5 10.5a.75.75 0 1 1-1.06 1.06L2.22 3.28a.75.75 0 0 1 0-1.06Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M17 4.517v9.301L5.433 2.252a41.44 41.44 0 0 1 9.637.058C16.194 2.45 17 3.414 17 4.517ZM3 17.25V6.182l10.654 10.654L10 15.082l-5.925 2.844A.75.75 0 0 1 3 17.25ZM3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06L3.28 2.22Z" }]
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
			"d": "m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/BugAnt.js
var BugAnt = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M11.983 1.364a.75.75 0 0 0-1.281.78c.096.158.184.321.264.489a5.48 5.48 0 0 1-.713.386A2.993 2.993 0 0 0 8 2c-.898 0-1.703.394-2.253 1.02a5.485 5.485 0 0 1-.713-.387c.08-.168.168-.33.264-.489a.75.75 0 1 0-1.28-.78c-.245.401-.45.83-.61 1.278a.75.75 0 0 0 .239.84 7 7 0 0 0 1.422.876A3.01 3.01 0 0 0 5 5c0 .126.072.24.183.3.386.205.796.37 1.227.487-.126.165-.227.35-.297.549A10.418 10.418 0 0 1 3.51 5.5a10.686 10.686 0 0 1-.008-.733.75.75 0 0 0-1.5-.033 12.222 12.222 0 0 0 .041 1.31.75.75 0 0 0 .4.6A11.922 11.922 0 0 0 6.199 7.87c.04.084.088.166.14.243l-.214.031-.027.005c-1.299.207-2.529.622-3.654 1.211a.75.75 0 0 0-.4.6 12.148 12.148 0 0 0 .197 3.443.75.75 0 0 0 1.47-.299 10.551 10.551 0 0 1-.2-2.6c.352-.167.714-.314 1.085-.441-.063.3-.096.614-.096.936 0 2.21 1.567 4 3.5 4s3.5-1.79 3.5-4c0-.322-.034-.636-.097-.937.372.128.734.275 1.085.442a10.703 10.703 0 0 1-.199 2.6.75.75 0 1 0 1.47.3 12.049 12.049 0 0 0 .197-3.443.75.75 0 0 0-.4-.6 11.921 11.921 0 0 0-3.671-1.215l-.011-.002a11.95 11.95 0 0 0-.213-.03c.052-.078.1-.16.14-.244 1.336-.202 2.6-.623 3.755-1.227a.75.75 0 0 0 .4-.6 12.178 12.178 0 0 0 .041-1.31.75.75 0 0 0-1.5.033 11.061 11.061 0 0 1-.008.733c-.815.386-1.688.67-2.602.836-.07-.2-.17-.384-.297-.55.43-.117.842-.282 1.228-.488A.34.34 0 0 0 11 5c0-.22-.024-.435-.069-.642a7 7 0 0 0 1.422-.876.75.75 0 0 0 .24-.84 6.97 6.97 0 0 0-.61-1.278Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M6.56 1.14a.75.75 0 0 1 .177 1.045 3.989 3.989 0 0 0-.464.86c.185.17.382.329.59.473A3.993 3.993 0 0 1 10 2c1.272 0 2.405.594 3.137 1.518.208-.144.405-.302.59-.473a3.989 3.989 0 0 0-.464-.86.75.75 0 0 1 1.222-.869c.369.519.65 1.105.822 1.736a.75.75 0 0 1-.174.707 7.03 7.03 0 0 1-1.299 1.098A4 4 0 0 1 14 6c0 .52-.301.963-.723 1.187a6.961 6.961 0 0 1-1.158.486c.13.208.231.436.296.679 1.413-.174 2.779-.5 4.081-.96a19.655 19.655 0 0 0-.09-2.319.75.75 0 1 1 1.493-.146 21.239 21.239 0 0 1 .08 3.028.75.75 0 0 1-.482.667 20.873 20.873 0 0 1-5.153 1.249 2.521 2.521 0 0 1-.107.247 20.945 20.945 0 0 1 5.252 1.257.75.75 0 0 1 .482.74 20.945 20.945 0 0 1-.908 5.107.75.75 0 0 1-1.433-.444c.415-1.34.69-2.743.806-4.191-.495-.173-1-.327-1.512-.46.05.284.076.575.076.873 0 1.814-.517 3.312-1.426 4.37A4.639 4.639 0 0 1 10 19a4.639 4.639 0 0 1-3.574-1.63C5.516 16.311 5 14.813 5 13c0-.298.026-.59.076-.873-.513.133-1.017.287-1.512.46.116 1.448.39 2.85.806 4.191a.75.75 0 1 1-1.433.444 20.94 20.94 0 0 1-.908-5.107.75.75 0 0 1 .482-.74 20.838 20.838 0 0 1 5.252-1.257 2.493 2.493 0 0 1-.107-.247 20.874 20.874 0 0 1-5.153-1.249.75.75 0 0 1-.482-.667 21.342 21.342 0 0 1 .08-3.028.75.75 0 1 1 1.493.146 19.745 19.745 0 0 0-.09 2.319c1.302.46 2.668.786 4.08.96.066-.243.166-.471.297-.679a6.962 6.962 0 0 1-1.158-.486A1.348 1.348 0 0 1 6 6a4 4 0 0 1 .166-1.143 7.032 7.032 0 0 1-1.3-1.098.75.75 0 0 1-.173-.707 5.48 5.48 0 0 1 .822-1.736.75.75 0 0 1 1.046-.177Z",
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
			"d": "M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.478 1.6a.75.75 0 0 1 .273 1.026 3.72 3.72 0 0 0-.425 1.121c.058.058.118.114.18.168A4.491 4.491 0 0 1 12 2.25c1.413 0 2.673.651 3.497 1.668.06-.054.12-.11.178-.167a3.717 3.717 0 0 0-.426-1.125.75.75 0 1 1 1.298-.752 5.22 5.22 0 0 1 .671 2.046.75.75 0 0 1-.187.582c-.241.27-.505.52-.787.749a4.494 4.494 0 0 1 .216 2.1c-.106.792-.753 1.295-1.417 1.403-.182.03-.364.057-.547.081.152.227.273.476.359.742a23.122 23.122 0 0 0 3.832-.803 23.241 23.241 0 0 0-.345-2.634.75.75 0 0 1 1.474-.28c.21 1.115.348 2.256.404 3.418a.75.75 0 0 1-.516.75c-1.527.499-3.119.854-4.76 1.049-.074.38-.22.735-.423 1.05 2.066.209 4.058.672 5.943 1.358a.75.75 0 0 1 .492.75 24.665 24.665 0 0 1-1.189 6.25.75.75 0 0 1-1.425-.47 23.14 23.14 0 0 0 1.077-5.306c-.5-.169-1.009-.32-1.524-.455.068.234.104.484.104.746 0 3.956-2.521 7.5-6 7.5-3.478 0-6-3.544-6-7.5 0-.262.037-.511.104-.746-.514.135-1.022.286-1.522.455.154 1.838.52 3.616 1.077 5.307a.75.75 0 1 1-1.425.468 24.662 24.662 0 0 1-1.19-6.25.75.75 0 0 1 .493-.749 24.586 24.586 0 0 1 4.964-1.24h.01c.321-.046.644-.085.969-.118a2.983 2.983 0 0 1-.424-1.05 24.614 24.614 0 0 1-4.76-1.05.75.75 0 0 1-.516-.75c.057-1.16.194-2.302.405-3.417a.75.75 0 0 1 1.474.28c-.164.862-.28 1.74-.345 2.634 1.237.371 2.517.642 3.832.803.085-.266.207-.515.359-.742a18.698 18.698 0 0 1-.547-.08c-.664-.11-1.311-.612-1.417-1.404a4.535 4.535 0 0 1 .217-2.103 6.788 6.788 0 0 1-.788-.751.75.75 0 0 1-.187-.583 5.22 5.22 0 0 1 .67-2.04.75.75 0 0 1 1.026-.273Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Calendar.js
var Calendar = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM4.5 6a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7Z",
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
			"d": "M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z",
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
			"d": "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CalendarDays.js
var CalendarDays = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z" }, {
			"fill-rule": "evenodd",
			"d": "M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" }, {
			"fill-rule": "evenodd",
			"d": "M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z",
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
			"d": "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" }, {
			"fill-rule": "evenodd",
			"d": "M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChartBar.js
var ChartBar = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M12 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-1ZM6.5 6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6ZM2 9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" }]
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
			"d": "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChatBubbleLeftRight.js
var ChatBubbleLeftRight = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M1 8.849c0 1 .738 1.851 1.734 1.947L3 10.82v2.429a.75.75 0 0 0 1.28.53l1.82-1.82A3.484 3.484 0 0 1 5.5 10V9A3.5 3.5 0 0 1 9 5.5h4V4.151c0-1-.739-1.851-1.734-1.947a44.539 44.539 0 0 0-8.532 0C1.738 2.3 1 3.151 1 4.151V8.85Z" }, { "d": "M7 9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.25v1.25a.75.75 0 0 1-1.28.53L9.69 12H9a2 2 0 0 1-2-2V9Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.505 2.365A41.369 41.369 0 0 1 9 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 0 0-.577-.069 43.141 43.141 0 0 0-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 0 1 5 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914Z" }, { "d": "M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 0 0 1.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0 0 14 6Z" }]
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
			"d": "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" }, { "d": "M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChatBubbleOvalLeft.js
var ChatBubbleOvalLeft = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1 8c0-3.43 3.262-6 7-6s7 2.57 7 6-3.262 6-7 6c-.423 0-.838-.032-1.241-.094-.9.574-1.941.948-3.06 1.06a.75.75 0 0 1-.713-1.14c.232-.378.395-.804.469-1.26C1.979 11.486 1 9.86 1 8Z",
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
			"d": "M2 10c0-3.967 3.69-7 8-7 4.31 0 8 3.033 8 7s-3.69 7-8 7a9.165 9.165 0 0 1-1.504-.123 5.976 5.976 0 0 1-3.935 1.107.75.75 0 0 1-.584-1.143 3.478 3.478 0 0 0 .522-1.756C2.979 13.825 2 12.025 2 10Z",
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
			"d": "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChatBubbleOvalLeftEllipsis.js
var ChatBubbleOvalLeftEllipsis = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 2C4.262 2 1 4.57 1 8c0 1.86.98 3.486 2.455 4.566a3.472 3.472 0 0 1-.469 1.26.75.75 0 0 0 .713 1.14 6.961 6.961 0 0 0 3.06-1.06c.403.062.818.094 1.241.094 3.738 0 7-2.57 7-6s-3.262-6-7-6ZM5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 0 1-.522 1.756.75.75 0 0 0 .584 1.143 5.976 5.976 0 0 0 3.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-2-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Check.js
var Check = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z",
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
			"d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
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
			"d": "m4.5 12.75 6 6 9-13.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CheckCircle.js
var CheckCircle = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z",
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
			"d": "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z",
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
			"d": "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronDoubleDown.js
var ChevronDoubleDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.47 12.78a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 11.19 5.28 8.47a.75.75 0 0 0-1.06 1.06l3.25 3.25ZM4.22 4.53l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 6.19 5.28 3.47a.75.75 0 0 0-1.06 1.06Z",
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
			"d": "M9.47 15.28a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 1 0-1.06-1.06L10 13.69 6.28 9.97a.75.75 0 0 0-1.06 1.06l4.25 4.25ZM5.22 6.03l4.25 4.25a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0-1.06-1.06L10 8.69 6.28 4.97a.75.75 0 0 0-1.06 1.06Z",
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
			"d": "m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronDoubleUp.js
var ChevronDoubleUp = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.47 3.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1-1.06 1.06L8 4.81 5.28 7.53a.75.75 0 0 1-1.06-1.06l3.25-3.25Zm-3.25 8.25 3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 1 1-1.06 1.06L8 9.81l-2.72 2.72a.75.75 0 0 1-1.06-1.06Z",
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
			"d": "M9.47 4.72a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 6.31l-3.72 3.72a.75.75 0 1 1-1.06-1.06l4.25-4.25Zm-4.25 9.25 4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 11.31l-3.72 3.72a.75.75 0 0 1-1.06-1.06Z",
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
			"d": "m4.5 18.75 7.5-7.5 7.5 7.5"
		}, {
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "m4.5 12.75 7.5-7.5 7.5 7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.47 10.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 12.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M11.47 4.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronDown.js
var ChevronDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z",
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
			"d": "M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z",
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
			"d": "m19.5 8.25-7.5 7.5-7.5-7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronLeft.js
var ChevronLeft = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z",
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
			"d": "M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z",
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
			"d": "M15.75 19.5 8.25 12l7.5-7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronRight.js
var ChevronRight = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z",
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
			"d": "M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z",
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
			"d": "m8.25 4.5 7.5 7.5-7.5 7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronUp.js
var ChevronUp = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z",
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
			"d": "M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z",
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
			"d": "m4.5 15.75 7.5-7.5 7.5 7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChevronUpDown.js
var ChevronUpDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z",
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
			"d": "M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z",
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
			"d": "M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ClipboardDocument.js
var ClipboardDocument = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937v-2.523a2.5 2.5 0 0 0-.732-1.768L8.354 5.232A2.5 2.5 0 0 0 6.586 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z",
			"clip-rule": "evenodd"
		}, { "d": "M3 6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3.586a1 1 0 0 0-.293-.707L7.293 6.293A1 1 0 0 0 6.586 6H3Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z",
			"clip-rule": "evenodd"
		}, { "d": "M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z" }]
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
			"d": "M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [
			{
				"fill-rule": "evenodd",
				"d": "M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z",
				"clip-rule": "evenodd"
			},
			{ "d": "M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" },
			{ "d": "M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" }
		]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Clock.js
var Clock = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z",
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
			"d": "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z",
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
			"d": "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CurrencyDollar.js
var CurrencyDollar = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M6.375 5.5h.875v1.75h-.875a.875.875 0 1 1 0-1.75ZM8.75 10.5V8.75h.875a.875.875 0 0 1 0 1.75H8.75Z" }, {
			"fill-rule": "evenodd",
			"d": "M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM7.25 3.75a.75.75 0 0 1 1.5 0V4h2.5a.75.75 0 0 1 0 1.5h-2.5v1.75h.875a2.375 2.375 0 1 1 0 4.75H8.75v.25a.75.75 0 0 1-1.5 0V12h-2.5a.75.75 0 0 1 0-1.5h2.5V8.75h-.875a2.375 2.375 0 1 1 0-4.75h.875v-.25Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z" }, {
			"fill-rule": "evenodd",
			"d": "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z",
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
			"d": "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" }, {
			"fill-rule": "evenodd",
			"d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/DocumentText.js
var DocumentText = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75Zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z",
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
			"d": "M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z",
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
			"d": "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z",
			"clip-rule": "evenodd"
		}, { "d": "M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/EllipsisHorizontal.js
var EllipsisHorizontal = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" }]
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
			"d": "M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ExclamationCircle.js
var ExclamationCircle = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ExclamationTriangle.js
var ExclamationTriangle = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Fire.js
var Fire = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.074.945A4.993 4.993 0 0 0 6 5v.032c.004.6.114 1.176.311 1.709.16.428-.204.91-.61.7a5.023 5.023 0 0 1-1.868-1.677c-.202-.304-.648-.363-.848-.058a6 6 0 1 0 8.017-1.901l-.004-.007a4.98 4.98 0 0 1-2.18-2.574c-.116-.31-.477-.472-.744-.28Zm.78 6.178a3.001 3.001 0 1 1-3.473 4.341c-.205-.365.215-.694.62-.59a4.008 4.008 0 0 0 1.873.03c.288-.065.413-.386.321-.666A3.997 3.997 0 0 1 8 8.999c0-.585.126-1.14.351-1.641a.42.42 0 0 1 .503-.235Z",
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
			"d": "M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z",
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
			"d": "M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
		}, {
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/GlobeAlt.js
var GlobeAlt = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3.757 4.5c.18.217.376.42.586.608.153-.61.354-1.175.596-1.678A5.53 5.53 0 0 0 3.757 4.5ZM8 1a6.994 6.994 0 0 0-7 7 7 7 0 1 0 7-7Zm0 1.5c-.476 0-1.091.386-1.633 1.427-.293.564-.531 1.267-.683 2.063A5.48 5.48 0 0 0 8 6.5a5.48 5.48 0 0 0 2.316-.51c-.152-.796-.39-1.499-.683-2.063C9.09 2.886 8.476 2.5 8 2.5Zm3.657 2.608a8.823 8.823 0 0 0-.596-1.678c.444.298.842.659 1.182 1.07-.18.217-.376.42-.586.608Zm-1.166 2.436A6.983 6.983 0 0 1 8 8a6.983 6.983 0 0 1-2.49-.456 10.703 10.703 0 0 0 .202 2.6c.72.231 1.49.356 2.288.356.798 0 1.568-.125 2.29-.356a10.705 10.705 0 0 0 .2-2.6Zm1.433 1.85a12.652 12.652 0 0 0 .018-2.609c.405-.276.78-.594 1.117-.947a5.48 5.48 0 0 1 .44 2.262 7.536 7.536 0 0 1-1.575 1.293Zm-2.172 2.435a9.046 9.046 0 0 1-3.504 0c.039.084.078.166.12.244C6.907 13.114 7.523 13.5 8 13.5s1.091-.386 1.633-1.427c.04-.078.08-.16.12-.244Zm1.31.74a8.5 8.5 0 0 0 .492-1.298c.457-.197.893-.43 1.307-.696a5.526 5.526 0 0 1-1.8 1.995Zm-6.123 0a8.507 8.507 0 0 1-.493-1.298 8.985 8.985 0 0 1-1.307-.696 5.526 5.526 0 0 0 1.8 1.995ZM2.5 8.1c.463.5.993.935 1.575 1.293a12.652 12.652 0 0 1-.018-2.608 7.037 7.037 0 0 1-1.117-.947 5.48 5.48 0 0 0-.44 2.262Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M16.555 5.412a8.028 8.028 0 0 0-3.503-2.81 14.899 14.899 0 0 1 1.663 4.472 8.547 8.547 0 0 0 1.84-1.662ZM13.326 7.825a13.43 13.43 0 0 0-2.413-5.773 8.087 8.087 0 0 0-1.826 0 13.43 13.43 0 0 0-2.413 5.773A8.473 8.473 0 0 0 10 8.5c1.18 0 2.304-.24 3.326-.675ZM6.514 9.376A9.98 9.98 0 0 0 10 10c1.226 0 2.4-.22 3.486-.624a13.54 13.54 0 0 1-.351 3.759A13.54 13.54 0 0 1 10 13.5c-1.079 0-2.128-.127-3.134-.366a13.538 13.538 0 0 1-.352-3.758ZM5.285 7.074a14.9 14.9 0 0 1 1.663-4.471 8.028 8.028 0 0 0-3.503 2.81c.529.638 1.149 1.199 1.84 1.66ZM17.334 6.798a7.973 7.973 0 0 1 .614 4.115 13.47 13.47 0 0 1-3.178 1.72 15.093 15.093 0 0 0 .174-3.939 10.043 10.043 0 0 0 2.39-1.896ZM2.666 6.798a10.042 10.042 0 0 0 2.39 1.896 15.196 15.196 0 0 0 .174 3.94 13.472 13.472 0 0 1-3.178-1.72 7.973 7.973 0 0 1 .615-4.115ZM10 15c.898 0 1.778-.079 2.633-.23a13.473 13.473 0 0 1-1.72 3.178 8.099 8.099 0 0 1-1.826 0 13.47 13.47 0 0 1-1.72-3.178c.855.151 1.735.23 2.633.23ZM14.357 14.357a14.912 14.912 0 0 1-1.305 3.04 8.027 8.027 0 0 0 4.345-4.345c-.953.542-1.971.981-3.04 1.305ZM6.948 17.397a8.027 8.027 0 0 1-4.345-4.345c.953.542 1.971.981 3.04 1.305a14.912 14.912 0 0 0 1.305 3.04Z" }]
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
			"d": "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/GlobeAmericas.js
var GlobeAmericas = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 3.757a5.5 5.5 0 1 0 6.857-.114l-.65.65a.707.707 0 0 0-.207.5c0 .39-.317.707-.707.707H8.427a.496.496 0 0 0-.413.771l.25.376a.481.481 0 0 0 .616.163.962.962 0 0 1 1.11.18l.573.573a1 1 0 0 1 .242 1.023l-1.012 3.035a1 1 0 0 1-1.191.654l-.345-.086a1 1 0 0 1-.757-.97v-.305a1 1 0 0 0-.293-.707L6.1 9.1a.849.849 0 0 1 0-1.2c.22-.22.22-.58 0-.8l-.721-.721A3 3 0 0 1 4.5 4.257v-.5Z",
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
			"d": "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 1-11-4.69v.447a3.5 3.5 0 0 0 1.025 2.475L8.293 10 8 10.293a1 1 0 0 0 0 1.414l1.06 1.06a1.5 1.5 0 0 1 .44 1.061v.363a1 1 0 0 0 .553.894l.276.139a1 1 0 0 0 1.342-.448l1.454-2.908a1.5 1.5 0 0 0-.281-1.731l-.772-.772a1 1 0 0 0-1.023-.242l-.384.128a.5.5 0 0 1-.606-.25l-.296-.592a.481.481 0 0 1 .646-.646l.262.131a1 1 0 0 0 .447.106h.188a1 1 0 0 0 .949-1.316l-.068-.204a.5.5 0 0 1 .149-.538l1.44-1.234A6.492 6.492 0 0 1 16.5 10Z",
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
			"d": "m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/InformationCircle.js
var InformationCircle = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z",
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
			"d": "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z",
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
			"d": "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Language.js
var Language = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11 5a.75.75 0 0 1 .688.452l3.25 7.5a.75.75 0 1 1-1.376.596L12.89 12H9.109l-.67 1.548a.75.75 0 1 1-1.377-.596l3.25-7.5A.75.75 0 0 1 11 5Zm-1.24 5.5h2.48L11 7.636 9.76 10.5ZM5 1a.75.75 0 0 1 .75.75v1.261a25.27 25.27 0 0 1 2.598.211.75.75 0 1 1-.2 1.487c-.22-.03-.44-.056-.662-.08A12.939 12.939 0 0 1 5.92 8.058c.237.304.488.595.752.873a.75.75 0 0 1-1.086 1.035A13.075 13.075 0 0 1 5 9.307a13.068 13.068 0 0 1-2.841 2.546.75.75 0 0 1-.827-1.252A11.566 11.566 0 0 0 4.08 8.057a12.991 12.991 0 0 1-.554-.938.75.75 0 1 1 1.323-.707c.049.09.099.181.15.271.388-.68.708-1.405.952-2.164a23.941 23.941 0 0 0-4.1.19.75.75 0 0 1-.2-1.487c.853-.114 1.72-.185 2.598-.211V1.75A.75.75 0 0 1 5 1Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M7.75 2.75a.75.75 0 0 0-1.5 0v1.258a32.987 32.987 0 0 0-3.599.278.75.75 0 1 0 .198 1.487A31.545 31.545 0 0 1 8.7 5.545 19.381 19.381 0 0 1 7 9.56a19.418 19.418 0 0 1-1.002-2.05.75.75 0 0 0-1.384.577 20.935 20.935 0 0 0 1.492 2.91 19.613 19.613 0 0 1-3.828 4.154.75.75 0 1 0 .945 1.164A21.116 21.116 0 0 0 7 12.331c.095.132.192.262.29.391a.75.75 0 0 0 1.194-.91c-.204-.266-.4-.538-.59-.815a20.888 20.888 0 0 0 2.333-5.332c.31.031.618.068.924.108a.75.75 0 0 0 .198-1.487 32.832 32.832 0 0 0-3.599-.278V2.75Z" }, {
			"fill-rule": "evenodd",
			"d": "M13 8a.75.75 0 0 1 .671.415l4.25 8.5a.75.75 0 1 1-1.342.67L15.787 16h-5.573l-.793 1.585a.75.75 0 1 1-1.342-.67l4.25-8.5A.75.75 0 0 1 13 8Zm2.037 6.5L13 10.427 10.964 14.5h4.073Z",
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
			"d": "m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Link.js
var Link$1 = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z",
			"clip-rule": "evenodd"
		}, {
			"fill-rule": "evenodd",
			"d": "M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" }, { "d": "M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" }]
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
			"d": "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/LockClosed.js
var LockClosed = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z",
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
			"d": "M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z",
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
			"d": "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/MagnifyingGlass.js
var MagnifyingGlass = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
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
			"d": "M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z",
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
			"d": "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/MapPin.js
var MapPin = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
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
			"d": "m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z",
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
			"d": "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
		}, {
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Megaphone.js
var Megaphone = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M13.407 2.59a.75.75 0 0 0-1.464.326c.365 1.636.557 3.337.557 5.084 0 1.747-.192 3.448-.557 5.084a.75.75 0 0 0 1.464.327c.264-1.185.444-2.402.531-3.644a2 2 0 0 0 0-3.534 24.736 24.736 0 0 0-.531-3.643ZM4.348 11H4a3 3 0 0 1 0-6h2c1.647 0 3.217-.332 4.646-.933C10.878 5.341 11 6.655 11 8c0 1.345-.122 2.659-.354 3.933a11.946 11.946 0 0 0-4.23-.925c.203.718.478 1.407.816 2.057.12.23.057.515-.155.663l-.828.58a.484.484 0 0 1-.707-.16A12.91 12.91 0 0 1 4.348 11Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M13.92 3.845a19.362 19.362 0 0 1-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 0 0-.504 7.969 15.97 15.97 0 0 0 1.271 3.34c.397.771 1.342 1 2.05.59l.867-.5c.726-.419.94-1.32.588-2.02-.166-.331-.315-.666-.448-1.004 1.8.357 3.511.963 5.096 1.78A17.964 17.964 0 0 0 15 10c0-2.162-.381-4.235-1.08-6.155ZM15.243 3.097A19.456 19.456 0 0 1 16.5 10c0 2.43-.445 4.758-1.257 6.904l-.03.077a.75.75 0 0 0 1.401.537 20.903 20.903 0 0 0 1.312-5.745 2 2 0 0 0 0-3.546 20.902 20.902 0 0 0-1.312-5.745.75.75 0 0 0-1.4.537l.029.078Z" }]
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
			"d": "M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M16.881 4.345A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.772-2.468a17.116 17.116 0 0 1-.628-1.607c1.918.258 3.76.75 5.5 1.446A21.727 21.727 0 0 0 18 11.25c0-2.414-.393-4.735-1.119-6.905ZM18.26 3.74a23.22 23.22 0 0 1 1.24 7.51 23.22 23.22 0 0 1-1.41 7.992.75.75 0 1 0 1.409.516 24.555 24.555 0 0 0 1.415-6.43 2.992 2.992 0 0 0 .836-2.078c0-.807-.319-1.54-.836-2.078a24.65 24.65 0 0 0-1.415-6.43.75.75 0 1 0-1.409.516c.059.16.116.321.17.483Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Minus.js
var Minus = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z",
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
			"d": "M5 12h14"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Newspaper.js
var Newspaper = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a2 2 0 0 0 2 2h8a2 2 0 0 1-2-2V3ZM4 4h4v2H4V4Zm4 3.5H4V9h4V7.5Zm-4 3h4V12H4v-1.5Z",
			"clip-rule": "evenodd"
		}, { "d": "M13 5h-1.5v6.25a1.25 1.25 0 1 0 2.5 0V6a1 1 0 0 0-1-1Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v11.75A2.75 2.75 0 0 0 16.75 18h-12A2.75 2.75 0 0 1 2 15.25V3.5Zm3.75 7a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM5 5.75A.75.75 0 0 1 5.75 5h4.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 8.25v-2.5Z",
			"clip-rule": "evenodd"
		}, { "d": "M16.5 6.5h-1v8.75a1.25 1.25 0 1 0 2.5 0V8a1.5 1.5 0 0 0-1.5-1.5Z" }]
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
			"d": "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z",
			"clip-rule": "evenodd"
		}, { "d": "M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/NoSymbol.js
var NoSymbol = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Zm1.627.566 7.707 7.707a5.501 5.501 0 0 0-7.707-7.707Zm6.646 8.768L3.616 4.677a5.501 5.501 0 0 0 7.707 7.707Z",
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
			"d": "m5.965 4.904 9.131 9.131a6.5 6.5 0 0 0-9.131-9.131Zm8.07 10.192L4.904 5.965a6.5 6.5 0 0 0 9.131 9.131ZM4.343 4.343a8 8 0 1 1 11.314 11.314A8 8 0 0 1 4.343 4.343Z",
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
			"d": "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "m6.72 5.66 11.62 11.62A8.25 8.25 0 0 0 6.72 5.66Zm10.56 12.68L5.66 6.72a8.25 8.25 0 0 0 11.62 11.62ZM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/PaperAirplane.js
var PaperAirplane = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M2.87 2.298a.75.75 0 0 0-.812 1.021L3.39 6.624a1 1 0 0 0 .928.626H8.25a.75.75 0 0 1 0 1.5H4.318a1 1 0 0 0-.927.626l-1.333 3.305a.75.75 0 0 0 .811 1.022 24.89 24.89 0 0 0 11.668-5.115.75.75 0 0 0 0-1.175A24.89 24.89 0 0 0 2.869 2.298Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" }]
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
			"d": "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Pencil.js
var Pencil = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" }]
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
			"d": "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Photo.js
var Photo = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm10.5 5.707a.5.5 0 0 0-.146-.353l-1-1a.5.5 0 0 0-.708 0L9.354 9.646a.5.5 0 0 1-.708 0L6.354 7.354a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0-.146.353V12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.707ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
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
			"d": "M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
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
			"d": "m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Play.js
var Play = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.267V3.732Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" }]
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
			"d": "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Plus.js
var Plus = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" }]
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
			"d": "M12 4.5v15m7.5-7.5h-15"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/PlusCircle.js
var PlusCircle = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z",
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
			"d": "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z",
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
			"d": "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/PresentationChartBar.js
var PresentationChartBar = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.75 2a.75.75 0 0 0 0 1.5H2V9a2 2 0 0 0 2 2h.043l-1.004 3.013a.75.75 0 0 0 1.423.474L4.624 14h6.752l.163.487a.75.75 0 1 0 1.422-.474L11.957 11H12a2 2 0 0 0 2-2V3.5h.25a.75.75 0 0 0 0-1.5H1.75Zm8.626 9 .5 1.5H5.124l.5-1.5h4.752ZM5.25 7a.75.75 0 0 0-.75.75v.5a.75.75 0 0 0 1.5 0v-.5A.75.75 0 0 0 5.25 7ZM10 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5ZM8 5.5a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 1.5 0v-2A.75.75 0 0 0 8 5.5Z",
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
			"d": "M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H18v8.75A2.75 2.75 0 0 1 15.25 15h-1.072l.798 3.06a.75.75 0 0 1-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 0 1-1.452-.38L5.823 15H4.75A2.75 2.75 0 0 1 2 12.25V3.5h-.25A.75.75 0 0 1 1 2.75ZM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373ZM13.25 5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75Zm-6.5 4a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 6.75 9Zm4-1.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Z",
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
			"d": "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/PuzzlePiece.js
var PuzzlePiece = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M9 3.889c0-.273.188-.502.417-.65.355-.229.583-.587.583-.989C10 1.56 9.328 1 8.5 1S7 1.56 7 2.25c0 .41.237.774.603 1.002.22.137.397.355.397.613 0 .331-.275.596-.605.579-.744-.04-1.482-.1-2.214-.18a.75.75 0 0 0-.83.81c.067.764.111 1.535.133 2.312A.6.6 0 0 1 3.882 8c-.268 0-.495-.185-.64-.412C3.015 7.231 2.655 7 2.25 7 1.56 7 1 7.672 1 8.5S1.56 10 2.25 10c.404 0 .764-.23.993-.588.144-.227.37-.412.64-.412a.6.6 0 0 1 .601.614 39.338 39.338 0 0 1-.231 3.3.75.75 0 0 0 .661.829c.826.093 1.66.161 2.5.204A.56.56 0 0 0 8 13.386c0-.271-.187-.499-.415-.645C7.23 12.512 7 12.153 7 11.75c0-.69.672-1.25 1.5-1.25s1.5.56 1.5 1.25c0 .403-.23.762-.585.99-.228.147-.415.375-.415.646v.11c0 .278.223.504.5.504 1.196 0 2.381-.052 3.552-.154a.75.75 0 0 0 .68-.661c.135-1.177.22-2.37.253-3.574a.597.597 0 0 0-.6-.611c-.27 0-.498.187-.644.415-.229.356-.588.585-.991.585-.69 0-1.25-.672-1.25-1.5S11.06 7 11.75 7c.403 0 .762.23.99.585.147.228.375.415.646.415a.597.597 0 0 0 .599-.61 40.914 40.914 0 0 0-.132-2.365.75.75 0 0 0-.815-.684A39.51 39.51 0 0 1 9.5 4.5a.501.501 0 0 1-.5-.503v-.108Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M12 4.467c0-.405.262-.75.559-1.027.276-.257.441-.584.441-.94 0-.828-.895-1.5-2-1.5s-2 .672-2 1.5c0 .362.171.694.456.953.29.265.544.6.544.994a.968.968 0 0 1-1.024.974 39.655 39.655 0 0 1-3.014-.306.75.75 0 0 0-.847.847c.14.993.242 1.999.306 3.014A.968.968 0 0 1 4.447 10c-.393 0-.729-.253-.994-.544C3.194 9.17 2.862 9 2.5 9 1.672 9 1 9.895 1 11s.672 2 1.5 2c.356 0 .683-.165.94-.441.276-.297.622-.559 1.027-.559a.997.997 0 0 1 1.004 1.03 39.747 39.747 0 0 1-.319 3.734.75.75 0 0 0 .64.842c1.05.146 2.111.252 3.184.318A.97.97 0 0 0 10 16.948c0-.394-.254-.73-.545-.995C9.171 15.693 9 15.362 9 15c0-.828.895-1.5 2-1.5s2 .672 2 1.5c0 .356-.165.683-.441.94-.297.276-.559.622-.559 1.027a.998.998 0 0 0 1.03 1.005c1.337-.05 2.659-.162 3.961-.337a.75.75 0 0 0 .644-.644c.175-1.302.288-2.624.337-3.961A.998.998 0 0 0 16.967 12c-.405 0-.75.262-1.027.559-.257.276-.584.441-.94.441-.828 0-1.5-.895-1.5-2s.672-2 1.5-2c.362 0 .694.17.953.455.265.291.601.545.995.545a.97.97 0 0 0 .976-1.024 41.159 41.159 0 0 0-.318-3.184.75.75 0 0 0-.842-.64c-1.228.164-2.473.271-3.734.319A.997.997 0 0 1 12 4.467Z" }]
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
			"d": "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/RectangleGroup.js
var RectangleGroup = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M1 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4ZM10 5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V5ZM4 10a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H4Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h6A1.5 1.5 0 0 0 10 8.5v-4A1.5 1.5 0 0 0 8.5 3h-6Zm11 2A1.5 1.5 0 0 0 12 6.5v7a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 17.5 5h-4Zm-10 7A1.5 1.5 0 0 0 2 13.5v2A1.5 1.5 0 0 0 3.5 17h6a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 9.5 12h-6Z",
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
			"d": "M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Scale.js
var Scale = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.75 2.5a.75.75 0 0 0-1.5 0v.508a32.661 32.661 0 0 0-4.624.434.75.75 0 0 0 .246 1.48l.13-.021-1.188 4.75a.75.75 0 0 0 .33.817A3.487 3.487 0 0 0 4 11c.68 0 1.318-.195 1.856-.532a.75.75 0 0 0 .33-.818l-1.25-5a31.31 31.31 0 0 1 2.314-.141V12.012c-.882.027-1.752.104-2.607.226a.75.75 0 0 0 .213 1.485 22.188 22.188 0 0 1 6.288 0 .75.75 0 1 0 .213-1.485 23.657 23.657 0 0 0-2.607-.226V4.509c.779.018 1.55.066 2.314.14L9.814 9.65a.75.75 0 0 0 .329.818 3.487 3.487 0 0 0 1.856.532c.68 0 1.318-.195 1.856-.532a.75.75 0 0 0 .33-.818L12.997 4.9l.13.022a.75.75 0 1 0 .247-1.48 32.66 32.66 0 0 0-4.624-.434V2.5ZM3.42 9.415a2 2 0 0 0 1.16 0L4 7.092l-.58 2.323ZM12 9.5a2 2 0 0 1-.582-.085L12 7.092l.58 2.323A2 2 0 0 1 12 9.5Z",
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
			"d": "M10 2a.75.75 0 0 1 .75.75v.258a33.186 33.186 0 0 1 6.668.83.75.75 0 0 1-.336 1.461 31.28 31.28 0 0 0-1.103-.232l1.702 7.545a.75.75 0 0 1-.387.832A4.981 4.981 0 0 1 15 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 0 1-.387-.832l1.77-7.849a31.743 31.743 0 0 0-3.339-.254v11.505a20.01 20.01 0 0 1 3.78.501.75.75 0 1 1-.339 1.462A18.558 18.558 0 0 0 10 17.5c-1.442 0-2.845.165-4.191.477a.75.75 0 0 1-.338-1.462 20.01 20.01 0 0 1 3.779-.501V4.509c-1.129.026-2.243.112-3.34.254l1.771 7.85a.75.75 0 0 1-.387.83A4.98 4.98 0 0 1 5 14a4.98 4.98 0 0 1-2.294-.556.75.75 0 0 1-.387-.832L4.02 5.067c-.37.07-.738.148-1.103.232a.75.75 0 0 1-.336-1.462 32.845 32.845 0 0 1 6.668-.829V2.75A.75.75 0 0 1 10 2ZM5 7.543 3.92 12.33a3.499 3.499 0 0 0 2.16 0L5 7.543Zm10 0-1.08 4.787a3.498 3.498 0 0 0 2.16 0L15 7.543Z",
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
			"d": "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 18.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 0 1-.262 1.453h-8.37a.75.75 0 0 1-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 5.25 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84L4.168 6.241H2.25a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Zm4.878 13.543 1.872-7.662 1.872 7.662h-3.744Zm-9.756 0L5.25 8.131l-1.872 7.662h3.744Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Share.js
var Share = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M12 6a2 2 0 1 0-1.994-1.842L5.323 6.5a2 2 0 1 0 0 3l4.683 2.342a2 2 0 1 0 .67-1.342L5.995 8.158a2.03 2.03 0 0 0 0-.316L10.677 5.5c.353.311.816.5 1.323.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.475l6.733-3.366A2.52 2.52 0 0 1 13 4.5Z" }]
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
			"d": "M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ShieldCheck.js
var ShieldCheck = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8.5 1.709a.75.75 0 0 0-1 0 8.963 8.963 0 0 1-4.84 2.217.75.75 0 0 0-.654.72 10.499 10.499 0 0 0 5.647 9.672.75.75 0 0 0 .694-.001 10.499 10.499 0 0 0 5.647-9.672.75.75 0 0 0-.654-.719A8.963 8.963 0 0 1 8.5 1.71Zm2.34 5.504a.75.75 0 0 0-1.18-.926L7.394 9.17l-1.156-.99a.75.75 0 1 0-.976 1.138l1.75 1.5a.75.75 0 0 0 1.078-.106l2.75-3.5Z",
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
			"d": "M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.75Zm4.196 5.954a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z",
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
			"d": "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Star.js
var Star = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z",
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
			"d": "M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z",
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
			"d": "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Sun.js
var Sun = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1ZM10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.95 4.11a.75.75 0 1 0-1.06-1.06l-1.062 1.06a.75.75 0 0 0 1.061 1.062l1.06-1.061ZM15 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 15 8ZM11.89 12.95a.75.75 0 0 0 1.06-1.06l-1.06-1.062a.75.75 0 0 0-1.062 1.061l1.061 1.06ZM8 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 12ZM5.172 11.89a.75.75 0 0 0-1.061-1.062L3.05 11.89a.75.75 0 1 0 1.06 1.06l1.06-1.06ZM4 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 8ZM4.11 5.172A.75.75 0 0 0 5.173 4.11L4.11 3.05a.75.75 0 1 0-1.06 1.06l1.06 1.06Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" }]
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
			"d": "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Tag.js
var Tag = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.5 2A2.5 2.5 0 0 0 2 4.5v2.879a2.5 2.5 0 0 0 .732 1.767l4.5 4.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-4.5-4.5A2.5 2.5 0 0 0 7.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
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
			"d": "M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
		}, {
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M6 6h.008v.008H6V6Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Trash.js
var Trash = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z",
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
			"d": "M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z",
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
			"d": "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Trophy.js
var Trophy = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 1.69a.494.494 0 0 0-.438-.494 32.352 32.352 0 0 0-7.124 0A.494.494 0 0 0 4 1.689v.567c-.811.104-1.612.24-2.403.406a.75.75 0 0 0-.595.714 4.5 4.5 0 0 0 4.35 4.622A3.99 3.99 0 0 0 7 8.874V10H6a1 1 0 0 0-1 1v2h-.667C3.597 13 3 13.597 3 14.333c0 .368.298.667.667.667h8.666a.667.667 0 0 0 .667-.667c0-.736-.597-1.333-1.333-1.333H11v-2a1 1 0 0 0-1-1H9V8.874a3.99 3.99 0 0 0 1.649-.876 4.5 4.5 0 0 0 4.35-4.622.75.75 0 0 0-.596-.714A30.897 30.897 0 0 0 12 2.256v-.567ZM4 3.768c-.49.066-.976.145-1.458.235a3.004 3.004 0 0 0 1.64 2.192A3.999 3.999 0 0 1 4 5V3.769Zm8 0c.49.066.976.145 1.458.235a3.004 3.004 0 0 1-1.64 2.192C11.936 5.818 12 5.416 12 5V3.769Z",
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
			"d": "M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 0 0-.552.698 5 5 0 0 0 4.503 5.152 6 6 0 0 0 2.946 1.822A6.451 6.451 0 0 1 7.768 13H7.5A1.5 1.5 0 0 0 6 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-.268a6.453 6.453 0 0 1-.684-2.202 6 6 0 0 0 2.946-1.822 5 5 0 0 0 4.503-5.152.75.75 0 0 0-.552-.698A31.804 31.804 0 0 0 16 2.562v-.387a.75.75 0 0 0-.629-.74A33.227 33.227 0 0 0 10 1ZM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 0 1-1.855-2.68Zm14.95 0a3.503 3.503 0 0 1-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332Z",
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
			"d": "M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/VideoCamera.js
var VideoCamera = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3ZM15 4.75a.75.75 0 0 0-1.28-.53l-2 2a.75.75 0 0 0-.22.53v2.5c0 .199.079.39.22.53l2 2a.75.75 0 0 0 1.28-.53v-6.5Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" }]
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
			"d": "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ViewColumns.js
var ViewColumns = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M9.836 3h-3.67v10h3.67V3ZM11.336 13H13.5a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-2.164v10ZM2.5 3h2.166v10H2.5A1.5 1.5 0 0 1 1 11.5v-7A1.5 1.5 0 0 1 2.5 3Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M14 17h2.75A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H14v14ZM12.5 3h-5v14h5V3ZM3.25 3H6v14H3.25A2.25 2.25 0 0 1 1 14.75v-9.5A2.25 2.25 0 0 1 3.25 3Z" }]
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
			"d": "M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M15 3.75H9v16.5h6V3.75ZM16.5 20.25h3.375c1.035 0 1.875-.84 1.875-1.875V5.625c0-1.036-.84-1.875-1.875-1.875H16.5v16.5ZM4.125 3.75H7.5v16.5H4.125a1.875 1.875 0 0 1-1.875-1.875V5.625c0-1.036.84-1.875 1.875-1.875Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/XMark.js
var XMark = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" }]
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
			"d": "M6 18 18 6M6 6l12 12"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/ui/shared/button/Button.svelte
var buttonAlignment = {
	left: "justify-start text-left origin-left",
	center: "justify-center",
	right: "justify-end text-right origin-right"
};
var buttonColor = {
	primary: "btn-primary",
	secondary: "btn-secondary",
	tertiary: "btn-tertiary",
	danger: "btn-danger",
	ghost: "btn-ghost",
	"danger-subtle": "text-red-500 dark:text-red-400 hover:bg-red-500/15 hover:dark:bg-red-400/20",
	"success-subtle": "text-green-500 dark:text-green-400 hover:bg-green-500 hover:dark:bg-green-400 hover:text-inherit!",
	"warning-subtle": "text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500 hover:dark:bg-yellow-400 hover:text-inherit!",
	"blue-subtle": `text-blue-500 dark:text-yellow-400 hover:bg-blue-500 hover:dark:bg-blue-400 hover:text-inherit!`,
	none: ""
};
var buttonShadow = {
	sm: "shadow-xs",
	none: "shadow-none"
};
var buttonSize = {
	xs: "btn-xs",
	sm: "btn-sm",
	md: "btn-md",
	lg: "btn-lg",
	xl: "btn-xl",
	"square-sm": "btn-square-sm",
	"square-md": "btn-square-md",
	"square-lg": "btn-square-lg",
	"square-xl": "btn-square-xl",
	custom: ""
};
var buttonRounding = {
	pill: "rounded-full",
	"2xl": "rounded-2xl",
	xl: "rounded-xl",
	lg: "rounded-lg",
	md: "rounded-md",
	inherit: "rounded-[inherit]",
	none: ""
};
var buttonWeight = {
	md: "font-medium",
	none: ""
};
var buttonGap = {
	xl: "gap-3",
	lg: "gap-2",
	md: "gap-1.5",
	none: ""
};
function Button($$renderer, $$props) {
	let { loading = false, submit = false, type = "button", color = "secondary", size = "md", rounding = size == "lg" || size == "square-lg" ? "2xl" : "xl", alignment = "center", shadow = "none", gap = "md", disabled, loaderWidth = void 0, href = void 0, class: clazz = "", prefix, children, suffix, icon, weight = "md", $$slots, $$events, ...rest } = $$props;
	element($$renderer, href ? "a" : "button", () => {
		$$renderer.push(`${attributes({
			role: href ? "link" : "button",
			href,
			...rest,
			tabindex: disabled ? -1 : void 0,
			class: clsx([
				type == "button" && "btn",
				buttonSize[size],
				buttonRounding[rounding],
				buttonShadow[shadow],
				buttonColor[color],
				buttonAlignment[alignment],
				buttonWeight[weight],
				buttonGap[gap],
				(disabled || loading) && "btn-disabled",
				alignment == "center" ? "origin-center" : alignment == "left" ? "origin-left" : "origin-right",
				clazz
			]),
			type: submit ? "submit" : "button"
		})}`);
	}, () => {
		if (loading) {
			$$renderer.push("<!--[0-->");
			Spinner($$renderer, { width: loaderWidth ?? 16 });
		} else if (prefix) {
			$$renderer.push("<!--[1-->");
			prefix?.($$renderer);
			$$renderer.push(`<!---->`);
		} else if (icon) {
			$$renderer.push("<!--[2-->");
			Icon($$renderer, {
				src: icon,
				size: "16",
				mini: true,
				class: [color == "secondary" && "text-slate-600 dark:text-zinc-400"]
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!----> `);
		suffix?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/lib/ui/shared/button/ButtonGroup.svelte
function ButtonGroup($$renderer, $$props) {
	let { orientation = "horizontal", children, class: clazz, $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<div${attributes({
		...rest,
		role: "group",
		class: clsx([
			"btn-group",
			orientation == "horizontal" ? "btn-group-horizontal" : "btn-group-vertical",
			clazz
		])
	}, "svelte-1qq3tao")}>`);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/lib/ui/shared/loader/Spinner.svelte
function Spinner($$renderer, $$props) {
	let { width = 16, $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<svg${attributes({
		...rest,
		width,
		height: width,
		stroke: "currentColor",
		fill: "none",
		"stroke-width": "2",
		viewBox: "0 0 24 24",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		class: "animate-spin",
		xmlns: "http://www.w3.org/2000/svg",
		"aria-live": "polite",
		role: "status"
	}, "svelte-2a5185", void 0, void 0, 3)}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`);
}
//#endregion
//#region src/lib/ui/shared/loader/TextLoader.svelte
function TextLoader($$renderer, $$props) {
	let { children, class: clazz } = $$props;
	$$renderer.push(`<div${attr_class(clsx(["text-loader font-medium text-lg tracking-tight", clazz]), "svelte-m1td40")} aria-busy="true" aria-live="polite">`);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/lib/ui/shared/materials/Material.svelte
function Material($$renderer, $$props) {
	const elevationClass = {
		flat: "",
		low: "shadow-2xs",
		medium: "shadow-xs",
		high: "shadow-md",
		xhigh: "shadow-lg",
		max: "shadow-xl"
	};
	const paddingClass = {
		none: "",
		xs: "p-1.5",
		sm: "p-2",
		md: "p-4",
		lg: "p-5",
		xl: "p-6"
	};
	const roundedClass = {
		none: "",
		sm: "rounded-xs",
		md: "rounded-md",
		lg: "rounded-lg",
		xl: "rounded-xl",
		"2xl": "rounded-2xl",
		"3xl": "rounded-3xl",
		full: "rounded-full"
	};
	const colorClass = {
		default: "material-default",
		distinct: "material-distinct",
		transparent: "material-transparent",
		uniform: "material-uniform",
		info: "material-info",
		warning: "material-warning",
		success: "material-success",
		error: "material-error",
		none: ""
	};
	let { elevation = "low", padding = "md", rounding = "xl", color = "uniform", element: element$3 = "div", icon, class: clazz = "", children, $$slots, $$events, ...rest } = $$props;
	element($$renderer, element$3, () => {
		$$renderer.push(`${attributes({
			...rest,
			class: clsx([
				elevationClass[elevation],
				paddingClass[padding],
				roundedClass[rounding],
				colorClass[color],
				"text-sm",
				clazz
			])
		})}`);
	}, () => {
		if (icon) {
			$$renderer.push("<!--[0-->");
			Icon($$renderer, {
				src: icon,
				size: "20",
				mini: true,
				class: "inline-block rounded-lg clear-both float-left mr-2"
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/lib/ui/shared/forms/helper.ts
var generateID = () => Math.floor(Math.random() * 1e6).toString();
//#endregion
//#region src/lib/ui/shared/forms/FileInput.svelte
function FileInput($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { accept = "*", id = generateID(), files = void 0, multiple = false, preview = true, label = void 0, class: clazz = "", customLabel, button, choose } = $$props;
		let previewURLs = derived(() => preview && files ? Array.from(files).map(URL.createObjectURL) : void 0);
		$$renderer.push(`<div${attr_class(`flex flex-col gap-1 ${stringify(clazz)}`)}>`);
		if (customLabel || label) {
			$$renderer.push("<!--[0-->");
			Label($$renderer, {
				for: id,
				text: label,
				children: ($$renderer) => {
					customLabel?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label class="w-max relative cursor-pointer space-x-2 flex flex-row items-center">`);
		if (button) {
			$$renderer.push("<!--[0-->");
			button($$renderer);
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			Button($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->Browse`);
				},
				$$slots: { default: true }
			});
		}
		$$renderer.push(`<!--]--> `);
		if (previewURLs()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-row items-center -space-x-1 hover:space-x-1 z-20 h-8"><!--[-->`);
			const each_array = ensure_array_like(previewURLs());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let file = each_array[$$index];
				$$renderer.push(`<img${attr("src", file)} alt="" class="w-8 h-8 object-cover rounded-full hover:w-16 hover:h-16 transition-all border border-slate-200 ring-1 ring-slate-50 dark:ring-zinc-950 bg-white dark:bg-zinc-950" onload="this.__e=event"/>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <span class="flex flex-row items-center text-slate-600 dark:text-zinc-400">`);
		if (choose) {
			$$renderer.push("<!--[0-->");
			choose($$renderer);
			$$renderer.push(`<!---->`);
		} else if ((files ?? []).length == 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`No file selected.`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((files ?? []).length)} files selected`);
		}
		$$renderer.push(`<!--]--></span> <input type="file"${attr("accept", accept)}${attr("multiple", multiple, true)} class="w-full h-full inset-0 opacity-0 absolute cursor-pointer"/></label></div>`);
		bind_props($$props, { files });
	});
}
//#endregion
//#region src/lib/ui/shared/forms/Label.svelte
function Label($$renderer, $$props) {
	/**
	* The `text` prop will take precedence over the slot.
	*/
	let { for: forID = void 0, text = void 0, class: clazz = "", customText, children, $$slots, $$events, ...rest } = $$props;
	element($$renderer, text || customText ? "label" : "h3", () => {
		$$renderer.push(`${attributes({
			...rest,
			for: forID,
			class: clsx(["text-sm text-slate-800 dark:text-zinc-200 font-medium", clazz])
		})}`);
	}, () => {
		if (text) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="inline-block">${escape_html(text)}</div>`);
		} else if (customText) {
			$$renderer.push("<!--[1-->");
			customText?.($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/lib/ui/shared/forms/TextArea.svelte
var sizeClass$1 = {
	sm: "p-3",
	md: "p-4",
	lg: "p-5"
};
function TextArea($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const borderClass = `
	border border-slate-200 dark:border-zinc-800
	`;
		let { label = void 0, value = void 0, placeholder = "", disabled = false, required = false, size = "md", id = generateID(), rows = 4, element = void 0, unstyled = false, class: clazz = "", customLabel, suffix, children, $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<div${attr_class(`flex flex-col gap-1 ${stringify(clazz)}`, "svelte-1iy65xi")}>`);
		if (customLabel || label) {
			$$renderer.push("<!--[0-->");
			Label($$renderer, {
				for: id,
				text: label,
				class: `peer-invalid:text-red-500 ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}`,
				children: ($$renderer) => {
					customLabel?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class(clsx([!unstyled && "text-area-container", clazz]), "svelte-1iy65xi")}><textarea${attributes({
			id,
			placeholder,
			disabled,
			rows,
			...rest,
			class: clsx([
				sizeClass$1[size],
				"text-area transition-all peer",
				!unstyled && borderClass,
				!unstyled && "focus:ring-2 ring-slate-800/50 dark:ring-zinc-200/50",
				suffix && "rounded-b-none border-b-0",
				clazz
			])
		}, "svelte-1iy65xi")}>`);
		const $$body = escape_html(value);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> `);
		if (suffix) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`
	border border-slate-200 dark:border-zinc-800
	 ${stringify(sizeClass$1[size])} w-full border-t-0 rounded-xl rounded-t-none flex items-center`, "svelte-1iy65xi")}>`);
			suffix?.($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, {
			value,
			element
		});
	});
}
//#endregion
//#region src/lib/ui/shared/forms/TextInput.svelte
var sizeClass = {
	sm: "px-3 py-1",
	md: "px-3.5 py-1.5",
	lg: "px-5 py-3"
};
var shadowClass = {
	sm: "shadow-xs",
	none: "shadow-none"
};
function TextInput($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { label, value = void 0, placeholder = "", disabled = false, required = false, size = "md", id = generateID(), icon, inlineAffixes = !!icon, shadow = "none", element = void 0, class: clazz = "", customLabel: passedCustomLabel, prefix, suffix, children, $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<div${attr_class(clsx(["text-input-container ", clazz]), "svelte-fvb3pr")}>`);
		if (passedCustomLabel || label) {
			$$renderer.push("<!--[0-->");
			Label($$renderer, {
				for: id,
				text: label,
				class: ["peer-invalid:text-red-500 relative", required && "after:content-['*'] after:text-red-500 after:ml-1"],
				children: ($$renderer) => {
					passedCustomLabel?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class(clsx([
			shadowClass[shadow],
			"text-input-sections focus-within:ring-2 ring-slate-300 dark:ring-zinc-700 transition-colors",
			clazz
		]), "svelte-fvb3pr")}>`);
		if (prefix || icon) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(clsx(["rounded-xl rounded-r-none text-slate-600 dark:text-zinc-400 pl-3"]), "svelte-fvb3pr")}>`);
			if (prefix) {
				$$renderer.push("<!--[0-->");
				prefix?.($$renderer);
				$$renderer.push(`<!---->`);
			} else if (icon) {
				$$renderer.push("<!--[1-->");
				Icon($$renderer, {
					src: icon,
					size: "20",
					mini: true
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <input${attributes({
			type: "text",
			id,
			placeholder,
			disabled,
			value,
			required,
			...rest,
			class: clsx([
				sizeClass[size],
				"text-input flex-1",
				(prefix || icon) && "rounded-l-none",
				(prefix || icon) && inlineAffixes && "border-l-0",
				suffix && "rounded-r-none",
				suffix && inlineAffixes && "border-r-0",
				clazz
			])
		}, "svelte-fvb3pr", void 0, void 0, 4)}/> `);
		if (suffix) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(clsx(["rounded-xl rounded-l-none text-slate-600 dark:text-zinc-400 h-full"]), "svelte-fvb3pr")}>`);
			suffix?.($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, {
			value,
			element
		});
	});
}
//#endregion
//#region src/lib/ui/shared/forms/select/Option.svelte
function Option($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, icon, $$slots, $$events, ...rest } = $$props;
		let optionElement = void 0;
		let option = derived(() => ({
			value: "",
			label: "",
			icon,
			disabled: void 0,
			isLabel: false
		}));
		const context = getContext("select");
		onDestroy(() => {
			const index = context.options.findIndex((i) => i.value == option().value);
			if (index != -1) context.options.splice(index, 1);
		});
		$$renderer.option({
			...rest,
			this: optionElement
		}, ($$renderer) => {
			children($$renderer);
			$$renderer.push(`<!---->`);
		}, void 0, void 0, void 0, void 0, true);
	});
}
//#endregion
//#region src/lib/ui/shared/forms/select/Select.svelte
function Select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let open = false;
		let element = void 0;
		const context = setContext("select", { options: [] });
		let { value = void 0, placeholder = void 0, label = void 0, size = "md", class: clazz = "", baseClass = "", selectClass = "", customLabel, children, customOption, oncontextmenu, onchange, placement = "bottom", target: passedTarget, $$slots, $$events, ...rest } = $$props;
		function selectTarget($$renderer, attachment) {
			Label($$renderer, {
				text: label,
				customText: customLabel,
				class: ["space-y-1 relative max-w-full w-max min-w-0", baseClass],
				children: ($$renderer) => {
					$$renderer.push(`<div class="relative max-w-full" role="presentation">`);
					$$renderer.select({
						...rest,
						this: element,
						class: [
							buttonSize[size],
							"btn btn-secondary select rounded-xl appearance-none pr-6! w-full",
							selectClass,
							clazz
						],
						value,
						onmousedown: (e) => {
							e.preventDefault();
						},
						onkeypress: (e) => {
							e.preventDefault();
							open = !open;
						},
						onchange,
						oncontextmenu,
						placeholder
					}, ($$renderer) => {
						if (placeholder) {
							$$renderer.push("<!--[0-->");
							$$renderer.option({
								disabled: true,
								selected: true,
								value: ""
							}, ($$renderer) => {
								$$renderer.push(`${escape_html(placeholder)}`);
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
						children?.($$renderer);
						$$renderer.push(`<!---->`);
					}, void 0, void 0, void 0, void 0, true);
					$$renderer.push(` `);
					Icon($$renderer, {
						src: ChevronUpDown,
						micro: true,
						size: "16",
						class: "absolute bottom-1/2 translate-y-1/2 right-1 box-border pointer-events-none z-10 text-slate-600 dark:text-zinc-400"
					});
					$$renderer.push(`<!----></div>`);
				},
				$$slots: { default: true }
			});
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function target($$renderer, attachment) {
					(passedTarget ?? selectTarget)?.($$renderer, attachment);
					$$renderer.push(`<!---->`);
				}
				Menu($$renderer, {
					placement,
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					target,
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(context.options);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let option = each_array[$$index];
							if (customOption) {
								$$renderer.push("<!--[0-->");
								customOption($$renderer, {
									option,
									selected: option.value == value
								});
								$$renderer.push(`<!---->`);
							} else {
								$$renderer.push("<!--[-1-->");
								MenuButton($$renderer, {
									onclick: async () => {
										value = option.value;
										await tick();
									},
									size: "custom",
									disabled: option.disabled,
									color: "none",
									class: [
										"min-h-0! py-1 hover:bg-slate-100 dark:hover:bg-zinc-800",
										option.value == value && "bg-slate-100 dark:bg-zinc-800 text-primary-900 dark:text-primary-100 font-medium",
										option.disabled && "pointer-events-none text-slate-600 dark:text-zinc-400",
										option.isLabel && "text-xs mt-2"
									],
									children: ($$renderer) => {
										if (option.value == value) {
											$$renderer.push("<!--[0-->");
											Icon($$renderer, {
												src: CheckCircle,
												size: "16",
												micro: true,
												class: "text-primary-900 dark:text-primary-100"
											});
										} else if (option.icon) {
											$$renderer.push("<!--[1-->");
											Icon($$renderer, {
												src: option.icon,
												size: "16",
												micro: true,
												class: "text-slate-600 dark:text-zinc-400"
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> ${html(option.label)}`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]-->`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						target: true,
						default: true
					}
				});
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/ui/shared/forms/Switch.svelte
function Switch($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { checked = void 0, labelClass = "", class: clazz = "", children, description } = $$props;
		$$renderer.push(`<label${attr_class(`font-normal cursor-pointer flex flex-row items-center gap-4 group ${stringify(clazz)}`, "svelte-9q5cns")}><div${attr_class(`w-11 h-6 rounded-full relative z-[inherit] cursor-pointer flex flex-row transition-colors shadow-xs ${checked ? "bg-primary-900 dark:bg-primary-100" : "bg-slate-200 dark:bg-zinc-800"} p-0.5 shrink-0`)}><input${attr("checked", checked, true)} type="checkbox" class="peer appearance-none absolute top-0 left-0 w-full h-full cursor-pointer z-10"/> <div class="box-border w-5 h-full bg-white dark:peer-checked:bg-black rounded-full shadow-xs group-active:w-5.5 transition peer-checked:translate-x-5 peer-checked:group-active:translate-x-4.5 peer-checked:rtl:-translate-x-5 peer-checked:group-active:rtl:-translate-x-4 svelte-9q5cns"></div></div> <div${attr_class(`flex flex-col ${stringify(labelClass)}`, "svelte-9q5cns")}>`);
		children?.($$renderer);
		$$renderer.push(`<!----> `);
		if (description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="font-normal text-sm text-slate-700 dark:text-zinc-300">`);
			description?.($$renderer);
			$$renderer.push(`<!----></span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></label>`);
		bind_props($$props, { checked });
	});
}
//#endregion
//#region src/lib/ui/shared/disclosure/Disclosure.svelte
function Disclosure($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const id = props_id($$renderer);
		let { open = false, class: clazz = "", summary, extended, children, $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<div${attributes({
			...rest,
			class: clsx(["w-full relative", clazz])
		}, "svelte-12tvw3t")}><label${attr("for", id)} class="w-full">`);
		summary?.($$renderer, { open });
		$$renderer.push(`<!----></label> `);
		extended?.($$renderer);
		$$renderer.push(`<!----> <input${attr("id", id)} class="appearance-none absolute w-full h-full inset-0 pointer-events-none svelte-12tvw3t" type="checkbox"${attr("checked", open, true)}/> <div class="expand svelte-12tvw3t"${attr("inert", !open, true)}>`);
		children?.($$renderer, { open });
		$$renderer.push(`<!----></div></div>`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/ui/shared/disclosure/Expandable.svelte
function Expandable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, icon = true, class: clazz = "", title, extended, content, children } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function summary($$renderer) {
					$$renderer.push(`<div${attr_class(clsx(["font-medium w-full text-left flex flex-row items-center justify-between hover:text-primary-900", "dark:hover:text-primary-100 transition-colors z-0 group relative cursor-pointer"]))}><div class="flex flex-row gap-1 items-center w-full select-none">`);
					title?.($$renderer, open);
					$$renderer.push(`<!----></div> `);
					if (icon) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div${attr_class(clsx([
							"ml-auto",
							!open && "rotate-90",
							"transition-transform duration-300 ease-out"
						]))}>`);
						Icon($$renderer, {
							src: open ? Minus : Plus,
							size: "15",
							micro: true,
							class: []
						});
						$$renderer.push(`<!----></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="inset-0 -z-10 opacity-0 absolute bg-slate-200/50 dark:bg-zinc-900/50 rounded-full group-hover:opacity-100 group-hover:-inset-1 group-hover:-inset-x-2 transition-all"></div></div>`);
				}
				Disclosure($$renderer, {
					extended,
					class: ["gap-2", clazz],
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					summary,
					children: ($$renderer) => {
						if (content) {
							$$renderer.push("<!--[0-->");
							content($$renderer);
							$$renderer.push(`<!---->`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<div class="text-slate-900 dark:text-zinc-100 *:mt-2">`);
							children?.($$renderer);
							$$renderer.push(`<!----></div>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						summary: true,
						default: true
					}
				});
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/ui/shared/popover/Portal.svelte
function Portal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let portal;
		createEventDispatcher();
		onDestroy(() => {
			portal.remove();
		});
		let { class: clazz = "", children } = $$props;
		$$renderer.push(`<div class="portal-initial-mount-point svelte-1lv3k5w"><div${attr_class(`portal-content ${stringify(clazz || "")}`, "svelte-1lv3k5w")}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
//#region src/lib/ui/shared/modal/Modal.svelte
function Modal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { action = void 0, open = false, title = void 0, dismissable = true, customTitle, children, actions, ondismissed, onaction, class: clazz = "" } = $$props;
		const modalId = Math.random().toString();
		function onclose() {
			open = false;
			if ((page.state.openModals ?? []).includes(modalId)) history.back();
			ondismissed?.();
		}
		Portal($$renderer, {
			children: ($$renderer) => {
				if (open) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div role="dialog"${attr_class(clsx([
						"overflow-hidden fixed top-0 left-0 w-screen h-screen z-100",
						"flex flex-col items-center justify-center backdrop-blur-xs",
						"bg-white/50 dark:bg-black/50 box-border p-4"
					]))}><div${attr_class(clsx([
						"w-full border border-slate-200 border-b-slate-300 dark:border-zinc-900",
						"rounded-2xl max-w-lg box-border mx-auto overscroll-contain shadow-lg overflow-auto",
						"p-5 flex flex-col gap-2 dark:bg-zinc-950 bg-slate-50 relative",
						clazz
					]))}>`);
					if (dismissable) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							class: "absolute top-0 right-0 m-2 text-slate-600 dark:text-zinc-400",
							color: "tertiary",
							size: "square-sm",
							onclick: onclose,
							icon: XMark
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (title !== null) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<h1 class="font-medium tracking-tight text-xl leading-5 max-w-full">`);
						if (customTitle) {
							$$renderer.push("<!--[0-->");
							customTitle?.($$renderer);
							$$renderer.push(`<!---->`);
						} else if (title) {
							$$renderer.push("<!--[1-->");
							$$renderer.push(`${escape_html(title)}`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></h1>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					children?.($$renderer);
					$$renderer.push(`<!----> `);
					if (action) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="mt-2 flex w-full">`);
						if (actions) {
							$$renderer.push("<!--[0-->");
							actions($$renderer, { action });
							$$renderer.push(`<!---->`);
						} else {
							$$renderer.push("<!--[-1-->");
							Button($$renderer, {
								class: "w-full",
								onclick: () => {
									onaction?.();
									onclose();
								},
								color: "primary",
								size: "lg",
								rounding: "xl",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(action)}`);
								},
								$$slots: { default: true }
							});
						}
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/ui/shared/modal/modal.ts
var shownModal = writable();
var action = (action) => ({
	action: action?.action ? () => {
		action?.action?.();
		if (action.close) shownModal.set(void 0);
	} : () => shownModal.set(void 0),
	type: action?.type ?? "secondary",
	content: action?.content || "Back",
	close: action?.close ?? true
});
function modal(inputModal) {
	const modal = {
		actions: inputModal.actions ?? [action()],
		dismissable: inputModal.dismissable ?? true,
		title: inputModal.title,
		body: inputModal.body,
		type: inputModal.type ?? "info",
		snippet: inputModal.snippet
	};
	shownModal.set(modal);
}
//#endregion
//#region src/lib/ui/shared/modal/ModalContainer.svelte
function ModalContainer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		$$renderer.push(`<!---->`);
		if (store_get($$store_subs ??= {}, "$shownModal", shownModal)) {
			$$renderer.push("<!--[0-->");
			Modal($$renderer, {
				title: store_get($$store_subs ??= {}, "$shownModal", shownModal).title,
				dismissable: store_get($$store_subs ??= {}, "$shownModal", shownModal).dismissable,
				ondismissed: () => shownModal.set(void 0),
				open: !!store_get($$store_subs ??= {}, "$shownModal", shownModal),
				children: ($$renderer) => {
					if (store_get($$store_subs ??= {}, "$shownModal", shownModal).snippet) {
						$$renderer.push("<!--[0-->");
						store_get($$store_subs ??= {}, "$shownModal", shownModal).snippet?.($$renderer);
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (store_get($$store_subs ??= {}, "$shownModal", shownModal).body) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p>${escape_html(store_get($$store_subs ??= {}, "$shownModal", shownModal).body)}</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (store_get($$store_subs ??= {}, "$shownModal", shownModal).actions) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div${attr_class(`flex items-center gap-2 ${store_get($$store_subs ??= {}, "$shownModal", shownModal).actions.length >= 3 ? "flex-col" : "flex-row"}`)}><!--[-->`);
						const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$shownModal", shownModal).actions);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let action = each_array[$$index];
							Button($$renderer, {
								size: "lg",
								class: "flex-1 w-full",
								onclick: action.action,
								color: action.type,
								children: ($$renderer) => {
									if (action.icon) {
										$$renderer.push("<!--[0-->");
										Icon($$renderer, {
											src: action.icon,
											mini: true,
											size: "16"
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> ${escape_html(action.content)}`);
								},
								$$slots: { default: true }
							});
						}
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		$$renderer.push(`<!---->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/ui/shared/popover/Menu.svelte
function Menu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { openOnHover = false, open = false, placement = "bottom-start", middleware = [
			offset(6),
			shift({ padding: 6 }),
			flip()
		], strategy = "absolute", target, children, $$slots, $$events, ...rest } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function popover($$renderer) {
					$$renderer.push(`<div class="w-full max-w-sm max-h-128 overflow-auto list-none shadow-lg rounded-xl select-none"><div class="flex flex-col p-1 list-none bg-white/60 dark:bg-zinc-900/60 rounded-xl border border-slate-200 dark:border-zinc-800 dark:border-t-zinc-700 not-dark:border-b-slate-300 gap-px" role="menu">`);
					children?.($$renderer, open);
					$$renderer.push(`<!----></div></div>`);
				}
				Popover($$renderer, spread_props([
					{
						openOnHover,
						placement,
						middleware,
						strategy,
						target
					},
					rest,
					{
						popoverClass: "rounded-xl w-full backdrop-blur-xl max-w-72",
						get open() {
							return open;
						},
						set open($$value) {
							open = $$value;
							$$settled = false;
						},
						popover,
						$$slots: { popover: true }
					}
				]));
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/ui/shared/popover/MenuButton.svelte
function MenuButton($$renderer, $$props) {
	let { color = "tertiary", alignment = "left", href = void 0, disabled = false, class: clazz = "", icon, prefix: passedPrefix, children, suffix: passedSuffix, nest, $$slots, $$events, ...rest } = $$props;
	{
		function prefix($$renderer) {
			$$renderer.push(`<div${attr_class(clsx(["contents shrink-0", color == "tertiary" && "text-slate-600 dark:text-zinc-400"]))}>`);
			if (icon) {
				$$renderer.push("<!--[0-->");
				Icon($$renderer, {
					src: icon,
					micro: true,
					size: "16"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				passedPrefix?.($$renderer);
				$$renderer.push(`<!---->`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		function suffix($$renderer) {
			passedSuffix?.($$renderer);
			$$renderer.push(`<!----> `);
			if (nest) {
				$$renderer.push("<!--[0-->");
				Icon($$renderer, {
					src: ChevronRight,
					size: "16",
					micro: true,
					class: "ml-auto"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		Button($$renderer, spread_props([rest, {
			color,
			type: "none",
			size: "custom",
			rounding: "none",
			class: [
				"w-full px-3 py-1.5 min-h-7 duration-75 hover:duration-0 hover:cursor-default font-normal rounded-lg flex items-center gap-1 text-sm",
				disabled && "opacity-70 pointer-events-none cursor-not-allowed",
				color == "tertiary" && "dark:hover:bg-zinc-800/70",
				clazz
			],
			alignment,
			href,
			disabled,
			"data-autoclose": nest ? "false" : "true",
			shadow: "none",
			role: "menuitem",
			prefix,
			suffix,
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			},
			$$slots: {
				prefix: true,
				suffix: true,
				default: true
			}
		}]));
	}
}
//#endregion
//#region src/lib/ui/shared/popover/MenuDivider.svelte
function MenuDivider($$renderer, $$props) {
	let { showLabel = false, hidden = false, children } = $$props;
	$$renderer.push(`<div${attr_class(clsx(["text-slate-800 dark:text-zinc-200 text-xs font-medium mx-3 my-1.5 flex items-center gap-1", hidden && "sr-only"]))}><div${attr_class(clsx([!showLabel && "sr-only"]))}>`);
	children?.($$renderer);
	$$renderer.push(`<!----></div> <hr${attr_class(clsx(["shrink flex-1 border-slate-100 dark:border-zinc-800", !showLabel && "-mx-4"]))}/></div>`);
}
//#endregion
//#region node_modules/svelte-floating-ui/dist/dom/index.js
var dom_exports = /* @__PURE__ */ __exportAll({});
import * as import__floating_ui_dom from "@floating-ui/dom";
__reExport(dom_exports, import__floating_ui_dom);
//#endregion
//#region node_modules/svelte-floating-ui/dist/index.js
var createFloatingActions = (initOptions) => {
	let referenceElement;
	let floatingElement;
	const defaultOptions = { autoUpdate: true };
	let options = initOptions ?? {};
	const getOptions = (mixin) => {
		return {
			...defaultOptions,
			...initOptions || {},
			...mixin || {}
		};
	};
	const update = (updateOptions) => {
		if (referenceElement && floatingElement) {
			options = getOptions(updateOptions);
			(0, dom_exports.computePosition)(referenceElement, floatingElement, options).then((v) => {
				Object.assign(floatingElement.style, {
					position: v.strategy,
					left: `${v.x}px`,
					top: `${v.y}px`
				});
				options?.onComputed && options.onComputed(v);
			});
		}
	};
	const referenceAction = (node) => {
		if ("subscribe" in node) {
			setupVirtualElementObserver(node);
			return {};
		} else {
			referenceElement = node;
			update();
		}
	};
	const contentAction = (node, contentOptions) => {
		let autoUpdateDestroy;
		floatingElement = node;
		options = getOptions(contentOptions);
		setTimeout(() => update(contentOptions), 0);
		update(contentOptions);
		const destroyAutoUpdate = () => {
			if (autoUpdateDestroy) {
				autoUpdateDestroy();
				autoUpdateDestroy = void 0;
			}
		};
		const initAutoUpdate = (_options = options) => {
			return new Promise((resolve) => {
				const { autoUpdate } = _options || {};
				destroyAutoUpdate();
				if (autoUpdate !== false) (/* @__PURE__ */ tick()).then(() => {
					resolve((0, dom_exports.autoUpdate)(referenceElement, floatingElement, () => update(_options), autoUpdate === true ? {} : autoUpdate));
				});
			});
		};
		initAutoUpdate().then((destroy) => autoUpdateDestroy = destroy);
		return {
			update(contentOptions) {
				update(contentOptions);
				initAutoUpdate().then((destroy) => autoUpdateDestroy = destroy);
			},
			destroy() {
				destroyAutoUpdate();
			}
		};
	};
	const setupVirtualElementObserver = (node) => {
		onDestroy(node.subscribe(($node) => {
			if (referenceElement === void 0) {
				referenceElement = $node;
				update();
			} else {
				Object.assign(referenceElement, $node);
				update();
			}
		}));
	};
	return [
		referenceAction,
		contentAction,
		update
	];
};
//#endregion
//#region src/lib/ui/shared/popover/Popover.svelte
function Popover($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { openOnHover = false, open = false, autoClose = true, placement = "bottom-start", middleware = [
			offset(6),
			shift(),
			flip()
		], strategy = "fixed", popoverClass = "", target, popover, children } = $$props;
		const [floatingRef, floatingContent] = createFloatingActions({
			strategy,
			placement,
			middleware,
			onComputed: ({ placement }) => {}
		});
		const menuAttach = (element) => {
			const e = element;
			function toggle(force) {
				if (!open && force == false) return;
				const newOpen = force ?? !open;
				if (!newOpen) e.focus();
				open = newOpen;
			}
			const mouseover = () => openOnHover && toggle(true);
			const mouseleave = () => openOnHover && toggle(false);
			const focus = () => openOnHover && toggle(true);
			const focusout = () => openOnHover && toggle(false);
			const click = () => {
				toggle();
				if (autoClose) {
					const clickHandler = (event) => {
						if (!e) return;
						const target = event.target;
						if (!e?.contains(event.target)) {
							if (target?.closest("[data-autoclose='false']") == null) {
								toggle(false);
								document.removeEventListener("click", clickHandler);
							}
						}
					};
					document.addEventListener("click", clickHandler);
				}
			};
			e.addEventListener("mouseover", mouseover);
			e.addEventListener("mouseleave", mouseleave);
			e.addEventListener("focus", focus);
			e.addEventListener("focusout", focusout);
			e.addEventListener("click", click);
			floatingRef(e);
			return () => {
				e.addEventListener("mouseover", mouseover);
				e.removeEventListener("mouseleave", mouseleave);
				e.removeEventListener("focus", focus);
				e.removeEventListener("focusout", focusout);
				e.removeEventListener("click", click);
			};
		};
		target?.($$renderer, menuAttach);
		$$renderer.push(`<!----> `);
		if (open) {
			$$renderer.push("<!--[0-->");
			Portal($$renderer, {
				class: "z-150",
				children: ($$renderer) => {
					$$renderer.push(`<div${attr_class(clsx(["z-150", popoverClass]))}>`);
					if (popover) {
						$$renderer.push("<!--[0-->");
						popover($$renderer, open);
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						Material($$renderer, {
							elevation: "high",
							color: "distinct",
							rounding: "xl",
							padding: "sm",
							class: "flex flex-col",
							children: ($$renderer) => {
								children?.($$renderer, open);
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
					}
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/app/markdown/MdTree.svelte
function MdTree($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { type, tokens = [], renderers, raw, text, $$slots, $$events, ...rest } = $$props;
		if (type) {
			$$renderer.push("<!--[0-->");
			if (renderers[type]) {
				$$renderer.push("<!--[0-->");
				const Renderer = renderers[type];
				if (Renderer) {
					$$renderer.push("<!--[-->");
					Renderer($$renderer, spread_props([rest, {
						raw,
						text,
						children: ($$renderer) => {
							$$renderer.push(`<!--[-->`);
							const each_array = ensure_array_like(tokens);
							for (let $$index_4 = 0, $$length = each_array.length; $$index_4 < $$length; $$index_4++) {
								let token = each_array[$$index_4];
								if (type != "list" && type != "table") {
									$$renderer.push("<!--[0-->");
									if (token.tokens && token.tokens.length > 0) {
										$$renderer.push("<!--[0-->");
										MdTree($$renderer, spread_props([{
											tokens: token.tokens,
											renderers
										}, rest]));
									} else if (token.text) {
										$$renderer.push("<!--[1-->");
										$$renderer.push(`${escape_html(token.text)}`);
									} else if (text) {
										$$renderer.push("<!--[2-->");
										$$renderer.push(`${escape_html(text)}`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								} else if (type == "list" && token.items) {
									$$renderer.push("<!--[1-->");
									$$renderer.push(`<!--[-->`);
									const each_array_1 = ensure_array_like(token.items);
									for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
										let item = each_array_1[$$index];
										MdTree($$renderer, spread_props([{
											type: "list_item",
											renderers,
											tokens: [item]
										}, rest]));
									}
									$$renderer.push(`<!--]-->`);
								} else if (type == "table") {
									$$renderer.push("<!--[2-->");
									const THead = renderers["tablehead"];
									const TBody = renderers["tablebody"];
									const TRow = renderers["tablerow"];
									if (token.header) {
										$$renderer.push("<!--[0-->");
										if (THead) {
											$$renderer.push("<!--[-->");
											THead($$renderer, {
												children: ($$renderer) => {
													if (TRow) {
														$$renderer.push("<!--[-->");
														TRow($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<!--[-->`);
																const each_array_2 = ensure_array_like(token.header);
																for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
																	let heading = each_array_2[index];
																	MdTree($$renderer, spread_props([rest, {
																		type: "tablecell",
																		renderers,
																		tokens: heading.tokens,
																		align: token.align[index]
																	}]));
																}
																$$renderer.push(`<!--]-->`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (token.rows) {
										$$renderer.push("<!--[0-->");
										if (TBody) {
											$$renderer.push("<!--[-->");
											TBody($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!--[-->`);
													const each_array_3 = ensure_array_like(token.rows);
													for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
														let row = each_array_3[$$index_3];
														if (TRow) {
															$$renderer.push("<!--[-->");
															TRow($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!--[-->`);
																	const each_array_4 = ensure_array_like(row);
																	for (let index = 0, $$length = each_array_4.length; index < $$length; index++) {
																		let cell = each_array_4[index];
																		MdTree($$renderer, spread_props([rest, {
																			type: "tablecell",
																			renderers,
																			tokens: cell.tokens,
																			align: token.align[index]
																		}]));
																	}
																	$$renderer.push(`<!--]-->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					}]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_5 = ensure_array_like(tokens);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let token = each_array_5[$$index_5];
				MdTree($$renderer, spread_props([
					rest,
					token,
					{
						tokens: [token],
						type: token.type,
						renderers,
						raw: token.raw,
						text: token.text
					}
				]));
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdCode.svelte
function MdCode($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { raw } = $$props;
		function parseCodeblock(src) {
			const match = /^```(.*)/gi.exec(src);
			if (match?.[1]) return {
				code: src.replace(/^```(.*)/gi, "").replaceAll("```", ""),
				lang: match?.[1]
			};
			else return { code: src.replaceAll("```", "") };
		}
		let codeblock = derived(() => parseCodeblock(raw));
		Material($$renderer, {
			padding: "none",
			rounding: "2xl",
			class: "flex flex-col rounded-xl\n  divide-y divide-slate-200 dark:divide-zinc-800 overflow-hidden",
			children: ($$renderer) => {
				$$renderer.push(`<div class="w-full bg-slate-25 dark:bg-zinc-925 h-9 flex items-center justify-between p-2"><pre class="code-baseline text-xs"> ${escape_html(codeblock().lang)}</pre> `);
				Button($$renderer, {
					size: "square-sm",
					color: "tertiary",
					onclick: () => {
						navigator?.clipboard?.writeText(codeblock().code);
						toast({ content: "Copied to clipboard." });
					},
					children: ($$renderer) => {
						Icon($$renderer, {
							src: ClipboardDocument,
							size: "16",
							micro: true,
							class: "text-slate-600 dark:text-zinc-400"
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <pre class="code-baseline w-full overflow-x-auto text-xs bg-white dark:bg-zinc-950 px-4">
    ${escape_html(codeblock().code)}
  </pre>`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdHeading.svelte
function MdHeading($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const options = getContext("options");
		let { depth = 0, raw = void 0, children } = $$props;
		if (depth === 1) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<h1${attr_class(clsx([options.inline && "inline"]), "svelte-azg7mb")}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></h1>`);
		} else if (depth === 2) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<h2${attr_class(clsx([options.inline && "inline"]), "svelte-azg7mb")}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></h2>`);
		} else if (depth === 3) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<h3${attr_class(clsx([options.inline && "inline"]), "svelte-azg7mb")}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></h3>`);
		} else if (depth === 4) {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<h4${attr_class(clsx([options.inline && "inline"]), "svelte-azg7mb")}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></h4>`);
		} else if (depth === 5) {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<h5${attr_class(clsx([options.inline && "inline"]), "svelte-azg7mb")}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></h5>`);
		} else if (depth === 6) {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<h6${attr_class(clsx([options.inline && "inline"]), "svelte-azg7mb")}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></h6>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html(raw)}`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdHr.svelte
function MdHr($$renderer) {
	$$renderer.push(`<hr class="border-slate-200 dark:border-zinc-800"/>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/MdHtml.svelte
function MdHtml($$renderer, $$props) {
	let { text } = $$props;
	$$renderer.push(`<p>${escape_html(text)}</p>`);
}
//#endregion
//#region src/lib/app/settings.svelte.ts
var SSR_ENABLED = public_env.PUBLIC_SSR_ENABLED?.toLowerCase() == "true";
var toBool = (str) => {
	if (!str) return null;
	return str.toLowerCase() === "true";
};
function isLeaf(node) {
	return node != null && typeof node === "object" && "default" in node;
}
function resolveSchema(schema) {
	const result = {};
	for (const [key, node] of Object.entries(schema)) if (isLeaf(node)) if (node.env) {
		const envVal = public_env[node.env];
		if (typeof node.default === "boolean") result[key] = toBool(envVal) ?? node.default;
		else result[key] = envVal ?? node.default;
	} else result[key] = node.default;
	else result[key] = resolveSchema(node);
	return result;
}
var defaultSettings = resolveSchema({
	settingsVer: { default: 8 },
	expandableImages: {
		default: true,
		env: "PUBLIC_EXPANDABLE_IMAGES"
	},
	markReadPosts: {
		default: true,
		env: "PUBLIC_MARK_READ_POSTS"
	},
	showInstances: {
		user: {
			default: true,
			env: "PUBLIC_SHOW_INSTANCES_USER"
		},
		community: {
			default: true,
			env: "PUBLIC_SHOW_INSTANCES_COMMUNITY"
		},
		comments: {
			default: true,
			env: "PUBLIC_SHOW_INSTANCES_COMMENTS"
		}
	},
	defaultSort: {
		sort: {
			default: "Active",
			env: "PUBLIC_DEFAULT_FEED_SORT"
		},
		feed: {
			default: "Local",
			env: "PUBLIC_DEFAULT_FEED"
		},
		comments: {
			default: "Hot",
			env: "PUBLIC_DEFAULT_COMMENT_SORT"
		}
	},
	hidePosts: {
		deleted: {
			default: false,
			env: "PUBLIC_HIDE_DELETED"
		},
		removed: {
			default: false,
			env: "PUBLIC_HIDE_REMOVED"
		}
	},
	expandSidebar: {
		default: true,
		env: "PUBLIC_EXPAND_SIDEBAR"
	},
	expand: {
		communities: {
			default: true,
			env: "PUBLIC_EXPAND_COMMUNITIES"
		},
		favorites: {
			default: true,
			env: "PUBLIC_EXPAND_FAVORITES"
		},
		moderates: {
			default: true,
			env: "PUBLIC_EXPAND_MODERATES"
		},
		about: { default: false },
		stats: { default: false },
		team: { default: false },
		accounts: { default: true }
	},
	displayNames: {
		default: true,
		env: "PUBLIC_DISPLAY_NAMES"
	},
	nsfwBlur: {
		default: true,
		env: "PUBLIC_NSFW_BLUR"
	},
	moderation: {
		presets: { default: [{
			title: "Preset 1",
			content: `Your submission in *"{{post}}"* was removed for {{reason}}.`
		}] },
		defaultRemoveAction: { default: null }
	},
	modlogCardView: { default: toBool(public_env.PUBLIC_MODLOG_CARD_VIEW) ?? void 0 },
	debugInfo: {
		default: false,
		env: "PUBLIC_DEBUG_INFO"
	},
	expandImages: {
		default: true,
		env: "PUBLIC_EXPAND_IMAGES"
	},
	view: {
		default: "compact",
		env: "PUBLIC_VIEW"
	},
	font: {
		default: "inter",
		env: "PUBLIC_FONT"
	},
	leftAlign: {
		default: false,
		env: "PUBLIC_LEFT_ALIGN"
	},
	newWidth: {
		default: true,
		env: "PUBLIC_LIMIT_LAYOUT_WIDTH"
	},
	markPostsAsRead: {
		default: true,
		env: "PUBLIC_MARK_POSTS_AS_READ"
	},
	openLinksInNewTab: { default: false },
	crosspostOriginalLink: { default: true },
	embeds: {
		clickToView: { default: true },
		youtube: { default: "youtube" },
		invidious: { default: void 0 },
		piped: { default: void 0 }
	},
	dock: {
		paletteHotkey: { default: "/" },
		autoHide: { default: true }
	},
	posts: {
		deduplicateEmbed: {
			default: true,
			env: "PUBLIC_DEDUPLICATE_EMBED"
		},
		compactFeatured: {
			default: true,
			env: "PUBLIC_COMPACT_FEATURED"
		},
		showHidden: { default: false },
		noVirtualize: { default: false },
		reverseActions: {
			default: false,
			env: "PUBLIC_REVERSE_ACTIONS"
		},
		titleOpensUrl: {
			default: false,
			env: "PUBLIC_TITLE_OPENS_URL"
		}
	},
	filters: { default: [] },
	forms: { autosubmitAutofill: { default: false } },
	infiniteScroll: { default: true },
	language: {
		default: null,
		env: "PUBLIC_LANGUAGE"
	},
	useRtl: { default: false },
	parseTags: { default: true },
	logoColorMonth: { default: null },
	absoluteDates: { default: false },
	messages: { fullMarkdown: {
		default: false,
		env: "PUBLIC_FULL_MARKDOWN"
	} },
	voteRatioBar: { default: false }
});
function createSettingsState(initial) {
	return initial;
}
var settings = createSettingsState(structuredClone(defaultSettings));
function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}
/**
* Deep merge two objects.
* @param target
* @param ...sources
*/
function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();
	if (isObject(target) && isObject(source)) for (const key in source) if (isObject(source[key])) {
		if (!target[key]) Object.assign(target, { [key]: {} });
		mergeDeep(target[key], source[key]);
	} else Object.assign(target, { [key]: source[key] });
	return mergeDeep(target, ...sources);
}
globalThis.Date;
var SvelteSet = globalThis.Set;
var SvelteMap = globalThis.Map;
var SvelteURL = globalThis.URL;
var SvelteURLSearchParams = globalThis.URLSearchParams;
//#endregion
//#region src/lib/app/util.svelte.ts
var findClosestNumber = (numbers, target) => numbers.reduce((prev, curr) => curr >= target && (prev < target || curr < prev) ? curr : prev);
var searchParam = (_url, key, value, ...deleteKeys) => {
	const url = new SvelteURL(_url);
	url.searchParams.set(key, value);
	deleteKeys.forEach((k) => url.searchParams.delete(k));
	goto(url);
};
var fullCommunityName = (name, actorId) => `${name}@${new SvelteURL(actorId).hostname}`;
var placeholders = { get: (type) => {
	switch (type) {
		case "post": return Math.random() < .01 && public_env.PUBLIC_XYLIGHT_MODE ? "top 10 reasons why TCP is brilliant and UDP is a spawn of satan" : "Add a post title";
		case "body": return "What do you have to say?";
		case "comment": return "Join the conversation";
		case "url": return "https://example.com";
	}
} };
function moveItem(array, currentIndex, newIndex) {
	if (currentIndex < 0 || currentIndex >= array.length || newIndex < 0 || newIndex >= array.length) throw new Error("Invalid index");
	const newArray = [...array];
	const [item] = newArray.splice(currentIndex, 1);
	newArray.splice(newIndex, 0, item);
	return newArray;
}
var DOMAIN_REGEX_FORMS = "(http(s)?://)?((?!-)[A-Za-z0-9]{1,63}.)+[A-Za-z]{2,63}(:[0-9]{0,5})?";
var instanceToURL = (input) => {
	if (input.startsWith("http://") || input.startsWith("https://")) return input;
	const host = input.split(":")[0];
	if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || /^192\.168\./.test(host) || /^10\./.test(host)) return `http://${input}`;
	return `https://${input}`;
};
function canParseUrl(url) {
	try {
		new SvelteURL(url);
		return true;
	} catch {
		return false;
	}
}
function escapeHtml(input) {
	return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var awaitIfServer = async (promise) => ({ data: await promise });
var ReactiveState = class {
	value;
	constructor(initialValue) {
		this.value = initialValue;
	}
};
var isImage = (url) => {
	try {
		if (!url) return false;
		return /\.(jpeg|jpg|gif|png|svg|bmp|webp|avif)/i.test(url);
	} catch {
		return false;
	}
};
var isVideo = (url) => {
	try {
		if (!url) return false;
		return /\.(mp4|mov|webm|mkv|avi)/i.test(url);
	} catch {
		return false;
	}
};
var communityLink = (community, prefix = "") => `${prefix}/c/${fullCommunityName(community.name, community.actor_id)}`;
var userLink = (person, prefix = "") => `${prefix}/u/${person.name}@${new SvelteURL(person.actor_id).hostname}`;
/**
* Basic types only, don't use for anything more than basic equality
*/
function recursiveEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== "object" || typeof b !== "object") return false;
	if (a == null || b == null) if (a == null && b == null) return true;
	else return false;
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length != keysB.length) return false;
	for (const key of keysA) {
		const valA = a[key];
		const valB = b[key];
		if (typeof valA == "object" && typeof valB == "object") {
			if (!recursiveEqual(valA, valB)) return false;
		} else if (valA != valB) return false;
	}
	return true;
}
//#endregion
//#region src/lib/feature/post/helpers.ts
var bestImageURL = (post, thumbnail = true, width = 1024, format = "webp") => {
	if (post.thumbnail_url && (thumbnail || !post.url)) return optimizeImageURL(post.thumbnail_url, width, format);
	else if (post.url) return optimizeImageURL(post.url, width, format);
	return post.url ?? "";
};
var optimizeImageURL = (urlStr, width = 1024, format = "webp") => {
	try {
		let url;
		try {
			url = new URL(urlStr);
		} catch {
			return urlStr;
		}
		const newUrl = new URL(public_env.PUBLIC_IMAGE_PROXY ? `${public_env.PUBLIC_IMAGE_PROXY}/thumbnail` : url);
		if (public_env.PUBLIC_IMAGE_PROXY) newUrl.searchParams.set("url", encodeURIComponent(url.toString()));
		if (format) newUrl.searchParams.set("format", format);
		if (width > 0 && !newUrl.searchParams.has("thumbnail")) newUrl.searchParams.set("thumbnail", findClosestNumber([
			32,
			64,
			128,
			196,
			256,
			512,
			728,
			1024,
			1536
		], width).toString());
		return newUrl.toString();
	} catch (e) {
		console.error(e);
		return urlStr;
	}
};
var YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
var isYoutubeLink = (url) => {
	if (!url) return null;
	return url?.match?.(YOUTUBE_REGEX);
};
function postLink(post) {
	return `/post/${encodeURIComponent(profile.current.instance)}/${post.id}`;
}
function mediaType(post) {
	if (!post) return "none";
	const isPost = typeof post != "string";
	const url = isPost ? post.url : post;
	if (isPost) {
		if (post.poll) return "poll";
		if (post.event) return "event";
	}
	if (!url) return "none";
	try {
		new URL(url);
	} catch {
		return "none";
	}
	if (isImage(url)) return "image";
	if (isVideo(url)) return "iframe";
	if (isYoutubeLink(url)) return "iframe";
	if (canParseUrl(url)) return "embed";
	return "none";
}
function iframeType(url) {
	if (isVideo(url)) return "video";
	if (isYoutubeLink(url)) return "youtube";
	return "none";
}
async function hidePost(id, hide, jwt) {
	await client({ auth: jwt }).hidePost({
		hide,
		post_ids: [id]
	});
	return hide;
}
//#endregion
//#region src/lib/ui/generic/Avatar.svelte
function Avatar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { url, alt = "", title = "", circle = true, width, res, style = "", class: clazz = "", $$slots, $$events, ...rest } = $$props;
		let optimizedURLs = derived(() => [1.5, 3].map((n) => url && optimizeImageURL(url, (res || width) * n)));
		if (url && optimizedURLs()[0] != void 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attributes({
				...rest,
				loading: "lazy",
				srcset: `${stringify(optimizedURLs()[0])} 1x, ${stringify(optimizedURLs()[1])} 2x`,
				src: optimizedURLs()[0],
				alt: "",
				width,
				title,
				class: clsx([
					"aspect-square object-cover overflow-hidden shrink-0",
					circle === true ? "rounded-full" : circle === false ? "rounded-lg" : "",
					clazz
				]),
				style: `width: ${stringify(width)}px; height: ${stringify(width)}px; ${stringify(style)}`
			})} onload="this.__e=event" onerror="this.__e=event"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attr_style(`width: ${stringify(width)}px; height: ${stringify(width)}px;`)}${attr_class(clsx([
				"aspect-square object-cover overflow-hidden shrink-0",
				circle === true ? "rounded-full" : circle === false ? "rounded-lg" : "",
				clazz
			]))}>${html(createAvatar(initials, {
				seed: alt,
				backgroundType: ["gradientLinear"],
				fontWeight: 800,
				randomizeIds: true,
				chars: 1,
				scale: 125,
				textColor: ["fff", "000"],
				backgroundColor: [
					"7B68EE",
					"FF6347",
					"20B2AA",
					"DDA0DD",
					"F0E68C",
					"FF1493",
					"4682B4",
					"32CD32",
					"FFB6C1",
					"8B4513",
					"00CED1",
					"9370DB",
					"FFA500",
					"2E8B57",
					"DC143C",
					"BA55D3",
					"708090",
					"ADFF2F",
					"CD853F",
					"48D1CC"
				]
			}).toString())}</div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/ui/shared/util/RelativeDate.svelte
function formatRelativeDate$1(date, options, locale, relativeTo) {
	try {
		const diffInMillis = (relativeTo?.getTime() ?? Date.now()) - date.getTime();
		const thresholds = [
			{
				unit: "second",
				threshold: 1e3
			},
			{
				unit: "minute",
				threshold: 60 * 1e3
			},
			{
				unit: "hour",
				threshold: 3600 * 1e3
			},
			{
				unit: "day",
				threshold: 1440 * 60 * 1e3
			},
			{
				unit: "week",
				threshold: 10080 * 60 * 1e3
			},
			{
				unit: "month",
				threshold: 720 * 60 * 60 * 1e3
			},
			{
				unit: "year",
				threshold: 365 * 24 * 60 * 60 * 1e3
			}
		];
		for (let i = thresholds.length - 1; i >= 0; i--) if (diffInMillis >= thresholds[i].threshold) {
			const value = Math.round(diffInMillis / thresholds[i].threshold);
			let language = locale ?? "en";
			if (settings.absoluteDates) return new Intl.DateTimeFormat(language, {
				...options,
				timeStyle: "short",
				dateStyle: "short"
			}).format(date);
			else return new Intl.RelativeTimeFormat(language, options).format(-value, thresholds[i].unit);
		}
		return "Now";
	} catch {
		return "Invalid Date";
	}
}
function RelativeDate$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const toLocaleDateString = (date) => {
			try {
				return date.toLocaleString();
			} catch {
				return "Invalid Date";
			}
		};
		let { date, relativeTo = void 0, options = {
			numeric: "always",
			style: "narrow"
		}, style = "", class: clazz = "" } = $$props;
		let dateTime = derived(() => toLocaleDateString(date));
		$$renderer.push(`<time${attr("datetime", dateTime())}${attr("title", dateTime())}${attr_class(clsx(clazz))}${attr_style(style)}>${escape_html(formatRelativeDate$1(date, options, "en", relativeTo))}</time>`);
	});
}
//#endregion
//#region src/lib/feature/community/CommunityLink.svelte
function CommunityLink($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community, avatar = false, name = true, avatarSize = 24, showInstance = settings.showInstances.community, displayName = true, badges = { nsfw: false }, class: clazz = "", instanceClass = "", $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<a${attributes({
			...rest,
			class: clsx(["items-center inline-flex flex-row gap-2 hover:underline max-w-full min-w-0", clazz]),
			href: communityLink(community),
			"data-sveltekit-preload-data": "tap"
		}, "svelte-svi9gd")}>`);
		if (avatar && !badges.nsfw) {
			$$renderer.push("<!--[0-->");
			Avatar($$renderer, {
				url: community.icon,
				alt: community.name,
				width: avatarSize
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (name) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="flex gap-0 items-center max-w-full min-w-0 shrink"><span class="font-medium username-text svelte-svi9gd">${escape_html(displayName ? community.title : community.name)}</span> `);
			if (showInstance) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span${attr_class(`text-slate-500 dark:text-zinc-500 font-normal instance-text shrink ${stringify(instanceClass || "")}`, "svelte-svi9gd")}>@${escape_html(new URL(community.actor_id).hostname)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (badges) {
			$$renderer.push("<!--[0-->");
			if (badges.nsfw) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span title="NSFW">`);
				Icon($$renderer, {
					src: ExclamationTriangle,
					size: "14",
					micro: true,
					class: "text-red-600 dark:text-red-400"
				});
				$$renderer.push(`<!----></span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></a>`);
	});
}
//#endregion
//#region src/lib/ui/generic/Logo.svelte
function Logo($$renderer, $$props) {
	let { width = 48 } = $$props;
	$$renderer.push(`<svg${attr("width", width)}${attr("height", width)} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="inline hover:fill-slate-700 dark:hover:fill-zinc-300 transition-colors"><path id="hexagon" d="M45.5 10.8868C48.594 9.10042 52.406 9.10042 55.5 10.8868L82.3061 26.3632C85.4001 28.1496 87.3061 31.4508 87.3061 35.0235V65.9765C87.3061 69.5492 85.4001 72.8504 82.3061 74.6368L55.5 90.1132C52.406 91.8996 48.594 91.8996 45.5 90.1132L18.6939 74.6368C15.5999 72.8504 13.6939 69.5492 13.6939 65.9765V35.0235C13.6939 31.4508 15.5999 28.1496 18.6939 26.3632L45.5 10.8868Z"></path></svg>`);
}
//#endregion
//#region src/lib/feature/user/UserLink.svelte
function parseBadge() {
	try {
		if (public_env.PUBLIC_BADGES) return JSON.parse(public_env.PUBLIC_BADGES);
		else return {};
	} catch {
		return {};
	}
}
var badges = parseBadge();
var getEnvBadge = (actor_id) => {
	if (badges.photon && badges.photon?.includes?.(actor_id)) return {
		classes: "bg-linear-to-r bg-clip-text text-transparent from-pink-500 to-fuchsia-500 dark:from-pink-400 dark:to-purple-400",
		icon: "photon"
	};
	if (badges.translator && badges.translator?.includes?.(actor_id)) return {
		classes: "bg-linear-to-r bg-clip-text text-transparent from-sky-500 to-blue-700 dark:from-blue-300 dark:to-indigo-500",
		icon: Language,
		iconClass: "text-blue-500 dark:text-blue-400"
	};
	return false;
};
function UserLink($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, avatar = false, avatarSize = 24, badges = true, inComment = false, showInstance = settings.showInstances.user || settings.showInstances.comments && inComment, displayName = settings.displayNames, instanceClass = "", class: clazz = "", children, extraBadges } = $$props;
		let envBadge = derived(() => getEnvBadge(user.actor_id));
		$$renderer.push(`<a${attr_class(`items-center inline-flex flex-row gap-1 hover:underline max-w-full min-w-0 ${stringify(clazz)}`, "svelte-13oojt1")}${attr("href", `/u/${stringify(user.name)}@${stringify(new URL(user.actor_id).hostname)}`)} data-sveltekit-preload-data="tap">`);
		children?.($$renderer);
		$$renderer.push(`<!----> `);
		if (avatar) {
			$$renderer.push("<!--[0-->");
			Avatar($$renderer, {
				url: user.avatar,
				alt: user.name,
				width: avatarSize,
				class: "shrink-0"
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <span${attr_class("flex gap-0 items-center shrink max-w-full min-w-0", void 0, { "ml-0.5": avatar })}><span${attr_class(`username-text ${stringify(envBadge() && envBadge().classes)}`, "svelte-13oojt1", { "font-medium": showInstance })}>${escape_html(displayName ? user.display_name || user.name : user.name)}</span> `);
		if (showInstance) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span${attr_class(`text-slate-500 dark:text-zinc-500 font-normal instance-text shrink ${stringify(instanceClass ?? "")}`, "svelte-13oojt1")}>@${escape_html(new URL(user.actor_id).hostname)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></span> `);
		if (badges) {
			$$renderer.push("<!--[0-->");
			if (user.banned) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-red-500" title="Banned">`);
				Icon($$renderer, {
					src: NoSymbol,
					mini: true,
					size: "12"
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (user.bot_account) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-blue-500 font-bold" title="Bot">BOT</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (envBadge()) {
				$$renderer.push("<!--[0-->");
				if (envBadge().icon == "photon") {
					$$renderer.push("<!--[0-->");
					Logo($$renderer, { width: 16 });
				} else {
					$$renderer.push("<!--[-1-->");
					Icon($$renderer, {
						src: envBadge().icon,
						micro: true,
						size: "16",
						class: envBadge().iconClass ?? envBadge().classes
					});
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (user.flair) {
				$$renderer.push("<!--[0-->");
				Badge($$renderer, {
					color: "blue-subtle",
					class: "px-1.5! py-0.5! whitespace-nowrap",
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(user.flair)}`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (user.note) {
				$$renderer.push("<!--[0-->");
				Badge($$renderer, {
					color: "gray-subtle",
					class: "px-1.5! py-0.5! whitespace-nowrap",
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(user.note)}`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			extraBadges?.($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></a>`);
	});
}
//#endregion
//#region src/lib/app/error.ts
function errorMessage(error, instance) {
	try {
		if (typeof error == "string") try {
			error = JSON.parse(error);
		} catch {}
		if (error?.body?.message) {
			error = JSON.parse(error?.body?.message);
			if (typeof error?.message == "string") error = error.message;
		}
		if (error?.message) error = error?.message;
		if (error?.error && typeof error?.error === "string") error = error.error;
		if (!error) throw error;
		return error;
	} catch {
		return error;
	}
}
//#endregion
//#region src/lib/ui/util/FormattedNumber.svelte
function FormattedNumber($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { number, locale: localeToUse = "en", options = { notation: "compact" }, class: clazz = "" } = $$props;
		$$renderer.push(`<span${attr_class(clsx(clazz ?? ""))}>${escape_html(Intl.NumberFormat(localeToUse, options).format(number))}</span>`);
	});
}
//#endregion
//#region src/lib/feature/tags/TagVote.svelte
function TagVote($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { tagId, name, totalVotes = 0, voteScore = 0, userVote = 0 } = $$props;
		let pending = false;
		$$renderer.push(`<div class="flex items-center gap-1 tag-vote svelte-nbnqqi"><button${attr("disabled", pending, true)}${attr_class(clsx([
			"flex items-center gap-0.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded-l-full",
			"border border-slate-200 dark:border-zinc-700",
			userVote === 1 ? "bg-primary-500 text-white border-primary-500" : "btn-tertiary hover:bg-primary-100 dark:hover:bg-primary-900"
		]), "svelte-nbnqqi")}${attr("aria-pressed", userVote === 1)} aria-label="Upvote">`);
		Icon($$renderer, {
			src: ChevronUp,
			size: "14",
			micro: true
		});
		$$renderer.push(`<!----> <span class="text-xs font-medium tabular-nums"><!---->`);
		$$renderer.push(`<span style="grid-column: 1; grid-row: 1;">`);
		FormattedNumber($$renderer, { number: voteScore ?? 0 });
		$$renderer.push(`<!----></span>`);
		$$renderer.push(`<!----></span></button> <span class="text-xs text-slate-400 dark:text-zinc-500 px-1">`);
		FormattedNumber($$renderer, { number: totalVotes ?? 0 });
		$$renderer.push(`<!----></span> <button${attr("disabled", pending, true)}${attr_class(clsx([
			"flex items-center gap-0.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded-r-full",
			"border border-slate-200 dark:border-zinc-700",
			userVote === -1 ? "bg-red-500 text-white border-red-500" : "btn-tertiary hover:bg-red-100 dark:hover:bg-red-900"
		]), "svelte-nbnqqi")}${attr("aria-pressed", userVote === -1)} aria-label="Downvote">`);
		Icon($$renderer, {
			src: ChevronDown,
			size: "14",
			micro: true
		});
		$$renderer.push(`<!----></button></div>`);
		bind_props($$props, {
			totalVotes,
			voteScore,
			userVote
		});
	});
}
//#endregion
//#region src/lib/feature/post/PostMeta.svelte
var textToTag = /* @__PURE__ */ new Map([
	["OC", {
		content: "OC",
		color: "#03A8F240",
		type: "custom"
	}],
	["NSFL", {
		content: "NSFL",
		color: "#ff000040",
		type: "custom"
	}],
	["CW", {
		content: "CW",
		color: "#ff000040",
		type: "custom"
	}]
]);
var parseTags = (title) => {
	if (!title) return { tags: [] };
	let extracted = [];
	return {
		tags: extracted,
		title: title.toString().replace(/^(\[.[^\]]+\])|(\[.[^\]]+\])$/g, (match) => {
			match.split(",").map((part) => part.trim()).map((i) => i.replaceAll(/(\[|\])/g, "")).forEach((content) => {
				extracted.push(textToTag.get(content) ?? {
					content,
					type: "custom"
				});
			});
			return "";
		})
	};
};
function PostMeta($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community = void 0, showCommunity = true, subscribed = void 0, user, published, title, id, read = false, edited, view = "cozy", badges = {
			nsfw: false,
			saved: false,
			featured: false,
			deleted: false,
			removed: false,
			locked: false,
			moderator: false,
			admin: false
		}, tags = [], tagVotes = [], postUrl, style = "", titleClass = "", extraBadges } = $$props;
		const badgeToData = new SvelteMap([
			["nsfw", {
				icon: ExclamationTriangle,
				color: "red-subtle",
				label: "NSFW"
			}],
			["saved", {
				icon: Bookmark,
				color: "yellow-subtle",
				label: "Saved"
			}],
			["featured", {
				icon: Megaphone,
				color: "green-subtle",
				label: "Featured"
			}],
			["removed", {
				icon: Trash,
				color: "green-subtle",
				label: "Removed"
			}],
			["deleted", {
				icon: Trash,
				color: "red-subtle",
				label: "Deleted"
			}],
			["locked", {
				icon: LockClosed,
				color: "yellow-subtle",
				label: "Locked"
			}]
		]);
		$$renderer.push(`<header${attr_class(clsx([
			"grid w-full meta",
			community ? "grid-rows-2" : "grid-rows-1 minimal",
			"text-xs min-w-0 max-w-full text-slate-600 dark:text-zinc-400"
		]), "svelte-1rfhh88", { "compact": view == "compact" })}${attr_style(style)}>`);
		if (showCommunity && community) {
			$$renderer.push("<!--[0-->");
			{
				function target($$renderer, attachment) {
					$$renderer.push(`<button${attr_class(clsx(["row-span-2 shrink-0 mr-2 self-center group/btn", "bg-slate-200 dark:bg-zinc-800 rounded-lg cursor-pointer"]))}>`);
					if (community.nsfw && settings.nsfwBlur) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div${attr_style(`width: ${stringify(view == "compact" ? 24 : 32)}; height: ${stringify(view == "compact" ? 24 : 32)}`)} class="bg-red-400 rounded-xl"></div>`);
					} else {
						$$renderer.push("<!--[-1-->");
						Avatar($$renderer, {
							url: community?.icon,
							width: view == "compact" ? 24 : 32,
							alt: community?.name,
							circle: false,
							class: "group-hover/btn:scale-90 group-active/btn:scale-[.85] transition-transform"
						});
					}
					$$renderer.push(`<!--]--></button>`);
				}
				function popover($$renderer, open) {
					if (open && community && subscribed) {
						$$renderer.push("<!--[0-->");
						Material($$renderer, {
							color: "uniform",
							rounding: "2xl",
							elevation: "high",
							class: "max-w-2xl w-screen max-h-128 overflow-auto",
							"data-autoclose": "false",
							children: ($$renderer) => {
								await_block($$renderer, import("./CommunityHeader.js"), () => {}, ({ default: CommunityHeader }) => {
									if (CommunityHeader) {
										$$renderer.push("<!--[-->");
										CommunityHeader($$renderer, {
											community,
											subscribed
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
				Popover($$renderer, {
					target,
					popover,
					$$slots: {
						target: true,
						popover: true
					}
				});
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (showCommunity && community) {
			$$renderer.push("<!--[0-->");
			CommunityLink($$renderer, {
				community,
				style: "grid-area: community;",
				class: "shrink no-list-margin",
				badges: { nsfw: community.nsfw }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class(`flex flex-row gap-1.5 items-center no-list-margin ${view == "compact" && showCommunity ? "min-sm:mx-2" : ""}`)} style="grid-area: stats;">`);
		if (user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<address class="contents not-italic">`);
			if (view == "compact" && showCommunity) {
				$$renderer.push("<!--[0-->");
				Icon($$renderer, {
					src: PaperAirplane,
					size: "12",
					micro: true,
					class: "rotate-180 text-slate-400 dark:text-zinc-600 max-sm:hidden"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function extraBadges($$renderer) {
					if (badges.moderator) {
						$$renderer.push("<!--[0-->");
						Icon($$renderer, {
							src: ShieldCheck,
							size: "14",
							mini: true,
							class: "text-green-500"
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (badges.admin) {
						$$renderer.push("<!--[0-->");
						Icon($$renderer, {
							src: ShieldCheck,
							size: "14",
							mini: true,
							class: "text-red-500"
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				UserLink($$renderer, {
					avatarSize: 20,
					user,
					avatar: !showCommunity,
					class: "shrink",
					extraBadges,
					$$slots: { extraBadges: true }
				});
			}
			$$renderer.push(`<!----></address>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (published) {
			$$renderer.push("<!--[0-->");
			RelativeDate$1($$renderer, {
				date: published,
				class: "shrink-0"
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (edited) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("title", `Last edited ${formatRelativeDate$1(publishedToDate(edited), { style: "long" })}`)}>`);
			Icon($$renderer, {
				src: Pencil,
				micro: true,
				size: "14"
			});
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex flex-row min-sm:justify-end items-center self-center flex-wrap gap-2 *:shrink-0 badges min-sm:ml-2" style="grid-area: badges;">`);
		if (tags) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(tags);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let tag = each_array[$$index];
				const href = tag.type == "flair" ? null : `/search?community=${community?.id}&q=[${tag.content}]&type=Posts`;
				element($$renderer, href ? "a" : "div", () => {
					$$renderer.push(`${attr("href", href)} class="hover:brightness-110"${attr_style(`${tag.color ? `--tag-color: ${tag.color};` : ""} ${tag.textColor ? `--tag-text-color: ${tag.textColor}` : ""}`)}`);
				}, () => {
					{
						function icon($$renderer) {
							if (tag.icon) {
								$$renderer.push("<!--[0-->");
								Icon($$renderer, {
									src: tag.icon,
									micro: true,
									size: "14"
								});
							} else if (tag === void 0) {
								$$renderer.push("<!--[1-->");
								Icon($$renderer, {
									src: Tag,
									micro: true,
									size: "14"
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						Badge($$renderer, {
							class: tag.color ? "badge-tag-color" : "",
							icon,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(tag.content)}`);
							},
							$$slots: {
								icon: true,
								default: true
							}
						});
					}
				});
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (tagVotes.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(tagVotes);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let voteData = each_array_1[$$index_1];
				TagVote($$renderer, {
					tagId: voteData.tagId,
					name: voteData.name,
					totalVotes: voteData.totalVotes,
					voteScore: voteData.voteScore,
					userVote: voteData.userVote
				});
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_2 = ensure_array_like(Object.keys(badges).filter((i) => badges[i] == true).map((i) => badgeToData.get(i)).filter((i) => i != void 0));
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let badge = each_array_2[$$index_2];
			{
				function icon($$renderer) {
					Icon($$renderer, {
						src: badge.icon,
						micro: true,
						size: "14"
					});
				}
				Badge($$renderer, {
					label: badge.label,
					color: badge.color,
					allowIconOnly: true,
					icon,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(badge.label)}`);
					},
					$$slots: {
						icon: true,
						default: true
					}
				});
			}
		}
		$$renderer.push(`<!--]--> `);
		extraBadges?.($$renderer);
		$$renderer.push(`<!----></div></header> `);
		if (title && id) {
			$$renderer.push("<!--[0-->");
			const useAttachedUrl = settings.posts.titleOpensUrl && postUrl;
			$$renderer.push(`<h3${attr_class(clsx([
				"font-medium max-sm:mt-0! font-display",
				titleClass,
				settings.markReadPosts && read && "text-slate-600 dark:text-zinc-400",
				view == "compact" ? "text-base" : "text-lg"
			]), "svelte-1rfhh88")} style="grid-area: title;"><a${attr("href", useAttachedUrl ? postUrl : `/post/${encodeURIComponent(profile.current.instance)}/${id}`)}${attr("target", useAttachedUrl ? "_blank" : void 0)}${attr("rel", useAttachedUrl ? "noopener noreferrer" : void 0)} class="inline-block hover:underline hover:text-primary-900 dark:hover:text-primary-100 transition-colors">`);
			Markdown($$renderer, {
				inline: true,
				source: title,
				class: view != "compact" ? "" : "leading-[1.3]"
			});
			$$renderer.push(`<!----></a></h3>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div style="grid-area: title; margin: 0;"></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			community,
			subscribed
		});
	});
}
//#endregion
//#region src/lib/feature/post/Post.svelte
function Post($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function getTagRule(tags) {
			const tagContent = tags.map((t) => t.content.toLowerCase());
			let rule;
			if (settings.nsfwBlur && (post.post.nsfw || post.community.nsfw)) rule = "blur-sm";
			tagContent.forEach(() => {
				if (rule == "hide") return rule;
			});
			return rule;
		}
		let { post = void 0, actions = true, hideCommunity = false, view = settings.view, style = "", class: clazz = "", extraBadges, onhide } = $$props;
		let tags = derived(() => {
			const parsed = parseTags(post.post.name);
			return {
				title: parsed.title,
				tags: [...parsed.tags, ...post.flair_list?.map((i) => ({
					content: i.flair_title,
					color: i.background_color,
					icon: null,
					type: "flair",
					textColor: i.text_color
				})) ?? []]
			};
		});
		let type = derived(() => mediaType(post.post));
		let rule = derived(() => getTagRule(tags().tags));
		let hideTitle = derived(() => settings.posts.deduplicateEmbed && post.post.embed_title == post.post.name && view != "compact" && type() != "iframe");
		let badges = derived(() => ({
			deleted: post.post.deleted,
			removed: post.post.removed,
			locked: post.post.locked,
			featured: post.post.featured_local || post.post.featured_community,
			nsfw: post.post.nsfw || post.community.nsfw,
			saved: post.saved,
			admin: post.creator_is_admin,
			moderator: post.creator_is_moderator
		}));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<article${attr_class(clsx([
				"relative group/post",
				settings.leftAlign && "left-align",
				view == "compact" && "py-3 list-type compact",
				view == "cozy" && "py-5 flex flex-col gap-2",
				clazz
			]), "svelte-jjm1lj")}${attr("id", post.post.id.toString())}${attr_style(style)}>`);
			PostMeta($$renderer, {
				community: post.community,
				showCommunity: !hideCommunity,
				user: post.creator,
				published: publishedToDate(post.post.published),
				badges: badges(),
				subscribed: profile.current?.user?.follows.map((c) => c.community.id).includes(post.community.id) ? "Subscribed" : "NotSubscribed",
				id: post.post.id,
				title: hideTitle() ? void 0 : tags()?.title ? tags().title : post.post.name,
				read: post.read,
				style: "grid-area: meta;",
				edited: post.post.updated,
				tags: tags()?.tags,
				postUrl: post.post.url,
				view,
				extraBadges
			});
			$$renderer.push(`<!----> <!---->`);
			$$renderer.push(`<div style="grid-area:embed;"${attr_class(clsx({ contents: view == "cozy" }))}>`);
			if (rule() != "hide") {
				$$renderer.push("<!--[0-->");
				PostMedia($$renderer, {
					post: post.post,
					blur: rule() == "blur-sm" ? true : void 0,
					view,
					type: type()
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (view == "compact") {
				$$renderer.push("<!--[0-->");
				PostMediaCompact($$renderer, {
					post: post.post,
					type: type(),
					class: `${settings.leftAlign ? "mr-3" : "ml-3"} shrink no-list-margin`,
					style: "grid-area: media;",
					blur: rule() == "blur-sm" ? true : void 0,
					view
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			$$renderer.push(`<!----> `);
			if (post.post.body && !post.post.nsfw && view != "compact") {
				$$renderer.push("<!--[0-->");
				PostBody($$renderer, {
					element: "section",
					body: post.post.body,
					style: "grid-area: body",
					class: "relative"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (actions) {
				$$renderer.push("<!--[0-->");
				PostActions($$renderer, {
					onhide,
					style: "grid-area: actions;",
					view,
					get post() {
						return post;
					},
					set post($$value) {
						post = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></article>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { post });
	});
}
//#endregion
//#region src/lib/feature/post/PostBody.svelte
function PostBody($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { body, clickThrough = false, element: htmlElement = "div", style = "", class: clazz = "" } = $$props;
		let overflows = derived(() => false);
		let expanded = false;
		element($$renderer, htmlElement, () => {
			$$renderer.push(`${attr_style(style)}${attr_class(clsx([
				expanded ? "text-slate-600 dark:text-zinc-400 max-h-full" : ["overflow-hidden bg-linear-to-b text-transparent from-slate-600 via-slate-600", "dark:from-zinc-400 dark:via-zinc-400 bg-clip-text z-0 max-h-36"],
				clickThrough && "pointer-events-none",
				clazz
			]))}`);
		}, () => {
			Markdown($$renderer, { source: expanded ? body : body.slice(0, 1e3) });
			$$renderer.push(`<!----> `);
			if (overflows()) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					onclick: () => expanded = !expanded,
					size: "square-md",
					color: "ghost",
					class: [
						"text-black dark:text-white absolute z-10 isolate pointer-events-auto left-0 bottom-0 transition-colors",
						"left-1/2 -translate-x-1/2 mb-4 hover:backdrop-blur-lg bg-slate-100 dark:bg-zinc-900/70",
						expanded && "shadow-md rotate-180 sticky bottom-16"
					],
					title: "Expand",
					children: ($$renderer) => {
						Icon($$renderer, {
							src: ChevronDoubleDown,
							size: "20",
							mini: true
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
	});
}
//#endregion
//#region src/lib/feature/post/PostItem.svelte
function PostItem($$renderer, $$props) {
	let { post } = $$props;
	Post($$renderer, { post });
}
//#endregion
//#region src/lib/feature/legacy/item.ts
function getItemPublished(item) {
	if ("post_report" in item) return item.post_report.published;
	if ("comment_report" in item) return item.comment_report.published;
	if ("private_message_report" in item) return item.private_message_report.published;
	if ("private_message" in item) return item.private_message.published;
	if ("comment" in item) return item.comment.published;
	else if ("post" in item) return item.post.published;
	if ("person" in item) return item.person.published;
	if ("community" in item) return item.community.published;
	return "";
}
var isPostView = (item) => "post" in item && !("comment" in item);
var isCommentView = (item) => "comment" in item;
var isComment = (item) => "content" in item;
function resumableStore(limit = 10) {
	const { subscribe, set, update } = writable([]);
	return {
		subscribe,
		set,
		update,
		add: (item) => {
			update((resumables) => {
				if (resumables.find((i) => JSON.stringify(i) == JSON.stringify(item))) return resumables;
				resumables.unshift(item);
				if (resumables.length > limit) resumables.pop();
				return resumables;
			});
		}
	};
}
var resumables = resumableStore();
//#endregion
//#region src/lib/feature/legacy/contentview.ts
var isSubmissionView = (item) => !("type" in item);
var isSubmission = (item) => !("type" in item);
var contentView = (item) => {
	if (isCommentView(item)) return {
		type: "comment",
		body: item.comment.content,
		creator: item.creator,
		id: item.comment.id
	};
	else return {
		type: "post",
		body: item.post.body ?? item.post.name,
		title: item.post.name,
		creator: item.creator,
		id: item.post.id
	};
};
var contentItem = (item) => {
	if (isComment(item)) return {
		type: "comment",
		body: item.content,
		id: item.id
	};
	else return {
		type: "post",
		body: item.body ?? item.name,
		title: item.name,
		id: item.id
	};
};
async function save(item, save) {
	if (isSubmissionView(item)) item = contentView(item);
	if (item.type == "post") return (await getClient().savePost({
		post_id: item.id,
		save
	})).post_view.saved;
	else if (item.type == "comment") return (await getClient().saveComment({
		comment_id: item.id,
		save
	})).comment_view.saved;
	return save;
}
async function deleteItem(item, deleted) {
	if (isSubmissionView(item)) item = contentView(item);
	if (item.type == "post") return (await getClient().deletePost({
		post_id: item.id,
		deleted
	})).post_view.post.deleted;
	else if (item.type == "comment") return (await getClient().deleteComment({
		comment_id: item.id,
		deleted
	})).comment_view.comment.deleted;
	return deleted;
}
async function markAsRead(item, read) {
	if (isSubmission(item)) item = contentItem(item);
	if (item.type == "post") {
		getClient().markPostAsRead({
			post_ids: [item.id],
			read
		});
		return read;
	}
	return false;
}
//#endregion
//#region src/lib/feature/post/PostVote.svelte
var voteColor = (vote) => vote == 1 ? `btn-primary border-0! border border-transparent` : vote == -1 ? `bg-red-500 text-slate-50 dark:bg-red-400 dark:text-zinc-900` : "";
var shouldShowVoteColor = (vote, type) => vote == -1 && type == "downvotes" || vote == 1 && type == "upvotes" ? voteColor(vote) : "";
function PostVote($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { post = void 0, vote = void 0, score = void 0, upvotes = void 0, downvotes = void 0, showCounts = true, children } = $$props;
		function voteButton($$renderer, votes, target, vote) {
			const targetNum = target == "upvote" ? 1 : -1;
			$$renderer.push(`<button${attr_class(clsx([
				"flex items-center gap-0.5 transition-colors relative cursor-pointer h-full p-2 first:border-r-0! first:rounded-l-[inherit] last:rounded-r-[inherit]",
				"last:flex-row-reverse",
				vote == targetNum ? shouldShowVoteColor(vote, target == "upvote" ? "upvotes" : "downvotes") : "btn-secondary"
			]), "svelte-9vi3oj")}${attr("aria-pressed", vote == targetNum)}${attr("aria-label", target == "upvote" ? "Upvote" : "Downvote")}>`);
			Icon($$renderer, {
				src: target == "upvote" ? ChevronUp : ChevronDown,
				size: "20",
				micro: true
			});
			$$renderer.push(`<!----> `);
			if (showCounts) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="grid text-sm z-20"><!---->`);
				$$renderer.push(`<span style="grid-column: 1; grid-row: 1;"${attr("aria-label", target == "upvote" ? `${votes} upvotes` : `${votes} downvotes`)}>`);
				FormattedNumber($$renderer, { number: votes ?? 0 });
				$$renderer.push(`<!----></span>`);
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></button>`);
		}
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer, {
				vote,
				score
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			const voteRatio = Math.floor((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0)) * 100);
			$$renderer.push(`<div${attr_class(clsx(["rounded-xl h-full font-medium flex relative overflow-hidden", voteRatio < 85 && settings.voteRatioBar && "vote-ratio"]), "svelte-9vi3oj")} aria-label="Post voting controls"${attr_style(`--vote-ratio: ${stringify(voteRatio)}%;`)}>`);
			voteButton($$renderer, upvotes, "upvote", vote);
			$$renderer.push(`<!----> `);
			if (site.data?.site_view.local_site.enable_downvotes ?? true) {
				$$renderer.push("<!--[0-->");
				voteButton($$renderer, downvotes, "downvote", vote);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			post,
			vote,
			score,
			upvotes,
			downvotes
		});
	});
}
//#endregion
//#region src/lib/ui/generic/Blobs.svelte
function Blobs($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { seed } = $$props;
		function randomoklch(seed, count) {
			function hashString(str) {
				let hash = 0;
				for (let i = 0; i < str.length; i++) {
					const char = str.charCodeAt(i);
					hash = (hash << 5) - hash + char;
					hash = hash & hash;
				}
				return Math.abs(hash);
			}
			function seededRandom(seedStr, index) {
				const combined = hashString(seedStr + "|" + index.toString());
				let x = Math.sin(combined) * 1e4;
				return x - Math.floor(x);
			}
			const colors = [];
			const baseHue = hashString(seed) % 12 * 60;
			for (let i = 0; i < count; i++) {
				const r1 = seededRandom(seed, i * 5);
				const r2 = seededRandom(seed, i * 5 + 1);
				const r3 = seededRandom(seed, i * 5 + 2);
				const lightness = .45 + r1 * .4;
				const chroma = .08 + r2 * .12;
				const hue = (baseHue + (r3 - .5) * 80 + 360) % 360;
				const oklchColor = `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
				colors.push({
					str: oklchColor,
					pos: r1 * 1e3
				});
			}
			return colors;
		}
		let colors = derived(() => randomoklch(seed, 12));
		const uniqueId = derived(() => seed.replace(/[^a-zA-Z0-9]/g, "_"));
		$$renderer.push(`<svg width="120%" height="120%" viewBox="0 -100 1171 241" fill="none"><defs><filter${attr("id", `noiseFilter_${stringify(uniqueId())}`)} x="0%" y="0%" width="100%" height="100%"><feTurbulence baseFrequency="0.9" numOctaves="3" seed="5" stitchTiles="stitch"></feTurbulence></filter><filter${attr("id", `mainBlur_${stringify(uniqueId())}`)} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="45" result="blur"></feGaussianBlur><feBlend mode="normal" in="blur" in2="BackgroundImageFix"></feBlend></filter><radialGradient${attr("id", `grad1_${stringify(uniqueId())}`)} cx="50%" cy="30%" r="60%"><stop offset="0%"${attr("stop-color", colors()[0].str)}></stop><stop offset="40%"${attr("stop-color", colors()[1].str)}></stop><stop offset="100%"${attr("stop-color", colors()[2].str)}></stop></radialGradient><radialGradient${attr("id", `grad2_${stringify(uniqueId())}`)} cx="30%" cy="70%" r="70%"><stop offset="0%"${attr("stop-color", colors()[3].str)}></stop><stop offset="30%"${attr("stop-color", colors()[4].str)}></stop><stop offset="100%"${attr("stop-color", colors()[5].str)}></stop></radialGradient><linearGradient${attr("id", `grad3_${stringify(uniqueId())}`)} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%"${attr("stop-color", colors()[6].str)}></stop><stop offset="50%"${attr("stop-color", colors()[7].str)}></stop><stop offset="100%"${attr("stop-color", colors()[8].str)}></stop></linearGradient></defs><g${attr("filter", `url(#mainBlur_${stringify(uniqueId())})`)}><ellipse${attr("cx", colors()[5].pos)} cy="-30" rx="300" ry="120"${attr("fill", `url(#grad1_${stringify(uniqueId())})`)} opacity="0.8"></ellipse><circle${attr("cx", colors()[6].pos)} cy="-20" r="180"${attr("fill", `url(#grad2_${stringify(uniqueId())})`)} opacity="0.7"></circle><ellipse${attr("cx", colors()[7].pos)} cy="10" rx="250" ry="100"${attr("fill", `url(#grad3_${stringify(uniqueId())})`)} opacity="0.6"></ellipse><circle${attr("cx", colors()[8].pos)} cy="30" r="120"${attr("fill", colors()[9].str)} opacity="0.5"></circle><ellipse${attr("cx", colors()[9].pos)} cy="20" rx="150" ry="80"${attr("fill", colors()[10].str)} opacity="0.4"></ellipse></g><rect width="100%" height="100%" fill="white" opacity="0.03"${attr("filter", `url(#noiseFilter_${stringify(uniqueId())})`)}></rect></svg>`);
	});
}
//#endregion
//#region src/lib/ui/util/RelativeDate.svelte
function formatRelativeDate(date, options, locale, relativeTo, absolute) {
	try {
		const diffInMillis = (relativeTo?.getTime() ?? Date.now()) - date.getTime();
		const thresholds = [
			{
				unit: "second",
				threshold: 1e3
			},
			{
				unit: "minute",
				threshold: 60 * 1e3
			},
			{
				unit: "hour",
				threshold: 3600 * 1e3
			},
			{
				unit: "day",
				threshold: 1440 * 60 * 1e3
			},
			{
				unit: "week",
				threshold: 10080 * 60 * 1e3
			},
			{
				unit: "month",
				threshold: 720 * 60 * 60 * 1e3
			},
			{
				unit: "year",
				threshold: 365 * 24 * 60 * 60 * 1e3
			}
		];
		for (let i = thresholds.length - 1; i >= 0; i--) if (Math.abs(diffInMillis) >= thresholds[i].threshold) {
			const value = Math.round(diffInMillis / thresholds[i].threshold);
			let language = locale ?? "en";
			if (absolute) return new Intl.DateTimeFormat(language, {
				...options,
				timeStyle: "short",
				dateStyle: "short"
			}).format(date);
			else return new Intl.RelativeTimeFormat(language, options).format(-value, thresholds[i].unit);
		}
		return "Now";
	} catch {
		return "Invalid Date";
	}
}
function RelativeDate($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const toLocaleDateString = (date) => {
			try {
				return date.toLocaleString();
			} catch {
				return "Invalid Date";
			}
		};
		let { date, relativeTo = void 0, options = {
			numeric: "always",
			style: "narrow"
		}, absolute = settings.absoluteDates, style = "", class: clazz = "" } = $$props;
		let dateTime = derived(() => toLocaleDateString(date));
		$$renderer.push(`<time${attr("datetime", dateTime())}${attr("title", dateTime())}${attr_class(clsx(clazz))}${attr_style(style)}>${escape_html(formatRelativeDate(date, options, "en", relativeTo, absolute))}</time>`);
	});
}
//#endregion
//#region src/lib/feature/post/media/PostEvent.svelte
function PostEvent($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { post } = $$props;
		$$renderer.push(`<div class="grid grid-cols-2 gap-4">`);
		Material($$renderer, {
			rounding: "2xl",
			color: "info",
			class: "relative z-0 flex flex-col overflow-hidden col-span-2",
			children: ($$renderer) => {
				$$renderer.push(`<div class="-m-4 mask-b-from-0 scale-125 -z-10">`);
				Blobs($$renderer, { seed: post.name });
				$$renderer.push(`<!----></div> <h3 class="font-display text-3xl tracking-tight">${escape_html(post.name)}</h3>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (post.event.start) {
			$$renderer.push("<!--[0-->");
			const startDate = publishedToDate(post.event.start);
			Material($$renderer, {
				rounding: "2xl",
				color: "info",
				class: "space-y-1",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: Calendar,
						size: "20",
						mini: true
					});
					$$renderer.push(`<!----> <h4 class="capitalize text-xl font-display"><date>${escape_html(startDate.toLocaleDateString("en", { dateStyle: "long" }))}</date></h4> `);
					RelativeDate($$renderer, {
						options: { style: "long" },
						date: startDate
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Material($$renderer, {
				rounding: "2xl",
				color: "info",
				class: "space-y-1",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: Clock,
						size: "20",
						mini: true
					});
					$$renderer.push(`<!----> <h4 class="capitalize text-xl font-display"><time>${escape_html(startDate.toLocaleTimeString("en", { timeStyle: "long" }))}</time></h4> <time>${escape_html(startDate.toLocaleTimeString("en", {
						timeZone: "GMT",
						timeStyle: "long"
					}))}</time>`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (post.event.event_fee_amount) {
			$$renderer.push("<!--[0-->");
			Material($$renderer, {
				rounding: "2xl",
				color: "info",
				class: "space-y-1",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: CurrencyDollar,
						size: "20",
						mini: true
					});
					$$renderer.push(`<!----> <h5 class="capitalize text-lg font-display">${escape_html(post.event.event_fee_amount)}
        ${escape_html(post.event.event_fee_currency ?? "")}</h5>`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (post.event.location && Object.keys(post.event.location).length > 0) {
			$$renderer.push("<!--[0-->");
			Material($$renderer, {
				rounding: "2xl",
				color: "info",
				class: "space-y-1",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: MapPin,
						size: "20",
						mini: true
					});
					$$renderer.push(`<!----> <h4 class="capitalize text-xl font-display">Location</h4> <dl class="space-y-2"><!--[-->`);
					const each_array = ensure_array_like(Object.keys(post.event.location));
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let key = each_array[$$index];
						$$renderer.push(`<div class="flex flex-row justify-between flex-wrap"><dt class="capitalize font-medium">${escape_html(key)}</dt> <dd>${escape_html(post.event.location[key])}</dd></div>`);
					}
					$$renderer.push(`<!--]--></dl>`);
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/api/piefed/rewrite.ts
function toPersonView(personView) {
	return {
		counts: personView.counts,
		is_admin: personView.is_admin,
		person: toPerson(personView.person)
	};
}
function toPerson(person) {
	return {
		...person,
		id: person.id,
		name: person.user_name,
		bot_account: person.bot
	};
}
function toLocalSite(site) {
	if (site) return {};
	return {};
}
function toCommunityView(communityView) {
	return {
		...communityView,
		community: toCommunity(communityView.community),
		banned_from_community: false,
		counts: {
			comments: communityView.counts.post_reply_count,
			posts: communityView.counts.post_count,
			subscribers: communityView.counts.total_subscriptions_count,
			published: communityView.community.published,
			community_id: communityView.community.id,
			subscribers_local: communityView.counts.subscriptions_count,
			users_active_day: communityView.counts.active_daily ?? -1,
			users_active_half_year: communityView.counts.active_6monthly ?? -1,
			users_active_month: communityView.counts.active_monthly ?? -1,
			users_active_week: communityView.counts.active_weekly ?? -1
		}
	};
}
function toCommunity(community) {
	return {
		...community,
		posting_restricted_to_mods: false,
		visibility: "Public"
	};
}
function toMyUser(myUser) {
	return {
		...myUser,
		community_blocks: myUser.community_blocks.map((i) => ({
			community: toCommunity(i.community),
			person: toPerson(i.person)
		})),
		local_user_view: {
			...myUser.local_user_view,
			local_user: {
				...myUser.local_user_view.local_user,
				id: myUser.local_user_view.person.id,
				person_id: myUser.local_user_view.person.id,
				totp_2fa_enabled: false,
				default_listing_type: "All"
			},
			person: toPerson(myUser.local_user_view.person)
		},
		follows: myUser.follows.map((i) => ({
			follower: toPerson(i.follower),
			community: toCommunity(i.community)
		})),
		moderates: myUser.moderates.map((i) => ({
			community: toCommunity(i.community),
			moderator: toPerson(i.moderator)
		})),
		instance_blocks: myUser.instance_blocks.map((i) => ({
			instance: i.instance,
			person: toPerson(i.person)
		})),
		person_blocks: myUser.person_blocks.map((i) => ({
			person: toPerson(i.person),
			target: toPerson(i.target)
		})),
		discussion_languages: myUser.discussion_languages.map((i) => i.id)
	};
}
function toPostView(postView) {
	return {
		...postView,
		creator: toPerson(postView.creator),
		creator_blocked: false,
		post: toPost(postView.post),
		community: toCommunity(postView.community)
	};
}
function toPost(post) {
	return {
		...post,
		creator_id: -1,
		name: post.title,
		featured_community: post.sticky,
		featured_local: false
	};
}
function toCommentView(commentView) {
	return {
		...commentView,
		comment: toComment(commentView.comment),
		creator: toPerson(commentView.creator),
		post: toPost(commentView.post),
		community: toCommunity(commentView.community),
		subscribed: commentView.subscribed
	};
}
function toComment(comment) {
	return {
		...comment,
		content: comment.body,
		creator_id: -1,
		distinguished: comment.distinguished ?? false
	};
}
function toCommentReplyView(commentReplyView) {
	return {
		...commentReplyView,
		banned_from_community: false,
		creator_banned_from_community: false,
		comment: toComment(commentReplyView.comment),
		creator: toPerson(commentReplyView.creator),
		post: toPost(commentReplyView.post),
		community: toCommunity(commentReplyView.community),
		recipient: toPerson(commentReplyView.recipient)
	};
}
function toPrivateMessageView(privateMessageView) {
	return {
		...privateMessageView,
		creator: toPerson(privateMessageView.creator),
		recipient: toPerson(privateMessageView.recipient)
	};
}
function toPersonMentionView(personMentionView) {
	return {
		...personMentionView,
		person_mention: personMentionView.comment_reply,
		creator_banned_from_community: false,
		banned_from_community: false,
		comment: toComment(personMentionView.comment),
		community: toCommunity(personMentionView.community),
		post: toPost(personMentionView.post),
		creator: toPerson(personMentionView.creator),
		recipient: toPerson(personMentionView.recipient)
	};
}
function toTopicView(topicView) {
	return {
		...topicView,
		communities: topicView.communities?.map(toCommunity),
		children: topicView.children.map(toTopicView)
	};
}
function toFeedView(feedView) {
	return {
		...feedView,
		communities: feedView.communities?.map(toCommunity),
		children: feedView.children.map(toFeedView)
	};
}
function fromGetPosts$1(getPosts) {
	return {
		...getPosts,
		sort: toSortType(getPosts.sort),
		page: Number(getPosts.page_cursor || 1)
	};
}
function fromGetComments(getComments) {
	return {
		...getComments,
		sort: toCommentSortType(getComments.sort)
	};
}
function fromGetPost(getPost) {
	return getPost;
}
function fromGetReplies(getReplies) {
	return {
		...getReplies,
		sort: toCommentSortType(getReplies.sort)
	};
}
function fromSearch(search) {
	return {
		...search,
		sort: toSortType(search.sort)
	};
}
function fromCreatePost(createPost) {
	return {
		...createPost,
		title: createPost.name
	};
}
function fromListCommunities(listCommunities) {
	return {
		...listCommunities,
		type_: listCommunities.type_,
		sort: toCommunitiesSortType(listCommunities.sort)
	};
}
function fromCreateComment(createComment) {
	return {
		...createComment,
		body: createComment.content
	};
}
function toSortType(sortType) {
	if (!sortType) return;
	if (sortType == "Old" || sortType == "MostComments" || sortType == "Controversial" || sortType == "NewComments") sortType = "New";
	if (sortType?.startsWith("Top")) sortType = "TopAll";
	return sortType;
}
function toCommentSortType(commentSortType) {
	if (commentSortType == "Controversial") commentSortType = void 0;
	return commentSortType;
}
function toCommunitiesSortType(sortType) {
	if (sortType == "Hot" || sortType == "New" || sortType == void 0) return sortType;
	else return "Top";
}
//#endregion
//#region src/lib/api/piefed/adapter.ts
function assertData(response) {
	if (response.error || !response.data) throw new Error(`API error: ${JSON.stringify(response.error ?? "No data returned")}`);
	return response.data;
}
var methods = {
	getSite: {
		method: "GET",
		path: "/api/alpha/site",
		transform: (r) => ({
			admins: r.admins.map(toPersonView),
			site_view: {
				counts: {
					comments: -1,
					communities: -1,
					posts: -1,
					site_id: -1,
					users: r.site.user_count ?? -1,
					users_active_day: -1,
					users_active_half_year: -1,
					users_active_month: -1,
					users_active_week: -1
				},
				local_site: toLocalSite(r.site),
				site: r.site
			},
			all_languages: r.site.all_languages ?? [],
			blocked_urls: [],
			custom_emojis: [],
			discussion_languages: [],
			taglines: [],
			version: r.version,
			my_user: r.my_user ? toMyUser(r.my_user) : void 0
		})
	},
	getSiteMetadata: {
		method: "GET",
		path: "/api/alpha/post/site_metadata",
		query: (p) => p,
		transform: (r) => r
	},
	getFederatedInstances: {
		method: "GET",
		path: "/api/alpha/federated_instances",
		transform: (r) => r
	},
	blockInstance: {
		method: "POST",
		path: "/api/alpha/site/block",
		transform: (r) => r
	},
	createPost: {
		method: "POST",
		path: "/api/alpha/post",
		body: fromCreatePost,
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	getPost: {
		method: "GET",
		path: "/api/alpha/post",
		query: fromGetPost,
		transform: (r) => ({
			community_view: toCommunityView(r.community_view),
			cross_posts: r.cross_posts.map(toPostView),
			moderators: r.moderators.map((i) => ({
				community: toCommunity(i.community),
				moderator: toPerson(i.moderator)
			})),
			post_view: toPostView(r.post_view)
		})
	},
	editPost: {
		method: "PUT",
		path: "/api/alpha/post",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	deletePost: {
		method: "POST",
		path: "/api/alpha/post/delete",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	removePost: {
		method: "POST",
		path: "/api/alpha/post/remove",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	getPosts: {
		method: "GET",
		path: "/api/alpha/post/list",
		query: fromGetPosts$1,
		transform: (r, p) => ({
			...r,
			posts: r.posts.map(toPostView),
			next_page: (Number(p.page_cursor || 1) + 1).toString()
		})
	},
	likePost: {
		method: "POST",
		path: "/api/alpha/post/like",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	markPostAsRead: {
		method: "POST",
		path: "/api/alpha/post/mark_as_read",
		transform: () => ({ success: true })
	},
	lockPost: {
		method: "POST",
		path: "/api/alpha/post/lock",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	featurePost: {
		method: "POST",
		path: "/api/alpha/post/feature",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	savePost: {
		method: "PUT",
		path: "/api/alpha/post/save",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	listPostLikes: {
		method: "GET",
		path: "/api/alpha/post/like/list",
		query: (p) => p,
		transform: (r) => ({ post_likes: r.post_likes.map((i) => ({
			...i,
			creator_banned_from_community: false,
			creator: toPerson(i.creator)
		})) })
	},
	createPostReport: {
		method: "POST",
		path: "/api/alpha/post/report",
		body: (p) => ({
			...p,
			report_remote: false
		}),
		transform: (r) => ({ post_report_view: {
			...r.post_report_view,
			community: toCommunity(r.post_report_view.community),
			post: toPost(r.post_report_view.post),
			creator: toPerson(r.post_report_view.creator),
			resolver: r.post_report_view.resolver ? toPerson(r.post_report_view.resolver) : void 0,
			post_creator: toPerson(r.post_report_view.post_creator),
			read: false,
			hidden: false,
			creator_banned_from_community: false,
			unread_comments: -1
		} })
	},
	voteOnPoll: {
		method: "POST",
		path: "/api/alpha/post/poll_vote",
		transform: (r) => ({ post_view: toPostView(r.post_view) })
	},
	createComment: {
		method: "POST",
		path: "/api/alpha/comment",
		body: fromCreateComment,
		transform: (r) => ({
			...r,
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	editComment: {
		method: "PUT",
		path: "/api/alpha/comment",
		body: (p) => ({
			...p,
			body: p.content,
			distinguished: false
		}),
		transform: (r) => ({
			...r,
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	deleteComment: {
		method: "POST",
		path: "/api/alpha/comment/delete",
		transform: (r) => ({
			...r,
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	removeComment: {
		method: "POST",
		path: "/api/alpha/comment/remove",
		transform: (r) => ({
			...r,
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	markCommentReplyAsRead: {
		method: "POST",
		path: "/api/alpha/comment/mark_as_read",
		transform: () => void 0
	},
	likeComment: {
		method: "POST",
		path: "/api/alpha/comment/like",
		body: (p) => ({
			...p,
			private: false
		}),
		transform: (r) => ({
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	listCommentLikes: {
		method: "GET",
		path: "/api/alpha/comment/like/list",
		query: (p) => p,
		transform: (r) => ({ comment_likes: r.comment_likes.map((i) => ({
			...i,
			creator: toPerson(i.creator)
		})) })
	},
	saveComment: {
		method: "PUT",
		path: "/api/alpha/comment/save",
		transform: (r) => ({
			...r,
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	getComments: {
		method: "GET",
		path: "/api/alpha/comment/list",
		query: fromGetComments,
		transform: (r) => ({ comments: r.comments.map(toCommentView) })
	},
	getComment: {
		method: "GET",
		path: "/api/alpha/comment",
		query: (p) => p,
		transform: (r) => ({
			...r,
			comment_view: toCommentView(r.comment_view),
			recipient_ids: []
		})
	},
	createCommentReport: {
		method: "POST",
		path: "/api/alpha/comment/report",
		body: (p) => ({
			...p,
			report_report: false,
			reason: p.reason ?? ""
		}),
		transform: (r) => ({
			...r,
			comment_report_view: {
				...r.comment_report_view,
				comment: toComment(r.comment_report_view.comment),
				community: toCommunity(r.comment_report_view.community),
				comment_creator: toPerson(r.comment_report_view.comment_creator),
				creator: toPerson(r.comment_report_view.creator),
				post: toPost(r.comment_report_view.post),
				resolver: r.comment_report_view.resolver ? toPerson(r.comment_report_view.resolver) : void 0,
				subscribed: r.comment_report_view.subscribed
			}
		})
	},
	createCommunity: {
		method: "POST",
		path: "/api/alpha/community",
		transform: (r) => ({
			...r,
			community_view: toCommunityView(r.community_view)
		})
	},
	getCommunity: {
		method: "GET",
		path: "/api/alpha/community",
		query: (p) => p,
		transform: (r) => ({
			...r,
			community_view: toCommunityView(r.community_view),
			moderators: r.moderators.map((i) => ({
				community: toCommunity(i.community),
				moderator: toPerson(i.moderator)
			}))
		})
	},
	editCommunity: {
		method: "PUT",
		path: "/api/alpha/community",
		transform: (r) => ({
			...r,
			community_view: toCommunityView(r.community_view)
		})
	},
	listCommunities: {
		method: "GET",
		path: "/api/alpha/community/list",
		query: fromListCommunities,
		transform: (r) => ({ communities: r.communities.map(toCommunityView) })
	},
	followCommunity: {
		method: "POST",
		path: "/api/alpha/community/follow",
		transform: (r) => ({
			...r,
			community_view: toCommunityView(r.community_view)
		})
	},
	blockCommunity: {
		method: "POST",
		path: "/api/alpha/community/block",
		transform: (r, p) => ({
			...r,
			community_view: toCommunityView(r.community_view),
			blocked: p.block
		})
	},
	deleteCommunity: {
		method: "POST",
		path: "/api/alpha/community/delete",
		transform: (r) => ({
			...r,
			community_view: toCommunityView(r.community_view)
		})
	},
	banFromCommunity: async (client, params) => {
		const response = params.ban ? await client.POST("/api/alpha/community/moderate/ban", { body: {
			community_id: params.community_id,
			user_id: params.person_id,
			reason: params.reason ?? "No reason provided.",
			expiredAt: new Date(params.expires ?? "6767-06-07T06:07:06Z").toISOString()
		} }) : await client.PUT("/api/alpha/community/moderate/unban", { body: {
			community_id: params.community_id,
			user_id: params.person_id
		} });
		return {
			banned: params.ban,
			person_view: {
				person: toPerson(assertData(response).banned_user),
				counts: {
					comment_count: -1,
					person_id: -1,
					post_count: -1
				},
				is_admin: false
			}
		};
	},
	addModToCommunity: {
		method: "POST",
		path: "/api/alpha/community/mod",
		transform: (r) => ({ moderators: r.moderators.map((i) => ({
			community: toCommunity(i.community),
			moderator: toPerson(i.moderator)
		})) })
	},
	search: {
		method: "GET",
		path: "/api/alpha/search",
		query: fromSearch,
		transform: (r) => ({
			comments: [],
			communities: r.communities.map(toCommunityView),
			posts: r.posts.map(toPostView),
			users: r.users.map(toPersonView),
			type_: r.type_
		})
	},
	resolveObject: {
		method: "GET",
		path: "/api/alpha/resolve_object",
		query: (p) => p,
		transform: (r) => ({
			comment: r.comment ? toCommentView(r.comment) : void 0,
			community: r.community ? toCommunityView(r.community) : void 0,
			post: r.post ? toPostView(r.post) : void 0,
			person: r.person ? toPersonView(r.person) : void 0
		})
	},
	getPrivateMessages: {
		method: "GET",
		path: "/api/alpha/private_message/list",
		query: (p) => p,
		transform: (r) => ({ private_messages: r.private_messages.map(toPrivateMessageView) })
	},
	createPrivateMessage: {
		method: "POST",
		path: "/api/alpha/private_message",
		transform: (p) => ({
			...p,
			private_message_view: toPrivateMessageView(p.private_message_view)
		})
	},
	editPrivateMessage: {
		method: "PUT",
		path: "/api/alpha/private_message",
		transform: (p) => ({
			...p,
			private_message_view: toPrivateMessageView(p.private_message_view)
		})
	},
	deletePrivateMessage: {
		method: "POST",
		path: "/api/alpha/private_message/delete",
		transform: (p) => ({
			...p,
			private_message_view: toPrivateMessageView(p.private_message_view)
		})
	},
	markPrivateMessageAsRead: {
		method: "POST",
		path: "/api/alpha/private_message/mark_as_read",
		transform: (p) => ({
			...p,
			private_message_view: toPrivateMessageView(p.private_message_view)
		})
	},
	login: async (client, params) => {
		return {
			verify_email_sent: false,
			registration_created: false,
			jwt: (await client.POST("/api/alpha/user/login", { body: {
				username: params.username_or_email,
				password: params.password
			} })).data?.jwt
		};
	},
	getPersonDetails: {
		method: "GET",
		path: "/api/alpha/user",
		query: (p) => ({
			...p,
			include_content: true,
			sort: toSortType(p.sort)
		}),
		transform: (r) => ({
			comments: r.comments.map(toCommentView),
			moderates: r.moderates.map((i) => ({
				community: toCommunity(i.community),
				moderator: toPerson(i.moderator)
			})),
			person_view: toPersonView(r.person_view),
			posts: r.posts.map(toPostView)
		})
	},
	getPersonMentions: {
		method: "GET",
		path: "/api/alpha/user/mentions",
		query: (p) => ({
			...p,
			sort: toCommentSortType(p.sort)
		}),
		transform: (r) => ({ mentions: r.replies.map(toPersonMentionView) })
	},
	markPersonMentionAsRead: async (client, params) => {
		await client.POST("/api/alpha/mention/mark_as_read", { body: params });
	},
	getReplies: {
		method: "GET",
		path: "/api/alpha/user/replies",
		query: fromGetReplies,
		transform: (r) => ({ replies: r.replies.map(toCommentReplyView) })
	},
	blockPerson: {
		method: "POST",
		path: "/api/alpha/user/block",
		transform: (r) => ({
			...r,
			person_view: toPersonView(r.person_view)
		})
	},
	markAllAsRead: {
		method: "POST",
		path: "/api/alpha/user/mark_all_as_read",
		transform: (r) => ({ replies: r.replies.map(toCommentReplyView) })
	},
	saveUserSettings: {
		method: "PUT",
		path: "/api/alpha/user/save_user_settings",
		body: (p) => p,
		transform: () => ({ success: true })
	},
	getUnreadCount: {
		method: "GET",
		path: "/api/alpha/user/unread_count",
		transform: (r) => r
	},
	setFlair: {
		method: "POST",
		path: "/api/alpha/user/set_flair",
		transform: (r) => ({
			...r,
			person_view: toPersonView(r.person_view)
		})
	},
	setNote: {
		method: "POST",
		path: "/api/alpha/user/note",
		body: (p) => ({
			...p,
			note: p.note ?? ""
		}),
		transform: (r) => ({
			...r,
			person_view: toPersonView(r.person_view)
		})
	},
	getFeeds: {
		method: "GET",
		path: "/api/alpha/feed/list",
		query: (p) => p,
		transform: (r) => ({
			...r,
			feeds: r.feeds.map(toFeedView)
		})
	},
	getTopics: {
		method: "GET",
		path: "/api/alpha/topic/list",
		query: (p) => p,
		transform: (r) => ({
			...r,
			topics: r.topics.map(toTopicView)
		})
	},
	uploadImage: async (client, params) => {
		const formData = new FormData();
		formData.append("file", params.image);
		return {
			...assertData(await client.POST("/api/alpha/upload/image", { body: formData })),
			msg: "Image uploaded successfully"
		};
	},
	generateTotpSecret: "unsupported",
	listLogins: "unsupported",
	listAllMedia: "unsupported",
	updateTotp: "unsupported",
	getModlog: "unsupported",
	hidePost: "unsupported",
	hideCommunity: "unsupported",
	removeCommunity: "unsupported",
	resolvePostReport: "unsupported",
	listPostReports: "unsupported",
	distinguishComment: "unsupported",
	resolveCommentReport: "unsupported",
	listCommentReports: "unsupported",
	createPrivateMessageReport: "unsupported",
	resolvePrivateMessageReport: "unsupported",
	listPrivateMessageReports: "unsupported",
	register: "unsupported",
	logout: "unsupported",
	banPerson: "unsupported",
	getBannedPersons: "unsupported",
	getCaptcha: "unsupported",
	deleteAccount: "unsupported",
	passwordReset: "unsupported",
	passwordChangeAfterReset: "unsupported",
	changePassword: "unsupported",
	getReportCount: "unsupported",
	verifyEmail: "unsupported",
	addAdmin: "unsupported",
	getUnreadRegistrationApplicationCount: "unsupported",
	listRegistrationApplications: "unsupported",
	approveRegistrationApplication: "unsupported",
	getRegistrationApplication: "unsupported",
	purgePerson: "unsupported",
	purgeCommunity: "unsupported",
	purgePost: "unsupported",
	purgeComment: "unsupported",
	editSite: "unsupported",
	deleteImage: "unsupported",
	listMedia: "unsupported"
};
var PiefedClientConstants = { password: {
	minLength: 6,
	maxLength: 128
} };
async function executeMethod(client, config, params) {
	const execute = async () => {
		if (config.method === "GET") return await client.GET(config.path, { params: { query: config.query?.(params) ?? params } });
		else return await client[config.method](config.path, { body: config.body?.(params) ?? params });
	};
	return execute().then((response) => config.transform(assertData(response), params));
}
function createPiefedClient(baseUrl, args) {
	const client = createClient({
		baseUrl,
		fetch: args.fetchFunction,
		headers: args.headers
	});
	return new Proxy({ type: {
		name: "piefed",
		baseUrl: "/api/alpha"
	} }, { get(target, prop, receiver) {
		if (prop in target) return Reflect.get(target, prop, receiver);
		const def = methods[prop];
		if (!def) return void 0;
		if (def === "unsupported") return () => {
			throw new Error(`${prop} is not supported on PieFed`);
		};
		if (typeof def === "function") return (params) => def(client, params);
		return (params) => executeMethod(client, def, params);
	} });
}
var PiefedClient = class PiefedClient {
	static constants = PiefedClientConstants;
	#proxy;
	constructor(baseUrl, args) {
		this.#proxy = createPiefedClient(baseUrl, args);
		return new Proxy(this, { get: (target, prop) => {
			if (prop === "constructor") return PiefedClient;
			return target.#proxy[prop];
		} });
	}
};
//#endregion
//#region src/lib/ui/layout/pages/Header.svelte
function Header($$renderer, $$props) {
	const sizes = {
		sm: "text-2xl",
		md: "text-3xl",
		lg: "text-4xl",
		xl: "text-6xl"
	};
	let { pageHeader = false, style = "", class: clazz = "", size = "lg", children, extended } = $$props;
	$$renderer.push(`<header${attr_class(clsx([pageHeader && `w-[calc(100%+1.5rem)] sm:w-[calc(100%+3rem)]
  bg-slate-50 dark:bg-zinc-950 -mx-3 sm:-mx-6 sm:px-6 sm:pb-6 px-4 pb-4 -mt-64 pt-64
   border-b border-slate-100 dark:border-zinc-900 font-display margin z-0 mb-3 sm:mb-6`]))}${attr_style(style)} aria-label="Page header">`);
	if (children) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<h1${attr_class(clsx([
			sizes[size],
			"flex gap-2 w-full tracking-tight font-medium",
			clazz
		]))}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></h1>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (extended) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex flex-col gap-3 mt-3">`);
		extended?.($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></header>`);
}
//#endregion
//#region src/lib/ui/form/TabButton.svelte
function TabButton($$renderer, $$props) {
	const sizes = {
		sm: "px-2.5 py-1",
		md: "py-1.5 px-3.5"
	};
	let { selected = false, onselect, disabled, children, href, size = "sm", element: element$2 = href ? "a" : "button", $$slots, $$events, ...rest } = $$props;
	element($$renderer, element$2, () => {
		$$renderer.push(`${attributes({
			class: clsx([
				sizes[size],
				"tab-button",
				selected && "material-distinct"
			]),
			disabled,
			href,
			...rest
		}, "svelte-yp9nw4")}`);
	}, () => {
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/lib/ui/layout/pages/Tabs.svelte
function Tabs($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { routes, currentRoute = void 0, buildUrl = (_, href) => href, children, style = "header", margin = true, class: clazz = "" } = $$props;
		let matchType = derived(() => routes.map((i) => new URL(`https://example.com${i.href}`)?.search != "" ? "search" : "pathname"));
		function isSelected(url, href, type) {
			const currentSearch = new Set(url.searchParams.values());
			const hrefSearch = new Set(href.searchParams.values());
			const usePathname = !routes.some((i) => new Set(new URL(`https://example.com${i.href}`).searchParams.values()).intersection(currentSearch).size > 0);
			const hasSearchParam = hrefSearch.intersection(currentSearch).size > 0;
			if (hasSearchParam && !usePathname) return hasSearchParam;
			else if ((url.search == "" || usePathname) && type == "pathname") return href.pathname == url.pathname;
		}
		$$renderer.push(`<nav${attr_class(clsx([
			"tab-bar rounded-full",
			style == "header" ? "bar-header material-uniform" : "gap-2",
			margin && "my-2",
			margin && style == "subpage" && "mb-3",
			clazz
		]), "svelte-iv6r04")}><!--[-->`);
		const each_array = ensure_array_like(routes);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let route = each_array[index];
			const selected = isSelected(page.url, new SvelteURL(`${page.url.origin}${route.href}`), matchType()[index]);
			if (style == "header") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a${attr("href", buildUrl(currentRoute, route.href))}${attr_class(clsx(["tab-item ", selected && "material-distinct tab-selected"]), "svelte-iv6r04")}>${escape_html(route.name)}</a>`);
			} else {
				$$renderer.push("<!--[-1-->");
				TabButton($$renderer, {
					href: buildUrl(currentRoute, route.href),
					selected,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(route.name)}`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!----></nav>`);
	});
}
//#endregion
//#region src/lib/ui/layout/CommonList.svelte
function CommonList($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const sizeDelay = {
			lg: 120,
			md: 80,
			sm: 40,
			xs: 0
		};
		let { items, item: itemSnippet, children, animate = true, size = "sm", class: clazz, selected } = $$props;
		$$renderer.push(`<ul class="svelte-1frsf38">`);
		if (items) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(items);
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let item = each_array[index];
				$$renderer.push(`<li${attr_class(clsx([
					"group/li",
					animate && "animate",
					size == "xs" && "xs",
					selected?.(item) && "selected",
					clazz
				]), "svelte-1frsf38")}${attr_style(`--i: ${stringify(index < 10 ? index * sizeDelay[size] : 0)}ms;`)}>`);
				itemSnippet?.($$renderer, item, index);
				$$renderer.push(`<!----></li>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!----></ul>`);
	});
}
//#endregion
//#region src/lib/ui/layout/SearchBar.svelte
function SearchBar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { query = void 0 } = $$props;
		let searchElement = void 0;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex gap-2 flex-row items-center w-full text-base h-10">`);
			TextInput($$renderer, {
				name: "q",
				placeholder: "Query",
				size: "lg",
				class: "flex-1 rounded-full! h-full text-base!",
				get value() {
					return query;
				},
				set value($$value) {
					query = $$value;
					$$settled = false;
				},
				get element() {
					return searchElement;
				},
				set element($$value) {
					searchElement = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				submit: true,
				color: "primary",
				size: "custom",
				class: "shrink-0 h-full aspect-square shadow-md",
				title: "Search",
				rounding: "pill",
				loading: navigating.to?.route.id == page.url.pathname,
				icon: MagnifyingGlass
			});
			$$renderer.push(`<!----></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { query });
	});
}
//#endregion
//#region src/lib/ui/layout/InvertedCorner.svelte
function InvertedCorner($$renderer, $$props) {
	let { class: clazz } = $$props;
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" aria-hidden="true"${attr_class(clsx(clazz))}><path d="M0 0h64v64H0V0z M0 24a24 24 0 0 1 24-24v24H0z" fill="currentColor" fill-rule="evenodd"></path></svg>`);
}
//#endregion
//#region src/lib/ui/layout/Shell.svelte
function Shell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, navbar, sidebar, main, suffix } = $$props;
		children?.($$renderer);
		$$renderer.push(`<!----> <div class="min-h-screen flex flex-col"><div${attr_class(clsx(["shell-navbar-holder", false]), "svelte-1boiwdb")} aria-hidden="true"><div class="md:hidden flex justify-between" dir="ltr">`);
		InvertedCorner($$renderer, { class: "w-8 h-8 text-slate-50 dark:text-zinc-950 rotate-270" });
		$$renderer.push(`<!----> `);
		InvertedCorner($$renderer, { class: "w-8 h-8 text-slate-50 dark:text-zinc-950 rotate-180" });
		$$renderer.push(`<!----></div> `);
		navbar?.($$renderer, { class: ["shell-navbar"] });
		$$renderer.push(`<!----></div> <div${attr_class(clsx(["shell-content flex-1", settings.newWidth && "limit-width"]), "svelte-1boiwdb")}>`);
		sidebar?.($$renderer, { class: `shell-aside shell-sidebar` });
		$$renderer.push(`<!----> `);
		main?.($$renderer, { class: `shell-main` });
		$$renderer.push(`<!----> `);
		suffix?.($$renderer, { class: `shell-aside shell-suffix` });
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
//#region src/lib/ui/layout/Pageination.svelte
function Pageination($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { page: page$4 = 0, cursor = void 0, hasMore = true, children, href, back = true } = $$props;
		let customHref = (href) => {
			if (href?.startsWith("?")) {
				const current = new SvelteURLSearchParams(page.url.searchParams);
				const newParams = new SvelteURLSearchParams(href);
				current.delete(Array.from(newParams.keys())[0]);
				current.append(Array.from(newParams.entries())[0][0], Array.from(newParams.entries())[0][1]);
				return `?${current.toString()}`;
			} else return href;
		};
		if (hasMore || page$4 != 1) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<nav aria-label="Pagination"${attr_class(clsx([
				"flex flex-row gap-4 items-center justify-center",
				"rounded-full overflow-hidden w-max mx-auto p-1",
				"material-distinct"
			]))}>`);
			if (children) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-sm text-slate-600 dark:text-zinc-400 font-medium">`);
				children?.($$renderer);
				$$renderer.push(`<!----></span> <hr class="border-slate-200 dark:border-zinc-800 flex-1"/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (back) {
				$$renderer.push("<!--[0-->");
				{
					function suffix($$renderer) {
						Icon($$renderer, {
							src: ChevronLeft,
							size: "24",
							mini: true
						});
					}
					Button($$renderer, {
						href: customHref(href?.(cursor?.back ?? page$4 - 1)),
						color: "tertiary",
						onclick: () => invalidate(page.url),
						title: "Back",
						rounding: "pill",
						size: "custom",
						class: "text-inherit dark:text-inherit p-1",
						disabled: cursor?.back == void 0 && cursor?.next != void 0 || page$4 <= 1,
						suffix,
						$$slots: { suffix: true }
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (page$4) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div style="display: grid;"><!---->`);
				$$renderer.push(`<div class="text-lg font-medium" style="grid-column: 1; grid-row: 1;">${escape_html(page$4)}</div>`);
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function suffix($$renderer) {
					Icon($$renderer, {
						src: ChevronRight,
						size: "24",
						mini: true
					});
				}
				Button($$renderer, {
					href: customHref(href?.(cursor?.next ?? page$4 + 1)),
					color: "tertiary",
					onclick: () => invalidate(page.url),
					title: "Next",
					size: "custom",
					rounding: "pill",
					class: "text-inherit dark:text-inherit p-1",
					disabled: !hasMore,
					suffix,
					$$slots: { suffix: true }
				});
			}
			$$renderer.push(`<!----></nav>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { page: page$4 });
	});
}
//#endregion
//#region src/lib/feature/filter/Location.svelte
function Location($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { selected = void 0, navigate = true, showLabel = true, children, $$slots, $$events, ...rest } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function customLabel($$renderer) {
					if (showLabel) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="flex items-center gap-1">`);
						Icon($$renderer, {
							src: GlobeAmericas,
							size: "16",
							micro: true
						});
						$$renderer.push(`<!----> Location</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				Select($$renderer, spread_props([rest, {
					onchange: () => {
						if (navigate) searchParam(page.url, "type", selected, "page", "cursor");
					},
					get value() {
						return selected;
					},
					set value($$value) {
						selected = $$value;
						$$settled = false;
					},
					customLabel,
					children: ($$renderer) => {
						Option($$renderer, {
							value: "All",
							icon: GlobeAmericas,
							children: ($$renderer) => {
								$$renderer.push(`<!---->All`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						if (profile.client instanceof PiefedClient) {
							$$renderer.push("<!--[0-->");
							Option($$renderer, {
								value: "Popular",
								icon: ChartBar,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Popular`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						Option($$renderer, {
							value: "Local",
							icon: MapPin,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Local`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "Subscribed",
							disabled: profile.current?.jwt == void 0,
							icon: Newspaper,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Subscriptions`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModeratorView",
							disabled: !profile.isMod(),
							icon: ShieldCheck,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Moderator`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						children?.($$renderer);
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						customLabel: true,
						default: true
					}
				}]));
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { selected });
	});
}
//#endregion
//#region src/lib/feature/filter/Sort.svelte
function Sort($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { selected = void 0, navigate = true, class: clazz = "", $$slots, $$events, ...rest } = $$props;
		let sort = selected?.startsWith("Top") ? "TopAll" : selected;
		const setSelected = () => selected = sort;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div${attr_class(`flex flex-row ${stringify(clazz)}`)}>`);
			{
				function customLabel($$renderer) {
					$$renderer.push(`<span class="flex items-center gap-1">`);
					Icon($$renderer, {
						src: ChartBar,
						size: "13",
						micro: true
					});
					$$renderer.push(`<!----> Sort</span>`);
				}
				Select($$renderer, spread_props([rest, {
					class: selected?.startsWith("Top") ? "rounded-r-none" : "",
					onchange: () => {
						setSelected();
						if (navigate) searchParam(page.url, "sort", selected, "page", "cursor");
					},
					get value() {
						return sort;
					},
					set value($$value) {
						sort = $$value;
						$$settled = false;
					},
					customLabel,
					children: ($$renderer) => {
						Option($$renderer, {
							value: "Active",
							icon: ArrowTrendingUp,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Active`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "Hot",
							icon: Fire,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Hot`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "Scaled",
							icon: Scale,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Scaled`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "TopAll",
							icon: Trophy,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Top`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "New",
							icon: Star,
							children: ($$renderer) => {
								$$renderer.push(`<!---->New`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						if (!(profile.client instanceof PiefedClient)) {
							$$renderer.push("<!--[0-->");
							Option($$renderer, {
								value: "Old",
								icon: Clock,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Old`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "Controversial",
								icon: ArrowTrendingDown,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Controversial`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "MostComments",
								icon: ChatBubbleOvalLeft,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Most Comments`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "NewComments",
								icon: ChatBubbleLeftRight,
								children: ($$renderer) => {
									$$renderer.push(`<!---->New Replies`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						customLabel: true,
						default: true
					}
				}]));
			}
			$$renderer.push(`<!----> `);
			if (selected?.startsWith("Top")) {
				$$renderer.push("<!--[0-->");
				{
					function customLabel($$renderer) {
						$$renderer.push(`<span class="flex items-center gap-1">`);
						Icon($$renderer, {
							src: Clock,
							size: "15",
							micro: true
						});
						$$renderer.push(`<!----> Period</span>`);
					}
					Select($$renderer, {
						class: "border-l-0 rounded-l-none",
						onchange: () => {
							sort = "TopAll";
							if (navigate) searchParam(page.url, "sort", selected, "page", "cursor");
						},
						get value() {
							return selected;
						},
						set value($$value) {
							selected = $$value;
							$$settled = false;
						},
						customLabel,
						children: ($$renderer) => {
							Option($$renderer, {
								value: "TopAll",
								icon: PlusCircle,
								children: ($$renderer) => {
									$$renderer.push(`<!---->All time`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopYear",
								icon: Calendar,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Past year`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopNineMonths",
								icon: Calendar,
								children: ($$renderer) => {
									$$renderer.push(`<!---->9 months`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopSixMonths",
								icon: Calendar,
								children: ($$renderer) => {
									$$renderer.push(`<!---->6 months`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopThreeMonths",
								icon: Calendar,
								children: ($$renderer) => {
									$$renderer.push(`<!---->3 months`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopMonth",
								icon: CalendarDays,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Past month`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopWeek",
								icon: CalendarDays,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Past week`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopDay",
								icon: Sun,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Past day`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopTwelveHour",
								icon: Clock,
								children: ($$renderer) => {
									$$renderer.push(`<!---->12 hours`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopSixHour",
								icon: Clock,
								children: ($$renderer) => {
									$$renderer.push(`<!---->6 hours`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Option($$renderer, {
								value: "TopHour",
								icon: Clock,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Past hour`);
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
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { selected });
	});
}
//#endregion
//#region src/lib/feature/filter/ViewSelect.svelte
function ViewSelect($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { showLabel = true, $$slots, $$events, ...rest } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function customLabel($$renderer) {
					if (showLabel) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="flex items-center gap-1">`);
						Icon($$renderer, {
							src: ViewColumns,
							size: "14",
							micro: true
						});
						$$renderer.push(`<!----> View</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				Select($$renderer, spread_props([rest, {
					get value() {
						return settings.view;
					},
					set value($$value) {
						settings.view = $$value;
						$$settled = false;
					},
					customLabel,
					children: ($$renderer) => {
						Option($$renderer, {
							value: "cozy",
							icon: RectangleGroup,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Cozy`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "compact",
							icon: Bars3,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Compact`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						customLabel: true,
						default: true
					}
				}]));
			}
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
//#region src/lib/feature/post/filters.svelte.ts
var filtersEx = derived(() => settings.filters.map((filter) => ({
	...filter,
	regex: new RegExp(filter.match, "i")
})));
function filterPost(post, filters = filtersEx()) {
	for (const filter of filters) try {
		if (filter.regex.test(post.post.name) || filter.regex.test(post.post.body ?? "")) return filter.action;
	} catch {}
	return "none";
}
//#endregion
//#region src/lib/feature/post/feed/PostFeed.svelte
function PostFeed($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { posts = void 0, community = false, children } = $$props;
		let filteredPosts = derived(() => posts.map((post) => ({
			id: post.post.id,
			action: filterPost(post)
		})));
		const removePost = (postId) => {
			const index = posts.findIndex((post) => post.post.id === postId);
			if (index === -1) return;
			posts = posts.toSpliced(index, 1);
		};
		$$renderer.push(`<ul class="flex flex-col list-none divide-y divide-slate-200 dark:divide-zinc-800">`);
		if (posts.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="h-full grid place-items-center">`);
			Placeholder($$renderer, {
				icon: ArchiveBox,
				title: "No posts",
				description: "There are no posts that match this filter.",
				children: ($$renderer) => {
					Button($$renderer, {
						href: "/communities",
						icon: Plus,
						children: ($$renderer) => {
							$$renderer.push(`<span>Follow some communities</span>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(posts);
			for (let row = 0, $$length = each_array.length; row < $$length; row++) {
				let post = each_array[row];
				const filter = filteredPosts()[row];
				if (filter.action != "hide") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<li class="relative post-container">`);
					if (filter.action == "none") {
						$$renderer.push("<!--[0-->");
						Post($$renderer, {
							hideCommunity: community,
							view: (post.post.featured_community || post.post.featured_local) && settings.posts.compactFeatured ? "compact" : settings.view,
							post,
							class: "transition-all duration-250",
							onhide: () => removePost(post.post.id)
						});
					} else if (filteredPosts()[row].action == "minimize") {
						$$renderer.push("<!--[1-->");
						Button($$renderer, {
							onclick: () => filteredPosts()[row].action = "none",
							color: "tertiary",
							rounding: "none",
							icon: ArrowsPointingOut,
							class: "text-slate-400 dark:text-zinc-600 w-full",
							size: "xs",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Content hidden by your filters`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></li>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--> `);
		children?.($$renderer);
		$$renderer.push(`<!----></ul>`);
		bind_props($$props, { posts });
	});
}
//#endregion
//#region src/lib/ui/shared/util/time.ts
var debounce = (fn, ms = 300) => {
	let timeoutId;
	return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
};
//#endregion
//#region src/lib/app/render/VirtualList.svelte
function VirtualList($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items, estimatedHeight = 100, overscan = 6, item: itemSnippet, initialOffset = 0, restore = void 0, debounceResize = 100, useWindow = true, height = 0, itemContainer = "div", initialScrollIndex = 0, $$slots, $$events, ...rest } = $$props;
		function scrollToIndex(index, useWindow = false) {
			const targetPx = cumulativeItemHeights()[index] - (initialOffset || 0);
			if (targetPx < (innerHeight.current ?? 0)) return;
			scrollY = targetPx;
		}
		function rerender() {
			requestAnimationFrame(() => {});
		}
		onDestroy(() => {
			restore = { itemHeights };
		});
		let itemHeights = [...restore?.itemHeights ?? Array(items.length).fill(null)];
		let cumulativeItemHeights = derived(() => {
			let cumulation = new Array(itemHeights.length);
			let sum = 0;
			for (let i = 0; i < itemHeights.length; i++) {
				const height = itemHeights[i] || estimatedHeight;
				sum += height;
				cumulation[i] = sum;
			}
			return cumulation;
		});
		let isRestoring = run(() => initialScrollIndex > 0);
		let scrollY = run(() => {
			if (isRestoring && initialScrollIndex < itemHeights.length) {
				let sum = 0;
				for (let i = 0; i < initialScrollIndex; i++) sum += itemHeights[i] || estimatedHeight;
				const targetPx = sum - (initialOffset || 0);
				if (targetPx >= 0) return targetPx;
			}
			return 0;
		});
		let viewportHeight = 0;
		let visibleItems = [];
		function updateVisibleItems() {
			return [];
		}
		const debouncedUpdate = debounce((entries) => {
			for (const entry of entries) {
				const indexAttr = entry.target.getAttribute("data-index");
				if (indexAttr === null) continue;
				const index = Number(indexAttr);
				if (isNaN(index)) continue;
				const newHeight = entry.contentRect.height;
				if (itemHeights[index] !== newHeight) {
					itemHeights[index] = newHeight;
					visibleItems = updateVisibleItems();
				}
			}
		}, debounceResize);
		const observer = new ResizeObserver((entries) => {
			debouncedUpdate(entries);
		});
		onDestroy(() => {
			observer.disconnect();
		});
		$$renderer.push(`<div${attributes({
			style: `position: relative; height: ${stringify(height || cumulativeItemHeights()[items.length - 1] || 0)}px;`,
			...rest,
			id: "feed"
		}, "svelte-vneox3")}><div${attr_style(`height: ${stringify(cumulativeItemHeights()[visibleItems?.[0]?.index - 1] || 0)}px; border: 0 !important;`)}></div> <!--[-->`);
		const each_array = ensure_array_like(visibleItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			element($$renderer, itemContainer, () => {
				$$renderer.push(`${attr("data-index", item.index)} class="post-container fix-divide group/virtual svelte-vneox3"`);
			}, () => {
				itemSnippet($$renderer, item.index);
				$$renderer.push(`<!---->`);
			});
		}
		$$renderer.push(`<!--]--> <div${attr_style(`height: ${stringify((cumulativeItemHeights()[items.length - 1] || 0) - (cumulativeItemHeights()[visibleItems?.[visibleItems.length - 1]?.index] || 0))}px; border: 0 !important;`)}></div></div> `);
		if (settings.debugInfo) {
			$$renderer.push("<!--[0-->");
			{
				function title($$renderer) {
					$$renderer.push(`<!---->Debug`);
				}
				Expandable($$renderer, {
					title,
					children: ($$renderer) => {
						$$renderer.push(`<pre>
      Virtual list debug info

      List items: ${escape_html(items.length)}
      Rendering items: ${escape_html(visibleItems?.length)} (${escape_html(visibleItems?.[0]?.index)} - ${escape_html(visibleItems?.[visibleItems?.length - 1]?.index)})
      Viewport height: ${escape_html(viewportHeight)}
      Current scroll position: ${escape_html(scrollY)}
      Container height: ${escape_html(cumulativeItemHeights()[visibleItems?.[visibleItems?.length - 1]?.index])}
      Overscan: ${escape_html(overscan)}
      Guess item height: ${escape_html(estimatedHeight)}
      Bumpscosity: ${escape_html(Math.floor(Math.random() * 5e3))}
      Restore data: ${escape_html(JSON.stringify(restore))}
    </pre>`);
					},
					$$slots: {
						title: true,
						default: true
					}
				});
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			restore,
			scrollToIndex,
			rerender
		});
	});
}
//#endregion
//#region src/lib/ui/layout/EndPlaceholder.svelte
function EndPlaceholder($$renderer, $$props) {
	const sizes = {
		xs: "text-xs",
		sm: "text-sm",
		md: "text-base",
		lg: "text-lg"
	};
	const margins = {
		none: "",
		sm: "mt-3 mb-1 px-3",
		md: "mt-4 mb-2",
		lg: "mt-6 mb-2",
		"bottom-sm": "mb-1 px-3",
		"bottom-md": "mb-2",
		"bottom-lg": "mb-3"
	};
	const colors = {
		subtle: "text-slate-600 dark:text-zinc-400",
		none: ""
	};
	let { class: clazz = "", children, action, border = true, size = "sm", color = "subtle", margin = "none", element: element$1 = "h3", alignment = "default" } = $$props;
	function divider($$renderer) {
		$$renderer.push(`<div${attr_class(clsx(["flex-1 border-slate-200/70 dark:border-zinc-800 border-b", !border && "opacity-0"]))}></div>`);
	}
	$$renderer.push(`<div${attr_class(clsx([
		"flex flex-row items-center gap-2 flex-wrap",
		sizes[size],
		colors[color],
		margins[margin],
		clazz
	]))}>`);
	if (alignment == "center") {
		$$renderer.push("<!--[0-->");
		divider($$renderer);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (children) {
		$$renderer.push("<!--[0-->");
		element($$renderer, element$1, () => {
			$$renderer.push(` class="font-medium text-left flex flex-row gap-1 items-center"`);
		}, () => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		});
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (alignment == "default") {
		$$renderer.push("<!--[0-->");
		divider($$renderer);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	action?.($$renderer);
	$$renderer.push(`<!----> `);
	if (alignment == "center") {
		$$renderer.push("<!--[0-->");
		divider($$renderer);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/feature/post/feed/VirtualFeed.svelte
function VirtualFeed($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { posts = void 0, params = void 0, virtualList = void 0, lastSeen = 0, community = false, children } = $$props;
		let filteredPosts = derived(() => posts.map((post) => ({
			id: post.post.id,
			action: filterPost(post)
		})));
		const abortLoad = new AbortController();
		new SvelteSet(posts.map((post) => post.post.id));
		const removePost = (postId) => {
			const index = posts.findIndex((post) => post.post.id === postId);
			if (index === -1) return;
			posts = posts.toSpliced(index, 1);
		};
		let initialOffset = derived(() => void 0);
		onDestroy(() => {
			abortLoad?.abort();
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<ul class="flex flex-col list-none"><!---->`);
			if (posts.length == 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="h-full grid place-items-center my-8">`);
				Placeholder($$renderer, {
					icon: ArchiveBox,
					title: "No",
					posts: true,
					description: "There are no posts that match this filter.",
					children: ($$renderer) => {
						Button($$renderer, {
							href: "/communities",
							rounding: "pill",
							color: "primary",
							icon: ArrowTopRightOnSquare,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Communities`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				{
					function item($$renderer, row) {
						const filter = new ReactiveState(filteredPosts()[row]);
						$$renderer.push(`<li${attr("data-index", row)}${attr_class(clsx(["relative post-container", filter.value.action == "hide" && "hidden"]))}>`);
						if (filter.value.action == "none") {
							$$renderer.push("<!--[0-->");
							Post($$renderer, {
								hideCommunity: community,
								view: (posts[row].post.featured_community || posts[row].post.featured_local) && settings.posts.compactFeatured ? "compact" : settings.view,
								onhide: () => removePost(posts[row].post.id),
								class: "px-3 sm:px-6 hover:bg-slate-100/30 hover:dark:bg-zinc-900/30 transition-colors",
								get post() {
									return posts[row];
								},
								set post($$value) {
									posts[row] = $$value;
									$$settled = false;
								}
							});
						} else if (filter.value.action == "minimize") {
							$$renderer.push("<!--[1-->");
							Button($$renderer, {
								onclick: () => {
									filteredPosts()[row].action = "none";
									filter.value.action = "none";
								},
								color: "tertiary",
								rounding: "none",
								icon: ArrowsPointingOut,
								class: "text-slate-400 dark:text-zinc-600 w-full",
								size: "xs",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Content hidden by your filters`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></li>`);
					}
					VirtualList($$renderer, {
						id: "feed",
						class: "divide-y -mx-3 sm:-mx-6 divide-slate-100 dark:divide-zinc-900",
						items: posts,
						initialOffset: initialOffset(),
						overscan: 3,
						estimatedHeight: settings.view == "cozy" ? 500 : 150,
						initialScrollIndex: lastSeen,
						get restore() {
							return virtualList;
						},
						set restore($$value) {
							virtualList = $$value;
							$$settled = false;
						},
						item,
						$$slots: { item: true }
					});
				}
			}
			$$renderer.push(`<!--]-->`);
			$$renderer.push(`<!----> `);
			if (settings.infiniteScroll && false);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			children?.($$renderer);
			$$renderer.push(`<!----></ul>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			posts,
			params,
			virtualList,
			lastSeen
		});
	});
}
//#endregion
//#region src/lib/ui/layout/pages/PostListShell.svelte
function PostListShell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { params, posts = void 0, cursor = void 0, title, extended: passedExtended, getParams, client = void 0, header = true } = $$props;
		let filters = {
			location: params.location,
			sort: params.sort
		};
		const FeedComponent = derived(() => (settings.infiniteScroll, PostFeed));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			var bind_get = () => client.lastSeen ?? 0;
			var bind_set = (v) => client.lastSeen = v;
			var bind_get_1 = () => ({ itemHeights: client.itemHeights ?? [] });
			var bind_set_1 = (v) => {
				if (v) client.itemHeights = v.itemHeights;
			};
			$$renderer.push(`<div class="flex flex-col gap-2 max-w-full w-full min-w-0">`);
			if (header) {
				$$renderer.push("<!--[0-->");
				{
					function extended($$renderer) {
						passedExtended?.($$renderer);
						$$renderer.push(`<!----> <form method="get"${attr("action", page.url.pathname)}><div class="flex flex-row gap-2">`);
						if (filters.location) {
							$$renderer.push("<!--[0-->");
							Location($$renderer, {
								name: "type",
								navigate: true,
								get selected() {
									return filters.location;
								},
								set selected($$value) {
									filters.location = $$value;
									$$settled = false;
								}
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (filters.sort) {
							$$renderer.push("<!--[0-->");
							Sort($$renderer, {
								placement: "bottom",
								name: "sort",
								navigate: true,
								get selected() {
									return filters.sort;
								},
								set selected($$value) {
									filters.sort = $$value;
									$$settled = false;
								}
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						ViewSelect($$renderer, { placement: "bottom" });
						$$renderer.push(`<!----> <noscript>`);
						Button($$renderer, {
							class: "self-end h-[34px] aspect-square",
							size: "custom",
							submit: true,
							children: ($$renderer) => {
								Icon($$renderer, {
									src: ArrowRight,
									size: "16",
									micro: true
								});
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></noscript></div></form>`);
					}
					Header($$renderer, {
						pageHeader: true,
						extended,
						children: ($$renderer) => {
							if (title) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`${escape_html(title)}`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						},
						$$slots: {
							extended: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (FeedComponent()) {
				$$renderer.push("<!--[-->");
				FeedComponent()($$renderer, {
					get lastSeen() {
						return bind_get();
					},
					set lastSeen($$value) {
						bind_set($$value);
					},
					get virtualList() {
						return bind_get_1();
					},
					set virtualList($$value) {
						bind_set_1($$value);
					},
					get posts() {
						return posts;
					},
					set posts($$value) {
						posts = $$value;
						$$settled = false;
					},
					get params() {
						return getParams;
					},
					set params($$value) {
						getParams = $$value;
						$$settled = false;
					}
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` `);
			element($$renderer, settings.infiniteScroll && !settings.posts.noVirtualize ? "noscript" : "div", () => {
				$$renderer.push(` class="mt-auto flex flex-col"`);
			}, () => {
				Pageination($$renderer, {
					cursor: { next: cursor },
					href: (page) => typeof page == "number" ? `?page=${page}` : `?cursor=${page}`,
					back: false
				});
			});
			$$renderer.push(`</div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			posts,
			cursor,
			client
		});
	});
}
//#endregion
//#region src/lib/feature/post/media/PostPoll.svelte
function PostPoll($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { post } = $$props;
		let selected = post.poll.my_votes?.length == 1 ? post.poll.my_votes[0] : post.poll.my_votes;
		let canVote = !(post.poll.end_poll && publishedToDate(post.poll.end_poll).getTime() < Date.now() || !profile.current.jwt || (post.poll.my_votes?.length ?? 0) > 0);
		let chosen = canVote ? void 0 : -1;
		let options = derived(() => post.poll.choices.map((i) => ({
			...i,
			num_votes: typeof chosen !== "number" && chosen?.includes(i.id) || chosen == i.id ? i.num_votes + 1 : i.num_votes
		})));
		let totalVotes = derived(() => options().reduce((a, b) => a + b.num_votes, 0));
		let loading = false;
		$$renderer.push(`<form class="space-y-2">`);
		CommonList($$renderer, {
			class: "",
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(options().toSorted((a, b) => a.sort_order - b.sort_order));
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let choice = each_array[$$index];
					const active = selected == choice.id || typeof selected !== "number" && selected?.includes(choice.id);
					const percentage = Math.floor((choice.num_votes / totalVotes() || 0) * 100);
					const multi = post.poll.mode != "single";
					$$renderer.push(`<li class="relative z-10 overflow-hidden has-disabled:pointer-events-none svelte-wwgx53" role="progressbar" aria-valuemin="0" aria-valuemax="100"${attr("aria-valuenow", percentage)}>`);
					if (chosen) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div${attr_class(clsx(["absolute inset-0 -z-10 p-0!", active ? "bg-primary-900/10 dark:bg-primary-100/10" : "bg-primary-900/5 dark:bg-primary-100/5"]))}${attr_style(`width: ${stringify(percentage)}%; transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);`)}></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <label class="px-4 py-2 w-full text-left flex flex-row gap-2 items-center svelte-wwgx53">`);
					if (!multi) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<input class="appearance-none absolute inset-0 cursor-pointer w-full h-full peer svelte-wwgx53"${attr("name", `poll=${stringify(post.id)}`)}${attr("value", choice.id)}${attr("checked", selected === choice.id, true)} type="radio"${attr("disabled", !canVote, true)}/>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<input class="appearance-none absolute inset-0 cursor-pointer w-full h-full peer svelte-wwgx53"${attr("name", `poll=${stringify(post.id)}`)}${attr("value", choice.id)}${attr("checked", selected.includes(choice.id), true)} type="checkbox"${attr("disabled", !canVote, true)}/>`);
					}
					$$renderer.push(`<!--]--> <div${attr_class(clsx(["choice-indicator", multi ? "rounded-md" : "rounded-full"]), "svelte-wwgx53")}><div class="svelte-wwgx53"></div></div> <div${attr_class(clsx(["choice-text", "text-slate-600 dark:text-zinc-400"]), "svelte-wwgx53")}>${escape_html(choice.choice_text)}</div> `);
					if (chosen) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="ml-auto">${escape_html(percentage)}%</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></label></li>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		{
			function action($$renderer) {
				if (selected && canVote || loading) {
					$$renderer.push("<!--[0-->");
					Button($$renderer, {
						class: "w-24",
						color: "primary",
						submit: true,
						loading,
						disabled: loading,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Submit`);
						},
						$$slots: { default: true }
					});
				} else if (post.poll.end_poll) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`${escape_html(`Ends ${formatRelativeDate(publishedToDate(post.poll.end_poll))}`)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			EndPlaceholder($$renderer, {
				size: "md",
				margin: "bottom-sm",
				action,
				children: ($$renderer) => {
					$$renderer.push(`<!---->\`$${escape_html(totalVotes())} votes\``);
				},
				$$slots: {
					action: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----></form>`);
	});
}
//#endregion
//#region src/lib/feature/post/media/PostMedia.svelte
function PostMedia($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { view = "cozy", post, type = "none", opened = void 0, blur = post.nsfw && settings.nsfwBlur, $$slots, $$events, ...rest } = $$props;
		if (type == "image" && view == "cozy") {
			$$renderer.push("<!--[0-->");
			PostImage($$renderer, spread_props([{
				post,
				blur
			}, rest]));
		} else if ((type == "iframe" || type == "video") && view == "cozy" && post.url) {
			$$renderer.push("<!--[1-->");
			PostIframe($$renderer, spread_props([{
				thumbnail: post.thumbnail_url,
				type: iframeType(post.url),
				url: post.url,
				opened,
				title: post.name
			}, rest]));
		} else if (type == "poll" && post.poll && view == "cozy") {
			$$renderer.push("<!--[2-->");
			PostPoll($$renderer, { post: {
				...post,
				poll: post.poll
			} });
		} else if (type == "event" && post.event && view == "cozy") {
			$$renderer.push("<!--[3-->");
			PostEvent($$renderer, { post: {
				...post,
				event: post.event
			} });
		} else if (type == "embed" && post.url) {
			$$renderer.push("<!--[4-->");
			PostLink($$renderer, spread_props([{
				url: post.url,
				thumbnail_url: post.thumbnail_url,
				nsfw: post.nsfw,
				embed_title: post.embed_title,
				embed_body: post.embed_description,
				view
			}, rest]));
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/ui/generic/ExpandableImage.svelte
function ExpandableImage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* The full-resolution image URL
		*/
		let { alt = "" } = $$props;
		async function share() {
			if (navigator.share != void 0 && page.state.openImage != null) {
				const url = page.state.openImage;
				const blob = await fetch(url).then((i) => i.blob());
				const file = new File([blob], url.substring(url.lastIndexOf("/") + 1), { type: blob.type });
				navigator.share({ files: [file] });
			} else {
				navigator.clipboard.writeText(page.state.openImage ?? "");
				toast({ content: "Copied to clipboard." });
			}
		}
		if (page.state.openImage || false) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed top-0 left-0 w-screen h-svh overflow-auto bg-white/50 dark:bg-black/50 flex flex-col z-100 backdrop-blur-xs"><img${attr("width", 800)}${attr("height", 800)}${attr("src", page.state.openImage)}${attr_class(clsx(["max-w-full mx-auto my-auto overscroll-contain bg-white dark:bg-zinc-900"]))}${attr("alt", alt)}/> <div class="sticky z-10 bottom-4 left-1/2 -translate-x-1/2 w-max">`);
			Material($$renderer, {
				class: "gap-1 p-0.5 px-1 flex flex-row items-center",
				rounding: "full",
				padding: "none",
				color: "distinct",
				onclick: (e) => e.stopPropagation(),
				children: ($$renderer) => {
					Button($$renderer, {
						onclick: share,
						color: "tertiary",
						size: "square-lg",
						rounding: "pill",
						"aria-label": "Share",
						icon: Share
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => history.back(),
						color: "tertiary",
						size: "square-lg",
						rounding: "pill",
						"aria-label": "Back",
						icon: XMark
					});
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/feature/post/media/PostMediaCompact.svelte
function PostMediaCompact($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const thumbnailSize = (view) => view == "compact" ? "w-22 h-22 sm:w-28" : "w-24 h-24 sm:w-32";
		let { post, type = "none", view = "cozy", blur = post.nsfw && settings.nsfwBlur, style = "", class: clazz = "" } = $$props;
		let size = derived(() => thumbnailSize(view));
		$$renderer.push(`<div${attr_class(clsx([
			size(),
			"relative group/media",
			clazz
		]), "svelte-1yaihdv")}${attr_style(style)} role="presentation">`);
		element($$renderer, !settings.expandImages || type != "image" ? "a" : "button", () => {
			$$renderer.push(`${attr("href", postLink(post))}${attr("aria-label", type == "image" ? `Open image: ${post.name}` : `Open post: ${post.name}`)}${attr("role", type == "image" ? "button" : "link")} tabindex="0" class="cursor-pointer h-full block svelte-1yaihdv"`);
		}, () => {
			$$renderer.push(`<div${attr_class(clsx(["relative overflow-hidden rounded-2xl max-h-full h-full", "btn-secondary hover-scale-effect"]), "svelte-1yaihdv")}>`);
			if (post.thumbnail_url || type == "image") {
				$$renderer.push("<!--[0-->");
				const thumbnail = post.thumbnail_url != void 0 && type != "image";
				$$renderer.push(`<picture class="rounded-[inherit] svelte-1yaihdv"><!--[-->`);
				const each_array = ensure_array_like(["webp"]);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let format = each_array[$$index];
					$$renderer.push(`<source${attr("srcset", `${stringify(bestImageURL(post, thumbnail, 128, format))} 1x, ${stringify(bestImageURL(post, thumbnail, 256, format))} 2x, ${stringify(bestImageURL(post, thumbnail, 512, format))} 3x`)} media="(min-width: 0px)"${attr("type", `image/${stringify(format)}`)}/>`);
				}
				$$renderer.push(`<!--]--> <img${attr("src", blur ? "" : bestImageURL(post, thumbnail, -1, null))} loading="lazy"${attr_class(clsx(["object-cover relative overflow-hidden rounded-[inherit] h-full", size()]), "svelte-1yaihdv", { "blur-xl": blur })}${attr("alt", post.alt_text ?? " ")}/></picture> `);
				if (type != "image") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="post-media-indicator svelte-1yaihdv">`);
					Icon($$renderer, {
						src: type == "iframe" ? VideoCamera : Link$1,
						micro: true,
						size: "16"
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				const typeIconMap = /* @__PURE__ */ new Map([
					["embed", Link$1],
					["iframe", VideoCamera],
					["poll", PresentationChartBar],
					["event", Calendar]
				]);
				$$renderer.push(`<div${attr_class(clsx([" w-full h-full rounded-xl grid place-items-center", "text-slate-600 dark:text-zinc-400"]), "svelte-1yaihdv")}>`);
				Icon($$renderer, {
					src: typeIconMap.get(type) ?? DocumentText,
					solid: true,
					size: "32"
				});
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (blur) {
				$$renderer.push("<!--[0-->");
				Icon($$renderer, {
					src: ExclamationTriangle,
					solid: true,
					size: "32",
					class: "absolute w-8 h-8 mx-auto my-auto z-30 inset-0 opacity-30"
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(` `);
		if (post.alt_text) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				onclick: () => modal({
					title: "Alt text",
					body: post.alt_text
				}),
				"aria-label": "Alt text",
				class: "absolute bottom-0 left-0 z-20 m-1",
				size: "square-md",
				rounding: "xl",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: Photo,
						size: "16",
						micro: true
					});
				},
				$$slots: { default: true }
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/feature/post/media/PostImage.svelte
function PostImage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { post, blur = false } = $$props;
		element($$renderer, settings.expandImages ? "button" : "a", () => {
			$$renderer.push(`${attr("href", postLink(post))}${attr_class(clsx([
				"container/a z-10 rounded-2xl cursor-pointer relative overflow-hidden",
				"bg-slate-100 dark:bg-zinc-900 transition-colors",
				"border border-slate-200 dark:border-zinc-800 group"
			]))} data-sveltekit-preload-data="off"${attr("aria-label", post.name)} role="button" tabindex="0"`);
		}, () => {
			$$renderer.push(`<div class="inset-0 absolute -z-10 rounded-xl overflow-hidden"><img loading="lazy" fetchpriority="auto"${attr("src", bestImageURL(post, false, 64))} class="object-cover w-full h-full opacity-50 blur-lg"/></div> <picture class="max-h-[60vh]"><!--[-->`);
			const each_array = ensure_array_like(["webp"]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let format = each_array[$$index];
				$$renderer.push(`<source${attr("srcset", `${stringify(bestImageURL(post, false, 512, format))} 512w, ${stringify(bestImageURL(post, false, 768, format))} 768w, ${stringify(bestImageURL(post, false, 1024, format))} 1024w`)} media="(min-width: 0px)"${attr("type", `image/${stringify(format)}`)}/>`);
			}
			$$renderer.push(`<!--]--> <img${attr("src", blur ? "" : bestImageURL(post, false, -1, null))} loading="lazy"${attr_class(clsx([
				"max-w-full rounded-xl z-30 transition-all max-h-[60vh] duration-500 object-contain mx-auto group-hover:scale-98 group-active:scale-95",
				"duration-200 ease-cubic",
				"opacity-100",
				blur && "blur-3xl"
			]))}${attr("width", 512)}${attr("height", 300)}${attr("alt", post.alt_text ?? "")} onload="this.__e=event"/></picture>  <div class="absolute bottom-0 left-0 right-0 flex justify-between items-center rounded-full ml-auto w-max m-2 p-0 gap-1 *:bg-white *:border *:border-slate-200 dark:*:border-zinc-800 dark:*:bg-zinc-900">`);
			if (post.alt_text) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					onclick: (e) => {
						e.stopPropagation();
						modal({
							title: "Alt",
							body: post.alt_text ?? ""
						});
					},
					color: "tertiary",
					size: "md",
					rounding: "pill",
					children: ($$renderer) => {
						$$renderer.push(`<!---->ALT`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		});
	});
}
//#endregion
//#region src/lib/feature/post/media/PostIframe.svelte
var youtubeDomain = (place) => {
	switch (place) {
		case "youtube": return "www.youtube-nocookie.com";
		case "invidious": return settings.embeds.invidious || "yewtu.be";
		case "piped": return settings.embeds.piped || "piped.video";
	}
};
function youtubeVideoID(url) {
	const match = url.match(/^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
	if (match && match[1]) return match[1];
	return null;
}
function PostIframe($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const urlToEmbed = (inputUrl) => {
			if (type == "video") return inputUrl;
			if (type == "youtube") {
				const url = new URL(inputUrl);
				const videoID = youtubeVideoID(inputUrl);
				if (videoID) {
					const embedUrl = new URL(`https://${youtubeDomain(settings.embeds.youtube)}/embed/${videoID}`);
					embedUrl.searchParams.set("start", url.searchParams.get("t") ?? "");
					url.searchParams.forEach((value, key) => {
						embedUrl.searchParams.set(key, value);
					});
					if (autoplay) embedUrl.searchParams.set("autoplay", "1");
					return embedUrl.toString();
				}
			}
			return "";
		};
		const typeData = (type) => {
			switch (type) {
				case "youtube": return {
					icon: VideoCamera,
					text: "YouTube Video"
				};
				case "video": return {
					icon: VideoCamera,
					text: "Video"
				};
				default: return {
					icon: PuzzlePiece,
					text: "Embed"
				};
			}
		};
		let { type = "none", thumbnail = void 0, url, title, opened = !settings.embeds.clickToView, autoplay = settings.embeds.clickToView, class: clazz = "" } = $$props;
		let data = derived(() => typeData(type));
		let embedUrl = derived(() => urlToEmbed(url));
		$$renderer.push(`<div${attr_class(clsx(["iframe-container", clazz]), "svelte-1d4prf0")}>`);
		if (opened) {
			$$renderer.push("<!--[0-->");
			if (type == "video") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<video${attr("autoplay", autoplay, true)} controls="" class="svelte-1d4prf0"><source${attr("src", url)}/></video>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<iframe${attr("src", embedUrl())} title="Embed player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" class="svelte-1d4prf0"></iframe>`);
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button class="iframe-preview svelte-1d4prf0"><div role="presentation" class="preview-start svelte-1d4prf0"><div class="start-button svelte-1d4prf0">`);
			Icon($$renderer, {
				src: Play,
				size: "32",
				mini: true
			});
			$$renderer.push(`<!----></div></div> `);
			if (thumbnail) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", optimizeImageURL(thumbnail, 512))} class="absolute top-0 left-0 -z-10 w-full object-cover h-full mask-b-from-0 brightness-75" alt=""/>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="absolute inset-0 w-full h-full scale-200 -z-10 opacity-50">`);
				Blobs($$renderer, { seed: title ?? data().text });
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--> `);
			Icon($$renderer, {
				src: data().icon,
				solid: true,
				size: "40"
			});
			$$renderer.push(`<!----> <h1 class="font-display text-xl md:text-2xl xl:text-3xl font-medium text-left overflow-hidden overflow-ellipsis line-clamp-2">${escape_html(title ?? data().text)}</h1> <div class="text-slate-600 dark:text-zinc-400">${escape_html(URL.parse?.(url)?.hostname ?? data().text)}</div></button>`);
		}
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { opened });
	});
}
//#endregion
//#region src/lib/ui/form/Link.svelte
var parseURL = (href) => {
	try {
		return new URL(href);
	} catch {
		return;
	}
};
function Link($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { href, highlight = false, children, class: clazz = "", icon, $$slots, $$events, ...rest } = $$props;
		$$renderer.push(`<a${attributes({
			...rest,
			href,
			class: clsx([
				"hover:underline max-w-full inline-flex items-center gap-1",
				highlight && "text-blue-600 dark:text-blue-400",
				clazz
			])
		})}>`);
		icon?.($$renderer);
		$$renderer.push(`<!----> `);
		children?.($$renderer);
		$$renderer.push(`<!----></a>`);
	});
}
//#endregion
//#region src/lib/feature/post/PostLink.svelte
function PostLink($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { url, thumbnail_url, nsfw = false, embed_title, embed_body, view = "cozy" } = $$props;
		let richURL = derived(() => parseURL(url));
		if (embed_title && view == "cozy") {
			$$renderer.push("<!--[0-->");
			Material($$renderer, {
				color: "default",
				class: ["post-link group/link hover:bg-slate-50 hover:dark:bg-zinc-800 transition-colors"],
				rounding: "2xl",
				element: "a",
				padding: "none",
				href: url,
				target: "_blank",
				rel: "noopener",
				children: ($$renderer) => {
					$$renderer.push(`<div${attr_class(clsx(["post-link-url", thumbnail_url && "-mt-2 sm:mt-0"]), "svelte-11ve8xr")}>`);
					if (richURL()) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="link-hostname svelte-11ve8xr">${escape_html(richURL().hostname)}</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <p class="post-link-title svelte-11ve8xr">${escape_html(embed_title)}</p> `);
					if (embed_body) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="post-link-body svelte-11ve8xr">${escape_html(embed_body?.slice(0, 200))}`);
						if (embed_body.length >= 200) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`...`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> `);
					if (thumbnail_url) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="post-link-image svelte-11ve8xr"><picture class="contents"><!--[-->`);
						const each_array = ensure_array_like(["webp"]);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let format = each_array[$$index];
							$$renderer.push(`<source${attr("srcset", `${stringify(optimizeImageURL(thumbnail_url, 256, format))} 256w, ${stringify(optimizeImageURL(thumbnail_url, 512, format))} 512w`)} media="(min-width: 0px)"${attr("type", `image/${stringify(format)}`)}/>`);
						}
						$$renderer.push(`<!--]--> <img${attr("src", optimizeImageURL(thumbnail_url, -1))}${attr_class("svelte-11ve8xr", void 0, { "blur-3xl": nsfw })}${attr("width", 600)}${attr("height", 400)} alt=""/></picture></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<a${attr("href", url)} target="_blank" rel="noopener noreferrer" class="post-link-compact svelte-11ve8xr">`);
			Icon($$renderer, {
				src: Link$1,
				size: "16",
				micro: true,
				class: "shrink-0"
			});
			$$renderer.push(`<!----> `);
			if (richURL()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="post-link-url svelte-11ve8xr">${escape_html(richURL().hostname)} `);
				if (richURL().pathname != "/") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="post-link-extended svelte-11ve8xr">${escape_html(richURL().pathname)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(url)}`);
			}
			$$renderer.push(`<!--]--></a>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/app/instance.svelte.ts
var InstanceData = class {
	#instance = derived(() => profile.current.instance);
	get data() {
		return this.#instance() ?? DEFAULT_INSTANCE_URL;
	}
};
var instance = new InstanceData();
var LINKED_INSTANCE_URL = (public_env.PUBLIC_LOCK_TO_INSTANCE ?? "true").toLowerCase() == "true" ? public_env.PUBLIC_INSTANCE_URL : void 0;
var getDefaultInstance = () => {
	return public_env.PUBLIC_INTERNAL_INSTANCE || public_env.PUBLIC_INSTANCE_URL || "lemdro.id";
};
var DEFAULT_INSTANCE_URL = getDefaultInstance();
//#endregion
//#region src/lib/ui/icon/photon.ts
var photon = {
	a: {
		viewBox: "0 0 100 100",
		fill: "currentColor"
	},
	path: [{
		"fill-rule": "evenodd",
		d: "M45.5 10.8868C48.594 9.10042 52.406 9.10042 55.5 10.8868L82.3061 26.3632C85.4001 28.1496 87.3061 31.4508 87.3061 35.0235V65.9765C87.3061 69.5492 85.4001 72.8504 82.3061 74.6368L55.5 90.1132C52.406 91.8996 48.594 91.8996 45.5 90.1132L18.6939 74.6368C15.5999 72.8504 13.6939 69.5492 13.6939 65.9765V35.0235C13.6939 31.4508 15.5999 28.1496 18.6939 26.3632L45.5 10.8868Z",
		"clip-rule": "evenodd"
	}]
};
var Photon = {
	micro: photon,
	mini: photon,
	solid: photon,
	outline: {
		a: {
			viewBox: "0 0 100 100",
			fill: "currentColor",
			"stroke-width": "1.5",
			stroke: "currentColor"
		},
		path: [{
			d: "M45.5 10.8868C48.594 9.10042 52.406 9.10042 55.5 10.8868L82.3061 26.3632C85.4001 28.1496 87.3061 31.4508 87.3061 35.0235V65.9765C87.3061 69.5492 85.4001 72.8504 82.3061 74.6368L55.5 90.1132C52.406 91.8996 48.594 91.8996 45.5 90.1132L18.6939 74.6368C15.5999 72.8504 13.6939 69.5492 13.6939 65.9765V35.0235C13.6939 31.4508 15.5999 28.1496 18.6939 26.3632L45.5 10.8868Z",
			"stroke-linecap": "round",
			"stroke-linejoin": "round"
		}]
	}
};
//#endregion
//#region src/lib/feature/post/form/postform.svelte.ts
var PostFormState = class {
	type;
	community;
	title;
	body;
	url;
	nsfw;
	altText;
	thumbnail;
	language;
	poll;
	event;
	flairList;
	mediaId;
	constructor(post) {
		this.type = post?.type ?? "normal";
		this.community = post?.community;
		this.title = post?.name ?? "";
		this.body = post?.body;
		this.url = post?.url;
		this.nsfw = post?.nsfw ?? false;
		this.altText = post?.alt_text;
		this.language = post?.language_id?.toString();
		this.thumbnail = void 0;
		this.mediaId = post?.media_id;
		this.poll = post?.poll ?? {
			mode: "single",
			local_only: false,
			choices: [{
				choice_text: "Option 1",
				id: 1,
				num_votes: 0,
				sort_order: 0
			}, {
				choice_text: "Option 2",
				id: 2,
				num_votes: 0,
				sort_order: 1
			}]
		};
		this.event = post?.event;
		this.flairList = post?.flair_list ?? [];
	}
	validate(mode) {
		if (mode == "create" && !this.community) return false;
		if (this.url && !URL.canParse(this.url)) return false;
		return true;
	}
	async submit(postId) {
		if (!this.validate(postId ? "edit" : "create")) throw new Error("failed validation");
		const api = client();
		let res;
		if (postId) res = (await api.editPost({
			post_id: postId,
			name: this.title,
			body: this.body,
			url: this.url,
			nsfw: this.nsfw,
			alt_text: this.altText,
			custom_thumbnail: this.thumbnail,
			language_id: Number(this.language) || void 0,
			poll: this.type == "poll" ? this.poll : void 0,
			event: this.type == "event" ? this.event : void 0
		})).post_view;
		else res = (await api.createPost({
			community_id: this.community.id,
			name: this.title,
			body: this.body,
			url: this.url,
			alt_text: this.altText,
			custom_thumbnail: this.thumbnail,
			nsfw: this.nsfw,
			language_id: Number(this.language) || void 0,
			poll: this.type == "poll" ? this.poll : void 0,
			event: this.type == "event" ? this.event : void 0,
			media_id: this.mediaId
		})).post_view;
		if (api instanceof PiefedClient && api.assignFlair) {
			const flairRes = await api.assignFlair({
				flair_id_list: this.flairList.map((i) => i.id),
				post_id: res.post.id
			});
			res.flair_list = flairRes.flair_list;
		}
		return res;
	}
};
async function autofillPost(url) {
	const res = await client().getSiteMetadata({ url: url.toString() });
	return {
		title: res.metadata.title,
		body: res.metadata.description
	};
}
//#endregion
//#region src/lib/feature/post/actions/PostActions.svelte
function PostActions($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let saving = false;
		let editing = false;
		let { post = void 0, view = "cozy", debug = false, style = "", onedit, onhide } = $$props;
		let buttonHeight = derived(() => view == "compact" ? "h-7.5" : "h-8");
		let buttonSquare = derived(() => view == "compact" ? "w-7.5 h-7.5" : "w-8 h-8");
		function share(global = true, url) {
			const link = url ?? (global ? post.post.ap_id : `${instanceToURL(profile.current.instance)}/post/${post.post.id}`);
			if (navigator.share) navigator.share?.({ url: link });
			else {
				navigator.clipboard.writeText(link);
				toast({ content: "Copied to clipboard." });
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (editing) {
				$$renderer.push("<!--[0-->");
				{
					function customTitle($$renderer) {
						$$renderer.push(`<h1 class="text-2xl font-bold">Edit</h1>`);
					}
					Modal($$renderer, {
						get open() {
							return editing;
						},
						set open($$value) {
							editing = $$value;
							$$settled = false;
						},
						customTitle,
						children: ($$renderer) => {
							await_block($$renderer, import("./PostForm2.js"), () => {
								$$renderer.push(`<div class="mx-auto h-96 flex justify-center items-center">`);
								Spinner($$renderer, { width: 32 });
								$$renderer.push(`<!----></div>`);
							}, ({ default: PostForm }) => {
								{
									function title($$renderer) {}
									if (PostForm) {
										$$renderer.push("<!--[-->");
										PostForm($$renderer, {
											editPost: post.post.id,
											onsubmit: (e) => {
												editing = false;
												post = e;
												onedit?.(e);
											},
											init: new PostFormState({
												type: post.post.poll ? "poll" : post.post.event ? "event" : "normal",
												...post.post
											}),
											title,
											$$slots: { title: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								}
							});
							$$renderer.push(`<!--]-->`);
						},
						$$slots: {
							customTitle: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <footer${attr_class(clsx(["flex flex-row gap-2 items-center shrink-0 text-slate-600 dark:text-zinc-400", buttonHeight()]), void 0, { "flex-row-reverse": settings.posts.reverseActions })}${attr_style(style)}>`);
			PostVote($$renderer, {
				post: post.post,
				get vote() {
					return post.my_vote;
				},
				set vote($$value) {
					post.my_vote = $$value;
					$$settled = false;
				},
				get score() {
					return post.counts.score;
				},
				set score($$value) {
					post.counts.score = $$value;
					$$settled = false;
				},
				get upvotes() {
					return post.counts.upvotes;
				},
				set upvotes($$value) {
					post.counts.upvotes = $$value;
					$$settled = false;
				},
				get downvotes() {
					return post.counts.downvotes;
				},
				set downvotes($$value) {
					post.counts.downvotes = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				size: "custom",
				href: `${stringify(postLink(post.post))}#comments`,
				class: "text-inherit! h-full px-3 relative",
				rounding: "xl",
				target: settings.openLinksInNewTab ? "_blank" : "",
				"aria-label": "Comments",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: publishedToDate(post.counts.newest_comment_time).getTime() > (/* @__PURE__ */ new Date()).getTime() - 300 * 1e3 ? ChatBubbleOvalLeftEllipsis : ChatBubbleOvalLeft,
						size: "16",
						mini: true
					});
					$$renderer.push(`<!----> `);
					FormattedNumber($$renderer, { number: post.counts.comments });
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="flex-1"></div> `);
			if (settings.debugInfo) {
				$$renderer.push("<!--[0-->");
				if (debug) {
					$$renderer.push("<!--[0-->");
					await_block($$renderer, import("./DebugObject2.js"), () => {}, ({ default: DebugObject }) => {
						if (DebugObject) {
							$$renderer.push("<!--[-->");
							DebugObject($$renderer, {
								object: post,
								get open() {
									return debug;
								},
								set open($$value) {
									debug = $$value;
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
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Button($$renderer, {
					onclick: () => debug = true,
					title: "Debug",
					size: "custom",
					rounding: "xl",
					class: buttonSquare(),
					icon: BugAnt
				});
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (profile.isMod(post.community) || profile.isAdmin) {
				$$renderer.push("<!--[0-->");
				await_block($$renderer, import("./ModerationMenu.js"), () => {}, ({ default: ModerationMenu }) => {
					{
						function target($$renderer, attachment, acting) {
							Button($$renderer, {
								size: "custom",
								rounding: "xl",
								loading: acting,
								class: buttonSquare(),
								children: ($$renderer) => {
									Icon($$renderer, {
										src: ShieldCheck,
										size: "18",
										mini: true
									});
								},
								$$slots: { default: true }
							});
						}
						if (ModerationMenu) {
							$$renderer.push("<!--[-->");
							ModerationMenu($$renderer, {
								get item() {
									return post;
								},
								set item($$value) {
									post = $$value;
									$$settled = false;
								},
								target,
								$$slots: { target: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					}
				});
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (profile.current?.jwt) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					onclick: async () => {
						if (!profile.current?.jwt) return;
						saving = true;
						post.saved = await save(post, !post.saved);
						saving = false;
					},
					size: "custom",
					class: buttonSquare(),
					rounding: "xl",
					loading: saving,
					disabled: saving,
					title: post.saved ? "Unsave" : "Save",
					icon: post.saved ? BookmarkSlash : Bookmark
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function target($$renderer, attachment) {
					Button($$renderer, {
						rounding: "xl",
						size: "custom",
						class: buttonSquare(),
						onclick: () => {
							if (post.post.local) share();
						},
						icon: Share,
						title: "Share"
					});
				}
				Menu($$renderer, {
					placement: "bottom-end",
					target,
					children: ($$renderer) => {
						MenuDivider($$renderer, {
							showLabel: true,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Share from`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							onclick: () => share(true),
							icon: GlobeAlt,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Origin server`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						MenuButton($$renderer, {
							onclick: () => share(false),
							icon: MapPin,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Your server`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						if (!LINKED_INSTANCE_URL) {
							$$renderer.push("<!--[0-->");
							MenuDivider($$renderer, {
								children: ($$renderer) => {},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							MenuButton($$renderer, {
								onclick: () => share(false, new URL(`/go/${post.post.ap_id}`, page.url.origin).toString()),
								icon: Photon,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Photon link`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						target: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			if (profile.current.jwt) {
				$$renderer.push("<!--[0-->");
				{
					function target($$renderer, popover) {
						Button($$renderer, {
							title: "More actions",
							rounding: "xl",
							size: "custom",
							class: buttonSquare(),
							icon: EllipsisHorizontal
						});
					}
					function children($$renderer, open) {
						if (open) {
							$$renderer.push("<!--[0-->");
							await_block($$renderer, import("./PostActionsMenu.js"), () => {
								$$renderer.push(`<div class="p-8 w-full h-full grid place-items-center">`);
								Spinner($$renderer, { width: 20 });
								$$renderer.push(`<!----></div>`);
							}, ({ default: PostActionsMenu }) => {
								if (PostActionsMenu) {
									$$renderer.push("<!--[-->");
									PostActionsMenu($$renderer, {
										onhide,
										get post() {
											return post;
										},
										set post($$value) {
											post = $$value;
											$$settled = false;
										},
										get editing() {
											return editing;
										},
										set editing($$value) {
											editing = $$value;
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
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Menu($$renderer, {
						placement: "bottom-end",
						target,
						children,
						$$slots: {
							target: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></footer>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			post,
			debug
		});
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdImage.svelte
function MdImage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let loaded = getContext("options")?.autoloadImages ?? true;
		let { href, title = void 0, text = "" } = $$props;
		let type = derived(() => mediaType(href));
		$$renderer.push(`<div class="w-auto h-auto max-h-96 rounded-2xl border border-slate-200 dark:border-zinc-800 inline-block group">`);
		if (loaded) {
			$$renderer.push("<!--[0-->");
			if (type() == "video" || type() == "embed" || type() == "iframe") {
				$$renderer.push("<!--[0-->");
				PostIframe($$renderer, {
					type: iframeType(href),
					url: href,
					opened: true,
					autoplay: false,
					class: "w-auto h-auto max-h-80 inline-block rounded-[inherit] cursor-pointer"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button class="inline cursor-pointer bg-slate-200 dark:bg-zinc-900 rounded-[inherit]"><img${attr("src", optimizeImageURL(href, 1024))}${attr("title", title)}${attr("alt", text)}${attr("width", 300)}${attr("height", 300)}${attr_class(clsx(["object-contain w-auto h-auto max-h-80 inline rounded-[inherit] group-hover:scale-98 group-active:scale-95", "transition-transform ease-cubic duration-300"]))}/></button>`);
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button class="w-40 h-40 flex flex-col justify-center items-center gap-4 p-2 group cursor-pointer" title="Download">`);
			Icon($$renderer, {
				src: ArrowDownTray,
				size: "24",
				class: "text-primary-900 dark:text-primary-100"
			});
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdLink.svelte
function MdLink($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { href = "", title = void 0, children } = $$props;
		const parseURL = (href) => {
			try {
				return new URL(href);
			} catch {
				return;
			}
		};
		let photonified = derived(() => photonify(href));
		$$renderer.push(`<a${attr("href", photonified() ?? href)}${attr("title", title)} class="hover:underline text-blue-600 dark:text-blue-400">`);
		children?.($$renderer);
		$$renderer.push(`<!----></a>`);
		bind_props($$props, { parseURL });
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdList.svelte
function MdList($$renderer, $$props) {
	let { ordered, start, children } = $$props;
	if (ordered) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<ol${attr("start", start)} class="pl-5 list-decimal">`);
		children?.($$renderer);
		$$renderer.push(`<!----></ol>`);
	} else {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<ul class="list-disc pl-8 *:marker:content-['• ']!">`);
		children?.($$renderer);
		$$renderer.push(`<!----></ul>`);
	}
	$$renderer.push(`<!--]-->`);
}
//#endregion
//#region src/lib/app/markdown/renderers/MdListItem.svelte
function MdListItem($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<li class="svelte-1o0y3jo">`);
	children?.($$renderer);
	$$renderer.push(`<!----></li>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/MdParagraph.svelte
function MdParagraph($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const options = getContext("options");
		$$renderer.push(`<p${attr_class(clsx([!options.noStyle && "leading-[1.7] break-words max-w"]), "svelte-g7db9n")}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></p>`);
	});
}
//#endregion
//#region src/lib/app/markdown/renderers/MdQuote.svelte
function MdQuote($$renderer, $$props) {
	/**
	* @typedef {Object} Props
	* @property {import('svelte').Snippet} [children]
	*/
	/** @type {Props} */
	let { children } = $$props;
	$$renderer.push(`<blockquote class="flex flex-col gap-2 border-l-2 dark:border-zinc-700 border-slate-300 p-1 px-3">`);
	children?.($$renderer);
	$$renderer.push(`<!----></blockquote>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/MdSpoiler.svelte
function MdSpoiler($$renderer, $$props) {
	let { raw, children } = $$props;
	function extractTitle(text) {
		const result = /^::: ?spoiler (.+)\n([\s\S]+?)\n:::/gm.exec(text);
		if (!result?.[1] || !result?.[2]) return {
			title: "parsing error",
			content: "parsing error"
		};
		return {
			title: result[1],
			content: result[2]
		};
	}
	let data = derived(() => extractTitle(raw));
	{
		function title($$renderer) {
			$$renderer.push(`<div class="text-left">${escape_html(data().title)}</div>`);
		}
		Expandable($$renderer, {
			class: "border-y border-slate-200 dark:border-zinc-800 py-2",
			title,
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			},
			$$slots: {
				title: true,
				default: true
			}
		});
	}
}
//#endregion
//#region src/lib/app/markdown/renderers/MdSubscript.svelte
function MdSubscript($$renderer, $$props) {
	let { text } = $$props;
	$$renderer.push(`<sub>${escape_html(text)}</sub>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/MdSuperscript.svelte
function MdSuperscript($$renderer, $$props) {
	let { text } = $$props;
	$$renderer.push(`<sup>${escape_html(text)}</sup>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/MdText.svelte
function MdText($$renderer, $$props) {
	/**
	* @typedef {Object} Props
	* @property {import('svelte').Snippet} [children]
	*/
	/** @type {Props} */
	let { children } = $$props;
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
//#region src/lib/app/markdown/renderers/spoiler/spoiler.ts
/**
* spoiler extension for marked
*/
function spoiler_default(tokensExtractor) {
	return {
		name: "spoiler",
		level: "block",
		start(src) {
			return src.match(/:::[^:\n]/)?.index;
		},
		tokenizer(src) {
			const match = /^:::[ \t]*spoiler[ \t]*([^\n]*)\n([\s\S]*?)\n[ \t]*:::[ \t]*(?:\n|$)/.exec(src);
			if (match) {
				const title = match[1].trim();
				const content = match[2].trim();
				const options = parseOptions(title);
				const result = tokensExtractor({
					type: "spoiler",
					raw: match[0],
					content,
					options,
					lexer: this.lexer
				});
				if (result?.tokens) this.lexer.blockTokens(content, result.tokens);
				return result ?? void 0;
			}
		}
	};
}
function parseOptions(options) {
	const output = {};
	const rule = /([a-z0-9]+)(?:="([^"]*)")?/gi;
	let match;
	while ((match = rule.exec(options)) !== null) {
		const name = match[1];
		if (name) output[name] = match?.groups?.value ?? true;
	}
	return output;
}
//#endregion
//#region src/lib/app/markdown/renderers/subtext/MdCodespan.svelte
function MdCodespan($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<code>`);
	children?.($$renderer);
	$$renderer.push(`<!----></code>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/subtext/MdDel.svelte
function MdDel($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<del>`);
	children?.($$renderer);
	$$renderer.push(`<!----></del>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/subtext/MdEm.svelte
function MdEm($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<em>`);
	children?.($$renderer);
	$$renderer.push(`<!----></em>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/subtext/MdStrong.svelte
function MdStrong($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<strong>`);
	children?.($$renderer);
	$$renderer.push(`<!----></strong>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/table/MdTable.svelte
function MdTable($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="overflow-auto w-full table-container svelte-cqfp8m"><table class="w-full table-fixed rounded-xl min-w-md svelte-cqfp8m">`);
	children?.($$renderer);
	$$renderer.push(`<!----></table></div>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/table/MdTableBody.svelte
function MdTableBody($$renderer, $$props) {
	/**
	* @typedef {Object} Props
	* @property {import('svelte').Snippet} [children]
	*/
	/** @type {Props} */
	let { children } = $$props;
	$$renderer.push(`<tbody>`);
	children?.($$renderer);
	$$renderer.push(`<!----></tbody>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/table/MdTableCell.svelte
function MdTableCell($$renderer, $$props) {
	let { header, align = void 0, children } = $$props;
	if (header) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<th${attr("align", align)}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></th>`);
	} else {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<td${attr("align", align)}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></td>`);
	}
	$$renderer.push(`<!--]-->`);
}
//#endregion
//#region src/lib/app/markdown/renderers/table/MdTableHead.svelte
function MdTableHead($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<thead>`);
	children?.($$renderer);
	$$renderer.push(`<!----></thead>`);
}
//#endregion
//#region src/lib/app/markdown/renderers/table/MdTableRow.svelte
function MdTableRow($$renderer, $$props) {
	/**
	* @typedef {Object} Props
	* @property {import('svelte').Snippet} [children]
	*/
	/** @type {Props} */
	let { children } = $$props;
	$$renderer.push(`<tr>`);
	children?.($$renderer);
	$$renderer.push(`<!----></tr>`);
}
//#endregion
//#region src/lib/app/markdown/Markdown.svelte
function preprocess(src) {
	return src.replaceAll(/\[([^\]]*)\]\(\s*javascript:[^)]*\)/gim, "*link removed*").replaceAll(/^\s*\[[^\]]+\]:\s*javascript:.*$/gim, "*link removed*");
}
marked.setOptions({
	gfm: true,
	breaks: false
});
marked.use(linkify, { extensions: [spoiler_default((params) => {
	if (params.type == "spoiler") return {
		type: "spoiler",
		raw: params.raw,
		title: params.options,
		tokens: []
	};
	return null;
}), subSupscriptExtension((params) => {
	if (params.type == "subscript") return {
		type: "subscript",
		raw: params.raw,
		text: params.content
	};
	if (params.type == "superscript") return {
		type: "superscript",
		raw: params.raw,
		text: params.content
	};
	return null;
})] });
var renderers = {
	heading: MdHeading,
	image: MdImage,
	link: MdLink,
	blockquote: MdQuote,
	hr: MdHr,
	html: MdHtml,
	code: MdCode,
	list: MdList,
	spoiler: MdSpoiler,
	table: MdTable,
	tablebody: MdTableBody,
	tablecell: MdTableCell,
	tablehead: MdTableHead,
	tablerow: MdTableRow,
	paragraph: MdParagraph,
	listitem: MdListItem,
	subscript: MdSubscript,
	superscript: MdSuperscript,
	space: MdParagraph,
	list_item: MdListItem,
	text: MdText,
	escape: MdText,
	em: MdEm,
	strong: MdStrong,
	del: MdDel,
	codespan: MdCodespan
};
var inlineRenderers = {
	paragraph: MdParagraph,
	subscript: MdSubscript,
	superscript: MdSuperscript,
	text: MdText,
	link: MdLink,
	em: MdEm,
	strong: MdStrong,
	del: MdDel,
	codespan: MdCodespan
};
function Markdown($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { source = "", inline = false, noStyle = false, style = "", class: clazz = "", rendererOptions = { autoloadImages: true } } = $$props;
		setContext("options", {
			...rendererOptions,
			inline,
			noStyle
		});
		let tokens = derived(() => marked.lexer(preprocess(source)));
		element($$renderer, inline ? "div" : "article", () => {
			$$renderer.push(` dir="auto"${attr_class(clsx([!noStyle && "wrap-break-word space-y-4 leading-normal font-reading", clazz]))}${attr_style(style)}`);
		}, () => {
			MdTree($$renderer, {
				tokens: tokens(),
				renderers: inline ? inlineRenderers : renderers
			});
		});
	});
}
//#endregion
//#region src/lib/ui/shared/toast/toasts.ts
var toastColors = {
	error: "material-error",
	warning: "material-warning",
	success: "material-success",
	info: "material-info"
};
var toasts = writable([]);
function toast({ title, content, type = "info", duration = 5e3, loading = false, long = false, action }) {
	let id = 0;
	toasts.update((toasts) => {
		id = Math.max(0, ...toasts.map((t) => t.id)) + 1;
		return [...toasts, {
			id,
			content,
			title,
			type,
			loading,
			long,
			action
		}];
	});
	setTimeout(() => {
		toasts.update((toasts) => toasts.filter((toast) => toast.id != id));
	}, duration);
	return id;
}
var removeToast = (id) => toasts.update((toasts) => toasts.filter((toast) => toast.id != id));
//#endregion
//#region src/lib/ui/shared/toast/Toast.svelte
function Toast($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { toast } = $$props;
		$$renderer.push(`<div${attr_class(clsx([
			toastColors[toast.type],
			"relative rounded-2xl overflow-hidden flex flex-row items-center gap-1 px-2 py-2 backdrop-blur-3xl",
			"bg-white dark:bg-zinc-925 shadow-lg",
			toast.long ? "w-full max-w-lg" : "w-80"
		]))}>`);
		if (toast.loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative m-2 ml-4 shrink-0">`);
			Spinner($$renderer, { width: 20 });
			$$renderer.push(`<!----></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			Icon($$renderer, {
				size: "28",
				mini: true,
				class: ["relative self-center shrink-0 p-1 rounded-lg"],
				src: toast.type == "info" ? InformationCircle : toast.type == "success" ? CheckCircle : toast.type == "warning" ? ExclamationTriangle : toast.type == "error" ? ExclamationCircle : ExclamationCircle
			});
		}
		$$renderer.push(`<!--]--> <div class="flex flex-col break-words max-w-full text-inherit">`);
		if (toast.title) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<h1 class="text-base font-semibold">${escape_html(toast.title)}</h1>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Markdown($$renderer, {
			source: toast.content,
			class: toast.long ? "text-[15px]" : "text-sm font-medium"
		});
		$$renderer.push(`<!----></div> <div class="absolute top-0 right-0 flex items-center gap-1 m-1">`);
		if (toast.action) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="rounded-lg w-max transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 cursor-pointer">`);
			Icon($$renderer, {
				src: Check,
				size: "20",
				micro: true
			});
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button class="rounded-lg w-max transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 cursor-pointer text-slate-600 dark:text-zinc-400">`);
		Icon($$renderer, {
			src: XMark,
			size: "16",
			micro: true
		});
		$$renderer.push(`<!----></button></div></div>`);
	});
}
//#endregion
//#region src/lib/ui/shared/toast/ToastContainer.svelte
function ToastContainer($$renderer) {
	var $$store_subs;
	$$renderer.push(`<div class="fixed right-0 bottom-0 flex flex-col items-end justify-end z-200 p-4 group overflow-hidden h-screen min-w-96 pointer-events-none gap-4"><!--[-->`);
	const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let toast = each_array[$$index];
		$$renderer.push(`<div class="pointer-events-auto transition-all duration-300">`);
		Toast($$renderer, { toast });
		$$renderer.push(`<!----></div>`);
	}
	$$renderer.push(`<!--]--></div>`);
	if ($$store_subs) unsubscribe_stores($$store_subs);
}
//#endregion
//#region src/lib/ui/shared/badge/Badge.svelte
function Badge($$renderer, $$props) {
	const badgeColor = {
		"red-subtle": "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400",
		"green-subtle": `bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400`,
		"yellow-subtle": "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
		"gray-subtle": "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300",
		"blue-subtle": "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
		custom: ""
	};
	const badgeRoundness = {
		full: "rounded-full",
		md: "rounded-md",
		custom: ""
	};
	let { label = "", color = "gray-subtle", rounding = "full", allowIconOnly = false, class: clazz = "", icon, children, $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<span${attributes({
		...rest,
		class: clsx([
			allowIconOnly && "max-md:px-1.5 max-md:py-1.5",
			"text-xs font-medium flex items-center gap-1 ring-1 ring-black/20 dark:ring-white/20 ring-inset px-2 py-1",
			badgeRoundness[rounding],
			badgeColor[color],
			clazz
		]),
		title: label
	})}>`);
	icon?.($$renderer);
	$$renderer.push(`<!----> <span${attr_class(clsx(allowIconOnly ? "sr-only md:contents" : "contents"))}>`);
	children?.($$renderer);
	$$renderer.push(`<!----></span></span>`);
}
//#endregion
//#region src/lib/ui/shared/note/Note.svelte
function Note($$renderer, $$props) {
	let { content = void 0, children, class: clazz = "" } = $$props;
	Material($$renderer, {
		color: "info",
		rounding: "2xl",
		class: ["flex flex-row items-center px-3 py-2.5", clazz],
		children: ($$renderer) => {
			Icon($$renderer, {
				src: InformationCircle,
				size: "20",
				micro: true,
				class: "inline-block rounded-lg clear-both float-left mr-2"
			});
			$$renderer.push(`<!----> <div class="flex flex-col md:flex-row items-center w-full">`);
			if (children) {
				$$renderer.push("<!--[0-->");
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			} else if (content) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<p class="text-left justify-self-start">${escape_html(content)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		},
		$$slots: { default: true }
	});
}
//#endregion
//#region src/lib/ui/shared/search/Search.svelte
function Search($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let items = [];
		/**
		* This is here so that the menu doesn't open as soon as it's mounted.
		*/
		let openMenu = false;
		let searching = false;
		let { query = "", selected = void 0, search, extractName, select = (item) => {
			if (item == null) return;
			selected = item;
			query = extractName(item);
			onselect?.(item);
		}, required, input, noresults, children, onselect, oninput, $$slots, $$events, ...rest } = $$props;
		const debounceFunc = debounce(async () => {
			searching = true;
			openMenu = true;
			items = await search(query);
			searching = false;
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="relative">`);
			{
				function target($$renderer, attachment) {
					if (input) {
						$$renderer.push("<!--[0-->");
						input($$renderer);
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						{
							function prefix($$renderer) {
								$$renderer.push(`<div class="h-5 flex items-center">`);
								Icon($$renderer, {
									src: MagnifyingGlass,
									mini: true,
									size: "16"
								});
								$$renderer.push(`<!----></div>`);
							}
							TextInput($$renderer, spread_props([
								{
									oninput: (e) => {
										searching = true;
										openMenu = true;
										oninput?.(e);
										debounceFunc();
									},
									onfocus: (e) => {
										searching = true;
										openMenu = true;
										oninput?.(e);
										debounceFunc();
									},
									required
								},
								rest,
								{
									inlineAffixes: true,
									get value() {
										return query;
									},
									set value($$value) {
										query = $$value;
										$$settled = false;
									},
									prefix,
									$$slots: { prefix: true }
								}
							]));
						}
					}
					$$renderer.push(`<!--]-->`);
				}
				Menu($$renderer, {
					get open() {
						return openMenu;
					},
					set open($$value) {
						openMenu = $$value;
						$$settled = false;
					},
					target,
					children: ($$renderer) => {
						if (searching) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="w-full h-24 grid place-items-center">`);
							Spinner($$renderer, { width: 24 });
							$$renderer.push(`<!----></div>`);
						} else if (items.length == 0) {
							$$renderer.push("<!--[1-->");
							$$renderer.push(`<div class="text-center h-24 grid place-items-center">`);
							if (noresults) {
								$$renderer.push("<!--[0-->");
								noresults($$renderer);
								$$renderer.push(`<!---->`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`No results found.`);
							}
							$$renderer.push(`<!--]--></div>`);
						} else {
							$$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--[-->`);
							const each_array = ensure_array_like(items);
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let item = each_array[$$index];
								if (children) {
									$$renderer.push("<!--[0-->");
									children($$renderer, {
										extractName,
										item,
										select
									});
									$$renderer.push(`<!---->`);
								} else {
									$$renderer.push("<!--[-1-->");
									MenuButton($$renderer, {
										onclick: () => select(item),
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(extractName(item))}`);
										},
										$$slots: { default: true }
									});
								}
								$$renderer.push(`<!--]-->`);
							}
							$$renderer.push(`<!--]-->`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						target: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			query,
			selected
		});
	});
}
//#endregion
//#region src/lib/app/auth/inbox.svelte.ts
var InboxService = class {
	POLL_INTERVAL = 240 * 1e3;
	#pollInterval = null;
	#profile;
	notifications = {
		applications: 0,
		inbox: 0,
		reports: 0
	};
	constructor(profile) {
		this.#profile = profile;
	}
	async init() {
		this.cleanup();
		this.notifications = await this.checkInbox();
		this.#pollInterval = setInterval(async () => {
			this.notifications = await this.checkInbox();
		}, this.POLL_INTERVAL);
	}
	cleanup() {
		if (this.#pollInterval) clearInterval(this.#pollInterval);
		this.#pollInterval = null;
	}
	clear() {
		this.notifications = {
			applications: 0,
			inbox: 0,
			reports: 0
		};
		return this.notifications;
	}
	async checkInbox() {
		if (!this.#profile.current.user || !this.#profile.current.jwt) return this.clear();
		const unreadsPromise = this.#profile.client.getUnreadCount().then((res) => res.mentions + res.private_messages + res.replies).catch(() => 0);
		const reportsPromise = !(this.#profile.client instanceof PiefedClient) && this.#profile.isMod() ? this.#profile.client.getReportCount({}).then((res) => res.comment_reports + res.post_reports + (res.private_message_reports ?? 0)).catch(() => 0) : Promise.resolve(0);
		const applicationsPromise = !(this.#profile.client instanceof PiefedClient) && this.#profile.isAdmin ? this.#profile.client.getUnreadRegistrationApplicationCount().then((res) => res.registration_applications).catch(() => 0) : Promise.resolve(0);
		const [unreads, reports, applications] = await Promise.all([
			unreadsPromise,
			reportsPromise,
			applicationsPromise
		]);
		return {
			inbox: unreads,
			reports,
			applications
		};
	}
};
var profile = new class Profile {
	static DONATION_CHECK_TIMEOUT = 3 * 1e3;
	static DONATION_REMINDER_INTERVAL = 375 * 24 * 60 * 60 * 1e3;
	meta = {
		profiles: [{
			id: 1,
			instance: DEFAULT_INSTANCE_URL,
			username: "Guest",
			color: "#505050",
			client: DEFAULT_CLIENT_TYPE
		}],
		profile: 1
	};
	#current = derived(() => this.meta.profiles.find((i) => i.id == this.meta.profile) ?? this.getDefaultProfile());
	#client = derived(() => client({
		auth: this.#current().jwt,
		clientType: this.#current().client,
		instanceURL: this.#current().instance
	}));
	get client() {
		return this.#client();
	}
	set client($$value) {
		return this.#client($$value);
	}
	inbox = new InboxService(this);
	getDefaultProfile() {
		return {
			id: -1,
			instance: DEFAULT_INSTANCE_URL,
			client: DEFAULT_CLIENT_TYPE
		};
	}
	constructor() {
		this.initCookieMigrate();
		this.donationPoll(Profile.DONATION_CHECK_TIMEOUT);
	}
	get current() {
		return this.#current();
	}
	set current(value) {
		if (!value) return;
		const index = this.meta.profiles.findLastIndex((i) => i.id === value.id);
		if (index != -1) this.meta.profiles[index] = value;
	}
	async initCookieMigrate() {
		if (!(public_env.PUBLIC_MIGRATE_COOKIE && this.meta.profiles.length == 0 && public_env.PUBLIC_INSTANCE_URL)) return;
	}
	donationPoll(delay) {
		return setTimeout(() => {
			if (this.current.user?.local_user_view.local_user.last_donation_notification) {
				const donationDate = publishedToDate(this.current.user?.local_user_view.local_user.last_donation_notification);
				if (Date.now() - donationDate.getTime() > Profile.DONATION_REMINDER_INTERVAL) {
					toast({
						content: "Your account's server runs Lemmy, and the developers are requesting donations. They are able to develop Lemmy as an open source platform, free of tracking and ads, thanks to the generosity of its users.\n\nAnnually, they ask you to consider donating to support their work, and allow them to continue maintaining and improving Lemmy.\n\n[Donate](https://join-lemmy.org/donate)\n\n*Note: this is a donation to Lemmy, not Photon.*",
						duration: 3600 * 1e3,
						long: true
					});
					fetch(`${instanceToURL(this.current.instance)}/api/v3/user/donation_dialog_shown`, {
						method: "POST",
						headers: { authorization: `Bearer ${this.current.jwt}` }
					});
				}
			}
		}, delay);
	}
	async fetchUserData() {
		const startId = this.#current().id;
		if (this.#current().jwt) {
			site.data = void 0;
			const res = await fetchUserContext(this.#current().jwt, this.#current().instance, this.#current().client);
			if (!res?.user) toast({
				content: "Your account's instance did not return your user data. Your login may have expired.",
				type: "error"
			});
			if (this.#current().id != startId) {
				console.error("profile was switched too fast, ID mismatch");
				return;
			}
			site.data = res?.site;
			this.#current().user = res?.user;
			if (this.current.user) {
				this.#current().avatar = res?.user?.local_user_view.person.avatar;
				this.#current().username = res?.user?.local_user_view.person.name;
			}
			this.inbox.init();
		}
		return this;
	}
	async add(jwt, instance, type) {
		try {
			const user = await fetchUserContext(jwt, instance, type);
			if (!user?.user) throw new Error("No user data received");
			const id = Math.max(...this.meta.profiles.map((p) => p.id), 0) + 1;
			this.meta.profiles.unshift({
				id,
				instance,
				jwt,
				username: user.user.local_user_view.person.name,
				avatar: user.user.local_user_view.person.avatar,
				client: type
			});
			this.meta.profile = id;
			return user;
		} catch (err) {
			toast({
				content: errorMessage(err),
				type: "error"
			});
			return null;
		}
	}
	remove(id) {
		this.meta.profiles.splice(this.meta.profiles.findIndex((p) => p.id == id), 1);
		if (id == this.meta.profile) this.meta.profile = -1;
	}
	move(id, up) {
		try {
			const index = this.meta.profiles.findIndex((i) => i.id == id);
			this.meta.profiles = moveItem(this.meta.profiles, index, index + (up ? -1 : 1));
		} catch {}
	}
	isMod(community) {
		if (!community) return (this.#current().user?.moderates.length ?? 0) > 0;
		if (community.local && this.isAdmin) return true;
		return this.#current().user?.moderates.some((m) => m.community.id === community.id) ?? false;
	}
	get isAdmin() {
		return site.data?.admins.some((i) => i.person.id == this.#current().user?.local_user_view.person.id) ?? false;
	}
	get isDefaultProfile() {
		return !this.#current().jwt && this.#current().instance == DEFAULT_INSTANCE_URL;
	}
	mainEffect = () => {};
}();
async function fetchUserContext(jwt, instance, type) {
	const sitePromise = client({
		instanceURL: instance,
		auth: jwt,
		clientType: type
	}).getSite();
	const timer = setTimeout(() => toast({
		content: `Still loading your user data...`,
		type: "warning",
		loading: true
	}), 5e3);
	const site = await sitePromise.then((r) => {
		clearTimeout(timer);
		return r;
	}).catch((e) => {
		toast({ content: `Failed to contact the instance. ${e}` });
	});
	if (!site) return;
	return {
		user: site.my_user,
		site
	};
}
//#endregion
//#region src/lib/api/lemmy/rewrite.ts
function fromGetPosts(getPosts) {
	return {
		...getPosts,
		type_: getPosts.type_ == "Popular" ? "All" : getPosts.type_
	};
}
function toListingType(listingType) {
	if (listingType == "Popular") listingType = "All";
	return listingType;
}
//#endregion
//#region src/lib/api/lemmy/adapter.ts
var LemmyClientConstants = { password: {
	minLength: 8,
	maxLength: 60
} };
function createLemmyClient(baseUrl, args) {
	const client = new LemmyHttp(baseUrl, args);
	return new Proxy({
		type: {
			name: "lemmy",
			baseUrl: "/api/v3"
		},
		async search(params) {
			return await client.search({
				...params,
				listing_type: toListingType(params.listing_type)
			});
		},
		async listCommunities(params) {
			return await client.listCommunities({
				...params,
				type_: toListingType(params.type_)
			});
		},
		async getPosts(params) {
			return await client.getPosts(fromGetPosts(params));
		},
		async getComments(params) {
			return await client.getComments({
				...params,
				type_: toListingType(params.type_)
			});
		}
	}, { get: (target, prop, receiver) => {
		const value = Reflect.get(target, prop, receiver);
		if (value !== void 0) return value;
		const clientValue = client[prop];
		if (typeof clientValue === "function") return clientValue.bind(client);
		return clientValue;
	} });
}
var LemmyClient = class LemmyClient {
	static constants = LemmyClientConstants;
	#proxy;
	constructor(baseUrl, args) {
		this.#proxy = createLemmyClient(baseUrl, args);
		return new Proxy(this, { get: (target, prop) => {
			if (prop === "constructor") return LemmyClient;
			return target.#proxy[prop];
		} });
	}
};
//#endregion
//#region src/lib/api/threadlight/adapter.ts
function mapUser(u) {
	return {
		person: {
			id: u.id,
			name: u.display_name ?? u.username,
			display_name: u.display_name ?? void 0,
			avatar: u.avatar_url ?? void 0,
			banner: u.banner_url ?? void 0,
			bio: u.bio ?? void 0,
			published: u.created_at,
			updated: u.updated_at ?? void 0,
			actor_id: `${instanceToURL(instance.data)}/u/${u.username}`,
			local: true,
			deleted: u.is_deleted,
			matrix_user_id: void 0,
			admin: (u.role ?? u.trust_level ?? 0) >= 100,
			bot_account: false,
			ban_expires: void 0,
			banned: false,
			instance_id: 1
		},
		counts: {
			id: u.id,
			person_id: u.id,
			post_count: u.post_count ?? 0,
			comment_count: u.comment_count ?? 0,
			post_score: u.like_count ?? 0,
			comment_score: 0
		}
	};
}
function mapPost(p) {
	return {
		post: {
			id: p.id,
			name: p.title,
			body: p.body ?? void 0,
			url: void 0,
			embed_title: void 0,
			embed_description: void 0,
			embed_video_url: void 0,
			thumbnail_url: void 0,
			nsfw: p.is_nsfw,
			published: p.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
			updated: p.updated_at ?? void 0,
			deleted: p.is_deleted,
			removed: p.archived_at != null,
			locked: p.locked,
			stickied: p.sticky,
			language_id: 1,
			featured_community: false,
			featured_local: false,
			community_id: 1,
			creator_id: p.author_id,
			ap_id: "",
			local: true,
			embed_html: void 0
		},
		creator_banned_from_community: false,
		counts: {
			id: p.id,
			post_id: p.id,
			comments: 0,
			score: p.interaction_count,
			upvotes: p.cumulative_interactions,
			downvotes: 0,
			featured_community: false,
			featured_local: false,
			hot_rank: 0,
			hot_rank_active: 0,
			newest_comment_time: p.created_at ?? void 0,
			newest_comment_time_necro: p.created_at ?? void 0,
			published: p.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
			read_comments: 0,
			score_time: 0,
			upvotes_time: 0,
			downvotes_time: 0
		},
		creator: void 0,
		community: void 0
	};
}
function mapCommunity(c) {
	return {
		community: {
			id: c.id,
			name: c.slug,
			title: c.name,
			description: c.description ?? void 0,
			icon: c.icon_url ?? void 0,
			banner: c.banner_url ?? void 0,
			removed: false,
			published: c.created_at,
			updated: c.updated_at ?? void 0,
			deleted: false,
			nsfw: c.is_private ?? c.invite_only ?? false,
			actor_id: "",
			local: true,
			hidden: false,
			posting_restricted_to_mods: false,
			instance_id: 1,
			only_followers_can_vote: false
		},
		counts: {
			id: c.id,
			community_id: c.id,
			subscribers: c.member_count,
			posts: c.post_count ?? 0,
			comments: 0,
			published: c.created_at,
			users_active_day: 0,
			users_active_half_year: 0,
			users_active_month: 0,
			users_active_week: 0,
			hot_rank: 0,
			subscribers_local: 0
		},
		subscribed: "NotSubscribed",
		blocked: false
	};
}
var ThreadlightClient = class extends BaseClient {
	#baseUrl = "";
	constructor(baseUrl, args) {
		super();
		this.#baseUrl = baseUrl;
	}
	async #api(path, options = {}) {
		let url = `${this.#baseUrl.replace(/\/$/, "")}/api/v1${path}`;
		if (options.params) {
			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(options.params)) if (value !== void 0 && value !== "") searchParams.set(key, value);
			const qs = searchParams.toString();
			if (qs) url += `?${qs}`;
		}
		const init = {
			method: options.method ?? "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			}
		};
		if (options.body && options.method !== "GET") init.body = JSON.stringify(options.body);
		const res = await fetch(url, init);
		if (!res.ok && !options.allowNonOk) {
			const errBody = await res.text().catch(() => "");
			throw new Error(errBody || `HTTP ${res.status}`);
		}
		if ((res.headers.get("content-type") ?? "").includes("application/json")) return await res.json();
		return { message: await res.text() };
	}
	async getSite() {
		let about;
		try {
			about = await this.#api("/about");
		} catch {}
		if (!about) return {
			site_view: {
				site: {
					id: 0,
					name: "Threadlight",
					sidebar: "",
					published: (/* @__PURE__ */ new Date()).toISOString(),
					updated: void 0,
					icon: void 0,
					banner: void 0,
					actor_id: "",
					last_refreshed_at: (/* @__PURE__ */ new Date()).toISOString(),
					inbox_url: "",
					public_key: "",
					private_key: void 0,
					instance_id: 1,
					description: "",
					sidebar_html: void 0
				},
				counts: {
					comments: 0,
					communities: 0,
					posts: 0,
					users: 0,
					users_active_day: 0,
					users_active_half_year: 0,
					users_active_month: 0,
					users_active_week: 0,
					id: 0,
					site_id: 0
				}
			},
			admins: [],
			all_languages: [],
			custom_emojis: [],
			discussion_languages: [],
			taglines: [],
			version: "0.19.4",
			my_user: void 0
		};
		let myUser;
		try {
			const sessionData = await this.#api("/auth/session");
			if (sessionData?.user) myUser = {
				local_user_view: mapUser(sessionData.user),
				follows: [],
				moderates: [],
				community_blocks: [],
				person_blocks: [],
				discussion_languages: [1]
			};
		} catch {}
		return {
			site_view: {
				site: {
					id: 1,
					name: about.instance_name,
					sidebar: about.description,
					published: (/* @__PURE__ */ new Date()).toISOString(),
					updated: void 0,
					icon: void 0,
					banner: void 0,
					actor_id: "",
					last_refreshed_at: (/* @__PURE__ */ new Date()).toISOString(),
					inbox_url: "",
					public_key: "",
					private_key: void 0,
					instance_id: 1,
					description: about.description,
					sidebar_html: void 0
				},
				counts: {
					comments: 0,
					communities: 0,
					posts: 0,
					users: 0,
					users_active_day: 0,
					users_active_half_year: 0,
					users_active_month: 0,
					users_active_week: 0,
					id: 1,
					site_id: 1
				}
			},
			admins: [],
			all_languages: [],
			custom_emojis: [],
			discussion_languages: [],
			taglines: [],
			version: about.version || "0.19.4",
			my_user: myUser
		};
	}
	async getLoggedInUser() {
		try {
			return await this.#api("/auth/session");
		} catch {
			return;
		}
	}
	async login(form) {
		const res = await this.#api("/auth/login", {
			method: "POST",
			body: {
				email: form.username_or_email,
				password: form.password
			}
		});
		if ("error" in res) throw new Error(res.error);
		return {
			jwt: "session",
			registration_created: false,
			verify_email_sent: false
		};
	}
	async register(form) {
		const body = {
			username: form.username,
			email: form.email ?? "",
			password: form.password
		};
		if (form.show_nsfw !== void 0) body["is_nsfw"] = form.show_nsfw;
		const res = await this.#api("/auth/register", {
			method: "POST",
			body
		});
		if ("error" in res) throw new Error(res.error);
		return {
			jwt: "session",
			registration_created: false,
			verify_email_sent: false
		};
	}
	async saveUserSettings(form) {
		await this.#api("/users/settings", {
			method: "PUT",
			body: form
		});
		return { jwt: "" };
	}
	async getPosts(form) {
		const params = {};
		if (form.limit) params["limit"] = form.limit.toString();
		if (form.page) params["page"] = form.page.toString();
		if (form.community_id) params["community_id"] = form.community_id.toString();
		if (form.sort) {
			if (form.sort === "Hot") params["sort"] = "hot";
			else if (form.sort === "New") params["sort"] = "new";
			else if (form.sort === "Top") params["sort"] = "top";
			else if (form.sort === "TopDay") params["sort"] = "top_day";
		}
		const data = await this.#api("/posts", { params });
		return {
			posts: (Array.isArray(data) ? data : data.posts ?? []).map(mapPost),
			next_page: void 0
		};
	}
	async getPost(form) {
		return {
			post_view: mapPost(await this.#api(`/posts/${form.id}`)),
			community_view: void 0,
			moderators: [],
			cross_posts: []
		};
	}
	async createPost(form) {
		const body = {
			title: form.name,
			body: form.body ?? "",
			is_nsfw: form.nsfw ?? false
		};
		const mediaId = form.media_id;
		if (mediaId !== void 0) body["media_id"] = mediaId;
		return { post_view: mapPost((await this.#api("/posts", {
			method: "POST",
			body
		})).post) };
	}
	async editPost(form) {
		return { post_view: mapPost((await this.#api(`/posts/${form.post_id}`, {
			method: "PUT",
			body: {
				title: form.name,
				body: form.body ?? "",
				is_nsfw: form.nsfw ?? false
			}
		})).post) };
	}
	async deletePost(form) {
		await this.#api(`/posts/${form.post_id}`, { method: "DELETE" });
		return {};
	}
	async likePost(form) {
		return { post_view: mapPost((await this.#api(`/posts/${form.post_id}/like`, {
			method: "POST",
			body: { score: form.score }
		})).post) };
	}
	async savePost(form) {
		return { post_view: mapPost((await this.#api(`/posts/${form.post_id}/bookmark`, {
			method: "POST",
			body: { save: form.save }
		})).post) };
	}
	async getCommunities(form) {
		const params = {};
		if (form.limit) params["limit"] = form.limit.toString();
		if (form.page) params["page"] = form.page.toString();
		return { communities: (await this.#api("/communities", { params }) ?? []).map(mapCommunity) };
	}
	async getCommunity(form) {
		return {
			community_view: mapCommunity(await this.#api(`/communities/${form.id}`)),
			moderators: [],
			online: 0,
			discussion_languages: []
		};
	}
	async followCommunity(form) {
		const endpoint = form.follow ? "join" : "leave";
		await this.#api(`/communities/${form.community_id}/${endpoint}`, { method: "POST" });
		return {};
	}
	async getPerson(form) {
		const identifier = form.username ?? form.person_id;
		return {
			person_view: mapUser((await this.#api(`/users/${identifier}`)).user),
			comments: [],
			posts: [],
			moderates: []
		};
	}
	async getPersonDetails(form) {
		return this.getPerson(form);
	}
	async search(form) {
		const params = { q: form.q };
		if (form.limit) params["limit"] = form.limit.toString();
		if (form.page) params["page"] = form.page.toString();
		return {
			posts: (await this.#api("/search", { params }) ?? []).map(mapPost),
			comments: [],
			communities: [],
			users: [],
			type_: form.type_
		};
	}
	async searchPosts(params) {
		const apiParams = { q: params.q };
		if (params.author) apiParams["author"] = params.author;
		if (params.community) apiParams["community"] = params.community;
		if (params.tags) apiParams["tag"] = params.tags;
		if (params.date_from) apiParams["date_from"] = params.date_from;
		if (params.date_to) apiParams["date_to"] = params.date_to;
		if (params.mood) apiParams["mood"] = params.mood;
		if (params.content_type) apiParams["content_type"] = params.content_type;
		if (params.is_educational !== void 0) apiParams["is_educational"] = params.is_educational;
		if (params.is_nsfw !== void 0) apiParams["is_nsfw"] = params.is_nsfw;
		if (params.sort) apiParams["sort"] = params.sort;
		if (params.page) apiParams["page"] = params.page.toString();
		if (params.limit) apiParams["limit"] = params.limit.toString();
		const raw = await this.#api("/search/posts", { params: apiParams });
		const results = (raw.results ?? []).map((p) => ({
			id: p.id,
			type: "post",
			title: p.title,
			body: p.body,
			snippet: p.headline || void 0,
			author: p.author_id ? {
				id: p.author_id,
				name: p.author_name ?? ""
			} : void 0,
			community: p.community_slug ? {
				id: 0,
				name: p.community_slug,
				slug: p.community_slug
			} : void 0,
			tags: p.tag_names ? p.tag_names.split(",").filter((n) => n).map((name) => ({
				id: 0,
				name
			})) : [],
			score: p.interaction_count,
			comment_count: p.comment_count ?? 0,
			created_at: p.created_at,
			is_nsfw: p.is_nsfw,
			is_educational: p.is_educational,
			mood: p.mood,
			content_type: p.content_type
		}));
		return {
			results,
			total: raw.total ?? results.length,
			page: raw.page ?? 1,
			limit: raw.limit ?? 20,
			facets: raw.facets
		};
	}
	async searchUsers(params) {
		const apiParams = { q: params.q };
		if (params.page) apiParams["page"] = params.page.toString();
		if (params.limit) apiParams["limit"] = params.limit.toString();
		const raw = await this.#api("/search/users", { params: apiParams });
		const results = (raw.results ?? []).map((u) => ({
			id: u.id,
			type: "user",
			title: u.display_name ?? u.username ?? "",
			body: u.bio ?? void 0,
			avatar_url: u.avatar_url ?? null,
			post_count: u.post_count ?? 0,
			created_at: u.created_at
		}));
		return {
			results,
			total: raw.total ?? results.length,
			page: raw.page ?? 1,
			limit: raw.limit ?? 20
		};
	}
	async searchCommunities(params) {
		const apiParams = { q: params.q };
		if (params.page) apiParams["page"] = params.page.toString();
		if (params.limit) apiParams["limit"] = params.limit.toString();
		const raw = await this.#api("/search/communities", { params: apiParams });
		const results = (raw.results ?? []).map((c) => ({
			id: c.id,
			type: "community",
			title: c.name ?? c.slug ?? "",
			body: c.description ?? void 0,
			community: c.slug ? {
				id: c.id,
				name: c.name ?? c.slug,
				slug: c.slug
			} : void 0,
			avatar_url: c.icon_url ?? null,
			member_count: c.member_count ?? 0,
			post_count: c.post_count ?? 0,
			created_at: c.created_at
		}));
		return {
			results,
			total: raw.total ?? results.length,
			page: raw.page ?? 1,
			limit: raw.limit ?? 20
		};
	}
	async searchSuggest(q) {
		return this.#api("/search/suggest", { params: { q } });
	}
	async getReplies(form) {
		return { replies: (await this.#api("/notifications", { params: { page: (form.page ?? 1).toString() } }) ?? []).map((n) => ({
			comment_reply: {
				id: n.id,
				recipient_id: n.user_id,
				comment_id: n.id,
				read: n.is_read,
				published: n.created_at,
				updated: void 0
			},
			comment: {
				id: n.id,
				creator_id: n.actor_id ?? n.user_id,
				post_id: n.post_id ?? 0,
				content: n.body,
				published: n.created_at,
				updated: void 0,
				deleted: false,
				removed: false,
				distinguished: false,
				path: "",
				local: true,
				ap_id: "",
				language_id: 1
			},
			creator: {
				id: n.actor_id ?? n.user_id,
				name: "",
				display_name: void 0,
				avatar: void 0,
				banned: false,
				published: n.created_at,
				actor_id: "",
				local: true,
				deleted: false,
				instance_id: 1
			},
			post: {
				id: n.post_id ?? 0,
				name: "",
				creator_id: 0,
				published: n.created_at,
				updated: void 0,
				nsfw: false,
				removed: false,
				deleted: false,
				local: true,
				locked: false,
				embed_title: void 0,
				embed_description: void 0,
				embed_video_url: void 0,
				thumbnail_url: void 0,
				ap_id: "",
				language_id: 1,
				featured_community: false,
				featured_local: false,
				url: void 0,
				body: void 0,
				community_id: 1
			},
			community: {
				id: 0,
				name: "",
				title: "",
				description: void 0,
				removed: false,
				deleted: false,
				published: n.created_at,
				updated: void 0,
				actor_id: "",
				local: true,
				nsfw: false,
				posting_restricted_to_mods: false,
				instance_id: 1,
				icon: void 0,
				banner: void 0,
				hidden: false,
				visibility: "Public"
			},
			recipient: {
				id: n.user_id,
				name: "",
				display_name: void 0,
				avatar: void 0,
				banned: false,
				published: n.created_at,
				actor_id: "",
				local: true,
				deleted: false,
				instance_id: 1
			},
			counts: {
				comment_id: n.id,
				score: 0,
				upvotes: 0,
				downvotes: 0,
				child_count: 0,
				hot_rank: 0,
				hot_rank_active: 0,
				reports: 0,
				score_tally: 0
			},
			creator_banned_from_community: false,
			creator_is_moderator: false,
			creator_blocked: false,
			subscribed: "NotSubscribed",
			saved: false
		})) };
	}
	async getPersonMentions(form) {
		return { mentions: [] };
	}
	async markAllAsRead() {
		await this.#api("/notifications/read-all", { method: "PUT" });
		return { replies: [] };
	}
	async markPersonMentionAsRead(form) {
		await this.#api(`/notifications/${form.person_mention_id}/read`, { method: "PUT" });
		return {};
	}
	async markCommentReplyAsRead(form) {
		await this.#api(`/notifications/${form.comment_reply_id}/read`, { method: "PUT" });
		return {};
	}
	async getUnreadCount() {
		return {
			replies: (await this.#api("/notifications/unread-count")).count,
			mentions: 0,
			private_messages: 0
		};
	}
	async getReportCount(form) {
		return {
			community_id: void 0,
			comment_reports: 0,
			post_reports: 0,
			private_message_reports: 0
		};
	}
	async getComments(form) {
		return { comments: [] };
	}
	async createComment(form) {
		return { comment_view: {
			comment: {
				id: 0,
				creator_id: 0,
				post_id: form.post_id,
				content: form.content || "",
				published: (/* @__PURE__ */ new Date()).toISOString(),
				updated: void 0,
				deleted: false,
				removed: false,
				distinguished: false,
				path: "",
				local: true,
				ap_id: ""
			},
			creator: {
				id: 0,
				name: "",
				display_name: void 0,
				avatar: void 0,
				banned: false,
				published: (/* @__PURE__ */ new Date()).toISOString(),
				actor_id: "",
				local: true,
				deleted: false,
				admin: false,
				bot_account: false,
				instance_id: 1
			},
			post: {
				id: form.post_id,
				name: "",
				creator_id: 0,
				published: (/* @__PURE__ */ new Date()).toISOString(),
				updated: void 0,
				nsfw: false,
				removed: false,
				deleted: false,
				local: true,
				locked: false,
				embed_title: void 0,
				embed_description: void 0,
				embed_video_url: void 0,
				thumbnail_url: void 0,
				ap_id: "",
				language_id: 0,
				featured_community: false,
				featured_local: false,
				url: void 0,
				body: void 0,
				alt_text: void 0
			},
			community: {
				id: 0,
				name: "",
				title: "",
				description: void 0,
				removed: false,
				deleted: false,
				published: (/* @__PURE__ */ new Date()).toISOString(),
				updated: void 0,
				actor_id: "",
				local: true,
				nsfw: false,
				posting_restricted_to_mods: false,
				instance_id: 1,
				icon: void 0,
				banner: void 0,
				hidden: false
			},
			counts: {
				id: 0,
				comment_id: 0,
				score: 0,
				upvotes: 0,
				downvotes: 0,
				child_count: 0,
				hot_rank: 0,
				hot_rank_active: 0,
				reports: 0,
				score_tally: 0
			},
			saved: false,
			creator_banned_from_community: false,
			creator_is_moderator: false,
			creator_blocked: false,
			subscribed: false
		} };
	}
	async editComment(form) {
		return this.createComment(form, void 0);
	}
	async deleteComment(form) {
		console.warn("deleteComment: not supported by Threadlight backend (no comment system)");
		return { comment_view: {
			comment: {
				id: form.comment_id,
				creator_id: 0,
				post_id: 0,
				content: "",
				published: (/* @__PURE__ */ new Date()).toISOString(),
				updated: void 0,
				deleted: true,
				removed: false,
				distinguished: false,
				path: "",
				local: true,
				ap_id: "",
				language_id: 1
			},
			creator: {
				id: 0,
				name: "",
				display_name: void 0,
				avatar: void 0,
				banned: false,
				published: (/* @__PURE__ */ new Date()).toISOString(),
				actor_id: "",
				local: true,
				deleted: false,
				instance_id: 1
			},
			post: {
				id: 0,
				name: "",
				creator_id: 0,
				published: (/* @__PURE__ */ new Date()).toISOString(),
				updated: void 0,
				nsfw: false,
				removed: false,
				deleted: false,
				local: true,
				locked: false,
				embed_title: void 0,
				embed_description: void 0,
				embed_video_url: void 0,
				thumbnail_url: void 0,
				ap_id: "",
				language_id: 1,
				featured_community: false,
				featured_local: false,
				url: void 0,
				body: void 0,
				community_id: 1
			},
			community: {
				id: 0,
				name: "",
				title: "",
				description: void 0,
				removed: false,
				deleted: false,
				published: (/* @__PURE__ */ new Date()).toISOString(),
				updated: void 0,
				actor_id: "",
				local: true,
				nsfw: false,
				posting_restricted_to_mods: false,
				instance_id: 1,
				icon: void 0,
				banner: void 0,
				hidden: false,
				visibility: "Public"
			},
			counts: {
				comment_id: form.comment_id,
				score: 0,
				upvotes: 0,
				downvotes: 0,
				child_count: 0,
				hot_rank: 0,
				hot_rank_active: 0,
				reports: 0,
				score_tally: 0
			},
			saved: false,
			creator_banned_from_community: false,
			creator_is_moderator: false,
			creator_blocked: false,
			subscribed: "NotSubscribed"
		} };
	}
	async likeComment(form) {
		return this.deleteComment({ comment_id: form.comment_id });
	}
	async createCommunity(form) {
		return { community_view: mapCommunity(await this.#api("/communities", {
			method: "POST",
			body: {
				name: form.name,
				description: form.description ?? "",
				icon_url: form.icon ?? "",
				banner_url: form.banner ?? "",
				is_private: form.nsfw ?? false
			}
		})) };
	}
	async editCommunity(form) {
		return { community_view: mapCommunity(await this.#api(`/communities/${form.community_id}`, {
			method: "PUT",
			body: {
				name: form.title,
				description: form.description ?? "",
				icon_url: form.icon ?? "",
				banner_url: form.banner ?? ""
			}
		})) };
	}
	async deleteCommunity(form) {
		await this.#api(`/communities/${form.community_id}`, { method: "DELETE" });
		return {};
	}
	async banFromCommunity(form) {
		return { banned: true };
	}
	async addModToCommunity(form) {
		return { moderators: [] };
	}
	async transferCommunity(form) {
		return {};
	}
	async blockCommunity(form) {
		return {
			blocked: true,
			community_view: void 0
		};
	}
	async hideCommunity(form) {
		return { success: true };
	}
	async blockPerson(form) {
		return {
			blocked: true,
			person_view: void 0
		};
	}
	async resolveObject(form) {
		return {
			comment: void 0,
			community: void 0,
			post: void 0,
			person: void 0
		};
	}
	async markPrivateMessageAsRead(form) {
		return {};
	}
	async createPrivateMessage(form) {
		console.warn("createPrivateMessage: not supported by Threadlight backend (no private messages)");
		return {};
	}
	async listPrivateMessages(form) {
		console.warn("listPrivateMessages: not supported by Threadlight backend (no private messages)");
		return { private_messages: [] };
	}
	async transferSite(form) {
		return {};
	}
	async getSiteMetadata(form) {
		console.warn("getSiteMetadata: no Threadlight backend equivalent, returning stub");
		return { metadata: {
			description: void 0,
			image: void 0,
			title: void 0
		} };
	}
	async getModlog(form) {
		try {
			return {
				added: [],
				added_to_community: ((await this.#api("/modlog/controversial", { params: {
					limit: (form.limit ?? 20).toString(),
					offset: (((form.page ?? 1) - 1) * (form.limit ?? 20)).toString()
				} })).decisions ?? []).map((d) => ({
					mod_remove_post: {
						id: d.action?.id ?? 0,
						mod_person_id: d.action?.moderator_id ?? 0,
						post_id: d.action?.target_post_id ?? 0,
						reason: d.action?.reason ?? "",
						removed: d.action?.action_type === 1,
						when_: d.action?.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
					},
					post: {
						id: d.action?.target_post_id ?? 0,
						name: "",
						creator_id: d.action?.target_user_id ?? 0,
						published: d.action?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
						updated: void 0,
						nsfw: false,
						removed: false,
						deleted: false,
						local: true,
						locked: false,
						embed_title: void 0,
						embed_description: void 0,
						embed_video_url: void 0,
						thumbnail_url: void 0,
						ap_id: "",
						language_id: 1,
						featured_community: false,
						featured_local: false,
						url: void 0,
						body: void 0,
						community_id: 1
					},
					moderator: {
						id: d.action?.moderator_id ?? 0,
						name: "",
						display_name: void 0,
						avatar: void 0,
						banned: false,
						published: d.action?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
						actor_id: "",
						local: true,
						deleted: false,
						instance_id: 1
					},
					community: {
						id: 0,
						name: "",
						title: "",
						description: void 0,
						removed: false,
						deleted: false,
						published: d.action?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
						updated: void 0,
						actor_id: "",
						local: true,
						nsfw: false,
						posting_restricted_to_mods: false,
						instance_id: 1,
						icon: void 0,
						banner: void 0,
						hidden: false
					}
				})),
				admin_purged_comments: [],
				admin_purged_communities: [],
				admin_purged_posts: [],
				admin_purged_persons: [],
				banned: [],
				banned_from_community: [],
				featured_posts: [],
				locked_posts: [],
				mod_remove_comments: [],
				mod_remove_communities: [],
				mod_remove_posts: [],
				mod_remove_persons: [],
				mod_transfer_community: [],
				mod_transfer_site: [],
				removed_posts: [],
				restored_posts: [],
				mod_change_password: [],
				mod_remove_post_origin: []
			};
		} catch {
			return {
				added: [],
				added_to_community: [],
				admin_purged_comments: [],
				admin_purged_communities: [],
				admin_purged_posts: [],
				admin_purged_persons: [],
				banned: [],
				banned_from_community: [],
				featured_posts: [],
				locked_posts: [],
				mod_remove_comments: [],
				mod_remove_communities: [],
				mod_remove_posts: [],
				mod_remove_persons: [],
				mod_transfer_community: [],
				mod_transfer_site: [],
				removed_posts: [],
				restored_posts: [],
				mod_change_password: [],
				mod_remove_post_origin: []
			};
		}
	}
	async listPostReports(form) {
		return { post_reports: (await this.#api("/reports") ?? []).map((r) => ({
			post_report: {
				id: r.id,
				creator_id: r.reporter_id,
				post_id: r.post_id,
				original_post_name: "",
				original_post_body: void 0,
				reason: r.reason,
				resolved: r.status !== 0,
				resolved_id: r.resolved_by ?? void 0,
				published: r.created_at,
				updated: r.resolved_at ?? void 0
			},
			post: {
				id: r.post_id,
				name: "",
				creator_id: 0,
				published: r.created_at,
				updated: void 0,
				nsfw: false,
				removed: false,
				deleted: false,
				local: true,
				locked: false,
				embed_title: void 0,
				embed_description: void 0,
				embed_video_url: void 0,
				thumbnail_url: void 0,
				ap_id: "",
				language_id: 1,
				featured_community: false,
				featured_local: false,
				url: void 0,
				body: void 0,
				community_id: 1
			},
			community: void 0,
			creator: {
				id: r.reporter_id,
				name: "",
				display_name: void 0,
				avatar: void 0,
				banned: false,
				published: r.created_at,
				actor_id: "",
				local: true,
				deleted: false,
				instance_id: 1
			},
			post_creator: void 0,
			creator_banned_from_community: false,
			my_vote: 0,
			counts: {
				id: r.id,
				post_id: r.post_id,
				comments: 0,
				score: 0,
				upvotes: 0,
				downvotes: 0,
				featured_community: false,
				featured_local: false,
				hot_rank: 0,
				hot_rank_active: 0,
				newest_comment_time: r.created_at,
				newest_comment_time_necro: r.created_at,
				published: r.created_at,
				read_comments: 0,
				score_time: 0,
				upvotes_time: 0,
				downvotes_time: 0
			},
			resolver: r.resolved_by ? {
				id: r.resolved_by,
				name: "",
				display_name: void 0,
				avatar: void 0,
				banned: false,
				published: r.created_at,
				actor_id: "",
				local: true,
				deleted: false,
				instance_id: 1
			} : void 0
		})) };
	}
	async listCommentReports(form) {
		console.warn("listCommentReports: Threadlight backend only has post reports, returning empty");
		return { comment_reports: [] };
	}
	async resolvePostReport(form) {
		await this.#api(`/reports/${form.report_id}/resolve`, {
			method: "PUT",
			body: { resolved: form.resolved ?? true }
		});
		return {};
	}
	async resolveCommentReport(form) {
		return { comment_report_view: void 0 };
	}
	async getUnregenerateKeys() {
		console.warn("getUnregenerateKeys: no Threadlight backend equivalent");
		return { success: true };
	}
	async createSite(form) {
		console.warn("createSite: no Threadlight backend equivalent (use editSite for config)");
		return {};
	}
	async listMedia() {
		console.warn("listMedia: no Threadlight backend equivalent");
		return { media: [] };
	}
	async purgePerson(form) {
		return { success: true };
	}
	async purgeCommunity(form) {
		return { success: true };
	}
	async purgePost(form) {
		return { success: true };
	}
	async purgeComment(form) {
		return { success: true };
	}
	async getBannedPersons() {
		return { banned: (await this.#api("/blocks") ?? []).map((b) => ({ person: {
			id: b.blocked_id,
			name: "",
			display_name: void 0,
			avatar: void 0,
			banned: true,
			published: b.created_at,
			updated: void 0,
			actor_id: "",
			local: true,
			deleted: false,
			instance_id: 1
		} })) };
	}
	async addAdmin(form) {
		return { admins: [] };
	}
	async getUnreadRegistrationApplicationCount() {
		return { registration_applications: (await this.#api("/admin/invites") ?? []).filter((i) => i.used_by === null).length };
	}
	async listRegistrationApplications(form) {
		console.warn("listRegistrationApplications: Threadlight uses /admin/invites instead, returning empty");
		return { registration_applications: [] };
	}
	async approveRegistrationApplication(form) {
		return { registration_application: void 0 };
	}
	async getTags() {
		return { tags: (await this.#api("/tags") ?? []).map((t) => ({
			id: t.id,
			name: t.name,
			description: t.description,
			category: t.category,
			total_votes: t.total_votes ?? 0,
			vote_score: t.vote_score ?? 0,
			user_vote: t.user_vote ?? 0
		})) };
	}
	async voteOnTag(tagId, vote) {
		return this.#api(`/tags/${tagId}/vote`, {
			method: "POST",
			body: { vote }
		});
	}
	async removeTagVote(tagId) {
		return this.#api(`/tags/${tagId}/vote`, { method: "DELETE" });
	}
	async searchPostLikes(form) {
		return {
			posts: (await this.#api("/interactions/post/" + form.post_id) ?? []).filter((i) => i.interaction_type === 1).map((i) => ({
				post: {
					id: i.post_id,
					name: "",
					creator_id: i.user_id,
					published: i.created_at,
					updated: void 0,
					nsfw: false,
					removed: false,
					deleted: false,
					local: true,
					locked: false,
					embed_title: void 0,
					embed_description: void 0,
					embed_video_url: void 0,
					thumbnail_url: void 0,
					ap_id: "",
					language_id: 1,
					featured_community: false,
					featured_local: false,
					url: void 0,
					body: void 0,
					community_id: 1
				},
				creator: {
					id: i.user_id,
					name: "",
					display_name: void 0,
					avatar: void 0,
					banned: false,
					published: i.created_at,
					actor_id: "",
					local: true,
					deleted: false,
					instance_id: 1
				},
				community: void 0,
				counts: {
					id: i.id,
					post_id: i.post_id,
					comments: 0,
					score: 0,
					upvotes: 0,
					downvotes: 0,
					featured_community: false,
					featured_local: false,
					hot_rank: 0,
					hot_rank_active: 0,
					newest_comment_time: i.created_at,
					newest_comment_time_necro: i.created_at,
					published: i.created_at,
					read_comments: 0,
					score_time: 0,
					upvotes_time: 0,
					downvotes_time: 0
				},
				creator_banned_from_community: false,
				creator_is_moderator: false,
				creator_blocked: false,
				subscribed: "NotSubscribed",
				saved: false
			})),
			comments: [],
			communities: [],
			users: [],
			type_: "All"
		};
	}
	async getPersonPostsLiked(form) {
		console.warn("getPersonPostsLiked: no Threadlight backend equivalent (no /posts?liked_by param)");
		return {
			posts: [],
			next_page: void 0
		};
	}
	async getPersonPostsSaved(form) {
		console.warn("getPersonPostsSaved: no Threadlight backend equivalent (no /posts?saved_by param)");
		return {
			posts: [],
			next_page: void 0
		};
	}
	async featurePost(form) {
		return {};
	}
	async lockPost(form) {
		return {};
	}
	async removePost(form) {
		await this.#api(`/posts/${form.post_id}/remove`, {
			method: "POST",
			body: { reason: form.reason }
		});
		return {};
	}
	async removeComment(form) {
		return {};
	}
	async distinguishComment(form) {
		return {};
	}
	async distinguishPost(form) {
		return {};
	}
	async createPostReport(form) {
		await this.#api("/reports", {
			method: "POST",
			body: {
				post_id: form.post_id,
				category: 0,
				reason: form.reason
			}
		});
		return {};
	}
	async createCommentReport(form) {
		console.warn("createCommentReport: Threadlight backend only supports post reports (no comment reports)");
		return {};
	}
	async getComment(form) {
		return { comment_view: void 0 };
	}
	async getVotes(form) {
		return {
			type_: form.type_,
			comments: [],
			posts: []
		};
	}
	async getVote(form) {
		return {
			type_: void 0,
			comments: [],
			posts: []
		};
	}
	async createCommentLike(form) {
		return this.deleteComment({ comment_id: form.comment_id });
	}
	async getPostLikes(form) {
		return { post_likes: [] };
	}
	async getCommentLikes(form) {
		return { comment_likes: [] };
	}
	async saveComment(form) {
		return this.createComment({
			post_id: 0,
			content: ""
		});
	}
	async saveUserSettingsFast(form) {
		await this.saveUserSettings(form);
		return { success: true };
	}
	async changePassword(form) {
		return { jwt: "" };
	}
	async getPersonDetailsFast(form) {
		return this.getPerson(form);
	}
	async getSiteFast() {
		return this.getSite();
	}
	async getPostsFast(form) {
		return this.getPosts(form);
	}
	async getCommunityFast(form) {
		return this.getCommunity(form);
	}
	async getUnreadCountFast() {
		return this.getUnreadCount();
	}
	async markAllAsReadFast() {
		return this.markAllAsRead();
	}
	async searchFast(form) {
		return this.search(form);
	}
	async getSiteMetadataFast(form) {
		return this.getSiteMetadata(form);
	}
	async markCommentReplyAsReadFast(form) {
		return this.markCommentReplyAsRead(form);
	}
	async markPersonMentionAsReadFast(form) {
		return this.markPersonMentionAsRead(form);
	}
	async getRepliesFast(form) {
		return this.getReplies(form);
	}
	async getPersonMentionsFast(form) {
		return this.getPersonMentions(form);
	}
	async listCommunityModerators(form) {
		return { moderators: [] };
	}
	async getCommunityByName(form) {
		const community = (await this.#api("/communities", { params: { name: form.name } }) ?? [])[0];
		if (!community) throw new Error("Community not found");
		return this.getCommunity({ id: community.id });
	}
	async searchByName(form) {
		return this.search({ q: form.q });
	}
	async logout() {
		await this.#api("/auth/logout", { method: "DELETE" });
		return { jwt: "" };
	}
	async editSite(form) {
		await this.#api("/admin/config", {
			method: "PUT",
			body: {
				title: form.name,
				description: form.description ?? form.sidebar ?? "",
				invite_only: form.registration_mode === "RequireApplication",
				registration_open: form.registration_mode !== "Closed",
				unfair_threshold_pct: form.unfair_threshold_pct,
				unfair_penalty_amount: form.unfair_penalty_amount,
				unfair_min_reviews: form.unfair_min_reviews,
				unfair_penalty_cooldown_hrs: form.unfair_penalty_cooldown_hrs,
				min_trust_level_for_review_voting: form.min_trust_level_for_review_voting,
				min_trust_level_for_community_create: form.min_trust_level_for_community_create,
				min_trust_level_for_curator: form.min_trust_level_for_curator,
				credit_action_costs: form.credit_action_costs
			}
		});
		return {};
	}
	async generateTotpSecret() {
		return {
			totp_secret_url: "",
			totp_secret: ""
		};
	}
	async listLogins() {
		return [];
	}
	async listAllMedia(form) {
		return { media: [] };
	}
	async updateTotp(form) {
		return { enabled: true };
	}
	async removeCommunity(form) {
		return {};
	}
	async banPerson(form) {
		return {
			banned: true,
			person_view: void 0
		};
	}
	async getCaptcha() {
		return { ok: void 0 };
	}
	async deleteAccount(form) {
		return { jwt: "" };
	}
	async passwordReset(form) {
		await this.#api("/auth/password-reset/forgot", {
			method: "POST",
			body: { email: form.email }
		});
		return {};
	}
	async passwordChangeAfterReset(form) {
		await this.#api("/auth/password-reset/reset", {
			method: "POST",
			body: {
				token: form.token,
				password: form.password
			}
		});
		return { jwt: "session" };
	}
	async verifyEmail(form) {
		return { jwt: "" };
	}
	async getFederatedInstances() {
		return { federated_instances: {
			linked: [],
			allowed: [],
			blocked: []
		} };
	}
	async blockInstance(form) {
		return {
			blocked: true,
			instance_view: void 0
		};
	}
	/**
	* Upload an image file to the media server via multipart form.
	* Returns the created Media record.
	*/
	async uploadImage(file) {
		const formData = new FormData();
		formData.append("file", file);
		const url = `${this.#baseUrl.replace(/\/$/, "")}/api/v1/media/upload`;
		const res = await fetch(url, {
			method: "POST",
			credentials: "include",
			body: formData
		});
		if (!res.ok) {
			const errBody = await res.text().catch(() => "");
			throw new Error(errBody || `HTTP ${res.status}`);
		}
		return await res.json();
	}
	async deleteImage(form) {
		return { success: true };
	}
	async getPostReplies(form) {
		return { comments: [] };
	}
	async createCommentReportFast(form) {
		return this.createCommentReport(form);
	}
	async createCommunityFast(form) {
		return this.createCommunity(form);
	}
	async createPostFast(form) {
		return this.createPost(form);
	}
	async followCommunityFast(form) {
		return this.followCommunity(form);
	}
	async getCommunitiesFast(form) {
		return this.getCommunities(form);
	}
	async loginFast(form) {
		return this.login(form);
	}
	async registerFast(form) {
		return this.register(form);
	}
	async changePasswordFast(form) {
		return this.changePassword(form);
	}
	async getLists() {
		return this.#api("/lists");
	}
	async getList(id) {
		return this.#api(`/lists/${id}`);
	}
	async createList(data) {
		const body = {
			name: data.name,
			description: data.description,
			list_type: data.list_type === "follow" ? 0 : 1,
			visibility: data.visibility === "public" ? 1 : 0
		};
		return this.#api("/lists", {
			method: "POST",
			body
		});
	}
	async createAlgorithmicList(data) {
		const body = {
			name: data.name,
			description: data.description,
			list_type: data.list_type === "follow" ? 0 : 1,
			visibility: data.visibility === "public" ? 1 : 0,
			scope: data.scope,
			criteria: data.criteria,
			refresh: data.refresh
		};
		if (data.tag_id !== void 0) body["tag_id"] = data.tag_id;
		return this.#api("/lists/algorithmic", {
			method: "POST",
			body
		});
	}
	async deleteList(id) {
		await this.#api(`/lists/${id}`, { method: "DELETE" });
	}
	async addListMember(listId, data) {
		await this.#api(`/lists/${listId}/members`, {
			method: "POST",
			body: data
		});
	}
	async removeListMember(listId, userId) {
		await this.#api(`/lists/${listId}/members/${userId}`, { method: "DELETE" });
	}
	async subscribeList(listId) {
		await this.#api(`/lists/${listId}/subscribe`, { method: "POST" });
	}
	async addCollaborator(listId, data) {
		await this.#api(`/lists/${listId}/collaborators`, {
			method: "POST",
			body: data
		});
	}
	async removeCollaborator(listId, userId) {
		await this.#api(`/lists/${listId}/collaborators/${userId}`, { method: "DELETE" });
	}
	async getAffinities() {
		return this.#api("/affinity");
	}
	async getSimilarUsers(minScore) {
		const params = {};
		if (minScore !== void 0) params["min_score"] = minScore.toString();
		return this.#api("/affinity/similar", { params });
	}
	async getPlugins(reviewed) {
		const params = {};
		if (reviewed !== void 0) params["reviewed"] = reviewed.toString();
		return this.#api("/feed-plugins", { params });
	}
	async getPlugin(id) {
		return this.#api(`/feed-plugins/${id}`);
	}
	async uploadPlugin(formData) {
		const url = `${this.#baseUrl.replace(/\/$/, "")}/api/v1/feed-plugins`;
		const res = await fetch(url, {
			method: "POST",
			credentials: "include",
			body: formData
		});
		if (!res.ok) {
			const errBody = await res.text().catch(() => "");
			throw new Error(errBody || `HTTP ${res.status}`);
		}
		return await res.json();
	}
	async installPlugin(id) {
		await this.#api(`/feed-plugins/${id}/install`, { method: "POST" });
	}
	async uninstallPlugin(id) {
		await this.#api(`/feed-plugins/${id}/uninstall`, { method: "POST" });
	}
	async createPluginReview(id, data) {
		return this.#api(`/feed-plugins/${id}/review`, {
			method: "POST",
			body: data
		});
	}
	/**
	* Fetch controversial modlog decisions with review counts
	*/
	async getControversialDecisions(params = {}) {
		const apiParams = {};
		if (params.limit) apiParams["limit"] = params.limit.toString();
		if (params.offset) apiParams["offset"] = params.offset.toString();
		return this.#api("/modlog/controversial", { params: apiParams });
	}
	/**
	* Cast a fair/unfair review on a modlog action
	*/
	async castReview(actionId, vote) {
		return this.#api(`/modlog/${actionId}/review`, {
			method: "POST",
			body: { vote }
		});
	}
	/**
	* Get all reviews for a modlog action
	*/
	async getReviews(actionId) {
		return this.#api(`/modlog/${actionId}/reviews`);
	}
	/**
	* Get the current user's review for a modlog action
	*/
	async getMyReview(actionId) {
		try {
			return await this.#api(`/modlog/${actionId}/my-review`);
		} catch {
			return null;
		}
	}
	/**
	* Fetch all moderation actions
	*/
	async getModerationActions(params = {}) {
		const apiParams = {};
		if (params.limit) apiParams["limit"] = params.limit.toString();
		if (params.offset) apiParams["offset"] = params.offset.toString();
		return this.#api("/moderation/actions", { params: apiParams });
	}
	/**
	* Resolve a report using the Threadlight-native endpoint
	*/
	async resolveReport(reportId) {
		return this.#api(`/reports/${reportId}/resolve`, { method: "PUT" });
	}
	/**
	* Fetch reports from the Threadlight backend
	*/
	async getReports(params = {}) {
		const apiParams = {};
		if (params.limit) apiParams["limit"] = params.limit.toString();
		if (params.offset) apiParams["offset"] = params.offset.toString();
		if (params.status !== void 0) apiParams["status"] = params.status.toString();
		return this.#api("/reports", { params: apiParams });
	}
	/**
	* Get the current user's credit balance, streak, and daily quests.
	*/
	async getCreditBalance() {
		try {
			return await this.#api("/credits/balance");
		} catch {
			return {
				credits: 0,
				lifetime_credits: 0,
				streak: 0,
				quests: []
			};
		}
	}
	/**
	* Get the configured credit action costs.
	*/
	async getCreditCosts() {
		try {
			return await this.#api("/credits/costs");
		} catch {
			return {
				post_creation: 2,
				image_upload: 10,
				search: 0,
				private_message: 1,
				reaction: 0
			};
		}
	}
	/**
	* Complete a daily quest by type.
	*/
	async completeQuest(questType) {
		return this.#api("/credits/quests/complete", {
			method: "POST",
			body: { quest_type: questType }
		});
	}
	/**
	* Get treasury balance for a community (curator/moderator only).
	*/
	async getCommunityBalance(slug) {
		try {
			return await this.#api(`/communities/${slug}/balance`);
		} catch {
			return {
				community_slug: slug,
				balance: 0,
				total_earned: 0,
				total_spent: 0
			};
		}
	}
	/**
	* Get recent credit transactions for the current user.
	*/
	async getCreditTransactions(params = {}) {
		const apiParams = {};
		if (params.page) apiParams["page"] = params.page.toString();
		if (params.limit) apiParams["limit"] = params.limit.toString();
		return this.#api("/credits/transactions", { params: apiParams });
	}
};
//#endregion
//#region src/lib/api/client.svelte.ts
var SiteData = class {
	#data;
	get data() {
		return this.#data;
	}
	set data(value) {
		this.#data = value;
	}
};
var site = new SiteData();
async function customFetch(func, input, init, auth) {
	const f = func ? func : fetch;
	if (init) {
		init.headers = {
			...init.headers,
			"User-Agent": `Photon/2.4.0`,
			...auth ? { authorization: `Bearer ${auth}` } : {}
		};
		if (auth) init.cache = "no-store";
	}
	const res = await f(input, init);
	if (!res.ok) error(res.status, await res.text());
	return res;
}
function client({ instanceURL, func, auth, clientType } = {}) {
	if (!instanceURL) instanceURL = profile.current.instance || DEFAULT_INSTANCE_URL;
	if (!clientType) clientType = profile.current.client ?? DEFAULT_CLIENT_TYPE;
	const jwt = auth ?? profile.current?.jwt;
	const headers = jwt ? { authorization: `Bearer ${jwt}` } : {};
	return new ({
		lemmy: LemmyClient,
		piefed: PiefedClient,
		threadlight: ThreadlightClient
	}[clientType.name] ?? LemmyClient)(instanceToURL(instanceURL), {
		fetchFunction: (input, init) => customFetch(func, input, init, jwt),
		headers
	});
}
function getClient(instanceURL, func, auth) {
	return client({
		instanceURL,
		func,
		auth
	});
}
//#endregion
export { parseTags as $, ArrowRight as $n, ViewColumns as $t, Sort as A, CurrencyDollar as An, settings as At, Blobs as B, Check as Bn, Switch as Bt, PostListShell as C, InformationCircle as Cn, searchParam as Ct, debounce as D, ExclamationTriangle as Dn, SvelteURL as Dt, VirtualList as E, Fire as En, SvelteSet as Et, CommonList as F, ChevronRight as Fn, ModalContainer as Ft, getItemPublished as G, Calendar as Gn, Label as Gt, deleteItem as H, ChatBubbleOvalLeft as Hn, Option as Ht, Tabs as I, ChevronLeft as In, action as It, resumables as J, Bookmark as Jn, TextLoader as Jt, isCommentView as K, BugAnt as Kn, FileInput as Kt, TabButton as L, ChevronDown as Ln, modal as Lt, Pageination as M, ClipboardDocument as Mn, MenuDivider as Mt, Shell as N, ChevronUpDown as Nn, MenuButton as Nt, PostFeed as O, EllipsisHorizontal as On, SSR_ENABLED as Ot, SearchBar as P, ChevronUp as Pn, Menu as Pt, PostMeta as Q, ArrowTopRightOnSquare as Qn, XMark as Qt, Header as R, ChevronDoubleUp as Rn, Modal as Rt, PostMedia as S, Language as Sn, recursiveEqual as St, EndPlaceholder as T, GlobeAlt as Tn, SvelteMap as Tt, markAsRead as U, ChatBubbleLeftRight as Un, TextInput as Ut, shouldShowVoteColor as V, ChatBubbleOvalLeftEllipsis as Vn, Select as Vt, save as W, ChartBar as Wn, TextArea as Wt, PostBody as X, ArrowsPointingOut as Xn, ButtonGroup as Xt, PostItem as Y, Bars3 as Yn, Spinner as Yt, Post as Z, ArrowTrendingDown as Zn, Button as Zt, DEFAULT_INSTANCE_URL as _, Megaphone as _n, fullCommunityName as _t, LemmyClient as a, Star as an, page as ar, RelativeDate$1 as at, Link as b, LockClosed as bn, isVideo as bt, Note as c, PuzzlePiece as cn, hidePost as ct, removeToast as d, Photo as dn, postLink as dt, VideoCamera as en, ArrowDownTray as er, FormattedNumber as et, toast as f, Pencil as fn, DOMAIN_REGEX_FORMS as ft, autofillPost as g, Minus as gn, escapeHtml as gt, PostFormState as h, Newspaper as hn, communityLink as ht, ThreadlightClient as i, Sun as in, navigating as ir, CommunityLink as it, Location as j, Clock as jn, Popover as jt, ViewSelect as k, DocumentText as kn, defaultSettings as kt, Badge as l, PlusCircle as ln, mediaType as lt, PostActions as m, NoSymbol as mn, awaitIfServer as mt, getClient as n, Trash as nn, BaseClient as nr, UserLink as nt, profile as o, ShieldCheck as on, formatRelativeDate$1 as ot, Markdown as p, PaperAirplane as pn, ReactiveState as pt, isPostView as q, BookmarkSlash as qn, Material as qt, site as r, Tag as rn, DEFAULT_CLIENT_TYPE as rr, Logo as rt, Search as s, Share as sn, Avatar as st, client as t, Trophy as tn, publishedToDate as tr, errorMessage as tt, ToastContainer as u, Plus as un, optimizeImageURL as ut, LINKED_INSTANCE_URL as v, MapPin as vn, instanceToURL as vt, VirtualFeed as w, GlobeAmericas as wn, userLink as wt, ExpandableImage as x, Link$1 as xn, placeholders as xt, instance as y, MagnifyingGlass as yn, isImage as yt, PiefedClient as z, CheckCircle as zn, Expandable as zt };

//# sourceMappingURL=client.svelte.js.map