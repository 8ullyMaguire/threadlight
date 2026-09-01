import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/accounts" | "/accounts/login" | "/accounts/login/guest" | "/activitypub/externalInteraction" | "/admin" | "/admin/applications" | "/admin/config" | "/admin/federation" | "/admin/media" | "/admin/taglines" | "/admin/team" | "/c/[name]" | "/c/[name]/settings" | "/c/[name]/settings/team" | "/comment/[instance]" | "/comment/[instance]/[id=integer]" | "/comment/[instance]/[id=integer]/confirm" | "/communities" | "/create" | "/create/community" | "/create/post" | "/error" | "/explore/communities" | "/explore/feeds" | "/explore/topics" | "/f/[id]" | "/go" | "/go/[...link]" | "/inbox" | "/inbox/messages" | "/inbox/messages/[user_id=integer]" | "/instances" | "/instances/blocked" | "/instances/linked" | "/legal" | "/login" | "/login/guest" | "/login_reset" | "/moderation" | "/moderation/c/[id=integer]" | "/moderation/communities" | "/modlog" | "/password_change/[token]" | "/plugins" | "/plugins/[id]" | "/plugins/upload" | "/post/[instance]" | "/post/[instance]/[id=integer]" | "/post/[instance]/[id=integer]/confirm" | "/profile" | "/profile/(local_user)/blocks" | "/profile/(local_user)/blocks/communities" | "/profile/(local_user)/blocks/instances" | "/profile/(local_user)/blocks/users" | "/profile/(local_user)/password" | "/profile/(local_user)/password/2fa" | "/profile/(local_user)/password/change" | "/profile/(local_user)/password/delete" | "/profile/(local_user)/password/logins" | "/profile/(local_user)/settings" | "/profile/media" | "/profile/user" | "/profile/voted/[type]" | "/registration_applications" | "/reports" | "/saved" | "/search" | "/settings" | "/settings/affinity" | "/settings/app" | "/settings/credits" | "/settings/embeds" | "/settings/lemmy" | "/settings/lists" | "/settings/lists/[id]" | "/settings/lists/create" | "/settings/moderation" | "/settings/other" | "/signup" | "/signup/[instance]" | "/theme" | "/topic/[id]" | "/translators" | "/u/[name]" | "/util" | "/util/components" | "/util/constants" | "/util/functions" | "/util/instance" | "/util/photonify" | "/util/placeholder" | "/verify_email/[token]" | null
type LayoutParams = RouteParams & { name?: string | undefined; instance?: string | undefined; id?: MatcherParam<typeof import('../../../../src/params/integer.js').match> | undefined; link?: string | undefined; user_id?: MatcherParam<typeof import('../../../../src/params/integer.js').match> | undefined; token?: string | undefined; type?: string | undefined }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageLoad<OutputData extends OutputDataShape<PageParentData> = OutputDataShape<PageParentData>> = Kit.Load<RouteParams, PageServerData, PageParentData, OutputData, RouteId>;
export type PageLoadEvent = Parameters<PageLoad>[0];
export type PageData = Expand<Omit<PageParentData, keyof Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+page.js').load>>>> & OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+page.js').load>>>>>>;
export type PageProps = { params: RouteParams; data: PageData }
export type LayoutServerData = null;
export type LayoutLoad<OutputData extends OutputDataShape<LayoutParentData> = OutputDataShape<LayoutParentData>> = Kit.Load<LayoutParams, LayoutServerData, LayoutParentData, OutputData, LayoutRouteId>;
export type LayoutLoadEvent = Parameters<LayoutLoad>[0];
export type LayoutData = Expand<Omit<LayoutParentData, keyof Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+layout.js').load>>>> & OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('../../../../src/routes/+layout.js').load>>>>>>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }