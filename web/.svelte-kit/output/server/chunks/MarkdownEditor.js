import { s as tick } from "./internal.js";
import { C as render_effect, M as state, j as set, n as attr, o as escape_html, r as clsx, v as get } from "./validate.js";
import { a as bind_props, c as ensure_array_like, f as spread_props, h as stringify, n as attr_style, o as derived, t as attr_class } from "./server.js";
import { Dn as ExclamationTriangle, Gt as Label, Rt as Modal, Wt as TextArea, Zt as Button, dn as Photo, p as Markdown, xn as Link } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ListBullet } from "./ListBullet.js";
import { i as raf, r as loop } from "./window.js";
import { t as Switch } from "./Switch.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Bold.js
var Bold = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 3a1 1 0 0 1 1-1h5a3.5 3.5 0 0 1 2.843 5.541A3.75 3.75 0 0 1 9.25 14H4a1 1 0 0 1-1-1V3Zm2.5 3.5v-2H9a1 1 0 0 1 0 2H5.5Zm0 2.5v2.5h3.75a1.25 1.25 0 1 0 0-2.5H5.5Z",
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
			"d": "M4 3a1 1 0 0 1 1-1h6a4.5 4.5 0 0 1 3.274 7.587A4.75 4.75 0 0 1 11.25 18H5a1 1 0 0 1-1-1V3Zm2.5 5.5v-4H11a2 2 0 1 1 0 4H6.5Zm0 2.5v4.5h4.75a2.25 2.25 0 0 0 0-4.5H6.5Z",
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
			"stroke-linejoin": "round",
			"d": "M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.246 3.744a.75.75 0 0 1 .75-.75h7.125a4.875 4.875 0 0 1 3.346 8.422 5.25 5.25 0 0 1-2.97 9.58h-7.5a.75.75 0 0 1-.75-.75V3.744Zm7.125 6.75a2.625 2.625 0 0 0 0-5.25H8.246v5.25h4.125Zm-4.125 2.251v6h4.5a3 3 0 0 0 0-6h-4.5Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/CodeBracket.js
var CodeBracket = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4.78 4.97a.75.75 0 0 1 0 1.06L2.81 8l1.97 1.97a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0ZM11.22 4.97a.75.75 0 0 0 0 1.06L13.19 8l-1.97 1.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0ZM8.856 2.008a.75.75 0 0 1 .636.848l-1.5 10.5a.75.75 0 0 1-1.484-.212l1.5-10.5a.75.75 0 0 1 .848-.636Z",
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
			"d": "M6.28 5.22a.75.75 0 0 1 0 1.06L2.56 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Zm7.44 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 0 1 0-1.06ZM11.377 2.011a.75.75 0 0 1 .612.867l-2.5 14.5a.75.75 0 0 1-1.478-.255l2.5-14.5a.75.75 0 0 1 .866-.612Z",
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
			"d": "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/DocumentPlus.js
var DocumentPlus = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4.75 4.75a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5Z",
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
			"d": "M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z",
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
			"d": "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z",
			"clip-rule": "evenodd"
		}, { "d": "M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/H1.js
var H1 = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M1.75 3a.75.75 0 0 1 .75.75v3.5h4v-3.5a.75.75 0 0 1 1.5 0v8.5a.75.75 0 0 1-1.5 0v-3.5h-4v3.5a.75.75 0 0 1-1.5 0v-8.5A.75.75 0 0 1 1.75 3ZM10 6.75a.75.75 0 0 1 .75-.75h1.75a.75.75 0 0 1 .75.75v4.75h1a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5h1v-4h-1a.75.75 0 0 1-.75-.75Z",
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
			"d": "M2.75 4a.75.75 0 0 1 .75.75v4.5h5v-4.5a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0v-4.5h-5v4.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 2.75 4ZM13 8.75a.75.75 0 0 1 .75-.75h1.75a.75.75 0 0 1 .75.75v5.75h1a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5h1v-5h-1a.75.75 0 0 1-.75-.75Z",
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
			"d": "M2.243 4.493v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501m4.501-8.627 2.25-1.5v10.126m0 0h-2.25m2.25 0h2.25"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2.243 3.743a.75.75 0 0 1 .75.75v6.75h9v-6.75a.75.75 0 1 1 1.5 0v15.002a.75.75 0 1 1-1.5 0v-6.751h-9v6.75a.75.75 0 1 1-1.5 0v-15a.75.75 0 0 1 .75-.75Zm17.605 4.964a.75.75 0 0 1 .396.661v9.376h1.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5h1.5V10.77l-1.084.722a.75.75 0 1 1-.832-1.248l2.25-1.5a.75.75 0 0 1 .77-.037Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Italic.js
var Italic = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M6.25 2.75A.75.75 0 0 1 7 2h6a.75.75 0 0 1 0 1.5h-2.483l-3.429 9H9A.75.75 0 0 1 9 14H3a.75.75 0 0 1 0-1.5h2.483l3.429-9H7a.75.75 0 0 1-.75-.75Z",
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
			"d": "M8 2.75A.75.75 0 0 1 8.75 2h7.5a.75.75 0 0 1 0 1.5h-3.215l-4.483 13h2.698a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3.215l4.483-13H8.75A.75.75 0 0 1 8 2.75Z",
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
			"d": "M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10.497 3.744a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-3.275l-5.357 15.002h2.632a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5h3.275l5.357-15.002h-2.632a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Strikethrough.js
var Strikethrough = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.165 3.654c-.95-.255-1.921-.273-2.693-.042-.769.231-1.087.624-1.173.947-.087.323-.008.822.543 1.407.389.412.927.77 1.55 1.034H13a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 3 7h1.756l-.006-.006c-.787-.835-1.161-1.849-.9-2.823.26-.975 1.092-1.666 2.191-1.995 1.097-.33 2.36-.28 3.512.029.75.2 1.478.518 2.11.939a.75.75 0 0 1-.833 1.248 5.682 5.682 0 0 0-1.665-.738Zm2.074 6.365a.75.75 0 0 1 .91.543 2.44 2.44 0 0 1-.35 2.024c-.405.585-1.052 1.003-1.84 1.24-1.098.329-2.36.279-3.512-.03-1.152-.308-2.27-.897-3.056-1.73a.75.75 0 0 1 1.092-1.029c.552.586 1.403 1.056 2.352 1.31.95.255 1.92.273 2.692.042.55-.165.873-.417 1.038-.656a.942.942 0 0 0 .13-.803.75.75 0 0 1 .544-.91Z",
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
			"d": "M11.617 3.963c-1.186-.318-2.418-.323-3.416.015-.992.336-1.49.91-1.642 1.476-.152.566-.007 1.313.684 2.1.528.6 1.273 1.1 2.128 1.446h7.879a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5h3.813a5.976 5.976 0 0 1-.447-.456C5.18 7.479 4.798 6.231 5.11 5.066c.312-1.164 1.268-2.055 2.61-2.509 1.336-.451 2.877-.42 4.286-.043.856.23 1.684.592 2.409 1.074a.75.75 0 1 1-.83 1.25 6.723 6.723 0 0 0-1.968-.875Zm1.909 8.123a.75.75 0 0 1 1.015.309c.53.99.607 2.062.18 3.01-.421.94-1.289 1.648-2.441 2.038-1.336.452-2.877.42-4.286.043-1.409-.377-2.759-1.121-3.69-2.18a.75.75 0 1 1 1.127-.99c.696.791 1.765 1.403 2.952 1.721 1.186.318 2.418.323 3.416-.015.853-.288 1.34-.756 1.555-1.232.21-.467.205-1.049-.136-1.69a.75.75 0 0 1 .308-1.014Z",
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
			"d": "M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M9.657 4.728c-1.086.385-1.766 1.057-1.979 1.85-.214.8.046 1.733.81 2.616.746.862 1.93 1.612 3.388 2.003.07.019.14.037.21.053h8.163a.75.75 0 0 1 0 1.5h-8.24a.66.66 0 0 1-.02 0H3.75a.75.75 0 0 1 0-1.5h4.78a7.108 7.108 0 0 1-1.175-1.074C6.372 9.042 5.849 7.61 6.229 6.19c.377-1.408 1.528-2.38 2.927-2.876 1.402-.497 3.127-.55 4.855-.086A8.937 8.937 0 0 1 16.94 4.6a.75.75 0 0 1-.881 1.215 7.437 7.437 0 0 0-2.436-1.14c-1.473-.394-2.885-.331-3.966.052Zm6.533 9.632a.75.75 0 0 1 1.03.25c.592.974.846 2.094.55 3.2-.378 1.408-1.529 2.38-2.927 2.876-1.402.497-3.127.55-4.855.087-1.712-.46-3.168-1.354-4.134-2.47a.75.75 0 0 1 1.134-.982c.746.862 1.93 1.612 3.388 2.003 1.473.394 2.884.331 3.966-.052 1.085-.384 1.766-1.056 1.978-1.85.169-.628.046-1.33-.381-2.032a.75.75 0 0 1 .25-1.03Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/svelte/src/easing/index.js
/**
* @param {number} t
* @returns {number}
*/
function linear(t) {
	return t;
}
/**
* @param {number} t
* @returns {number}
*/
function expoOut(t) {
	return t === 1 ? t : 1 - Math.pow(2, -10 * t);
}
//#endregion
//#region node_modules/svelte/src/motion/utils.js
/**
* @param {any} obj
* @returns {obj is Date}
*/
function is_date(obj) {
	return Object.prototype.toString.call(obj) === "[object Date]";
}
//#endregion
//#region node_modules/svelte/src/motion/tweened.js
/**
* @template T
* @param {T} a
* @param {T} b
* @returns {(t: number) => T}
*/
function get_interpolator(a, b) {
	if (a === b || a !== a) return () => a;
	const type = typeof a;
	if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) throw new Error("Cannot interpolate values of different type");
	if (Array.isArray(a)) {
		const arr = b.map((bi, i) => {
			return get_interpolator(
				/** @type {Array<any>} */
				a[i],
				bi
			);
		});
		return (t) => arr.map((fn) => fn(t));
	}
	if (type === "object") {
		if (!a || !b) throw new Error("Object cannot be null");
		if (is_date(a) && is_date(b)) {
			const an = a.getTime();
			const delta = b.getTime() - an;
			return (t) => new Date(an + t * delta);
		}
		const keys = Object.keys(b);
		/** @type {Record<string, (t: number) => T>} */
		const interpolators = {};
		keys.forEach((key) => {
			interpolators[key] = get_interpolator(a[key], b[key]);
		});
		return (t) => {
			/** @type {Record<string, any>} */
			const result = {};
			keys.forEach((key) => {
				result[key] = interpolators[key](t);
			});
			return result;
		};
	}
	if (type === "number") {
		const delta = b - a;
		return (t) => a + t * delta;
	}
	return () => b;
}
/**
* A wrapper for a value that tweens smoothly to its target value. Changes to `tween.target` will cause `tween.current` to
* move towards it over time, taking account of the `delay`, `duration` and `easing` options.
*
* ```svelte
* <script>
* 	import { Tween } from 'svelte/motion';
*
* 	const tween = new Tween(0);
* <\/script>
*
* <input type="range" bind:value={tween.target} />
* <input type="range" bind:value={tween.current} disabled />
* ```
* @template T
* @since 5.8.0
*/
var Tween = class Tween {
	#current;
	#target;
	/** @type {TweenOptions<T>} */
	#defaults;
	/** @type {import('../internal/client/types').Task | null} */
	#task = null;
	/**
	* @param {T} value
	* @param {TweenOptions<T>} options
	*/
	constructor(value, options = {}) {
		this.#current = /* @__PURE__ */ state(value);
		this.#target = /* @__PURE__ */ state(value);
		this.#defaults = options;
	}
	/**
	* Create a tween whose value is bound to the return value of `fn`. This must be called
	* inside an effect root (for example, during component initialisation).
	*
	* ```svelte
	* <script>
	* 	import { Tween } from 'svelte/motion';
	*
	* 	let { number } = $props();
	*
	* 	const tween = Tween.of(() => number);
	* <\/script>
	* ```
	* @template U
	* @param {() => U} fn
	* @param {TweenOptions<U>} [options]
	*/
	static of(fn, options) {
		const tween = new Tween(fn(), options);
		render_effect(() => {
			tween.set(fn());
		});
		return tween;
	}
	/**
	* Sets `tween.target` to `value` and returns a `Promise` that resolves if and when `tween.current` catches up to it.
	*
	* If `options` are provided, they will override the tween's defaults.
	* @param {T} value
	* @param {TweenOptions<T>} [options]
	* @returns
	*/
	set(value, options) {
		set(this.#target, value);
		let { delay = 0, duration = 400, easing = linear, interpolate = get_interpolator } = {
			...this.#defaults,
			...options
		};
		if (duration === 0) {
			this.#task?.abort();
			set(this.#current, value);
			return Promise.resolve();
		}
		const start = raf.now() + delay;
		/** @type {(t: number) => T} */
		let fn;
		let started = false;
		let previous_task = this.#task;
		this.#task = loop((now) => {
			if (now < start) return true;
			if (!started) {
				started = true;
				const prev = this.#current.v;
				fn = interpolate(prev, value);
				if (typeof duration === "function") duration = duration(prev, value);
				previous_task?.abort();
				previous_task = null;
			}
			const elapsed = now - start;
			if (elapsed > duration) {
				set(this.#current, value);
				return false;
			}
			set(this.#current, fn(easing(elapsed / duration)));
			return true;
		});
		return this.#task.promise;
	}
	get current() {
		return get(this.#current);
	}
	get target() {
		return get(this.#target);
	}
	set target(v) {
		this.set(v);
	}
};
//#endregion
//#region src/lib/ui/info/ProgressBar.svelte
function ProgressBar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { progress = 0 } = $$props;
		let tween = new Tween(progress, { easing: expoOut });
		$$renderer.push(`<div class="bg-primary-900 dark:bg-primary-100 h-1 rounded-full"${attr_style(`width: ${stringify(tween.current >= 0 ? tween.current * 100 : 0)}%;`)}></div>`);
	});
}
//#endregion
//#region src/lib/ui/form/ImageAttachForm.svelte
function ImageAttachForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { image = null, preview = true, multiple = true, onupload } = $$props;
		let previewURLs = derived(() => preview && image ? Array.from(image).map(URL.createObjectURL) : void 0);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form class="flex flex-col gap-4"><label for="image-input" class="p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors border-slate-300 dark:border-zinc-700 hover:border-primary-900 dark:hover:border-primary-100">`);
		if (previewURLs()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`grid gap-x-2 gap-y-px max-h-64 overflow-auto ${multiple ? "grid-cols-3 grid-rows-2" : "grid-cols-1 grid-rows-1"}`)}><!--[-->`);
			const each_array = ensure_array_like(previewURLs());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let file = each_array[$$index];
				$$renderer.push(`<img${attr("src", file)}${attr("alt", file)} class="w-full rounded-md h-full object-cover transition-all border border-slate-200 dark:border-zinc-800 ring-1 ring-slate-50 dark:ring-zinc-950 bg-white dark:bg-zinc-950" onload="this.__e=event"/>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex flex-col justify-center w-full items-center gap-2 text-slate-600 dark:text-zinc-400">`);
			Icon($$renderer, {
				src: DocumentPlus,
				size: "32"
			});
			$$renderer.push(`<!----> <span class="font-medium text-sm">Select a file</span></div>`);
		}
		$$renderer.push(`<!--]--> <input${attr("multiple", multiple, true)} type="file" accept="image/*" class="hidden" id="image-input"/></label> `);
		Button($$renderer, {
			loading: false,
			disabled: image == null,
			submit: true,
			color: "primary",
			size: "lg",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Upload`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></form>`);
		bind_props($$props, { image });
	});
}
//#endregion
//#region src/lib/app/markdown/MarkdownEditor.svelte
function MarkdownEditor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let textArea = void 0;
		function replaceTextAtIndices(str, startIndex, endIndex, replacement) {
			return str.substring(0, startIndex) + replacement + str.substring(endIndex);
		}
		function wrapSelection(start, end) {
			if (!textArea) return;
			const startPos = textArea.selectionStart;
			const endPos = textArea.selectionEnd;
			let newText = `${start}${textArea.value.substring(startPos, endPos)}${end}`;
			textArea.value = replaceTextAtIndices(textArea.value, startPos, endPos, newText);
			textArea.focus();
			textArea.selectionStart = startPos + start.length;
			textArea.selectionEnd = endPos + start.length;
			value = textArea.value;
		}
		let uploadingImage = false;
		let image = null;
		const shortcuts = {
			b: () => wrapSelection("**", "**"),
			i: () => wrapSelection("*", "*"),
			s: () => wrapSelection("~~", "~~"),
			h: () => wrapSelection("\n# ", ""),
			k: () => wrapSelection("[](", ")")
		};
		async function adjustHeight() {
			await tick();
			if (textArea) {
				textArea.style.height = "auto";
				textArea.style.height = `${textArea.scrollHeight}px`;
			}
		}
		function handleKeydown(event) {
			if (event.ctrlKey && event.key === "Enter") {
				event.preventDefault();
				const form = textArea?.closest("form");
				if (form) form.requestSubmit();
			}
		}
		let { images = true, value = void 0, label = void 0, previewButton = true, tools = true, disabled = false, rows = 2, beforePreview = (input) => input ?? "", previewing = false, class: clazz = "", customLabel, children, $$slots, $$events, ...rest } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (uploadingImage && images) {
				$$renderer.push("<!--[0-->");
				Modal($$renderer, {
					title: "Upload",
					image: true,
					get open() {
						return uploadingImage;
					},
					set open($$value) {
						uploadingImage = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						ImageAttachForm($$renderer, {
							onupload: (e) => {
								e.forEach((i) => {
									wrapSelection(`![](${i})\n\n`, "");
								});
							},
							get image() {
								return image;
							},
							set image($$value) {
								image = $$value;
								$$settled = false;
							}
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div>`);
			if (label || customLabel) {
				$$renderer.push("<!--[0-->");
				Label($$renderer, {
					children: ($$renderer) => {
						if (label) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`${escape_html(label)}`);
						} else if (customLabel) {
							$$renderer.push("<!--[1-->");
							customLabel?.($$renderer);
							$$renderer.push(`<!---->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div${attr_class(clsx([
				"focus-within:ring-3 ring-slate-300 dark:ring-zinc-700",
				"markdown-editor",
				label && "mt-1",
				clazz
			]), "svelte-1fyzbll")}>`);
			if (previewing) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="p-5 overflow-auto text-sm resize-y bg-white dark:bg-zinc-950 min-h-48">`);
				Markdown($$renderer, { source: beforePreview(value) });
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				if (tools) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class(clsx(["*:shrink-0 flex flex-row overflow-auto p-1.5 gap-1.5", disabled && "opacity-60 pointer-events-none"]))}>`);
					Button($$renderer, {
						onclick: () => wrapSelection("**", "**"),
						title: "Bold",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Bold,
								size: "15",
								micro: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("*", "*"),
						title: "Italic",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Italic,
								size: "15",
								micro: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("[", "](https://example.com)"),
						title: "Link",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Link,
								size: "15",
								micro: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("\n# ", ""),
						title: "Header",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: H1,
								size: "15",
								micro: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("~~", "~~"),
						title: "Strikethrough",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Strikethrough,
								size: "15",
								micro: true
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("\n> ", ""),
						title: "Quote",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							$$renderer.push(`<span class="font-bold font-serif text-lg">"</span>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("\n- ", ""),
						title: "List",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: ListBullet,
								micro: true,
								size: "15"
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("`", "`"),
						title: "Code",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: CodeBracket,
								micro: true,
								size: "15"
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("::: spoiler <spoiler title>\n", "\n:::"),
						title: "Spoiler",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: ExclamationTriangle,
								micro: true,
								size: "15"
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("~", "~"),
						title: "Subscript",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							$$renderer.push(`<span class="font-bold">X <sub>1</sub></span>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						onclick: () => wrapSelection("^", "^"),
						title: "Superscript",
						size: "custom",
						class: "w-8 h-8",
						rounding: "lg",
						children: ($$renderer) => {
							$$renderer.push(`<span class="font-bold">X <sup>1</sup></span>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (images) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							onclick: () => uploadingImage = !uploadingImage,
							title: "Image",
							size: "custom",
							class: "w-8 h-8",
							rounding: "lg",
							children: ($$renderer) => {
								Icon($$renderer, {
									src: Photo,
									size: "15",
									micro: true
								});
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				TextArea($$renderer, spread_props([
					{
						class: "z-0 focus:ring-transparent! transition-none! resize-none",
						onkeydown: (e) => {
							if (disabled) return;
							if (e.ctrlKey || e.metaKey) {
								handleKeydown(e);
								let shortcut = shortcuts[e.key];
								if (shortcut) {
									e.preventDefault();
									shortcut?.(e);
								}
							}
						},
						unstyled: true,
						oninput: adjustHeight,
						onpaste: (e) => {
							if (!e.clipboardData?.files) return;
							if (Array.from(e.clipboardData.files)[0]?.type.startsWith("image/")) {
								image = e.clipboardData.files;
								uploadingImage = true;
							}
						},
						rows
					},
					rest,
					{
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						},
						get element() {
							return textArea;
						},
						set element($$value) {
							textArea = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push(`<!---->`);
			}
			$$renderer.push(`<!--]--> `);
			if (previewButton) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="p-2 flex flex-row items-center w-full gap-1">`);
				if (previewButton) {
					$$renderer.push("<!--[0-->");
					Switch($$renderer, {
						options: [false, true],
						optionNames: ["Edit", "Preview"],
						get selected() {
							return previewing;
						},
						set selected($$value) {
							previewing = $$value;
							$$settled = false;
						}
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				children?.($$renderer);
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			value,
			previewing
		});
	});
}
//#endregion
export { DocumentPlus as i, ImageAttachForm as n, ProgressBar as r, MarkdownEditor as t };

//# sourceMappingURL=MarkdownEditor.js.map