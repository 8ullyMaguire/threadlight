import { n as attr, o as escape_html } from "../../../chunks/validate.js";
import { c as ensure_array_like, l as head, o as derived, v as html } from "../../../chunks/server.js";
import { Bt as Switch, F as CommonList, Ht as Option, I as Tabs, Ln as ChevronDown, P as SearchBar, Pn as ChevronUp, R as Header, Ut as TextInput, Vt as Select, Zt as Button, ar as page, i as ThreadlightClient, t as client, wn as GlobeAmericas, yn as MagnifyingGlass } from "../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../chunks/Placeholder.js";
import { t as AdjustmentsHorizontal } from "../../../chunks/AdjustmentsHorizontal.js";
//#region src/routes/search/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let filtersOpen = false;
		let loadingMore = false;
		let localResults = [];
		let localTotal = 0;
		let localPage = 1;
		let filters = derived(() => data.filters.value);
		let hasMore = derived(() => localResults.length < localTotal);
		function applyFilters() {
			const f = filters();
			const url = new URL(page.url);
			url.searchParams.set("q", f.query || "");
			url.searchParams.set("tab", f.tab);
			if (f.author) url.searchParams.set("author", f.author);
			else url.searchParams.delete("author");
			if (f.community) url.searchParams.set("community", f.community);
			else url.searchParams.delete("community");
			if (f.tags) url.searchParams.set("tags", f.tags);
			else url.searchParams.delete("tags");
			if (f.dateFrom) url.searchParams.set("dateFrom", f.dateFrom);
			else url.searchParams.delete("dateFrom");
			if (f.dateTo) url.searchParams.set("dateTo", f.dateTo);
			else url.searchParams.delete("dateTo");
			if (f.mood) url.searchParams.set("mood", f.mood);
			else url.searchParams.delete("mood");
			if (f.contentType) url.searchParams.set("contentType", f.contentType);
			else url.searchParams.delete("contentType");
			if (f.isEducational) url.searchParams.set("isEducational", "true");
			else url.searchParams.delete("isEducational");
			if (f.isNsfw) url.searchParams.set("isNsfw", "true");
			else url.searchParams.delete("isNsfw");
			if (f.sort && f.sort !== "relevance") url.searchParams.set("sort", f.sort);
			else url.searchParams.delete("sort");
			url.searchParams.delete("page");
			import("../../../chunks/navigation2.js").then(({ goto }) => goto(url));
		}
		async function loadMore() {
			if (loadingMore || !hasMore() || !data.results) return;
			loadingMore = true;
			try {
				const api = client();
				const f = filters();
				const nextPage = localPage + 1;
				if (api instanceof ThreadlightClient) {
					let resp;
					if (f.tab === "posts") resp = await api.searchPosts({
						q: f.query,
						...f.author && { author: f.author },
						...f.community && { community: f.community },
						...f.tags && { tags: f.tags },
						...f.dateFrom && { date_from: f.dateFrom },
						...f.dateTo && { date_to: f.dateTo },
						...f.mood && { mood: f.mood },
						...f.contentType && { content_type: f.contentType },
						...f.isEducational && { is_educational: "true" },
						...f.isNsfw && { is_nsfw: "true" },
						...f.sort && { sort: f.sort },
						page: nextPage,
						limit: 20
					});
					else if (f.tab === "users") resp = await api.searchUsers({
						q: f.query,
						page: nextPage,
						limit: 20
					});
					else resp = await api.searchCommunities({
						q: f.query,
						page: nextPage,
						limit: 20
					});
					if (resp?.results) {
						localResults = [...localResults, ...resp.results];
						localTotal = resp.total;
						localPage = nextPage;
					}
				}
			} catch (err) {
				console.error("Load more error:", err);
			} finally {
				loadingMore = false;
			}
		}
		function highlightSnippet(html) {
			if (!html) return "";
			return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&lt;mark&gt;/g, "<mark>").replace(/&lt;\/mark&gt;/g, "</mark>");
		}
		function formatDate(iso) {
			if (!iso) return "";
			return new Date(iso).toLocaleDateString(void 0, {
				year: "numeric",
				month: "short",
				day: "numeric"
			});
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("e12qt1", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Search</title>`);
				});
			});
			{
				function extended($$renderer) {
					$$renderer.push(`<form method="get" action="/search" class="contents">`);
					SearchBar($$renderer, {
						get query() {
							return filters().query;
						},
						set query($$value) {
							filters().query = $$value;
							$$settled = false;
						}
					});
					$$renderer.push(`<!----> `);
					if (filters().query) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="text-xs text-slate-400 dark:text-zinc-500 -mt-1 mb-1 italic">Use AND, OR, NOT, "phrases", author:name, tag:tagname, community:name</div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="flex flex-row flex-wrap items-center gap-2">`);
					Button($$renderer, {
						onclick: () => filtersOpen = !filtersOpen,
						color: "tertiary",
						size: "sm",
						class: "flex items-center gap-1",
						children: ($$renderer) => {
							Icon($$renderer, {
								src: AdjustmentsHorizontal,
								mini: true,
								size: "15"
							});
							$$renderer.push(`<!----> Filters `);
							Icon($$renderer, {
								src: filtersOpen ? ChevronUp : ChevronDown,
								mini: true,
								size: "12"
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></form>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Search`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			Tabs($$renderer, {
				routes: [
					{
						href: "?tab=posts",
						name: "Posts"
					},
					{
						href: "?tab=users",
						name: "Users"
					},
					{
						href: "?tab=communities",
						name: "Communities"
					}
				],
				margin: false
			});
			$$renderer.push(`<!----> `);
			if (filtersOpen) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="filters-panel bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 mb-4 space-y-3 svelte-e12qt1"><div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`);
				TextInput($$renderer, {
					label: "Author",
					placeholder: "author:username",
					size: "sm",
					get value() {
						return filters().author;
					},
					set value($$value) {
						filters().author = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Community",
					placeholder: "community:name",
					size: "sm",
					get value() {
						return filters().community;
					},
					set value($$value) {
						filters().community = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">`);
				TextInput($$renderer, {
					label: "Tags",
					placeholder: "tag1, tag2",
					size: "sm",
					get value() {
						return filters().tags;
					},
					set value($$value) {
						filters().tags = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Date from",
					type: "date",
					size: "sm",
					get value() {
						return filters().dateFrom;
					},
					set value($$value) {
						filters().dateFrom = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				TextInput($$renderer, {
					label: "Date to",
					type: "date",
					size: "sm",
					get value() {
						return filters().dateTo;
					},
					set value($$value) {
						filters().dateTo = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`);
				Select($$renderer, {
					label: "Mood",
					size: "sm",
					get value() {
						return filters().mood;
					},
					set value($$value) {
						filters().mood = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						Option($$renderer, {
							value: "",
							children: ($$renderer) => {
								$$renderer.push(`<!---->'All'`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "0",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Neutral`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "1",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Happy`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "2",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Sad`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "3",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Angry`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "4",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Funny`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "5",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Informative`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Select($$renderer, {
					label: "Sort",
					size: "sm",
					get value() {
						return filters().sort;
					},
					set value($$value) {
						filters().sort = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						Option($$renderer, {
							value: "relevance",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Relevance`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "newest",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Newest`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "oldest",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Oldest`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "top",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Top`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"><div class="flex items-center gap-2">`);
				Switch($$renderer, {
					get checked() {
						return filters().isEducational;
					},
					set checked($$value) {
						filters().isEducational = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->Educational`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="flex items-center gap-2">`);
				Switch($$renderer, {
					get checked() {
						return filters().isNsfw;
					},
					set checked($$value) {
						filters().isNsfw = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<!---->NSFW`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div> <div class="flex gap-2 pt-1">`);
				Button($$renderer, {
					onclick: applyFilters,
					color: "primary",
					size: "sm",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Apply Filters`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (!data.results) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="my-auto">`);
				Placeholder($$renderer, {
					icon: GlobeAmericas,
					title: "No results",
					description: "Search for anything across the fediverse."
				});
				$$renderer.push(`<!----></div>`);
			} else if (localResults && localResults.length === 0) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="my-auto">`);
				Placeholder($$renderer, {
					icon: MagnifyingGlass,
					title: "No results",
					description: "There are no results that match that filter. Try refining your search."
				});
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				if (filters().tab === "posts") {
					$$renderer.push("<!--[0-->");
					{
						function item($$renderer, result) {
							$$renderer.push(`<a${attr("href", `/post/${result.id}`)} class="block no-underline text-inherit"><div class="flex flex-col gap-1"><div class="flex items-center gap-2">`);
							if (result.is_nsfw) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 font-medium">NSFW</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (result.is_educational) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">Edu</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> <span class="text-xs text-slate-400 dark:text-zinc-500">${escape_html(result.community?.slug ?? "")}</span></div> <h3 class="text-base font-semibold leading-tight">${escape_html(result.title)}</h3> `);
							if (result.snippet) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">${html(highlightSnippet(result.snippet))}</p>`);
							} else if (result.body) {
								$$renderer.push("<!--[1-->");
								$$renderer.push(`<p class="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">${escape_html(result.body)}</p>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> <div class="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-500 mt-1">`);
							if (result.author) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span>${escape_html(result.author.name)}</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (result.created_at) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span>${escape_html(formatDate(result.created_at))}</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (result.score !== void 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span>${escape_html(result.score)} pts</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (result.comment_count !== void 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span>${escape_html(result.comment_count)} comments</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> `);
							if (result.tags && result.tags.length > 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="flex flex-wrap gap-1 mt-1"><!--[-->`);
								const each_array = ensure_array_like(result.tags);
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let tag = each_array[$$index];
									$$renderer.push(`<span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">${escape_html(tag.name)}</span>`);
								}
								$$renderer.push(`<!--]--></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div></a>`);
						}
						CommonList($$renderer, {
							items: localResults,
							animate: false,
							item,
							$$slots: { item: true }
						});
					}
				} else if (filters().tab === "users") {
					$$renderer.push("<!--[1-->");
					{
						function item($$renderer, result) {
							$$renderer.push(`<a${attr("href", `/u/${result.author?.name ?? result.id}`)} class="block no-underline text-inherit"><div class="flex items-center gap-3">`);
							if (result.avatar_url) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<img${attr("src", result.avatar_url)}${attr("alt", result.title ?? "")} class="w-10 h-10 rounded-full object-cover"/>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 text-sm font-medium">${escape_html((result.title ?? "?")[0])}</div>`);
							}
							$$renderer.push(`<!--]--> <div class="flex-1 min-w-0"><div class="font-medium truncate">${escape_html(result.title)}</div> `);
							if (result.body) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="text-sm text-slate-500 dark:text-zinc-400 truncate">${escape_html(result.body)}</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="text-xs text-slate-400 dark:text-zinc-500 text-right shrink-0">`);
							if (result.post_count !== void 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div>${escape_html(result.post_count)} posts</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (result.member_count !== void 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div>${escape_html(result.member_count)} members</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div></div></a>`);
						}
						CommonList($$renderer, {
							items: localResults,
							animate: false,
							item,
							$$slots: { item: true }
						});
					}
				} else if (filters().tab === "communities") {
					$$renderer.push("<!--[2-->");
					{
						function item($$renderer, result) {
							$$renderer.push(`<a${attr("href", `/c/${result.community?.slug ?? result.id}`)} class="block no-underline text-inherit"><div class="flex items-center gap-3">`);
							if (result.community?.icon_url) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<img${attr("src", result.community.icon_url)}${attr("alt", result.title ?? "")} class="w-10 h-10 rounded-lg object-cover"/>`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`<div class="w-10 h-10 rounded-lg bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 text-sm font-medium">${escape_html((result.title ?? "?")[0])}</div>`);
							}
							$$renderer.push(`<!--]--> <div class="flex-1 min-w-0"><div class="font-medium truncate">${escape_html(result.title)}</div> `);
							if (result.body) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="text-sm text-slate-500 dark:text-zinc-400 line-clamp-1">${escape_html(result.body)}</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="text-xs text-slate-400 dark:text-zinc-500 text-right shrink-0">`);
							if (result.member_count !== void 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div>${escape_html(result.member_count)} members</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (result.post_count !== void 0) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div>${escape_html(result.post_count)} posts</div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div></div></a>`);
						}
						CommonList($$renderer, {
							items: localResults,
							animate: false,
							item,
							$$slots: { item: true }
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (hasMore()) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex justify-center mt-4 mb-8">`);
					Button($$renderer, {
						onclick: loadMore,
						color: "tertiary",
						size: "md",
						rounding: "pill",
						loading: loadingMore,
						class: "px-6",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(loadingMore ? "Loading..." : "Load More")}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]-->`);
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