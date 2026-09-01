import "../../../../../chunks/internal.js";
import { n as attr, o as escape_html, r as clsx } from "../../../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, i as await_block, l as head, n as attr_style, o as derived, s as element, t as attr_class } from "../../../../../chunks/server.js";
import { t as goto } from "../../../../../chunks/navigation.js";
import { $ as parseTags, At as settings, En as Fire, F as CommonList, Hn as ChatBubbleOvalLeft, Ht as Option, Q as PostMeta, Rn as ChevronDoubleUp, S as PostMedia, T as EndPlaceholder, Tt as SvelteMap, Un as ChatBubbleLeftRight, Vt as Select, Y as PostItem, Zn as ArrowTrendingDown, Zt as Button, an as Star, ar as page, dt as postLink, et as FormattedNumber, f as toast, jn as Clock, ln as PlusCircle, lt as mediaType, m as PostActions, o as profile, p as Markdown, t as client, tn as Trophy, tr as publishedToDate, tt as errorMessage, zt as Expandable } from "../../../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../../../chunks/Placeholder.js";
import { t as ArrowDownCircle } from "../../../../../chunks/ArrowDownCircle.js";
import { t as ArrowPath } from "../../../../../chunks/ArrowPath.js";
import { n as CommentForm, t as Comment } from "../../../../../chunks/Comment.js";
import { t as Skeleton } from "../../../../../chunks/Skeleton.js";
//#region src/lib/feature/comment/comments.svelte.ts
function getCommentParentId(comment) {
	const split = comment?.path.split(".");
	split?.shift();
	return split && split.length > 1 ? Number(split.at(split.length - 2)) : void 0;
}
function getDepthFromComment(comment) {
	const len = comment?.path.split(".").length;
	return len ? len - 2 : void 0;
}
function buildCommentsTree(comments, baseDepth = 0, filter = () => true) {
	const map = new SvelteMap();
	let min_depth = Number.MAX_VALUE;
	for (const comment_view of comments) {
		const depth = (getDepthFromComment(comment_view.comment) ?? 0) + baseDepth;
		if (comment_view.comment.content == "" && comment_view.comment.removed) comment_view.comment.content = `*Removed by Moderator — [Modlog](/modlog?comment=${comment_view.comment.id})*`;
		const node = {
			comment_view,
			children: [],
			depth,
			expanded: true,
			hasMore: false
		};
		min_depth = Math.min(min_depth, depth);
		if (filter(comment_view)) map.set(comment_view.comment.id, { ...node });
	}
	const tree = [];
	for (const comment_view of comments) {
		const cNode = map.get(comment_view.comment.id);
		if (cNode && cNode.depth == min_depth) tree.push(cNode);
	}
	for (const comment_view of comments) {
		const child = map.get(comment_view.comment.id);
		if (child) {
			const parent_id = getCommentParentId(comment_view.comment);
			if (parent_id) {
				const parent = map.get(parent_id);
				if (parent) parent.children.push(child);
			}
		}
	}
	return tree;
}
//#endregion
//#region src/lib/feature/comment/CommentTree.svelte
function CommentTree_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { nodes = void 0, post } = $$props;
		async function fetchChildren(parent) {
			try {
				parent.loading = true;
				parent.page ??= 1;
				const newComments = await client().getComments({
					max_depth: 3,
					parent_id: parent.comment_view.comment.id,
					type_: "All",
					limit: 1e6,
					page: parent.page++
				});
				if (newComments.comments.length == 0) {
					toast({
						content: "The API returned no comments.",
						type: "error"
					});
					return;
				}
				if (newComments.comments.length >= parent.comment_view.counts.child_count) parent.hasMore = false;
				parent.children = buildCommentsTree(newComments.comments, parent.depth)[0].children;
			} catch (err) {
				console.error(err);
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<ul class="svelte-cfzx81"><!--[-->`);
			const each_array = ensure_array_like(nodes);
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let node = each_array[index];
				Comment($$renderer, {
					contentClass: [
						(node.children.length > 0 || node.comment_view.counts.child_count > 0) && "border-l",
						"ml-2.5 pl-3 sm:pl-4 lg:pl-5",
						"comment-border"
					],
					get node() {
						return nodes[index];
					},
					set node($$value) {
						nodes[index] = $$value;
						$$settled = false;
					},
					get open() {
						return nodes[index].expanded;
					},
					set open($$value) {
						nodes[index].expanded = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						$$renderer.push(`<button class="expand-btn svelte-cfzx81" aria-label="Expand"></button> <div${attr_class(clsx(["comment-corner", node.depth == 0 && "hidden"]), "svelte-cfzx81")}></div> `);
						if (node.children?.length > 0) {
							$$renderer.push("<!--[0-->");
							CommentTree_1($$renderer, {
								post,
								get nodes() {
									return nodes[index].children;
								},
								set nodes($$value) {
									nodes[index].children = $$value;
									$$settled = false;
								}
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (node.comment_view.counts.child_count > 0 && node.children.length == 0) {
					$$renderer.push("<!--[0-->");
					element($$renderer, "a", () => {
						$$renderer.push(` class="w-full h-10 -mt-2 -ml-2.5 svelte-cfzx81"${attr("href", `/comment/${stringify(node.comment_view.comment.id)}`)}`);
					}, () => {
						Button($$renderer, {
							loading: nodes[index].loading,
							disabled: nodes[index].loading,
							rounding: "pill",
							color: "tertiary",
							class: "font-normal text-slate-600 dark:text-zinc-400",
							shadow: "none",
							loaderWidth: 16,
							onclick: () => {
								if (nodes[index].depth > 6) goto(`/comment/${nodes[index].comment_view.comment.id}#comments`);
								else {
									nodes[index].loading = true;
									fetchChildren(nodes[index]).then(() => nodes[index].loading = false);
								}
							},
							icon: ArrowDownCircle,
							children: ($$renderer) => {
								$$renderer.push(`<!---->\`$${escape_html(node.comment_view.counts.child_count)} more\``);
							},
							$$slots: { default: true }
						});
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { nodes });
	});
}
//#endregion
//#region src/lib/feature/comment/CommentListVirtualizer.svelte
function CommentListVirtualizer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { nodes, post, scrollTo } = $$props;
		derived(() => void 0);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div>`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
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
//#region src/routes/post/[instance]/[id=integer]/CommentProvider.svelte
function CommentProvider($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { post, comments, sort = void 0, onupdate, focus, virtualize = true, showContext, singleThread } = $$props;
		let commenting = false;
		let tree = buildCommentsTree(comments);
		function allCommentsPlaceholder($$renderer) {
			{
				function action($$renderer) {
					Button($$renderer, {
						href: postLink(post.post),
						icon: PlusCircle,
						rounding: "pill",
						children: ($$renderer) => {
							$$renderer.push(`<!---->All comments`);
						},
						$$slots: { default: true }
					});
				}
				EndPlaceholder($$renderer, {
					alignment: "center",
					action,
					$$slots: { action: true }
				});
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (profile.current?.jwt) {
				$$renderer.push("<!--[0-->");
				if (!commenting) {
					$$renderer.push("<!--[0-->");
					{
						function action($$renderer) {
							$$renderer.push(`<div class="gap-2 flex items-center">`);
							Select($$renderer, {
								size: "md",
								onchange: onupdate,
								get value() {
									return settings.defaultSort.comments;
								},
								set value($$value) {
									settings.defaultSort.comments = $$value;
									$$settled = false;
								},
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
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								size: "custom",
								class: "h-8.5 w-8.5",
								rounding: "xl",
								onclick: onupdate,
								icon: ArrowPath
							});
							$$renderer.push(`<!----></div>`);
						}
						EndPlaceholder($$renderer, {
							border: false,
							action,
							children: ($$renderer) => {
								Button($$renderer, {
									color: "primary",
									rounding: "xl",
									disabled: (post.post.locked || post.banned_from_community) && !(profile.isAdmin || profile.isMod(post.community)),
									onclick: () => commenting = true,
									children: ($$renderer) => {
										Icon($$renderer, {
											src: ChatBubbleOvalLeft,
											size: "16",
											micro: true
										});
										$$renderer.push(`<!----> Add a comment`);
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
				} else {
					$$renderer.push("<!--[-1-->");
					CommentForm($$renderer, {
						postId: post.post.id,
						oncomment: (comment) => {
							tree.unshift({
								children: [],
								depth: 1,
								expanded: true,
								comment_view: comment.comment_view
							});
						},
						onfocus: () => commenting = true,
						tools: commenting,
						preview: commenting,
						placeholder: commenting ? void 0 : "Add a comment",
						rows: commenting ? 7 : 1,
						oncancel: () => commenting = false
					});
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (commenting || !profile.current.jwt) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="gap-2 flex items-center">`);
				Select($$renderer, {
					size: "md",
					onchange: onupdate,
					get value() {
						return settings.defaultSort.comments;
					},
					set value($$value) {
						settings.defaultSort.comments = $$value;
						$$settled = false;
					},
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
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					size: "custom",
					class: "h-8.5 w-8.5",
					rounding: "xl",
					onclick: onupdate,
					icon: ArrowPath
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (singleThread && !showContext) {
				$$renderer.push("<!--[0-->");
				allCommentsPlaceholder($$renderer);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (showContext && tree[0]) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					color: "secondary",
					alignment: "left",
					rounding: "pill",
					href: `/comment/${comments[0].comment.path.split(".").slice(-5)[1]}`,
					class: "mt-2 -mb-2 -mx-2.5 w-max",
					children: ($$renderer) => {
						Icon($$renderer, {
							src: PlusCircle,
							size: "16",
							micro: true
						});
						$$renderer.push(`<!----> \`$${escape_html(tree[0].comment_view.comment.path.split(".").length - 2)} more\``);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <div class="border-l h-4 -mb-5 ml-2.5 border-slate-200 dark:border-zinc-800"></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (virtualize) {
				$$renderer.push("<!--[0-->");
				CommentListVirtualizer($$renderer, {
					post: post.post,
					nodes: tree,
					scrollTo: focus
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="divide-y divide-slate-200 dark:divide-zinc-800"><div class="-mx-3 sm:-mx-6 px-3 sm:px-6">`);
				CommentTree_1($$renderer, {
					nodes: tree,
					post: post.post
				});
				$$renderer.push(`<!----></div></div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (singleThread && !showContext) {
				$$renderer.push("<!--[0-->");
				allCommentsPlaceholder($$renderer);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { sort });
	});
}
//#endregion
//#region src/routes/post/[instance]/[id=integer]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		async function reloadComments() {
			data.data.value.comments = client().getComments({
				page: 1,
				limit: 25,
				type_: "All",
				post_id: data.data.value.post.post.id,
				sort: settings.defaultSort.comments,
				max_depth: data.data.value.post.counts.comments > 100 ? 1 : 3
			}).then((i) => i.comments);
			data.data.value.params.thread.singleThread = false;
		}
		let tags = derived(() => {
			const parsed = parseTags(data.data.value.post.post.name);
			return {
				title: parsed.title,
				tags: [...parsed.tags, ...data.data.value.post.flair_list?.map((i) => ({
					content: i.flair_title,
					color: i.background_color,
					icon: null,
					textColor: i.text_color,
					type: "flair"
				})) ?? []]
			};
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1hgh63m", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>
    ${escape_html(data.data.value.post.community.title)} | ${escape_html(data.data.value.post.post.name)}
  </title>`);
				});
				$$renderer.push(`<meta property="og:title"${attr("content", data.data.value.post.post.name)}/> `);
				if (!data.data.value.post.post.local) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<meta name="robots" content="noindex, follow"/>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <link rel="canonical"${attr("href", data.data.value.post.post.ap_id)}/> `);
				if (data.data.value.post.post.body) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<meta property="description"${attr("content", data.data.value.post.post.body.slice(0, 500))}/> <meta property="og:description"${attr("content", data.data.value.post.post.body.slice(0, 500))}/> <meta property="twitter:description"${attr("content", data.data.value.post.post.body.slice(0, 500))}/>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <meta property="og:url"${attr("content", page.url.toString())}/> `);
				if (mediaType(data.data.value.post.post.url) == "image") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<meta property="og:image"${attr("content", data.data.value.post.post.url)}/> <meta property="twitter:card"${attr("content", data.data.value.post.post.url)}/>`);
				} else if (data.data.value.post.post.thumbnail_url) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<meta property="og:image"${attr("content", data.data.value.post.post.thumbnail_url)}/> <meta property="twitter:card"${attr("content", data.data.value.post.post.thumbnail_url)}/>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(`<article class="flex flex-col gap-2"><header class="flex flex-col gap-2"><div class="flex flex-row items-center gap-2 flex-wrap">`);
			PostMeta($$renderer, {
				community: data.data.value.post.community,
				user: data.data.value.post.creator,
				subscribed: profile.current.user?.follows.find((i) => i.community.id == data.data.value.post.community.id) ? "Subscribed" : "NotSubscribed",
				badges: {
					deleted: data.data.value.post.post.deleted,
					removed: data.data.value.post.post.removed,
					locked: data.data.value.post.post.locked,
					featured: data.data.value.post.post.featured_community || data.data.value.post.post.featured_local,
					nsfw: data.data.value.post.post.nsfw,
					saved: data.data.value.post.saved,
					admin: data.data.value.post.creator_is_admin,
					moderator: data.data.value.post.creator_is_moderator
				},
				published: publishedToDate(data.data.value.post.post.published),
				edited: data.data.value.post.post.updated,
				title: data.data.value.post.post.name,
				style: "width: max-content;",
				tags: tags().tags
			});
			$$renderer.push(`<!----></div> <h1 class="font-medium font-display text-xl leading-5 tracking-tight">`);
			Markdown($$renderer, {
				inline: true,
				source: tags().title ?? data.data.value.post.post.name
			});
			$$renderer.push(`<!----></h1></header> `);
			PostMedia($$renderer, {
				type: mediaType(data.data.value.post.post),
				post: data.data.value.post.post,
				opened: true,
				view: "cozy",
				autoplay: false
			});
			$$renderer.push(`<!----> `);
			if (data.data.value.post.post.body) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-base text-slate-800 dark:text-zinc-300 leading-normal">`);
				Markdown($$renderer, { source: data.data.value.post.post.body });
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="w-full relative">`);
			PostActions($$renderer, {
				onedit: () => toast({
					content: "The post was edited successfully.",
					type: "success"
				}),
				get post() {
					return data.data.value.post;
				},
				set post($$value) {
					data.data.value.post = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> `);
			await_block($$renderer, data.data.value.meta, () => {}, (meta) => {
				const crossposts = meta.cross_posts;
				if (crossposts?.length > 0) {
					$$renderer.push("<!--[0-->");
					{
						function title($$renderer) {
							{
								function action($$renderer) {
									$$renderer.push(`<span class="font-bold">`);
									FormattedNumber($$renderer, { number: crossposts.length });
									$$renderer.push(`<!----></span>`);
								}
								EndPlaceholder($$renderer, {
									size: "md",
									color: "none",
									class: "w-full ",
									action,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Crossposts`);
									},
									$$slots: {
										action: true,
										default: true
									}
								});
							}
						}
						Expandable($$renderer, {
							class: "text-base mt-2 w-full cursor-pointer",
							title,
							children: ($$renderer) => {
								{
									function item($$renderer, item) {
										PostItem($$renderer, { post: item });
									}
									CommonList($$renderer, {
										items: crossposts,
										item,
										$$slots: { item: true }
									});
								}
							},
							$$slots: {
								title: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(`<!--]--></article> <section class="flex flex-col gap-2 w-full" id="comments"><header class="mt-4">`);
			{
				function action($$renderer) {
					$$renderer.push(`<span class="font-bold">`);
					FormattedNumber($$renderer, { number: data.data.value.post.counts.comments });
					$$renderer.push(`<!----></span>`);
				}
				EndPlaceholder($$renderer, {
					size: "md",
					color: "none",
					action,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Comments`);
					},
					$$slots: {
						action: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----></header> `);
			if (!page.url.searchParams.get("noVirtualize")) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<noscript>`);
				Button($$renderer, {
					href: "?noVirtualize=true",
					class: "block",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Load comments`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></noscript>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			await_block($$renderer, data.data.value.comments, () => {
				$$renderer.push(`<div class="flex flex-col gap-4"><!--[-->`);
				const each_array = ensure_array_like(new Array(10));
				for (let index = 0, $$length = each_array.length; index < $$length; index++) {
					let _ = each_array[index];
					$$renderer.push(`<!---->${escape_html(_)} <div class="animate-pop-in"${attr_style(`animation-delay: ${stringify(index * 50)}ms; opacity: 0; width: ${stringify(1 / ((index + 1) % 3) * 100)}%`)}>`);
					Skeleton($$renderer, { size: "sm" });
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}, (comments) => {
				CommentProvider($$renderer, {
					comments,
					post: data.data.value.post,
					focus: data.data.value.params.thread.focus,
					onupdate: reloadComments,
					virtualize: !page.url.searchParams.get("noVirtualize"),
					showContext: data.data.value.params.thread.showContext,
					singleThread: data.data.value.params.thread.singleThread,
					get sort() {
						return data.data.value.params.comments.sort;
					},
					set sort($$value) {
						data.data.value.params.comments.sort = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				if (comments.length == 0) {
					$$renderer.push("<!--[0-->");
					Placeholder($$renderer, {
						icon: ChatBubbleLeftRight,
						title: "No comments",
						description: "Start the conversation!"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(`<!--]--> `);
			if (data.data.value.post.counts.comments > 5) {
				$$renderer.push("<!--[0-->");
				{
					function action($$renderer) {
						$$renderer.push(`<span class="text-black dark:text-white font-bold">${escape_html(data.data.value.post.counts.comments)}</span> `);
						Button($$renderer, {
							color: "tertiary",
							onclick: () => window.scrollTo({
								top: 0,
								behavior: "smooth"
							}),
							icon: ChevronDoubleUp,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Scroll to top`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					}
					EndPlaceholder($$renderer, {
						action,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Comments`);
						},
						$$slots: {
							action: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></section>`);
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