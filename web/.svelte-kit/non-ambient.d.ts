
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/accounts" | "/accounts/login" | "/accounts/login/guest" | "/activitypub" | "/activitypub/externalInteraction" | "/admin" | "/admin/applications" | "/admin/config" | "/admin/federation" | "/admin/media" | "/admin/taglines" | "/admin/team" | "/comment" | "/comment/[instance]" | "/comment/[instance]/[id=integer]" | "/comment/[instance]/[id=integer]/confirm" | "/communities" | "/create" | "/create/community" | "/create/post" | "/c" | "/c/[name]" | "/c/[name]/settings" | "/c/[name]/settings/team" | "/error" | "/explore" | "/explore/communities" | "/explore/feeds" | "/explore/topics" | "/f" | "/f/[id]" | "/go" | "/go/[...link]" | "/inbox" | "/inbox/messages" | "/inbox/messages/[user_id=integer]" | "/instances" | "/instances/blocked" | "/instances/linked" | "/legal" | "/login_reset" | "/login" | "/login/guest" | "/moderation" | "/moderation/communities" | "/moderation/c" | "/moderation/c/[id=integer]" | "/modlog" | "/modlog/item" | "/password_change" | "/password_change/[token]" | "/plugins" | "/plugins/upload" | "/plugins/[id]" | "/post" | "/post/[instance]" | "/post/[instance]/[id=integer]" | "/post/[instance]/[id=integer]/confirm" | "/profile/(local_user)" | "/profile" | "/profile/(local_user)/blocks" | "/profile/(local_user)/blocks/communities" | "/profile/(local_user)/blocks/instances" | "/profile/(local_user)/blocks/users" | "/profile/media" | "/profile/(local_user)/password" | "/profile/(local_user)/password/2fa" | "/profile/(local_user)/password/change" | "/profile/(local_user)/password/delete" | "/profile/(local_user)/password/logins" | "/profile/(local_user)/settings" | "/profile/user" | "/profile/voted" | "/profile/voted/[type]" | "/registration_applications" | "/reports" | "/saved" | "/search" | "/settings" | "/settings/affinity" | "/settings/app" | "/settings/credits" | "/settings/embeds" | "/settings/lemmy" | "/settings/lists" | "/settings/lists/create" | "/settings/lists/[id]" | "/settings/moderation" | "/settings/other" | "/signup" | "/signup/[instance]" | "/theme" | "/topic" | "/topic/[id]" | "/translators" | "/util" | "/util/components" | "/util/constants" | "/util/functions" | "/util/instance" | "/util/photonify" | "/util/placeholder" | "/u" | "/u/[name]" | "/verify_email" | "/verify_email/[token]";
		RouteParams(): {
			"/comment/[instance]": { instance: string };
			"/comment/[instance]/[id=integer]": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/comment/[instance]/[id=integer]/confirm": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/c/[name]": { name: string };
			"/c/[name]/settings": { name: string };
			"/c/[name]/settings/team": { name: string };
			"/f/[id]": { id: string };
			"/go/[...link]": { link: string };
			"/inbox/messages/[user_id=integer]": { user_id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/moderation/c/[id=integer]": { id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/password_change/[token]": { token: string };
			"/plugins/[id]": { id: string };
			"/post/[instance]": { instance: string };
			"/post/[instance]/[id=integer]": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/post/[instance]/[id=integer]/confirm": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/profile/voted/[type]": { type: string };
			"/settings/lists/[id]": { id: string };
			"/signup/[instance]": { instance: string };
			"/topic/[id]": { id: string };
			"/u/[name]": { name: string };
			"/verify_email/[token]": { token: string }
		};
		LayoutParams(): {
			"/": { instance?: string | undefined; id?: string | undefined; name?: string | undefined; link?: string | undefined; user_id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined; token?: string | undefined; type?: string | undefined };
			"/accounts": Record<string, never>;
			"/accounts/login": Record<string, never>;
			"/accounts/login/guest": Record<string, never>;
			"/activitypub": Record<string, never>;
			"/activitypub/externalInteraction": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/applications": Record<string, never>;
			"/admin/config": Record<string, never>;
			"/admin/federation": Record<string, never>;
			"/admin/media": Record<string, never>;
			"/admin/taglines": Record<string, never>;
			"/admin/team": Record<string, never>;
			"/comment": { instance?: string | undefined; id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/comment/[instance]": { instance: string; id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/comment/[instance]/[id=integer]": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/comment/[instance]/[id=integer]/confirm": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/communities": Record<string, never>;
			"/create": Record<string, never>;
			"/create/community": Record<string, never>;
			"/create/post": Record<string, never>;
			"/c": { name?: string | undefined };
			"/c/[name]": { name: string };
			"/c/[name]/settings": { name: string };
			"/c/[name]/settings/team": { name: string };
			"/error": Record<string, never>;
			"/explore": Record<string, never>;
			"/explore/communities": Record<string, never>;
			"/explore/feeds": Record<string, never>;
			"/explore/topics": Record<string, never>;
			"/f": { id?: string | undefined };
			"/f/[id]": { id: string };
			"/go": { link?: string | undefined };
			"/go/[...link]": { link: string };
			"/inbox": { user_id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/inbox/messages": { user_id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/inbox/messages/[user_id=integer]": { user_id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/instances": Record<string, never>;
			"/instances/blocked": Record<string, never>;
			"/instances/linked": Record<string, never>;
			"/legal": Record<string, never>;
			"/login_reset": Record<string, never>;
			"/login": Record<string, never>;
			"/login/guest": Record<string, never>;
			"/moderation": { id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/moderation/communities": Record<string, never>;
			"/moderation/c": { id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/moderation/c/[id=integer]": { id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/modlog": Record<string, never>;
			"/modlog/item": Record<string, never>;
			"/password_change": { token?: string | undefined };
			"/password_change/[token]": { token: string };
			"/plugins": { id?: string | undefined };
			"/plugins/upload": Record<string, never>;
			"/plugins/[id]": { id: string };
			"/post": { instance?: string | undefined; id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/post/[instance]": { instance: string; id?: MatcherParam<typeof import('../src/params/integer.js').match> | undefined };
			"/post/[instance]/[id=integer]": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/post/[instance]/[id=integer]/confirm": { instance: string; id: MatcherParam<typeof import('../src/params/integer.js').match> };
			"/profile/(local_user)": Record<string, never>;
			"/profile": { type?: string | undefined };
			"/profile/(local_user)/blocks": Record<string, never>;
			"/profile/(local_user)/blocks/communities": Record<string, never>;
			"/profile/(local_user)/blocks/instances": Record<string, never>;
			"/profile/(local_user)/blocks/users": Record<string, never>;
			"/profile/media": Record<string, never>;
			"/profile/(local_user)/password": Record<string, never>;
			"/profile/(local_user)/password/2fa": Record<string, never>;
			"/profile/(local_user)/password/change": Record<string, never>;
			"/profile/(local_user)/password/delete": Record<string, never>;
			"/profile/(local_user)/password/logins": Record<string, never>;
			"/profile/(local_user)/settings": Record<string, never>;
			"/profile/user": Record<string, never>;
			"/profile/voted": { type?: string | undefined };
			"/profile/voted/[type]": { type: string };
			"/registration_applications": Record<string, never>;
			"/reports": Record<string, never>;
			"/saved": Record<string, never>;
			"/search": Record<string, never>;
			"/settings": { id?: string | undefined };
			"/settings/affinity": Record<string, never>;
			"/settings/app": Record<string, never>;
			"/settings/credits": Record<string, never>;
			"/settings/embeds": Record<string, never>;
			"/settings/lemmy": Record<string, never>;
			"/settings/lists": { id?: string | undefined };
			"/settings/lists/create": Record<string, never>;
			"/settings/lists/[id]": { id: string };
			"/settings/moderation": Record<string, never>;
			"/settings/other": Record<string, never>;
			"/signup": { instance?: string | undefined };
			"/signup/[instance]": { instance: string };
			"/theme": Record<string, never>;
			"/topic": { id?: string | undefined };
			"/topic/[id]": { id: string };
			"/translators": Record<string, never>;
			"/util": Record<string, never>;
			"/util/components": Record<string, never>;
			"/util/constants": Record<string, never>;
			"/util/functions": Record<string, never>;
			"/util/instance": Record<string, never>;
			"/util/photonify": Record<string, never>;
			"/util/placeholder": Record<string, never>;
			"/u": { name?: string | undefined };
			"/u/[name]": { name: string };
			"/verify_email": { token?: string | undefined };
			"/verify_email/[token]": { token: string }
		};
		Pathname(): "/" | "/accounts" | "/accounts/login" | "/accounts/login/guest" | "/activitypub/externalInteraction" | "/admin" | "/admin/applications" | "/admin/config" | "/admin/federation" | "/admin/media" | "/admin/taglines" | "/admin/team" | `/comment/${string}` & {} | `/comment/${string}/${string}` & {} | `/comment/${string}/${string}/confirm` & {} | "/communities" | "/create" | "/create/community" | "/create/post" | `/c/${string}` & {} | `/c/${string}/settings` & {} | `/c/${string}/settings/team` & {} | "/error" | "/explore/communities" | "/explore/feeds" | "/explore/topics" | `/f/${string}` & {} | "/go" | `/go/${string}` & {} | "/inbox" | "/inbox/messages" | `/inbox/messages/${string}` & {} | "/instances" | "/instances/blocked" | "/instances/linked" | "/legal" | "/login_reset" | "/login" | "/login/guest" | "/moderation" | "/moderation/communities" | `/moderation/c/${string}` & {} | "/modlog" | `/password_change/${string}` & {} | "/plugins" | "/plugins/upload" | `/plugins/${string}` & {} | `/post/${string}` & {} | `/post/${string}/${string}` & {} | `/post/${string}/${string}/confirm` & {} | "/profile" | "/profile/blocks" | "/profile/blocks/communities" | "/profile/blocks/instances" | "/profile/blocks/users" | "/profile/media" | "/profile/password" | "/profile/password/2fa" | "/profile/password/change" | "/profile/password/delete" | "/profile/password/logins" | "/profile/settings" | "/profile/user" | `/profile/voted/${string}` & {} | "/registration_applications" | "/reports" | "/saved" | "/search" | "/settings" | "/settings/affinity" | "/settings/app" | "/settings/credits" | "/settings/embeds" | "/settings/lemmy" | "/settings/lists" | "/settings/lists/create" | `/settings/lists/${string}` & {} | "/settings/moderation" | "/settings/other" | "/signup" | `/signup/${string}` & {} | "/theme" | `/topic/${string}` & {} | "/translators" | "/util" | "/util/components" | "/util/constants" | "/util/functions" | "/util/instance" | "/util/photonify" | "/util/placeholder" | `/u/${string}` & {} | `/verify_email/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.well-known/assetlinks.json" | "/favicon.png" | "/font/Inter.woff2" | "/font/RobotoSlab.woff2" | "/img/logo-background.svg" | "/img/logo-isolated-dynamic.svg" | "/img/logo-isolated.svg" | "/img/logo-square.svg" | "/img/pwa/narrow.webp" | "/img/pwa/wide.webp" | "/logo_512.png" | "/manifest.json" | "/robots.txt" | string & {};
	}
}