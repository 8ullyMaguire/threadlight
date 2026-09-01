import { a as onDestroy } from "../../../../chunks/internal.js";
import { n as attr, o as escape_html } from "../../../../chunks/validate.js";
import { c as ensure_array_like, l as head, o as derived } from "../../../../chunks/server.js";
import { $n as ArrowRight, C as PostListShell, Zt as Button, c as Note, l as Badge, o as profile, r as site, un as Plus } from "../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../chunks/Placeholder.js";
import "../../../../chunks/session.js";
import { t as CommunityHeader } from "../../../../chunks/CommunityHeader2.js";
//#region src/routes/c/[name]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let isModOrCurator = derived(() => profile.current?.user && data.community?.moderators?.some((m) => (m.moderator?.id ?? m.person?.id) === profile.current?.user?.local_user_view?.person?.id));
		onDestroy(() => {});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("7oe38s", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(data.community.community_view.community.title)}</title>`);
				});
				$$renderer.push(`<meta name="og:title"${attr("content", data.community.community_view.community.title)}/> `);
				if (data.community.community_view.community.description) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<meta name="og:description"${attr("content", data.community.community_view.community.description)}/>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			});
			{
				function extended($$renderer) {
					CommunityHeader($$renderer, {
						blocked: data.community.community_view.blocked,
						moderators: data.community.moderators,
						counts: data.community.community_view.counts,
						class: "w-full relative",
						compact: "lg",
						avatarCircle: false,
						get community() {
							return data.community.community_view.community;
						},
						set community($$value) {
							data.community.community_view.community = $$value;
							$$settled = false;
						},
						get subscribed() {
							return data.community.community_view.subscribed;
						},
						set subscribed($$value) {
							data.community.community_view.subscribed = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					if (isModOrCurator()) {
						$$renderer.push("<!--[0-->");
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (data.community.community_view.blocked) {
						$$renderer.push("<!--[0-->");
						Note($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<!---->You've blocked this community.`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (profile.current.user) {
						$$renderer.push("<!--[0-->");
						if (!data.community.discussion_languages.every((l) => profile.current.user?.discussion_languages.includes(l)) && profile.current.user.discussion_languages.length > 0) {
							$$renderer.push("<!--[0-->");
							const missing = data.community.discussion_languages.filter((i) => !profile.current.user?.discussion_languages.includes(i));
							Note($$renderer, {
								class: "p-1! pl-3! flex-col md:flex-row",
								children: ($$renderer) => {
									$$renderer.push(`<div>Content in this community is in languages you do not have selected. Some or all posts may be missing.</div> `);
									{
										function suffix($$renderer) {
											Icon($$renderer, {
												src: ArrowRight,
												size: "16",
												micro: true
											});
										}
										Button($$renderer, {
											class: "inline-block ml-auto",
											href: "/profile/settings",
											color: "tertiary",
											rounding: "pill",
											size: "md",
											suffix,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Profile`);
											},
											$$slots: {
												suffix: true,
												default: true
											}
										});
									}
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <div class="flex flex-row gap-4 flex-wrap -mt-2">`);
							if (site.data?.all_languages) {
								$$renderer.push("<!--[0-->");
								const allLanguages = site.data.all_languages;
								$$renderer.push(`<!--[-->`);
								const each_array = ensure_array_like(missing);
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let language = each_array[$$index];
									$$renderer.push(`<a href="/profile/settings#languages" class="inline-block w-max">`);
									Badge($$renderer, {
										color: "blue-subtle",
										children: ($$renderer) => {
											Icon($$renderer, {
												src: Plus,
												size: "16",
												micro: true
											});
											$$renderer.push(`<!----> ${escape_html(allLanguages.find((i) => language == i.id)?.name)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></a>`);
								}
								$$renderer.push(`<!--]-->`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				PostListShell($$renderer, {
					getParams: data.params,
					params: { sort: data.params.sort },
					get posts() {
						return data.posts;
					},
					set posts($$value) {
						data.posts = $$value;
						$$settled = false;
					},
					get cursor() {
						return data.next_page;
					},
					set cursor($$value) {
						data.next_page = $$value;
						$$settled = false;
					},
					get client() {
						return data.client;
					},
					set client($$value) {
						data.client = $$value;
						$$settled = false;
					},
					extended,
					$$slots: { extended: true }
				});
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
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map