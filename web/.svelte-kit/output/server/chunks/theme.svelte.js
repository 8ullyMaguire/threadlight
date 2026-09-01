import { t as public_env } from "./shared-server.js";
import { o as derived } from "./server.js";
//#region src/lib/app/theme/presets.ts
var PHOTON_DEFAULT = {
	slate: {
		25: "252 253 254",
		50: "248 250 252",
		100: "241 245 249",
		200: "226 232 240",
		300: "203 213 225",
		400: "148 163 184",
		500: "100 116 139",
		600: "71 85 105",
		700: "51 65 85",
		800: "30 41 59",
		900: "15 23 42",
		950: "2 6 23"
	},
	zinc: {
		"50": "252 252 254",
		"100": "248 248 251",
		"200": "235 235 240",
		"300": "222 222 228",
		"400": "175 175 185",
		"500": "128 128 138",
		"600": "98 98 108",
		"700": "68 68 76",
		"800": "47 47 54",
		"900": "34 34 39",
		"925": "28 28 32",
		"950": "25 25 29"
	},
	primary: {
		100: "241 245 249",
		900: "15 23 42"
	},
	other: {
		black: "0 0 0",
		white: "255 255 255"
	}
};
function getDefaultColors() {
	return public_env.PUBLIC_THEME ? JSON.parse(public_env.PUBLIC_THEME) : PHOTON_DEFAULT;
}
function getDefaultTheme() {
	return {
		id: 0,
		colors: getDefaultColors(),
		name: public_env.PUBLIC_THEME ? "Instance Default" : "Mono"
	};
}
var presets = [
	getDefaultTheme(),
	...public_env.PUBLIC_THEME ? [{
		colors: PHOTON_DEFAULT,
		id: -10,
		name: "Mono"
	}] : [],
	{
		colors: {
			slate: {
				25: "252 253 254",
				50: "248 250 252",
				100: "241 245 249",
				200: "226 232 240",
				300: "203 213 225",
				400: "148 163 184",
				500: "100 116 139",
				600: "71 85 105",
				700: "51 65 85",
				800: "30 41 59",
				900: "15 23 42",
				950: "2 6 23"
			},
			zinc: {
				50: "250 250 250",
				100: "244 244 245",
				200: "228 228 231",
				300: "212 212 216",
				400: "161 161 170",
				500: "113 113 122",
				600: "82 82 91",
				700: "52 52 59",
				800: "31 31 36",
				900: "18 18 21",
				925: "12 12 14",
				950: "9 9 11"
			},
			primary: {
				100: "241 245 249",
				900: "15 23 42"
			},
			other: {
				black: "0 0 0",
				white: "255 255 255"
			}
		},
		id: -1,
		name: "Classic"
	},
	{
		colors: {
			slate: {
				25: "252 253 254",
				50: "248 250 252",
				100: "241 245 249",
				200: "226 232 240",
				300: "203 213 225",
				400: "148 163 184",
				500: "100 116 139",
				600: "71 85 105",
				700: "51 65 85",
				800: "30 41 59",
				900: "15 23 42",
				950: "2 6 23"
			},
			zinc: {
				50: `249 250 251`,
				100: `243 244 246`,
				200: `229 231 235`,
				300: `209 213 219`,
				400: `156 163 175`,
				500: `107 114 128`,
				600: `75 85 99`,
				700: "30 30 30",
				800: "22 22 22",
				900: "10 10 10",
				925: "0 0 0",
				950: `0 0 0`
			},
			primary: {
				100: "241 245 249",
				900: "15 23 42"
			},
			other: {
				black: `0 0 0`,
				white: `255 255 255`
			}
		},
		id: -2,
		name: "AMOLED"
	},
	{
		colors: {
			zinc: {
				"50": "205 214 244",
				"100": "186 194 222",
				"200": "166 173 200",
				"300": "147 153 178",
				"400": "127 132 156",
				"500": "108 112 134",
				"600": "88 91 112",
				"700": "69 71 90",
				"800": "49 50 68",
				"900": "30 30 46",
				"925": "24 24 37",
				"950": "17 17 27"
			},
			primary: {
				"100": "166 227 161",
				"900": "114 135 253"
			},
			other: { white: "239 241 245" },
			slate: {
				"25": "239 241 245",
				"50": "230 233 239",
				"100": "220 224 232",
				"200": "204 208 218",
				"300": "188 192 204",
				"400": "172 176 190",
				"500": "140 143 161",
				"600": "124 127 147",
				"700": "108 111 133",
				"800": "92 95 119",
				"900": "76 79 105",
				"950": "76 79 105"
			}
		},
		id: -3,
		name: "Catppuccin"
	},
	{
		colors: {
			slate: {
				25: "251 251 251",
				50: "242 242 242",
				100: "229 229 229",
				200: "226 226 226",
				300: "222 222 222",
				400: "154 153 150",
				500: "102 102 102",
				600: "51 51 51",
				700: "85 85 85",
				800: "51 51 51",
				900: "51 51 51",
				950: "7 7 7"
			},
			zinc: {
				50: "253 253 253",
				100: "244 244 244",
				200: "226 226 226",
				300: "213 213 213",
				400: "163 163 163",
				500: "114 114 114",
				600: "85 85 85",
				700: "78 78 78",
				800: "59 59 59",
				900: "42 42 42",
				925: "34 34 34",
				950: "29 29 29"
			},
			primary: {
				100: "241 245 249",
				900: "15 23 42"
			},
			other: {
				black: "0 0 0",
				white: "255 255 255"
			}
		},
		id: -4,
		name: "Neutral"
	}
];
//#endregion
//#region src/lib/app/theme/theme.svelte.ts
function hexToRgb(value) {
	if (!/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return value;
	let hex = value.replace("#", "");
	if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	return `${parseInt(hex.substring(0, 2), 16)} ${parseInt(hex.substring(2, 4), 16)} ${parseInt(hex.substring(4, 6), 16)}`;
}
function rgbToHex(rgbString) {
	const rgb = rgbString.split(" ");
	if (rgb.length !== 3) return rgbString;
	const [r, g, b] = rgb.map((val) => {
		const num = parseInt(val, 10);
		if (isNaN(num) || num < 0 || num > 255) return 0;
		return num;
	});
	const toHex = (n) => n.toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
var configuredColorScheme = public_env.PUBLIC_COLORSCHEME ?? "system";
var ThemeState = class {
	constructor() {
		const localColorScheme = configuredColorScheme;
		this.#colorScheme = localColorScheme;
	}
	#data = loadTheme() ?? {
		scheme: "system",
		themes: presets,
		currentTheme: 0
	};
	#current = derived(() => this.#data.themes.find((i) => i.id == this.#data.currentTheme) ?? getDefaultTheme());
	#colorScheme = configuredColorScheme;
	#vars = derived(() => calculateVars(this.#current()));
	get current() {
		return this.#current();
	}
	set current(value) {
		if (!value) return;
		const index = this.#data.themes.findIndex((i) => i.id == value?.id);
		this.#data.themes[index] = value;
	}
	get colorScheme() {
		return this.#colorScheme;
	}
	set colorScheme(value) {
		this.#colorScheme = value;
	}
	get vars() {
		return this.#vars();
	}
	get data() {
		return this.#data;
	}
	set data(value) {
		this.#data = value;
	}
};
var theme = new ThemeState();
function calculateVars(theme) {
	let cssVariables = "";
	for (const [scheme, colors] of Object.entries(theme.colors)) for (const [key, value] of Object.entries(colors)) cssVariables += `--color-${scheme}-${key}:rgb(${hexToRgb(value)}); `;
	return cssVariables.trim();
}
var inDarkColorScheme = () => {
	return false;
};
function loadTheme() {}
//#endregion
export { getDefaultColors as i, rgbToHex as n, theme as r, inDarkColorScheme as t };

//# sourceMappingURL=theme.svelte.js.map