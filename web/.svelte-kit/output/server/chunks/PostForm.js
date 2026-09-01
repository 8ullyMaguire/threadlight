import "./internal.js";
import { n as attr, o as escape_html, r as clsx } from "./validate.js";
import { c as ensure_array_like, h as stringify, i as await_block, n as attr_style, o as derived, t as attr_class } from "./server.js";
import { At as settings, Bn as Check, Bt as Switch, F as CommonList, Gt as Label, Ht as Option, Jt as TextLoader, Lt as modal, Qt as XMark, R as Header, Sn as Language, T as EndPlaceholder, Ut as TextInput, Vt as Select, Wt as TextArea, Xt as ButtonGroup, Yt as Spinner, Zt as Button, dn as Photo, f as toast, g as autofillPost, h as PostFormState, l as Badge, nn as Trash, o as profile, qt as Material, r as site, rn as Tag, st as Avatar, t as client, tr as publishedToDate, tt as errorMessage, un as Plus, xt as placeholders, z as PiefedClient } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ArrowUpTray } from "./ArrowUpTray.js";
import { t as MarkdownEditor } from "./MarkdownEditor.js";
import { t as ErrorContainer } from "./ErrorContainer.js";
import { t as Switch$1 } from "./Switch.js";
import { t as ImageInputModal } from "./ImageInputModal.js";
import { t as Duration } from "./Duration.js";
import { t as FreeTextInput } from "./FreeTextInput.js";
import { t as ObjectAutocomplete } from "./ObjectAutocomplete.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ChatBubbleBottomCenterText.js
var ChatBubbleBottomCenterText = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1 8.74c0 .983.713 1.825 1.69 1.943.904.108 1.817.19 2.737.243.363.02.688.231.85.556l1.052 2.103a.75.75 0 0 0 1.342 0l1.052-2.103c.162-.325.487-.535.85-.556.92-.053 1.833-.134 2.738-.243.976-.118 1.689-.96 1.689-1.942V4.259c0-.982-.713-1.824-1.69-1.942a44.45 44.45 0 0 0-10.62 0C1.712 2.435 1 3.277 1 4.26v4.482Zm3-3.49a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 5.25ZM4.75 7a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z",
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
			"d": "M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 0 0 1.33 0l1.713-3.293a.783.783 0 0 1 .642-.413 41.102 41.102 0 0 0 3.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2ZM6.75 6a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 2.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z",
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
			"d": "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/QrCode.js
var QrCode = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [
			{ "d": "M4.75 4.25a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z" },
			{
				"fill-rule": "evenodd",
				"d": "M2 3.5A1.5 1.5 0 0 1 3.5 2H6a1.5 1.5 0 0 1 1.5 1.5V6A1.5 1.5 0 0 1 6 7.5H3.5A1.5 1.5 0 0 1 2 6V3.5Zm1.5 0H6V6H3.5V3.5Z",
				"clip-rule": "evenodd"
			},
			{ "d": "M4.25 11.25a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" },
			{
				"fill-rule": "evenodd",
				"d": "M2 10a1.5 1.5 0 0 1 1.5-1.5H6A1.5 1.5 0 0 1 7.5 10v2.5A1.5 1.5 0 0 1 6 14H3.5A1.5 1.5 0 0 1 2 12.5V10Zm1.5 2.5V10H6v2.5H3.5Z",
				"clip-rule": "evenodd"
			},
			{ "d": "M11.25 4.25a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z" },
			{
				"fill-rule": "evenodd",
				"d": "M10 2a1.5 1.5 0 0 0-1.5 1.5V6A1.5 1.5 0 0 0 10 7.5h2.5A1.5 1.5 0 0 0 14 6V3.5A1.5 1.5 0 0 0 12.5 2H10Zm2.5 1.5H10V6h2.5V3.5Z",
				"clip-rule": "evenodd"
			},
			{ "d": "M8.5 9.417a.917.917 0 1 1 1.833 0 .917.917 0 0 1-1.833 0ZM8.5 13.083a.917.917 0 1 1 1.833 0 .917.917 0 0 1-1.833 0ZM13.083 8.5a.917.917 0 1 0 0 1.833.917.917 0 0 0 0-1.833ZM12.166 13.084a.917.917 0 1 1 1.833 0 .917.917 0 0 1-1.833 0ZM11.25 10.333a.917.917 0 1 0 0 1.833.917.917 0 0 0 0-1.833Z" }
		]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3.75 2A1.75 1.75 0 0 0 2 3.75v3.5C2 8.216 2.784 9 3.75 9h3.5A1.75 1.75 0 0 0 9 7.25v-3.5A1.75 1.75 0 0 0 7.25 2h-3.5ZM3.5 3.75a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.5a.25.25 0 0 1-.25.25h-3.5a.25.25 0 0 1-.25-.25v-3.5ZM3.75 11A1.75 1.75 0 0 0 2 12.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 9 16.25v-3.5A1.75 1.75 0 0 0 7.25 11h-3.5Zm-.25 1.75a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.5a.25.25 0 0 1-.25.25h-3.5a.25.25 0 0 1-.25-.25v-3.5Zm7.5-9c0-.966.784-1.75 1.75-1.75h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 16.25 9h-3.5A1.75 1.75 0 0 1 11 7.25v-3.5Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25h-3.5Zm-7.26 1a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1h-.01Zm9 0a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1h-.01Zm-9 9a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1v-.01a1 1 0 0 0-1-1h-.01Zm9 0a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1v-.01a1 1 0 0 0-1-1h-.01Zm-3.5-1.5a1 1 0 0 1 1-1H12a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V12Zm6-1a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1H17a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1h-.01Zm-1 6a1 1 0 0 1 1-1H17a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V17Zm-4-1a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1H12a1 1 0 0 0 1-1V17a1 1 0 0 0-1-1h-.01Z",
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
			"d": "M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
		}, {
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Sparkles.js
var Sparkles = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" }]
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
			"d": "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/feature/media/ImageUploader.svelte
function ImageUploader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { onUpload, maxSizeMB = 10 } = $$props;
		let selectedFile = null;
		let previewUrl = null;
		let uploading = false;
		let error = null;
		const ALLOWED_TYPES = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
			"image/avif"
		];
		`${maxSizeMB}`;
		function clearSelection() {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			selectedFile = null;
			previewUrl = null;
			error = null;
		}
		async function handleUpload() {
			if (!selectedFile) return;
			uploading = true;
			error = null;
			try {
				const media = await client().uploadImage(selectedFile);
				onUpload(media);
				clearSelection();
				toast({
					content: "Image uploaded successfully",
					type: "success"
				});
			} catch (err) {
				error = errorMessage(err);
				toast({
					content: errorMessage(err),
					type: "error"
				});
			} finally {
				uploading = false;
			}
		}
		function formatFileSize(bytes) {
			if (bytes < 1024) return `${bytes} B`;
			if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
			return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		}
		$$renderer.push(`<div class="space-y-3"><div class="text-xs text-zinc-500 flex items-center gap-1">`);
		$$renderer.push("<!--[0-->");
		Spinner($$renderer, { width: 12 });
		$$renderer.push(`<!--]--></div> `);
		if (!selectedFile) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<label for="image-upload-input"${attr_class(clsx(["flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors", "border-slate-300 dark:border-zinc-700 hover:border-primary-400 dark:hover:border-primary-600"].join(" ")))}>`);
			Icon($$renderer, {
				src: Photo,
				size: "32",
				class: "text-zinc-400"
			});
			$$renderer.push(`<!----> <div class="text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center">Drop an image here or click to browse</div> <div class="text-xs text-zinc-400">${escape_html(ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", "))} up to ${escape_html(maxSizeMB)}MB</div> <input id="image-upload-input" type="file"${attr("accept", ALLOWED_TYPES.join(","))} class="hidden"/></label>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (previewUrl && selectedFile) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"><img${attr("src", previewUrl)} alt="Preview" class="w-full max-h-64 object-contain"/> <button class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors" aria-label="Remove">`);
			Icon($$renderer, {
				src: XMark,
				size: "16",
				mini: true
			});
			$$renderer.push(`<!----></button> <div class="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-lg">${escape_html(selectedFile.name)} (${escape_html(formatFileSize(selectedFile.size))})</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">${escape_html(error)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (selectedFile) {
			$$renderer.push("<!--[0-->");
			{
				function prefix($$renderer) {
					Icon($$renderer, {
						src: ArrowUpTray,
						size: "18"
					});
				}
				Button($$renderer, {
					onclick: handleUpload,
					loading: uploading,
					disabled: uploading || !selectedFile,
					color: "primary",
					size: "lg",
					class: "w-full",
					prefix,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(uploading ? "Uploading…" : "Upload Image")}`);
					},
					$$slots: {
						prefix: true,
						default: true
					}
				});
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/feature/media/MediaDisplay.svelte
function MediaDisplay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { src, alt = "", maxWidth = 800 } = $$props;
		const MINIO_BASE = "http://localhost:9000/threadlight-images";
		let imageUrl = derived(() => src.startsWith("http") ? src : `${MINIO_BASE}/${src.replace(/^\//, "")}`);
		$$renderer.push(`<div class="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"${attr_style(`max-width: ${stringify(maxWidth)}px`)}>`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center h-48 bg-zinc-100 dark:bg-zinc-800 animate-pulse"><span class="text-sm text-zinc-400">Loading image…</span></div>`);
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <img${attr("src", imageUrl())}${attr("alt", alt)}${attr_class("w-full h-auto object-contain", void 0, { "hidden": true })} onload="this.__e=event" onerror="this.__e=event"/></div>`);
	});
}
//#endregion
//#region src/lib/feature/post/form/PostForm.svelte
function PostForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { editPost, init, title, onsubmit } = $$props;
		let form = init ?? new PostFormState({ type: "normal" });
		let extendedCommunity = derived(() => {
			const api = client();
			if (!(api instanceof PiefedClient)) return void 0;
			if (form.community?.id) return api.getCommunity({ id: form.community.id });
			else return void 0;
		});
		let loading = false;
		let uploadImage = false;
		let customThumbnail = false;
		let showImageUploader = false;
		let uploadedMedia = null;
		function handleImageUpload(media) {
			uploadedMedia = media;
			form.mediaId = media.id;
			showImageUploader = false;
		}
		function removeUploadedImage() {
			uploadedMedia = null;
			form.mediaId = void 0;
		}
		async function autofill(data) {
			if (data instanceof URL) {
				const res = await autofillPost(data);
				if (settings.forms.autosubmitAutofill) {
					autofill({
						title: res.title,
						body: res.body
					});
					history?.back?.();
				}
				return res;
			} else {
				form.title = data.title || form.title;
				form.body = data.body?.split("\n").map((i) => `> ${i}`).join("\n") || form.body;
				return {
					title: form.title,
					body: form.body
				};
			}
		}
		function altText($$renderer) {
			TextArea($$renderer, {
				get value() {
					return form.altText;
				},
				set value($$value) {
					form.altText = $$value;
					$$settled = false;
				}
			});
		}
		function flairs($$renderer) {
			Material($$renderer, {
				color: "uniform",
				class: "flex flex-row gap-4 flex-wrap",
				children: ($$renderer) => {
					await_block($$renderer, extendedCommunity(), () => {
						$$renderer.push(`<div class="w-full h-full grid place-items-center">`);
						Spinner($$renderer, {});
						$$renderer.push(`<!----></div>`);
					}, (communityView) => {
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(communityView?.community_view.flair_list ?? []);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let flair = each_array[$$index];
							const selected = form.flairList?.some((i) => i.id == flair.id);
							$$renderer.push(`<button class="rounded-full cursor-pointer hover:brightness-100 badge-tag-color"${attr_style(`--tag-color: ${stringify(flair.background_color)}; --tag-text-color: ${stringify(flair.text_color)};`)}>`);
							{
								function icon($$renderer) {
									Icon($$renderer, {
										src: selected ? Check : Plus,
										size: "16",
										micro: true
									});
								}
								Badge($$renderer, {
									color: selected ? "gray-subtle" : "custom",
									class: "ring-white/20",
									icon,
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(flair.flair_title)}`);
									},
									$$slots: {
										icon: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----></button>`);
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		function autofillPostModal($$renderer) {
			$$renderer.push(`<!--[-->`);
			if (form.url) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<!---->`);
				await_block($$renderer, autofill(new URL(form.url)), () => {
					$$renderer.push(`<div class="w-full h-48 grid place-items-center">`);
					TextLoader($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Fetching site metadata`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					Button($$renderer, {
						size: "lg",
						color: "secondary",
						onclick: history.back,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Cancel`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				}, (url) => {
					if (!url) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`${escape_html(history.back())}`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					Material($$renderer, {
						color: "info",
						class: "space-y-2 h-48",
						children: ($$renderer) => {
							$$renderer.push(`<h2 class="text-xl font-display font-medium">${escape_html(url.title)}</h2> <p class="overflow-hidden text-ellipsis">${escape_html(url.body ?? "...")}</p>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						size: "lg",
						color: "primary",
						onclick: () => {
							autofill({
								title: url.title,
								body: url.body
							});
							history.back();
						},
						children: ($$renderer) => {
							$$renderer.push(`<!---->Submit`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				});
				$$renderer.push(`<!--]--> `);
				Switch($$renderer, {
					class: "mt-4",
					get checked() {
						return settings.forms.autosubmitAutofill;
					},
					set checked($$value) {
						settings.forms.autosubmitAutofill = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Submit automatically`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
			$$renderer.push(`<!--]-->`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (profile.client instanceof PiefedClient && !editPost) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-3">`);
				Switch$1($$renderer, {
					options: ["normal", "poll"],
					optionNames: [
						"Discussion",
						"Poll",
						"Event"
					],
					get selected() {
						return form.type;
					},
					set selected($$value) {
						form.type = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (uploadImage) {
				$$renderer.push("<!--[0-->");
				var bind_get = () => "";
				var bind_set = (v) => form.url = v;
				ImageInputModal($$renderer, {
					get imageUrl() {
						return bind_get();
					},
					set imageUrl($$value) {
						bind_set($$value);
					},
					get open() {
						return uploadImage;
					},
					set open($$value) {
						uploadImage = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (customThumbnail) {
				$$renderer.push("<!--[0-->");
				var bind_get_1 = () => form.thumbnail;
				var bind_set_1 = (v) => form.thumbnail = v;
				ImageInputModal($$renderer, {
					get imageUrl() {
						return bind_get_1();
					},
					set imageUrl($$value) {
						bind_set_1($$value);
					},
					get open() {
						return customThumbnail;
					},
					set open($$value) {
						customThumbnail = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->  <form class="flex flex-col gap-4 h-full">`);
			if (title) {
				$$renderer.push("<!--[0-->");
				title($$renderer);
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Header($$renderer, {
					class: "font-bold text-xl",
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(editPost ? "Edit post" : "Create post")}`);
					},
					$$slots: { default: true }
				});
			}
			$$renderer.push(`<!--]--> `);
			ErrorContainer($$renderer, { scope: "post-form" });
			$$renderer.push(`<!----> `);
			if (!editPost) {
				$$renderer.push("<!--[0-->");
				if (!form.community) {
					$$renderer.push("<!--[0-->");
					ObjectAutocomplete($$renderer, {
						listing_type: "All",
						label: "Community",
						onselect: (i) => {
							form.community = i.community;
						},
						required: true
					});
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="flex flex-col gap-1">`);
					Label($$renderer, {
						children: ($$renderer) => {
							$$renderer.push(`<!---->Community`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					{
						function prefix($$renderer) {
							Avatar($$renderer, {
								url: form.community?.icon,
								alt: form.community?.name,
								width: 24
							});
						}
						Button($$renderer, {
							class: "w-full",
							onclick: () => form.community = void 0,
							alignment: "left",
							size: "sm",
							rounding: "xl",
							prefix,
							children: ($$renderer) => {
								$$renderer.push(`<div class="flex flex-col gap-0"><span class="text-sm">${escape_html(form.community.name)}</span> <span class="text-[10px] leading-3">${escape_html(new URL(form.community?.actor_id).hostname)}</span></div>`);
							},
							$$slots: {
								prefix: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			FreeTextInput($$renderer, {
				required: true,
				placeholder: placeholders.get("post"),
				label: "Title",
				class: "font-display font-medium text-2xl",
				get value() {
					return form.title;
				},
				set value($$value) {
					form.title = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			MarkdownEditor($$renderer, {
				label: "Body",
				placeholder: placeholders.get("body"),
				previewButton: true,
				get value() {
					return form.body;
				},
				set value($$value) {
					form.body = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			if (showImageUploader) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4"><div class="flex items-center justify-between mb-2"><h3 class="font-semibold text-sm">Upload Image</h3> `);
				Button($$renderer, {
					size: "xs",
					rounding: "xl",
					onclick: () => showImageUploader = false,
					icon: XMark,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Cancel`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				ImageUploader($$renderer, {
					onUpload: handleImageUpload,
					maxSizeMB: 10
				});
				$$renderer.push(`<!----></div>`);
			} else if (uploadedMedia) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 space-y-2"><div class="flex items-center justify-between"><h3 class="font-semibold text-sm">Attached Image</h3> `);
				Button($$renderer, {
					size: "xs",
					rounding: "xl",
					color: "danger",
					onclick: removeUploadedImage,
					icon: Trash,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Remove`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				MediaDisplay($$renderer, {
					src: uploadedMedia.file_path,
					alt: uploadedMedia.original_name ?? "",
					maxWidth: 400
				});
				$$renderer.push(`<!----> <div class="text-xs text-zinc-500">${escape_html(uploadedMedia.original_name ?? "Image")} · ${escape_html(uploadedMedia.width)}×${escape_html(uploadedMedia.height)}</div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (form.type == "normal") {
				$$renderer.push("<!--[0-->");
				{
					function suffix($$renderer) {
						Button($$renderer, {
							color: "none",
							rounding: "none",
							class: "h-full border-l border-slate-200 dark:border-zinc-800 aspect-square hover:bg-slate-50 hover:dark:bg-zinc-900 rounded-[inherit]",
							size: "custom",
							disabled: !form.url || !URL.canParse(form.url),
							icon: Sparkles,
							"aria-label": "Autofill",
							post: true,
							onclick: () => modal({
								title: "Autofill post",
								snippet: autofillPostModal,
								actions: []
							})
						});
					}
					TextInput($$renderer, {
						label: "URL",
						placeholder: placeholders.get("url"),
						get value() {
							return form.url;
						},
						set value($$value) {
							form.url = $$value;
							$$settled = false;
						},
						suffix,
						$$slots: { suffix: true }
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (form.type == "poll" && form.poll) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div>`);
				Label($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!---->Choices`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				CommonList($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<!--[-->`);
						const each_array_1 = ensure_array_like(form.poll.choices);
						for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
							each_array_1[index];
							$$renderer.push(`<li class="px-4 py-1 flex flex-row items-center xs"><div class="p-0! font-medium flex-1">`);
							FreeTextInput($$renderer, {
								class: "w-full",
								get value() {
									return form.poll.choices[index].choice_text;
								},
								set value($$value) {
									form.poll.choices[index].choice_text = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> <div>`);
							Button($$renderer, {
								onclick: () => form.poll?.choices.splice(index, 1),
								size: "square-md",
								"aria-label": "Delete",
								children: ($$renderer) => {
									Icon($$renderer, {
										src: Trash,
										size: "16",
										mini: true
									});
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div></li>`);
						}
						$$renderer.push(`<!--]--> <li class="xs"><button type="button" class="font-medium w-full px-4 py-2! flex flex-row items-center gap-1 justify-center cursor-pointer">`);
						Icon($$renderer, {
							src: Plus,
							size: "16",
							micro: true
						});
						$$renderer.push(`<!----> Add</button></li>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				{
					function action($$renderer) {
						if (!editPost) {
							$$renderer.push("<!--[0-->");
							var bind_get_2 = () => {
								return form.poll?.end_poll ? Math.floor(Date.now() - publishedToDate(form.poll?.end_poll).getTime()) : Date.now() + 1440 * 60;
							};
							var bind_set_2 = (v) => {
								if (v <= 0) form.poll.end_poll = void 0;
								else form.poll.end_poll = new Date(Date.now() + v * 1e3).toISOString();
							};
							Duration($$renderer, {
								get value() {
									return bind_get_2();
								},
								set value($$value) {
									bind_set_2($$value);
								}
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					EndPlaceholder($$renderer, {
						margin: "bottom-lg",
						action,
						children: ($$renderer) => {
							Select($$renderer, {
								label: "Mode",
								get value() {
									return form.poll.mode;
								},
								set value($$value) {
									form.poll.mode = $$value;
									$$settled = false;
								},
								children: ($$renderer) => {
									Option($$renderer, {
										value: "single",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Single choice`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Option($$renderer, {
										value: "multiple",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Multiple choice`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: {
							action: true,
							default: true
						}
					});
				}
				$$renderer.push(`<!----> `);
				if (settings.debugInfo) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`${escape_html(form.poll?.end_poll)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="flex flex-row overflow-auto gap-2 -mx-3 px-3 relative"><div class="bg-gradient-to-r from-slate-25 to-slate-25/0 dark:from-zinc-925 dark:to-zinc-925/0 absolute left-0 w-3 h-full z-10"></div> <div class="bg-gradient-to-l from-slate-25 to-slate-25/0 dark:from-zinc-925 dark:to-zinc-925/0 absolute right-0 w-3 h-full z-10"></div> `);
			ButtonGroup($$renderer, {
				orientation: "horizontal",
				class: "flex flex-row *:flex-shrink-0 w-full",
				children: ($$renderer) => {
					if (form.type == "normal") {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							onclick: () => {
								uploadImage = !uploadImage;
							},
							icon: Photo,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Upload image`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Button($$renderer, {
							onclick: () => {
								showImageUploader = !showImageUploader;
							},
							color: uploadedMedia ? "primary" : "secondary",
							icon: Photo,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(uploadedMedia ? "Image attached" : "Add image")}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						if (form.url && URL.canParse(form.url)) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								class: "animate-pop-in",
								color: (form.altText ?? "") != "" ? "primary" : "secondary",
								onclick: () => modal({
									title: "Alt text",
									snippet: altText
								}),
								icon: ChatBubbleBottomCenterText,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Alt text`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (form.url) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								class: "animate-pop-in",
								onclick: () => {
									customThumbnail = !customThumbnail;
								},
								color: form.thumbnail ? "primary" : "secondary",
								icon: QrCode,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Set thumbnail`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (form.language === void 0) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							onclick: () => form.language = "",
							icon: Language,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Set language`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					await_block($$renderer, extendedCommunity(), () => {}, (communityView) => {
						if ((communityView?.community_view.flair_list?.length || 0) > 0) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								color: form.flairList.length > 0 ? "primary" : "secondary",
								class: "animate-pop-in",
								onclick: () => modal({
									title: "Add flair",
									snippet: flairs
								}),
								icon: Tag,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Add flair`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			if (form.language !== void 0) {
				$$renderer.push("<!--[0-->");
				if (site.data) {
					$$renderer.push("<!--[0-->");
					var bind_get_3 = () => form.language;
					var bind_set_3 = (v) => {
						if (v == "") form.language = void 0;
						else form.language = v;
					};
					Select($$renderer, {
						class: "w-max",
						label: "Language",
						get value() {
							return bind_get_3();
						},
						set value($$value) {
							bind_set_3($$value);
						},
						children: ($$renderer) => {
							Option($$renderer, {
								value: "",
								children: ($$renderer) => {
									Icon($$renderer, {
										src: XMark,
										size: "16",
										micro: true
									});
									$$renderer.push(`<!----> Unset`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <!--[-->`);
							const each_array_2 = ensure_array_like(site.data?.all_languages);
							for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
								let language = each_array_2[$$index_2];
								Option($$renderer, {
									value: language.id.toString(),
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(language.name)}`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div style="height: 58px;">`);
					Spinner($$renderer, { width: 24 });
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Switch($$renderer, {
				get checked() {
					return form.nsfw;
				},
				set checked($$value) {
					form.nsfw = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<!---->NSFW`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				submit: true,
				color: "primary",
				loading,
				size: "lg",
				class: "mt-auto",
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
export { PostForm as t };

//# sourceMappingURL=PostForm.js.map