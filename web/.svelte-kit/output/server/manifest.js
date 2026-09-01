export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".well-known/assetlinks.json","favicon.png","font/Inter.woff2","font/RobotoSlab.woff2","img/logo-background.svg","img/logo-isolated-dynamic.svg","img/logo-isolated.svg","img/logo-square.svg","img/pwa/narrow.webp","img/pwa/wide.webp","logo_512.png","manifest.json","robots.txt","service-worker.js"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".woff2":"font/woff2",".svg":"image/svg+xml",".webp":"image/webp",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.DxvLy2Ld.js",app:"_app/immutable/entry/app.B6ZoK_8p.js",imports:["_app/immutable/entry/start.DxvLy2Ld.js","_app/immutable/chunks/CrIi_4GS.js","_app/immutable/chunks/DhdsNEKP.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/entry/app.B6ZoK_8p.js","_app/immutable/chunks/DhdsNEKP.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js')),
			__memo(() => import('./nodes/43.js')),
			__memo(() => import('./nodes/44.js')),
			__memo(() => import('./nodes/45.js')),
			__memo(() => import('./nodes/46.js')),
			__memo(() => import('./nodes/47.js')),
			__memo(() => import('./nodes/48.js')),
			__memo(() => import('./nodes/49.js')),
			__memo(() => import('./nodes/50.js')),
			__memo(() => import('./nodes/51.js')),
			__memo(() => import('./nodes/52.js')),
			__memo(() => import('./nodes/53.js')),
			__memo(() => import('./nodes/54.js')),
			__memo(() => import('./nodes/55.js')),
			__memo(() => import('./nodes/56.js')),
			__memo(() => import('./nodes/57.js')),
			__memo(() => import('./nodes/58.js')),
			__memo(() => import('./nodes/59.js')),
			__memo(() => import('./nodes/60.js')),
			__memo(() => import('./nodes/61.js')),
			__memo(() => import('./nodes/62.js')),
			__memo(() => import('./nodes/63.js')),
			__memo(() => import('./nodes/64.js')),
			__memo(() => import('./nodes/65.js')),
			__memo(() => import('./nodes/66.js')),
			__memo(() => import('./nodes/67.js')),
			__memo(() => import('./nodes/68.js')),
			__memo(() => import('./nodes/69.js')),
			__memo(() => import('./nodes/70.js')),
			__memo(() => import('./nodes/71.js')),
			__memo(() => import('./nodes/72.js')),
			__memo(() => import('./nodes/73.js')),
			__memo(() => import('./nodes/74.js')),
			__memo(() => import('./nodes/75.js')),
			__memo(() => import('./nodes/76.js')),
			__memo(() => import('./nodes/77.js')),
			__memo(() => import('./nodes/78.js')),
			__memo(() => import('./nodes/79.js')),
			__memo(() => import('./nodes/80.js')),
			__memo(() => import('./nodes/81.js')),
			__memo(() => import('./nodes/82.js')),
			__memo(() => import('./nodes/83.js')),
			__memo(() => import('./nodes/84.js')),
			__memo(() => import('./nodes/85.js')),
			__memo(() => import('./nodes/86.js')),
			__memo(() => import('./nodes/87.js')),
			__memo(() => import('./nodes/88.js')),
			__memo(() => import('./nodes/89.js')),
			__memo(() => import('./nodes/90.js')),
			__memo(() => import('./nodes/91.js')),
			__memo(() => import('./nodes/92.js')),
			__memo(() => import('./nodes/93.js')),
			__memo(() => import('./nodes/94.js')),
			__memo(() => import('./nodes/95.js')),
			__memo(() => import('./nodes/96.js')),
			__memo(() => import('./nodes/97.js')),
			__memo(() => import('./nodes/98.js')),
			__memo(() => import('./nodes/99.js')),
			__memo(() => import('./nodes/100.js')),
			__memo(() => import('./nodes/101.js')),
			__memo(() => import('./nodes/102.js')),
			__memo(() => import('./nodes/103.js')),
			__memo(() => import('./nodes/104.js')),
			__memo(() => import('./nodes/105.js')),
			__memo(() => import('./nodes/106.js')),
			__memo(() => import('./nodes/107.js')),
			__memo(() => import('./nodes/108.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/accounts",
				pattern: /^\/accounts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/accounts/login",
				pattern: /^\/accounts\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/accounts/login/guest",
				pattern: /^\/accounts\/login\/guest\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/activitypub/externalInteraction",
				pattern: /^\/activitypub\/externalInteraction\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/admin/applications",
				pattern: /^\/admin\/applications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/admin/config",
				pattern: /^\/admin\/config\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/admin/federation",
				pattern: /^\/admin\/federation\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/admin/media",
				pattern: /^\/admin\/media\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/admin/taglines",
				pattern: /^\/admin\/taglines\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/admin/team",
				pattern: /^\/admin\/team\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/comment/[instance]",
				pattern: /^\/comment\/([^/]+?)\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/comment/[instance]/[id=integer]",
				pattern: /^\/comment\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false},{"name":"id","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/comment/[instance]/[id=integer]/confirm",
				pattern: /^\/comment\/([^/]+?)\/([^/]+?)\/confirm\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false},{"name":"id","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/communities",
				pattern: /^\/communities\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/create",
				pattern: /^\/create\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/create/community",
				pattern: /^\/create\/community\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/create/post",
				pattern: /^\/create\/post\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/c/[name]",
				pattern: /^\/c\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/c/[name]/settings",
				pattern: /^\/c\/([^/]+?)\/settings\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/c/[name]/settings/team",
				pattern: /^\/c\/([^/]+?)\/settings\/team\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/error",
				pattern: /^\/error\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/explore/communities",
				pattern: /^\/explore\/communities\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/explore/feeds",
				pattern: /^\/explore\/feeds\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/explore/topics",
				pattern: /^\/explore\/topics\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/f/[id]",
				pattern: /^\/f\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/go",
				pattern: /^\/go\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/go/[...link]",
				pattern: /^\/go(?:\/([^]*))?\/?$/,
				params: [{"name":"link","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/inbox",
				pattern: /^\/inbox\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/inbox/messages",
				pattern: /^\/inbox\/messages\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/inbox/messages/[user_id=integer]",
				pattern: /^\/inbox\/messages\/([^/]+?)\/?$/,
				params: [{"name":"user_id","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,6,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/instances",
				pattern: /^\/instances\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/instances/blocked",
				pattern: /^\/instances\/blocked\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/instances/linked",
				pattern: /^\/instances\/linked\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/legal",
				pattern: /^\/legal\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/login_reset",
				pattern: /^\/login_reset\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/login/guest",
				pattern: /^\/login\/guest\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/moderation",
				pattern: /^\/moderation\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/moderation/communities",
				pattern: /^\/moderation\/communities\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/moderation/c/[id=integer]",
				pattern: /^\/moderation\/c\/([^/]+?)\/?$/,
				params: [{"name":"id","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,8,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/modlog",
				pattern: /^\/modlog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/password_change/[token]",
				pattern: /^\/password_change\/([^/]+?)\/?$/,
				params: [{"name":"token","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/plugins",
				pattern: /^\/plugins\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/plugins/upload",
				pattern: /^\/plugins\/upload\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/plugins/[id]",
				pattern: /^\/plugins\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/post/[instance]",
				pattern: /^\/post\/([^/]+?)\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/post/[instance]/[id=integer]",
				pattern: /^\/post\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false},{"name":"id","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/post/[instance]/[id=integer]/confirm",
				pattern: /^\/post\/([^/]+?)\/([^/]+?)\/confirm\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false},{"name":"id","matcher":"integer","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/blocks",
				pattern: /^\/profile\/blocks\/?$/,
				params: [],
				page: { layouts: [0,9,10,11,], errors: [1,,,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/blocks/communities",
				pattern: /^\/profile\/blocks\/communities\/?$/,
				params: [],
				page: { layouts: [0,9,10,11,], errors: [1,,,,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/blocks/instances",
				pattern: /^\/profile\/blocks\/instances\/?$/,
				params: [],
				page: { layouts: [0,9,10,11,], errors: [1,,,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/blocks/users",
				pattern: /^\/profile\/blocks\/users\/?$/,
				params: [],
				page: { layouts: [0,9,10,11,], errors: [1,,,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/profile/media",
				pattern: /^\/profile\/media\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 77 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/password",
				pattern: /^\/profile\/password\/?$/,
				params: [],
				page: { layouts: [0,9,10,12,], errors: [1,,,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/password/2fa",
				pattern: /^\/profile\/password\/2fa\/?$/,
				params: [],
				page: { layouts: [0,9,10,12,], errors: [1,,,,], leaf: 72 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/password/change",
				pattern: /^\/profile\/password\/change\/?$/,
				params: [],
				page: { layouts: [0,9,10,12,], errors: [1,,,,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/password/delete",
				pattern: /^\/profile\/password\/delete\/?$/,
				params: [],
				page: { layouts: [0,9,10,12,], errors: [1,,,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/password/logins",
				pattern: /^\/profile\/password\/logins\/?$/,
				params: [],
				page: { layouts: [0,9,10,12,], errors: [1,,,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/profile/(local_user)/settings",
				pattern: /^\/profile\/settings\/?$/,
				params: [],
				page: { layouts: [0,9,10,], errors: [1,,,], leaf: 76 },
				endpoint: null
			},
			{
				id: "/profile/user",
				pattern: /^\/profile\/user\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 78 },
				endpoint: null
			},
			{
				id: "/profile/voted/[type]",
				pattern: /^\/profile\/voted\/([^/]+?)\/?$/,
				params: [{"name":"type","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,9,], errors: [1,,], leaf: 79 },
				endpoint: null
			},
			{
				id: "/registration_applications",
				pattern: /^\/registration_applications\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 80 },
				endpoint: null
			},
			{
				id: "/reports",
				pattern: /^\/reports\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 81 },
				endpoint: null
			},
			{
				id: "/saved",
				pattern: /^\/saved\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 82 },
				endpoint: null
			},
			{
				id: "/search",
				pattern: /^\/search\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 83 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 84 },
				endpoint: null
			},
			{
				id: "/settings/affinity",
				pattern: /^\/settings\/affinity\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 85 },
				endpoint: null
			},
			{
				id: "/settings/app",
				pattern: /^\/settings\/app\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 86 },
				endpoint: null
			},
			{
				id: "/settings/credits",
				pattern: /^\/settings\/credits\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 87 },
				endpoint: null
			},
			{
				id: "/settings/embeds",
				pattern: /^\/settings\/embeds\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 88 },
				endpoint: null
			},
			{
				id: "/settings/lemmy",
				pattern: /^\/settings\/lemmy\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 89 },
				endpoint: null
			},
			{
				id: "/settings/lists",
				pattern: /^\/settings\/lists\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 90 },
				endpoint: null
			},
			{
				id: "/settings/lists/create",
				pattern: /^\/settings\/lists\/create\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 92 },
				endpoint: null
			},
			{
				id: "/settings/lists/[id]",
				pattern: /^\/settings\/lists\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,13,], errors: [1,,], leaf: 91 },
				endpoint: null
			},
			{
				id: "/settings/moderation",
				pattern: /^\/settings\/moderation\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 93 },
				endpoint: null
			},
			{
				id: "/settings/other",
				pattern: /^\/settings\/other\/?$/,
				params: [],
				page: { layouts: [0,13,], errors: [1,,], leaf: 94 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,14,], errors: [1,,], leaf: 95 },
				endpoint: null
			},
			{
				id: "/signup/[instance]",
				pattern: /^\/signup\/([^/]+?)\/?$/,
				params: [{"name":"instance","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,14,], errors: [1,,], leaf: 96 },
				endpoint: null
			},
			{
				id: "/theme",
				pattern: /^\/theme\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 97 },
				endpoint: null
			},
			{
				id: "/topic/[id]",
				pattern: /^\/topic\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 98 },
				endpoint: null
			},
			{
				id: "/translators",
				pattern: /^\/translators\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 99 },
				endpoint: null
			},
			{
				id: "/util",
				pattern: /^\/util\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 101 },
				endpoint: null
			},
			{
				id: "/util/components",
				pattern: /^\/util\/components\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 102 },
				endpoint: null
			},
			{
				id: "/util/constants",
				pattern: /^\/util\/constants\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 103 },
				endpoint: null
			},
			{
				id: "/util/functions",
				pattern: /^\/util\/functions\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 104 },
				endpoint: null
			},
			{
				id: "/util/instance",
				pattern: /^\/util\/instance\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 105 },
				endpoint: null
			},
			{
				id: "/util/photonify",
				pattern: /^\/util\/photonify\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 106 },
				endpoint: null
			},
			{
				id: "/util/placeholder",
				pattern: /^\/util\/placeholder\/?$/,
				params: [],
				page: { layouts: [0,15,], errors: [1,,], leaf: 107 },
				endpoint: null
			},
			{
				id: "/u/[name]",
				pattern: /^\/u\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 100 },
				endpoint: null
			},
			{
				id: "/verify_email/[token]",
				pattern: /^\/verify_email\/([^/]+?)\/?$/,
				params: [{"name":"token","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 108 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			const { match: integer } = await import ('./entries/matchers/integer.js')
			return { integer };
		},
		server_assets: {}
	}
}
})();
